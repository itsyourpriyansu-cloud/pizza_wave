import { http } from 'msw'
import { db } from '../../database/db'
import { createId } from '../../../domain/shared/ids'
import { confirmPayment, failPayment } from '../../../domain/payment/payment.machine'
import { demoPhonePeProvider } from '../../../services/payment/DemoPhonePeProvider'
import { API, boot, error, getAndClearNextPaymentOutcome, json, now } from './_shared'
import { confirmPaymentAndCreateOrder, generateMerchantOrderId } from './_orderProcessing'

export const paymentHandlers = [
  http.post(`${API}/payment/initiate`, async ({ request }) => {
    await boot()
    const { orderIntentId } = await request.json() as { orderIntentId: string }
    const intent = await db.orderIntents.get(orderIntentId)
    if (!intent) return error('Order intent not found', 404)
    if (intent.status !== 'OPEN') return error('Order intent already used or expired', 409)

    const merchantOrderId = generateMerchantOrderId(orderIntentId)
    const outcome = await getAndClearNextPaymentOutcome()
    demoPhonePeProvider.setNextOutcome(merchantOrderId, outcome)
    const providerResult = await demoPhonePeProvider.initiate({ merchantOrderId, amount: intent.quoteSnapshot.total })
    const attempt = {
      id: createId('PAY'), orderIntentId, provider: 'PHONEPE' as const, merchantOrderId,
      amount: intent.quoteSnapshot.total, status: 'PENDING' as const, createdAt: now().toISOString(),
    }
    await db.payments.add(attempt)
    return json({ payment: attempt, redirectUrl: providerResult.redirectUrl }, 201)
  }),

  http.get(`${API}/payment/:merchantOrderId/status`, async ({ params }) => {
    await boot()
    const attempt = await db.payments.where('merchantOrderId').equals(String(params.merchantOrderId)).first()
    if (!attempt) return error('Payment attempt not found', 404)
    return json(attempt)
  }),

  /** Simulated PhonePe webhook. Idempotent: replaying this for an already-CONFIRMED attempt returns the same order, never a second one. */
  http.post(`${API}/payment/:merchantOrderId/confirm`, async ({ params }) => {
    await boot()
    const merchantOrderId = String(params.merchantOrderId)
    const attempt = await db.payments.where('merchantOrderId').equals(merchantOrderId).first()
    if (!attempt) return error('Payment attempt not found', 404)

    const providerStatus = await demoPhonePeProvider.getStatus(merchantOrderId)
    if (providerStatus.status === 'FAILED') {
      const failed = failPayment(attempt, providerStatus.failureReason ?? 'Payment failed')
      await db.payments.put(failed)
      return json({ payment: failed }, 402)
    }

    const { attempt: confirmed } = confirmPayment(attempt, providerStatus.providerTransactionId ?? createId('PHONEPE-TXN'), now())
    await db.payments.put(confirmed)
    const order = await confirmPaymentAndCreateOrder(confirmed)
    return json({ payment: confirmed, order })
  }),

  http.post(`${API}/payment/:merchantOrderId/fail`, async ({ params }) => {
    await boot()
    const attempt = await db.payments.where('merchantOrderId').equals(String(params.merchantOrderId)).first()
    if (!attempt) return error('Payment attempt not found', 404)
    const failed = failPayment(attempt, 'Demo payment marked as failed')
    await db.payments.put(failed)
    return json({ payment: failed })
  }),
]

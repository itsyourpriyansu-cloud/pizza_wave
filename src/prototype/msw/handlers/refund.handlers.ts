import { http } from 'msw'
import { db } from '../../database/db'
import { approveRefund, completeRefund, failRefund, processRefund, submitRefund } from '../../../domain/refunds/refund.machine'
import { applyRefundReversal } from '../../../domain/loyalty/loyalty.engine'
import { createAttentionItem, resolveAttentionItem } from '../../../domain/attention/attention.engine'
import { demoPhonePeProvider } from '../../../services/payment/DemoPhonePeProvider'
import { API, boot, error, json, now } from './_shared'

export const refundHandlers = [
  http.get(`${API}/refunds`, async ({ request }) => {
    await boot()
    const orderId = new URL(request.url).searchParams.get('orderId')
    const rows = await db.refunds.toArray()
    return json(orderId ? rows.filter((row) => row.orderId === orderId) : rows)
  }),

  /**
   * Simulated end-to-end refund: REQUESTED -> APPROVED -> SUBMITTED -> PROCESSING -> SUCCESS/FAILED.
   * A completed refund reverses the linked order's points and closes any matching attention item.
   */
  http.post(`${API}/refunds/:id/process`, async ({ params }) => {
    await boot()
    let refund = await db.refunds.get(String(params.id))
    if (!refund) return error('Refund not found', 404)

    refund = approveRefund(refund)
    refund = submitRefund(refund)
    refund = processRefund(refund)
    await db.refunds.put(refund)

    const providerResult = await demoPhonePeProvider.refund(refund.id, refund.amount)
    if (providerResult.status === 'FAILED') {
      refund = failRefund(refund, 'Demo refund provider returned a failure')
      await db.refunds.put(refund)
      await db.attentionItems.add(createAttentionItem('REFUND_FAILURE', `Refund failed for order ${refund.orderId}`, 'Provider returned failure.', 'Retry the refund or contact the customer.', now(), { orderId: refund.orderId, customerId: refund.customerId }))
      return json(refund, 402)
    }

    refund = completeRefund(refund, now())
    await db.refunds.put(refund)

    if (refund.pointsToReverse > 0) {
      const reversal = applyRefundReversal(refund.orderId, refund.customerId, refund.pointsToReverse, now())
      await db.loyaltyTransactions.add(reversal)
      const customer = await db.customers.get(refund.customerId)
      if (customer) await db.customers.put({ ...customer, pointsPending: Math.max(0, customer.pointsPending - refund.pointsToReverse) })
    }

    const relatedAttention = (await db.attentionItems.toArray()).find((item) => item.orderId === refund!.orderId && !item.resolvedAt)
    if (relatedAttention) await db.attentionItems.put(resolveAttentionItem(relatedAttention, now()))

    return json(refund)
  }),
]

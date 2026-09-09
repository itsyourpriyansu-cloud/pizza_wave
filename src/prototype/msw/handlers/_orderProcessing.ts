import { db } from '../../database/db'
import { createId } from '../../../domain/shared/ids'
import { createOrderFromIntent } from '../../../domain/orders/order.logic'
import { applyPendingEarnOnPayment, calculateTier } from '../../../domain/loyalty/loyalty.engine'
import type { Order } from '../../../domain/orders/order.types'
import type { PaymentAttempt } from '../../../domain/payment/payment.types'
import { logOrderEvent, nextOrderSequence, now } from './_shared'

/**
 * Stage 4 payment boundary. A backend-confirmed payment creates one idempotent order in
 * AWAITING_ACCEPTANCE and stops. Acceptance evaluation and kitchen scheduling belong to
 * later stages and must not run from this customer payment path.
 */
export async function confirmPaymentAndCreateOrder(payment: PaymentAttempt): Promise<Order> {
  if (payment.status !== 'CONFIRMED') throw new Error(`Payment ${payment.id} is not backend-confirmed`)
  const intent = await db.orderIntents.get(payment.orderIntentId)
  if (!intent) throw new Error(`Order intent ${payment.orderIntentId} missing`)

  const existingOrders = await db.orders.where('orderIntentId').equals(intent.id).toArray()
  const sequence = existingOrders.length ? 0 : await nextOrderSequence()
  const { order: created, created: isNew } = createOrderFromIntent(intent, payment, existingOrders, sequence, now())
  if (!isNew) return created

  const order: Order = { ...created, paymentStatus: 'CONFIRMED', acceptanceStatus: 'AWAITING_ACCEPTANCE', fulfillmentStatus: 'NOT_STARTED' }
  const customer = await db.customers.get(order.customerId)
  const tier = calculateTier({ rolling120Orders: customer?.stats.rolling120Orders ?? 0, rolling120EligibleSpend: customer?.stats.rolling120EligibleSpend ?? 0 })
  const pendingEarn = applyPendingEarnOnPayment(order.id, order.customerId, order.financialSnapshot.eligibleSpend, tier, now())

  await db.transaction('rw', db.orders, db.orderIntents, db.loyaltyTransactions, db.cartItems, async () => {
    await db.orders.add(order)
    await db.orderIntents.update(intent.id, { status: 'CONSUMED' })
    await db.loyaltyTransactions.add(pendingEarn)
    await db.cartItems.where('cartId').equals(intent.cartSnapshot.cartId).delete()
  })
  await logOrderEvent(order.id, 'PAYMENT_CONFIRMED', 'SYSTEM', { acceptanceStatus: 'AWAITING_ACCEPTANCE' })
  return order
}

export function generateMerchantOrderId(orderIntentId: string): string {
  return `MO-${orderIntentId}-${createId('SEQ')}`
}

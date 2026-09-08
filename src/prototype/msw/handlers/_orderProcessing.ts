import { db } from '../../database/db'
import { createId } from '../../../domain/shared/ids'
import { evaluateOrderAcceptance } from '../../../domain/orders/acceptance.engine'
import { acceptOrder, applySchedule, createOrderFromIntent, markReviewRequired, rejectOrder } from '../../../domain/orders/order.logic'
import { validateCartAvailability } from '../../../domain/availability/availability.engine'
import { applyPendingEarnOnPayment, calculateTier } from '../../../domain/loyalty/loyalty.engine'
import { createRefund } from '../../../domain/refunds/refund.machine'
import { createAttentionItem } from '../../../domain/attention/attention.engine'
import type { Order } from '../../../domain/orders/order.types'
import type { PaymentAttempt } from '../../../domain/payment/payment.types'
import { getCapabilities, getStoreConfig, logOrderEvent, nextOrderSequence, now } from './_shared'

/** Orders actively occupying kitchen capacity for load-percent purposes. */
const ACTIVE_KITCHEN_STATUSES: Order['fulfillmentStatus'][] = ['SCHEDULED', 'PREP_DUE', 'PREPARING']
const KITCHEN_CAPACITY_COUNT = 8

/**
 * Runs once per confirmed payment: creates the order (idempotently), evaluates acceptance,
 * and applies the resulting AUTO_ACCEPT / OWNER_REVIEW / REJECT outcome including the
 * event log, loyalty pending-earn transaction, and — for a reject — the refund record.
 */
export async function confirmPaymentAndCreateOrder(payment: PaymentAttempt): Promise<Order> {
  const intent = await db.orderIntents.get(payment.orderIntentId)
  if (!intent) throw new Error(`Order intent ${payment.orderIntentId} missing`)

  const existingOrders = await db.orders.where('orderIntentId').equals(intent.id).toArray()
  const sequence = existingOrders.length ? 0 : await nextOrderSequence()
  const { order: created, created: isNew } = createOrderFromIntent(intent, payment, existingOrders, sequence, now())
  if (!isNew) return created

  let order: Order = { ...created, paymentStatus: 'CONFIRMED' }
  await db.orders.add(order)
  await db.orderIntents.update(intent.id, { status: 'CONSUMED' })
  await logOrderEvent(order.id, 'PAYMENT_CONFIRMED', 'SYSTEM')

  const customer = await db.customers.get(order.customerId)
  const tier = calculateTier({ rolling120Orders: customer?.stats.rolling120Orders ?? 0, rolling120EligibleSpend: customer?.stats.rolling120EligibleSpend ?? 0 })
  const pendingEarn = applyPendingEarnOnPayment(order.id, order.customerId, order.financialSnapshot.eligibleSpend, tier, now())
  await db.loyaltyTransactions.add(pendingEarn)

  const products = await db.products.bulkGet(order.items.map((item) => item.productId))
  const availabilityRecords = await db.availability.toArray()
  const availabilityIssues = validateCartAvailability(
    order.items.map((item) => ({ productId: item.productId, productName: item.name })),
    products.filter(Boolean) as NonNullable<typeof products[number]>[],
    availabilityRecords, now(),
  )

  const capabilities = await getCapabilities()
  const storeConfig = await getStoreConfig()
  const activeOrderCount = (await db.orders.toArray()).filter((candidate) => ACTIVE_KITCHEN_STATUSES.includes(candidate.fulfillmentStatus)).length

  const result = evaluateOrderAcceptance({
    paymentConfirmed: order.paymentStatus === 'CONFIRMED',
    capabilities, fulfillmentType: order.fulfillmentType, availabilityIssues, kdsOnline: storeConfig.kdsOnline,
    quote: order.financialSnapshot, acceptanceMode: storeConfig.acceptanceMode,
    schedule: {
      items: products.filter(Boolean).map((product) => ({ productId: product!.id, prepMinutes: product!.prepMinutes, complexity: product!.complexity, station: product!.station, quantity: order.items.find((item) => item.productId === product!.id)?.quantity ?? 1 })),
      pickupSlot: intent.pickupSlot, activeOrderCount, kitchenCapacityCount: KITCHEN_CAPACITY_COUNT,
      packingMinutes: storeConfig.packingMinutes, pickupBufferMinutes: storeConfig.pickupBufferMinutes, deliveryBufferMinutes: storeConfig.deliveryBufferMinutes, now: now(),
    },
  })

  if (result.decision === 'AUTO_ACCEPT') {
    order = acceptOrder(order, now())
    order = applySchedule(order, result.recommendation)
    await logOrderEvent(order.id, 'ORDER_ACCEPTED', 'SYSTEM', { reasons: result.reasons })
    await logOrderEvent(order.id, 'FULFILLMENT_SCHEDULED', 'SYSTEM', { targetReadyAt: order.targetReadyAt })
  } else if (result.decision === 'OWNER_REVIEW') {
    order = markReviewRequired(order)
    await logOrderEvent(order.id, 'ORDER_REVIEW_REQUIRED', 'SYSTEM', { reasons: result.reasons })
    await db.attentionItems.add(createAttentionItem('ORDER_REVIEW', `Order ${order.publicOrderNumber} needs review`, result.reasons.join('; '), 'Accept or reject from the order queue.', now(), { orderId: order.id, customerId: order.customerId }))
  } else {
    order = rejectOrder(order, result.reasons.join('; ') || 'Order could not be auto-accepted', now())
    await logOrderEvent(order.id, 'ORDER_REJECTED', 'SYSTEM', { reasons: result.reasons })
    const refund = createRefund(order.id, order.customerId, order.financialSnapshot.total, pendingEarn.points, 'ORDER_REJECTED', now())
    await db.refunds.add(refund)
    await logOrderEvent(order.id, 'REFUND_REQUESTED', 'SYSTEM', { refundId: refund.id })
  }

  await db.orders.put(order)
  return order
}

export function generateMerchantOrderId(orderIntentId: string): string {
  return `MO-${orderIntentId}-${createId('SEQ')}`
}

import { db } from '../../database/db'
import { assertFulfillmentTransition } from '../../../domain/orders/order.machine'
import type { FulfillmentStatus, Order } from '../../../domain/orders/order.types'
import { applyOrderCompletion, calculateTier } from '../../../domain/loyalty/loyalty.engine'
import { deriveActivityState, deriveCustomerStage, deriveTags, recalculateCustomerStats } from '../../../domain/crm/crm.engine'
import type { CrmOrderHistoryEntry } from '../../../domain/crm/crm.types'
import { logOrderEvent, now } from './_shared'

/**
 * The moment loyalty points move from pending to available and CRM stats/tier/tags recompute.
 * Never done anywhere else — this is the single settlement point for a completed order.
 */
export async function completeOrderFulfillment(order: Order, finalStatus: Extract<FulfillmentStatus, 'DELIVERED' | 'PICKED_UP' | 'STORE_COMPLETED'>): Promise<Order> {
  assertFulfillmentTransition(order.fulfillmentStatus, finalStatus)
  const updatedOrder: Order = { ...order, fulfillmentStatus: finalStatus }
  await db.orders.put(updatedOrder)
  await logOrderEvent(updatedOrder.id, 'ORDER_COMPLETED', 'SYSTEM')

  const customer = await db.customers.get(updatedOrder.customerId)
  if (!customer) return updatedOrder

  const allOrders = await db.orders.where('customerId').equals(customer.id).toArray()
  const history: CrmOrderHistoryEntry[] = allOrders
    .filter((candidate) => ['DELIVERED', 'PICKED_UP', 'STORE_COMPLETED'].includes(candidate.fulfillmentStatus))
    .map((candidate) => ({ fulfillmentType: candidate.fulfillmentType, total: candidate.financialSnapshot.total, category: candidate.items[0]?.productId.split('-')[0] ?? 'OTHER', completedAt: candidate.createdAt }))

  const stats = recalculateCustomerStats(customer.stats, history, now())
  const tier = calculateTier({ rolling120Orders: stats.rolling120Orders, rolling120EligibleSpend: stats.rolling120EligibleSpend })
  const previousTier = customer.tier

  const completedIn30 = history.filter((entry) => new Date(entry.completedAt).getTime() >= now().getTime() - 30 * 86_400_000).length
  const transactions = applyOrderCompletion({ orderId: updatedOrder.id, customerId: customer.id, eligibleSubtotal: updatedOrder.financialSnapshot.eligibleSpend, tier, completedOrdersInRolling30: completedIn30, now: now() })
  await db.loyaltyTransactions.bulkAdd(transactions)

  const pendingForOrder = await db.loyaltyTransactions.where('orderId').equals(updatedOrder.id).and((tx) => tx.type === 'EARN_PENDING').first()
  if (pendingForOrder) await db.loyaltyTransactions.update(pendingForOrder.id, { status: 'AVAILABLE' })

  const earnedNow = transactions.reduce((sum, tx) => sum + tx.points, 0)
  const tags = deriveTags({ tier: tier.id, stats }, history)
  const updatedCustomer = {
    ...customer, tier: tier.id, stats, tags,
    customerStage: deriveCustomerStage(stats.lifetimeOrders), activityState: deriveActivityState(stats.lastOrderAt, now()),
    pointsAvailable: customer.pointsAvailable + earnedNow,
    pointsPending: Math.max(0, customer.pointsPending - (pendingForOrder?.points ?? 0)),
  }
  await db.customers.put(updatedCustomer)
  await logOrderEvent(updatedOrder.id, 'POINTS_CREDITED', 'SYSTEM', { points: earnedNow })
  if (previousTier !== tier.id) await logOrderEvent(updatedOrder.id, 'TIER_CHANGED', 'SYSTEM', { from: previousTier, to: tier.id })

  return updatedOrder
}

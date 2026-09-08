import { http } from 'msw'
import { db } from '../../database/db'
import { acceptOrder, applySchedule, rejectOrder } from '../../../domain/orders/order.logic'
import { scheduleOrder } from '../../../domain/fulfillment/scheduler'
import { createRefund } from '../../../domain/refunds/refund.machine'
import { resolveAttentionItem, getActiveAttentionQueue } from '../../../domain/attention/attention.engine'
import { API, boot, error, getActiveKitchenOrderCount, getStoreConfig, json, logOrderEvent, now } from './_shared'

export const ownerHandlers = [
  http.get(`${API}/owner/orders`, async ({ request }) => {
    await boot()
    const status = new URL(request.url).searchParams.get('acceptanceStatus')
    const rows = await db.orders.toArray()
    return json(status ? rows.filter((order) => order.acceptanceStatus === status) : rows)
  }),

  http.post(`${API}/owner/orders/:id/accept`, async ({ params }) => {
    await boot()
    let order = await db.orders.get(String(params.id))
    if (!order) return error('Order not found', 404)
    const products = await db.products.bulkGet(order.items.map((item) => item.productId))
    const storeConfig = await getStoreConfig()
    const activeOrderCount = await getActiveKitchenOrderCount()
    const schedule = scheduleOrder({
      items: products.filter(Boolean).map((product) => ({ productId: product!.id, prepMinutes: product!.prepMinutes, complexity: product!.complexity, station: product!.station, quantity: order!.items.find((item) => item.productId === product!.id)?.quantity ?? 1 })),
      fulfillmentType: order.fulfillmentType, activeOrderCount, kitchenCapacityCount: storeConfig.kitchenCapacityCount,
      packingMinutes: storeConfig.packingMinutes, pickupBufferMinutes: storeConfig.pickupBufferMinutes, deliveryBufferMinutes: storeConfig.deliveryBufferMinutes, now: now(),
    })
    order = acceptOrder(order, now())
    order = applySchedule(order, schedule)
    await db.orders.put(order)
    await logOrderEvent(order.id, 'ORDER_ACCEPTED', 'OWNER')
    await logOrderEvent(order.id, 'FULFILLMENT_SCHEDULED', 'OWNER', { targetReadyAt: order.targetReadyAt })
    const pending = (await db.attentionItems.toArray()).find((item) => item.orderId === order!.id && item.type === 'ORDER_REVIEW' && !item.resolvedAt)
    if (pending) await db.attentionItems.put(resolveAttentionItem(pending, now()))
    return json(order)
  }),

  http.post(`${API}/owner/orders/:id/reject`, async ({ params, request }) => {
    await boot()
    let order = await db.orders.get(String(params.id))
    if (!order) return error('Order not found', 404)
    const { reason } = await request.json() as { reason: string }
    order = rejectOrder(order, reason, now())
    await db.orders.put(order)
    await logOrderEvent(order.id, 'ORDER_REJECTED', 'OWNER', { reason })
    const refund = createRefund(order.id, order.customerId, order.financialSnapshot.total, order.financialSnapshot.pointsToEarn, 'ORDER_REJECTED', now())
    await db.refunds.add(refund)
    await logOrderEvent(order.id, 'REFUND_REQUESTED', 'OWNER', { refundId: refund.id })
    const pending = (await db.attentionItems.toArray()).find((item) => item.orderId === order!.id && item.type === 'ORDER_REVIEW' && !item.resolvedAt)
    if (pending) await db.attentionItems.put(resolveAttentionItem(pending, now()))
    return json({ order, refund })
  }),

  http.get(`${API}/owner/attention`, async () => { await boot(); return json(getActiveAttentionQueue(await db.attentionItems.toArray())) }),

  http.post(`${API}/owner/attention/:id/resolve`, async ({ params }) => {
    await boot()
    const item = await db.attentionItems.get(String(params.id))
    if (!item) return error('Attention item not found', 404)
    const resolved = resolveAttentionItem(item, now())
    await db.attentionItems.put(resolved)
    return json(resolved)
  }),

  http.get(`${API}/owner/customers/:id`, async ({ params }) => {
    await boot()
    const customer = await db.customers.get(String(params.id))
    return customer ? json(customer) : error('Customer not found', 404)
  }),
]

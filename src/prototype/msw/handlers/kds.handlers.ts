import { http } from 'msw'
import { db } from '../../database/db'
import { getKitchenQueue, markReady, overridePrepTime, startPrep } from '../../../domain/kitchen/kitchen.logic'
import { createAttentionItem } from '../../../domain/attention/attention.engine'
import { API, boot, error, getStoreConfig, json, logOrderEvent, now } from './_shared'
import { completeOrderFulfillment } from './_fulfillmentCompletion'

export const kdsHandlers = [
  http.get(`${API}/kds/queue`, async () => { await boot(); return json(getKitchenQueue(await db.orders.toArray())) }),

  http.post(`${API}/kds/orders/:id/start-prep`, async ({ params }) => {
    await boot()
    const order = await db.orders.get(String(params.id))
    if (!order) return error('Order not found', 404)
    const updated = startPrep(order, now())
    await db.orders.put(updated)
    await logOrderEvent(updated.id, 'PREP_STARTED', 'CHEF')
    return json(updated)
  }),

  http.patch(`${API}/kds/orders/:id/prep-time`, async ({ params, request }) => {
    await boot()
    const order = await db.orders.get(String(params.id))
    if (!order) return error('Order not found', 404)
    const { minutes, reason, chefId } = await request.json() as { minutes: number; reason: string; chefId?: string }
    const storeConfig = await getStoreConfig()
    const result = overridePrepTime({ order, requestedMinutes: minutes, reason, chefId: chefId ?? 'Kitchen Tablet #1', now: now() }, storeConfig.delayThresholds)
    await db.orders.put(result.order)
    await logOrderEvent(result.order.id, 'PREP_TIME_OVERRIDDEN', 'CHEF', { minutes, reason, delayMinutes: result.delayMinutes })
    if (result.severeDelay) {
      await db.attentionItems.add(createAttentionItem('SEVERE_DELAY', `Order ${result.order.publicOrderNumber} delayed ${result.delayMinutes}m`, reason, 'Consider proactively contacting the customer.', now(), { orderId: result.order.id, customerId: result.order.customerId }))
    }
    return json({ order: result.order, customerNoticeNeeded: result.customerNoticeNeeded, severeDelay: result.severeDelay })
  }),

  http.post(`${API}/kds/orders/:id/ready`, async ({ params }) => {
    await boot()
    const order = await db.orders.get(String(params.id))
    if (!order) return error('Order not found', 404)
    const updated = markReady(order, now())
    await db.orders.put(updated)
    await logOrderEvent(updated.id, 'ORDER_READY', 'CHEF')
    return json(updated)
  }),

  http.post(`${API}/kds/orders/:id/problem`, async ({ params, request }) => {
    await boot()
    const order = await db.orders.get(String(params.id))
    if (!order) return error('Order not found', 404)
    const { reason } = await request.json() as { reason: string }
    await db.attentionItems.add(createAttentionItem('AVAILABILITY_CONFLICT', `Kitchen problem on ${order.publicOrderNumber}`, reason, 'Check with the chef and update the customer.', now(), { orderId: order.id, customerId: order.customerId }))
    return json({ ok: true })
  }),

  /** Marks fulfillment complete (dispatched/delivered/picked up/store-completed) and settles loyalty + CRM for the order. */
  http.post(`${API}/orders/:id/complete`, async ({ params, request }) => {
    await boot()
    const order = await db.orders.get(String(params.id))
    if (!order) return error('Order not found', 404)
    const { finalStatus } = await request.json() as { finalStatus: 'DELIVERED' | 'PICKED_UP' | 'STORE_COMPLETED' }
    const updated = await completeOrderFulfillment(order, finalStatus)
    return json(updated)
  }),
]

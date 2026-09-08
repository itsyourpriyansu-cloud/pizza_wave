import { http } from 'msw'
import { db } from '../../database/db'
import { API, boot, error, json } from './_shared'

export const ordersHandlers = [
  http.get(`${API}/orders`, async ({ request }) => {
    await boot()
    const customerId = new URL(request.url).searchParams.get('customerId') ?? 'CUST001'
    const rows = await db.orders.where('customerId').equals(customerId).sortBy('createdAt')
    return json(rows.reverse())
  }),

  http.get(`${API}/orders/:id`, async ({ params }) => {
    await boot()
    const order = await db.orders.get(String(params.id))
    return order ? json(order) : error('Order not found', 404)
  }),

  http.get(`${API}/orders/:id/events`, async ({ params }) => {
    await boot()
    const events = await db.orderEvents.where('orderId').equals(String(params.id)).sortBy('at')
    return json(events)
  }),
]

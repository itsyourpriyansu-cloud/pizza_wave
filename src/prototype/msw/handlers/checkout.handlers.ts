import { http } from 'msw'
import { db } from '../../database/db'
import { createId } from '../../../domain/shared/ids'
import { buildCartSnapshot } from '../../../domain/cart/cart.logic'
import type { FulfillmentMode } from '../../../domain/customer/customer.types'
import { API, boot, error, json, now } from './_shared'
import { getCart, getQuote } from './cart.handlers'

export const checkoutHandlers = [
  http.post(`${API}/checkout/intent`, async ({ request }) => {
    await boot()
    const body = await request.json() as { fulfillmentType: FulfillmentMode; pickupSlot?: string; addressSnapshot?: { line1: string; city: string; pincode: string } }
    const cart = await getCart()
    if (cart.items.length === 0) return error('Cart is empty', 422)
    const quote = await getQuote()
    const current = now()
    const intent = {
      id: createId('INTENT'), customerId: cart.customerId ?? 'CUST001', fulfillmentType: body.fulfillmentType,
      cartSnapshot: buildCartSnapshot(cart), addressSnapshot: body.addressSnapshot, pickupSlot: body.pickupSlot,
      quoteSnapshot: quote, expectedPromiseAt: new Date(current.getTime() + 35 * 60_000).toISOString(),
      expiresAt: new Date(current.getTime() + 15 * 60_000).toISOString(), status: 'OPEN' as const, createdAt: current.toISOString(),
    }
    await db.orderIntents.add(intent)
    return json(intent, 201)
  }),

  http.get(`${API}/checkout/intent/:id`, async ({ params }) => {
    await boot()
    const intent = await db.orderIntents.get(String(params.id))
    return intent ? json(intent) : error('Order intent not found', 404)
  }),
]

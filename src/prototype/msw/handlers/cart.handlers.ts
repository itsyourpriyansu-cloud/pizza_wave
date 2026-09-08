import { http } from 'msw'
import { db } from '../../database/db'
import { DEMO_CART_ID } from '../../demo/reset-demo'
import { quoteCart } from '../../../domain/pricing/pricing.engine'
import { toLegacyProductView } from '../../../domain/catalog/catalog.view'
import type { LegacyCart } from '../../../domain/cart/cart.types'
import { API, boot, getStoreConfig, json } from './_shared'
import { eventBus } from '../../events/event-bus'

async function getCart(): Promise<LegacyCart> {
  const cart = await db.carts.get(DEMO_CART_ID)
  if (!cart) throw new Error('Demo cart missing')
  const rows = await db.cartItems.where('cartId').equals(cart.id).toArray()
  const products = await db.products.bulkGet(rows.map((row) => row.productId))
  return { ...cart, items: rows.map((row, index) => ({ ...row, product: toLegacyProductView(products[index]!) })) }
}

async function getQuote() {
  const [cart, storeConfig] = await Promise.all([getCart(), getStoreConfig()])
  const customer = await db.customers.get(cart.customerId ?? 'CUST001')
  return quoteCart({
    items: cart.items.map((item) => ({ quantity: item.quantity, unitPrice: item.product.price })),
    fulfillmentType: 'DELIVERY', customerTier: customer?.tier ?? 'MEMBER',
    pointsAvailable: customer?.pointsAvailable ?? 0, pointsRequested: 0,
    deliveryFeeTable: { DELIVERY: storeConfig.deliveryFeeFlat, PICKUP: 0, STORE: 0 },
  })
}

export const cartHandlers = [
  http.get(`${API}/cart`, async () => { await boot(); return json(await getCart()) }),

  http.post(`${API}/cart/items`, async ({ request }) => {
    await boot()
    const body = await request.json() as { productId: string; quantity?: number }
    const existing = await db.cartItems.where('[cartId+productId]').equals([DEMO_CART_ID, body.productId]).first()
    if (existing) await db.cartItems.update(existing.id, { quantity: existing.quantity + (body.quantity ?? 1) })
    else await db.cartItems.add({ id: crypto.randomUUID(), cartId: DEMO_CART_ID, productId: body.productId, quantity: body.quantity ?? 1, modifiers: [], unitPriceSnapshot: 0 })
    eventBus.emit('CART_UPDATED', { productId: body.productId })
    return json(await getCart(), 201)
  }),

  http.patch(`${API}/cart/items/:itemId`, async ({ params, request }) => {
    await boot()
    const body = await request.json() as { quantity: number }
    if (body.quantity <= 0) await db.cartItems.delete(String(params.itemId))
    else await db.cartItems.update(String(params.itemId), { quantity: body.quantity })
    eventBus.emit('CART_UPDATED', { itemId: params.itemId })
    return json(await getCart())
  }),

  http.delete(`${API}/cart/items/:itemId`, async ({ params }) => {
    await boot()
    await db.cartItems.delete(String(params.itemId))
    eventBus.emit('CART_UPDATED', { itemId: params.itemId, removed: true })
    return json(await getCart())
  }),

  http.post(`${API}/cart/quote`, async () => { await boot(); return json(await getQuote()) }),
]

export { getCart, getQuote }

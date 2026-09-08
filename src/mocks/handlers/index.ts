import { HttpResponse, http } from 'msw'
import { db } from '../../services/storage/db'
import type { Cart, Product, StoreCapabilities } from '../../shared/types/domain'
import { calculateCartQuote } from '../../features/cart/domain/calculateCartQuote'
import { ensureDemoDatabase, resetDemoDatabase } from '../seed/reset'
import { smartCollections } from '../fixtures/seed'

const api = '*/api/v1'
const json = <T,>(value: T, status = 200) => HttpResponse.json(value as never, { status })

async function getCart(): Promise<Cart> {
  await ensureDemoDatabase()
  const cart = await db.carts.get('CART-DEMO')
  if (!cart) throw new Error('Demo cart missing')
  const rows = await db.cartItems.where('cartId').equals(cart.id).toArray()
  const products = await db.products.bulkGet(rows.map((row) => row.productId))
  return { ...cart, items: rows.map((row, index) => ({ ...row, product: products[index] as Product })) }
}

export const handlers = [
  http.get(`${api}/capabilities`, async () => { await ensureDemoDatabase(); return json((await db.config.get('capabilities'))?.value as StoreCapabilities) }),
  http.get(`${api}/categories`, async () => { await ensureDemoDatabase(); return json(await db.categories.orderBy('sortOrder').toArray()) }),
  http.get(`${api}/products`, async ({ request }) => {
    await ensureDemoDatabase(); const url = new URL(request.url); let rows = await db.products.toArray()
    const category = url.searchParams.get('category'); if (category) rows = rows.filter((item) => item.category === category)
    return json(rows)
  }),
  http.get(`${api}/products/:id`, async ({ params }) => { await ensureDemoDatabase(); const item = await db.products.get(String(params.id)); return item ? json(item) : json({ message: 'Product not found' }, 404) }),
  http.get(`${api}/menu`, async () => { await ensureDemoDatabase(); return json({ categories: await db.categories.orderBy('sortOrder').toArray(), products: await db.products.toArray(), collections: smartCollections }) }),
  http.get(`${api}/recommendations`, async () => { await ensureDemoDatabase(); return json((await db.products.toArray()).filter((item) => item.badges.includes('Bestseller') || item.id === 'PIZZA-VEG-001').slice(0, 4)) }),
  http.get(`${api}/search`, async ({ request }) => { await ensureDemoDatabase(); const q = new URL(request.url).searchParams.get('q')?.toLowerCase().trim() ?? ''; const rows = await db.products.toArray(); return json(rows.filter((item) => `${item.name} ${item.description} ${item.badges.join(' ')}`.toLowerCase().includes(q))) }),
  http.get(`${api}/cart`, async () => json(await getCart())),
  http.post(`${api}/cart/items`, async ({ request }) => {
    const body = await request.json() as { productId: string; quantity?: number }; const existing = await db.cartItems.where('[cartId+productId]').equals(['CART-DEMO', body.productId]).first()
    if (existing) await db.cartItems.update(existing.id, { quantity: existing.quantity + (body.quantity ?? 1) })
    else await db.cartItems.add({ id: crypto.randomUUID(), cartId: 'CART-DEMO', productId: body.productId, quantity: body.quantity ?? 1 })
    return json(await getCart(), 201)
  }),
  http.patch(`${api}/cart/items/:itemId`, async ({ params, request }) => { const body = await request.json() as { quantity: number }; if (body.quantity <= 0) await db.cartItems.delete(String(params.itemId)); else await db.cartItems.update(String(params.itemId), { quantity: body.quantity }); return json(await getCart()) }),
  http.delete(`${api}/cart/items/:itemId`, async ({ params }) => { await db.cartItems.delete(String(params.itemId)); return json(await getCart()) }),
  http.post(`${api}/cart/quote`, async () => json(calculateCartQuote(await getCart()))),
  http.get(`${api}/loyalty`, async () => { await ensureDemoDatabase(); const customer = await db.customers.get('CUST001'); return json({ customer, nextTier: 'PLATINUM', ordersNeeded: 2, spendNeeded: 880 }) }),
  http.post(`${api}/demo/reset`, async () => { await resetDemoDatabase(); return json({ ok: true }) }),
  http.patch(`${api}/demo/capabilities`, async ({ request }) => { const current = (await db.config.get('capabilities'))?.value as StoreCapabilities; const patch = await request.json() as Partial<StoreCapabilities>; const next = { ...current, ...patch }; await db.config.put({ key: 'capabilities', value: next }); return json(next) }),
  http.patch(`${api}/demo/session`, async ({ request }) => { const { loggedIn } = await request.json() as { loggedIn: boolean }; await db.config.put({ key: 'customerLoggedIn', value: loggedIn }); return json({ loggedIn }) }),
]

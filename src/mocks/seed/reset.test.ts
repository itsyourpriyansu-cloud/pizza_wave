import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../services/storage/db'
import { resetDemoDatabase } from './reset'

describe('demo seed', () => {
  beforeEach(async () => { await resetDemoDatabase() })
  it('restores the frozen customer and all 12 menu products', async () => {
    expect(await db.products.count()).toBe(12)
    expect((await db.customers.get('CUST001'))?.pointsAvailable).toBe(182)
    expect((await db.products.get('PIZZA-VEG-001'))?.price).toBe(110)
  })
  it('clears cart changes on reset', async () => {
    await db.cartItems.add({ id: 'x', cartId: 'CART-DEMO', productId: 'FRIES-001', quantity: 2 })
    await resetDemoDatabase()
    expect(await db.cartItems.count()).toBe(0)
  })
})

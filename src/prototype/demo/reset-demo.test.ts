import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../database/db'
import { DEMO_CART_ID, ensureDemoDatabase, resetDemoDatabase } from './reset-demo'

describe('resetDemoDatabase', () => {
  beforeEach(async () => { await resetDemoDatabase() })

  it('restores the frozen customer and all 12 menu products', async () => {
    expect(await db.products.count()).toBe(12)
    expect((await db.customers.get('CUST001'))?.pointsAvailable).toBe(182)
    expect((await db.products.get('PIZZA-VEG-001'))?.basePrice).toBe(110)
  })

  it('seeds a resolvable store config and derived capabilities', async () => {
    const config = (await db.config.get('storeConfig'))?.value as { kdsOnline: boolean; acceptanceMode: string }
    expect(config.kdsOnline).toBe(true)
    expect(config.acceptanceMode).toBe('HYBRID')
  })

  it('clears cart changes on reset', async () => {
    await db.cartItems.add({ id: 'x', cartId: DEMO_CART_ID, productId: 'FRIES-001', quantity: 2, modifiers: [], unitPriceSnapshot: 99 })
    await resetDemoDatabase()
    expect(await db.cartItems.count()).toBe(0)
  })

  it('seeds two historical completed orders for loyalty/CRM continuity', async () => {
    const orders = await db.orders.where('customerId').equals('CUST001').toArray()
    expect(orders).toHaveLength(2)
    expect(orders.every((order) => order.paymentStatus === 'CONFIRMED')).toBe(true)
  })
})

describe('ensureDemoDatabase', () => {
  it('boots the database only when empty', async () => {
    await resetDemoDatabase()
    await db.products.clear()
    await ensureDemoDatabase()
    expect(await db.products.count()).toBe(12)
  })
})

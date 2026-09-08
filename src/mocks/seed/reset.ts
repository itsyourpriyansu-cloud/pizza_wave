import { db } from '../../services/storage/db'
import { categories, demoCapabilities, demoCustomer, products } from '../fixtures/seed'

export async function resetDemoDatabase() {
  await db.transaction('rw', db.tables, async () => {
    await Promise.all(db.tables.map((table) => table.clear()))
    await db.customers.add(demoCustomer)
    await db.categories.bulkAdd(categories)
    await db.products.bulkAdd(products)
    await db.carts.add({ id: 'CART-DEMO', customerId: demoCustomer.id, status: 'ACTIVE', updatedAt: new Date(0).toISOString() })
    await db.config.bulkAdd([
      { key: 'capabilities', value: demoCapabilities },
      { key: 'customerLoggedIn', value: true },
    ])
  })
}

export async function ensureDemoDatabase() {
  if ((await db.products.count()) === 0) await resetDemoDatabase()
}

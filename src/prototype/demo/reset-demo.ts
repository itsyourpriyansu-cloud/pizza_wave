import { db } from '../database/db'
import { deriveCapabilities } from '../../domain/store/capability.engine'
import { storeConfigSeed } from '../seed/store.seed'
import { primaryCustomerSeed, secondaryCustomerSeed } from '../seed/customers.seed'
import { categorySeed, productSeed, smartCollectionSeed } from '../seed/catalog.seed'
import { orderHistorySeed } from '../seed/orders.seed'
import { loyaltyTransactionSeed, tierStatusSeed } from '../seed/loyalty.seed'
import { conversationSeed, messageSeed } from '../seed/conversations.seed'
import { supportCaseSeed } from '../seed/support.seed'
import { demoClock } from '../../domain/shared/clock'
import { eventBus } from '../events/event-bus'
import { createCustomerSession } from '../../domain/auth/session.policy'

export const DEMO_CART_ID = 'CART-DEMO'
const CATALOG_VERSION = 4
const AUTH_VERSION = 1

export async function resetDemoDatabase(): Promise<void> {
  demoClock.reset()
  await db.transaction('rw', db.tables, async () => {
    await Promise.all(db.tables.map((table) => table.clear()))

    await db.config.bulkAdd([
      { key: 'storeConfig', value: storeConfigSeed },
      { key: 'capabilities', value: deriveCapabilities(storeConfigSeed) },
      { key: 'customerLoggedIn', value: true },
      { key: 'orderSequence', value: orderHistorySeed.length },
      { key: 'smartCollections', value: smartCollectionSeed },
      { key: 'cartThreshold', value: { target: 499, label: 'Build a ₹499 feast' } },
      { key: 'activeScenario', value: 'none' },
      { key: 'catalogVersion', value: CATALOG_VERSION },
      { key: 'authVersion', value: AUTH_VERSION },
    ])

    await db.customers.bulkAdd([primaryCustomerSeed, secondaryCustomerSeed])
    await db.sessions.add({ id: 'SESSION-CUSTOMER-DEMO', realm: 'CUSTOMER', payload: createCustomerSession(primaryCustomerSeed.id, demoClock.now()) })
    await db.categories.bulkAdd(categorySeed)
    await db.products.bulkAdd(productSeed)
    await db.carts.add({ id: DEMO_CART_ID, customerId: primaryCustomerSeed.id, status: 'ACTIVE', updatedAt: new Date(0).toISOString() })
    await db.orders.bulkAdd(orderHistorySeed)
    await db.loyaltyTransactions.bulkAdd(loyaltyTransactionSeed)
    await db.tierStatus.bulkAdd(tierStatusSeed)
    if (conversationSeed.length) await db.conversations.bulkAdd(conversationSeed)
    if (messageSeed.length) await db.messages.bulkAdd(messageSeed)
    if (supportCaseSeed.length) await db.supportCases.bulkAdd(supportCaseSeed)
  })
  eventBus.clearHistory()
  eventBus.emit('DEMO_RESET')
}

export async function ensureDemoDatabase(): Promise<void> {
  const [productCount, categoryCount, customer, cart, storeConfig] = await Promise.all([
    db.products.count(), db.categories.count(), db.customers.get(primaryCustomerSeed.id),
    db.carts.get(DEMO_CART_ID), db.config.get('storeConfig'),
  ])
  if (productCount !== productSeed.length || categoryCount !== categorySeed.length || !customer || !cart || !storeConfig) {
    await resetDemoDatabase()
    return
  }
  const catalogVersion = await db.config.get('catalogVersion')
  if (catalogVersion?.value !== CATALOG_VERSION) {
    await db.transaction('rw', db.categories, db.products, db.cartItems, db.config, async () => {
      await db.categories.clear()
      await db.products.clear()
      // Stage 3 modifier pricing snapshots are incompatible with earlier fast-add rows.
      await db.cartItems.clear()
      await db.categories.bulkAdd(categorySeed)
      await db.products.bulkAdd(productSeed)
      await db.config.put({ key: 'smartCollections', value: smartCollectionSeed })
      await db.config.put({ key: 'cartThreshold', value: { target: 499, label: 'Build a ₹499 feast' } })
      await db.config.put({ key: 'catalogVersion', value: CATALOG_VERSION })
    })
  }
  const authVersion = await db.config.get('authVersion')
  if (authVersion?.value !== AUTH_VERSION) {
    await db.transaction('rw', db.sessions, db.config, async () => {
      await db.sessions.where('realm').equals('CUSTOMER').delete()
      await db.sessions.add({ id: 'SESSION-CUSTOMER-DEMO', realm: 'CUSTOMER', payload: createCustomerSession(primaryCustomerSeed.id, demoClock.now()) })
      await db.config.put({ key: 'customerLoggedIn', value: true })
      await db.config.put({ key: 'authVersion', value: AUTH_VERSION })
    })
  }

  const cartRows = await db.cartItems.toArray()
  const invalidCartSnapshot = cartRows.some((row) =>
    !Number.isInteger(row.quantity) || row.quantity <= 0 ||
    !Number.isFinite(row.unitPriceSnapshot) || row.unitPriceSnapshot <= 0 ||
    !Array.isArray(row.modifiers),
  )
  if (invalidCartSnapshot) await db.cartItems.clear()
}

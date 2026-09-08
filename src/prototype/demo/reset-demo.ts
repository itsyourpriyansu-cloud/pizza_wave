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

export const DEMO_CART_ID = 'CART-DEMO'

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
      { key: 'activeScenario', value: 'none' },
    ])

    await db.customers.bulkAdd([primaryCustomerSeed, secondaryCustomerSeed])
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
  if ((await db.products.count()) === 0) await resetDemoDatabase()
}

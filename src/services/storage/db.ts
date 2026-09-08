import Dexie, { type EntityTable } from 'dexie'
import type { CartItem, Category, DemoCustomer, Product } from '../../shared/types/domain'

export interface StoredCart { id: string; customerId?: string; status: 'ACTIVE'; updatedAt: string }
export interface AvailabilityRecord { id: string; entityType: string; entityId: string; source: string; available: boolean; expiresAt?: string }
export interface ConfigRecord { key: string; value: unknown }
export interface BaseRecord { id: string; [key: string]: unknown }

export class PizzaWaveDatabase extends Dexie {
  customers!: EntityTable<DemoCustomer, 'id'>
  products!: EntityTable<Product, 'id'>
  categories!: EntityTable<Category, 'id'>
  availability!: EntityTable<AvailabilityRecord, 'id'>
  carts!: EntityTable<StoredCart, 'id'>
  cartItems!: EntityTable<CartItem, 'id'>
  checkoutSessions!: EntityTable<BaseRecord, 'id'>
  orderIntents!: EntityTable<BaseRecord, 'id'>
  payments!: EntityTable<BaseRecord, 'id'>
  orders!: EntityTable<BaseRecord, 'id'>
  orderEvents!: EntityTable<BaseRecord, 'id'>
  loyaltyTransactions!: EntityTable<BaseRecord, 'id'>
  tierStatus!: EntityTable<BaseRecord, 'id'>
  conversations!: EntityTable<BaseRecord, 'id'>
  supportCases!: EntityTable<BaseRecord, 'id'>
  config!: EntityTable<ConfigRecord, 'key'>

  constructor() {
    super('pizza-wave-prototype')
    this.version(1).stores({
      customers: 'id, phone, tier', products: 'id, category, available, price', categories: 'id, sortOrder',
      availability: 'id, [entityType+entityId], source, expiresAt', carts: 'id, customerId, status, updatedAt',
      cartItems: 'id, cartId, productId, [cartId+productId]', checkoutSessions: 'id, cartId, status', orderIntents: 'id, merchantOrderId, paymentStatus',
      payments: 'id, providerTransactionId, status', orders: 'id, customerId, paymentStatus, acceptanceStatus, fulfillmentStatus, createdAt',
      orderEvents: 'id, orderId, type, at', loyaltyTransactions: 'id, customerId, status, expiresAt', tierStatus: 'id, customerId, tier',
      conversations: 'id, customerId, status', supportCases: 'id, conversationId, status', config: 'key',
    })
  }
}

export const db = new PizzaWaveDatabase()

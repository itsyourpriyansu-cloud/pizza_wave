import Dexie, { type EntityTable } from 'dexie'
import type { Customer } from '../../domain/customer/customer.types'
import type { Category, Product } from '../../domain/catalog/catalog.types'
import type { AvailabilityRecord } from '../../domain/availability/availability.types'
import type { LegacyCart, CartItem } from '../../domain/cart/cart.types'
import type { OrderIntent, Order, OrderEvent } from '../../domain/orders/order.types'
import type { PaymentAttempt } from '../../domain/payment/payment.types'
import type { LoyaltyTransaction, TierStatus } from '../../domain/loyalty/loyalty.types'
import type { Conversation, ChatMessage } from '../../domain/conversation/conversation.types'
import type { SupportCase } from '../../domain/support/support.types'
import type { Refund } from '../../domain/refunds/refund.types'
import type { AttentionItem } from '../../domain/attention/attention.types'
import type { AnySession } from '../../domain/auth/auth.types'

export interface StoredCartItem extends CartItem { quantity: number }
/** Generic key/value store: 'storeConfig' -> StoreConfig, 'capabilities' -> Capabilities, 'customerLoggedIn' -> boolean, 'orderSequence' -> number. */
export interface ConfigRecord { key: string; value: unknown }
export interface AuditLogRecord { id: string; actor: string; action: string; entityType: string; entityId: string; at: string; metadata?: Record<string, unknown> }
export interface SessionRecord { id: string; realm: AnySession['realm']; payload: AnySession }

export class PizzaWaveDatabase extends Dexie {
  customers!: EntityTable<Customer, 'id'>
  products!: EntityTable<Product, 'id'>
  categories!: EntityTable<Category, 'id'>
  availability!: EntityTable<AvailabilityRecord, 'id'>
  carts!: EntityTable<Omit<LegacyCart, 'items'>, 'id'>
  cartItems!: EntityTable<StoredCartItem, 'id'>
  orderIntents!: EntityTable<OrderIntent, 'id'>
  payments!: EntityTable<PaymentAttempt, 'id'>
  orders!: EntityTable<Order, 'id'>
  orderEvents!: EntityTable<OrderEvent, 'id'>
  loyaltyTransactions!: EntityTable<LoyaltyTransaction, 'id'>
  tierStatus!: EntityTable<TierStatus, 'customerId'>
  conversations!: EntityTable<Conversation, 'id'>
  messages!: EntityTable<ChatMessage, 'id'>
  supportCases!: EntityTable<SupportCase, 'id'>
  refunds!: EntityTable<Refund, 'id'>
  attentionItems!: EntityTable<AttentionItem, 'id'>
  sessions!: EntityTable<SessionRecord, 'id'>
  auditLogs!: EntityTable<AuditLogRecord, 'id'>
  config!: EntityTable<ConfigRecord, 'key'>

  constructor() {
    super('pizza-wave-prototype')
    this.version(1).stores({
      customers: 'id, phone, tier', products: 'id, categoryId, available, basePrice', categories: 'id, sortOrder',
      availability: 'id, entityId, entityType, source, expiresAt', carts: 'id, customerId, status, updatedAt',
      cartItems: 'id, cartId, productId, [cartId+productId]',
      orderIntents: 'id, customerId, status, expiresAt',
      payments: 'id, orderIntentId, merchantOrderId, status',
      orders: 'id, customerId, orderIntentId, paymentStatus, acceptanceStatus, fulfillmentStatus, createdAt',
      orderEvents: 'id, orderId, type, at',
      loyaltyTransactions: 'id, customerId, orderId, status, expiresAt',
      tierStatus: 'customerId, tier',
      conversations: 'id, customerId, status',
      messages: 'id, conversationId, at',
      supportCases: 'id, conversationId, orderId, customerId, status',
      refunds: 'id, orderId, customerId, status',
      attentionItems: 'id, type, severity, resolvedAt',
      sessions: 'id, realm',
      auditLogs: 'id, actor, entityType, entityId, at',
      config: 'key',
    })
  }
}

export const db = new PizzaWaveDatabase()

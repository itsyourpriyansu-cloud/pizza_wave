import type { OrderEventType } from '../../domain/orders/order.types'

export type SystemEventType = OrderEventType | 'CART_UPDATED' | 'DEMO_RESET' | 'DEMO_SCENARIO_LOADED' | 'KDS_ONLINE_CHANGED' | 'CAPABILITIES_CHANGED'

export interface AppEvent<T = unknown> { id: string; type: SystemEventType; at: string; orderId?: string; customerId?: string; payload?: T }

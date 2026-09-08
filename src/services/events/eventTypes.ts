export type AppEventType = 'AVAILABILITY_CHANGED' | 'CART_UPDATED' | 'DEMO_RESET'
export interface AppEvent { id: string; type: AppEventType; at: string; payload?: unknown }

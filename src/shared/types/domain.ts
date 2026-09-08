export type FulfillmentMode = 'DELIVERY' | 'PICKUP' | 'STORE'
export type Station = 'PIZZA' | 'FRY' | 'BEVERAGE' | 'ASSEMBLY'
export type ProductBadge = 'Bestseller' | 'New' | 'Veg' | 'Spicy' | 'Wave Exclusive' | 'Customizable'

export interface ModifierOption { id: string; name: string; priceDelta: number }
export interface ModifierGroup { id: string; name: string; required: boolean; multiple?: boolean; options: ModifierOption[] }
export interface Category { id: string; name: string; color: string; sortOrder: number }
export interface Product {
  id: string
  name: string
  description: string
  category: string
  price: number
  veg: boolean
  available: boolean
  prepMinutes: number
  complexity: number
  station: Station
  image: string
  badges: ProductBadge[]
  modifierGroups?: ModifierGroup[]
}

export interface StoreCapabilities {
  store: { id: string; name: string; city: string; open: boolean; acceptanceMode: 'HYBRID' }
  deliveryEnabled: boolean
  pickupEnabled: boolean
  storeOrderEnabled: boolean
}

export interface DemoCustomer {
  id: string
  firstName: string
  phone: string
  tier: 'GOLD'
  pointsAvailable: number
  pointsPending: number
  rolling120Orders: number
  rolling120Spend: number
  lifetimeOrders: number
  lifetimeValue: number
  averageOrderValue: number
  preferredCategory: string
  tags: string[]
}

export interface CartItem { id: string; cartId: string; productId: string; quantity: number }
export interface Cart { id: string; customerId?: string; status: 'ACTIVE'; updatedAt: string; items: Array<CartItem & { product: Product }> }
export interface CartQuote { itemCount: number; subtotal: number; deliveryFee: number; total: number; pointsEarned: number }
export interface LoyaltySummary { customer: DemoCustomer; nextTier: 'PLATINUM'; ordersNeeded: number; spendNeeded: number }

export interface CustomerSession { realm: 'customer'; customerId: string; expiresAt: string }
export interface OwnerSession { realm: 'owner'; email: string; expiresAt: string }
export interface KdsSession { realm: 'kds'; device: string; expiresAt: string }

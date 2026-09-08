import { z } from 'zod'

const badgeSchema = z.enum(['Bestseller', 'New', 'Veg', 'Spicy', 'Wave Exclusive', 'Customizable'])
const modifierOptionSchema = z.object({ id: z.string(), name: z.string(), priceDelta: z.number() })
const modifierGroupSchema = z.object({
  id: z.string(), name: z.string(), required: z.boolean(), multiple: z.boolean().optional(), options: z.array(modifierOptionSchema),
})

export const categorySchema = z.object({ id: z.string(), name: z.string(), color: z.string(), sortOrder: z.number() })
export const productSchema = z.object({
  id: z.string(), name: z.string(), description: z.string(), category: z.string(), price: z.number().nonnegative(), veg: z.boolean(), available: z.boolean(),
  prepMinutes: z.number().int().nonnegative(), complexity: z.number().int().positive(), station: z.enum(['PIZZA', 'FRY', 'BEVERAGE', 'ASSEMBLY']),
  image: z.string(), badges: z.array(badgeSchema), modifierGroups: z.array(modifierGroupSchema).optional(),
})
export const menuResponseSchema = z.object({
  categories: z.array(categorySchema), products: z.array(productSchema), collections: z.array(z.object({ id: z.string(), name: z.string() })),
})
export const capabilitiesSchema = z.object({
  store: z.object({ id: z.string(), name: z.string(), city: z.string(), open: z.boolean(), acceptanceMode: z.literal('HYBRID') }),
  deliveryEnabled: z.boolean(), pickupEnabled: z.boolean(), storeOrderEnabled: z.boolean(),
})
export const cartSchema = z.object({
  id: z.string(), customerId: z.string().optional(), status: z.literal('ACTIVE'), updatedAt: z.string(),
  items: z.array(z.object({ id: z.string(), cartId: z.string(), productId: z.string(), quantity: z.number().int().positive(), product: productSchema })),
})
export const cartQuoteSchema = z.object({ itemCount: z.number().int(), subtotal: z.number(), deliveryFee: z.number(), total: z.number(), pointsEarned: z.number().int() })
const customerSchema = z.object({
  id: z.string(), firstName: z.string(), phone: z.string(), tier: z.literal('GOLD'), pointsAvailable: z.number(), pointsPending: z.number(),
  rolling120Orders: z.number(), rolling120Spend: z.number(), lifetimeOrders: z.number(), lifetimeValue: z.number(), averageOrderValue: z.number(),
  preferredCategory: z.string(), tags: z.array(z.string()),
})
export const loyaltySchema = z.object({ customer: customerSchema, nextTier: z.literal('PLATINUM'), ordersNeeded: z.number(), spendNeeded: z.number() })

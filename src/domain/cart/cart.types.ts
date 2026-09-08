import type { z } from 'zod'
import type { cartItemModifierSelectionSchema, cartItemSchema, cartSchema, legacyCartSchema } from './cart.schema'

export type CartItemModifierSelection = z.infer<typeof cartItemModifierSelectionSchema>
export type CartItem = z.infer<typeof cartItemSchema>
export type Cart = z.infer<typeof cartSchema>
export type LegacyCart = z.infer<typeof legacyCartSchema>

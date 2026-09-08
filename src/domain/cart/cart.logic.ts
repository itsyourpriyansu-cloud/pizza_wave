import type { LegacyCart } from './cart.types'

/** Immutable snapshot taken at OrderIntent creation time — never recomputed from a live cart afterward. */
export function buildCartSnapshot(cart: LegacyCart) {
  return {
    cartId: cart.id,
    items: cart.items.map((item) => ({ productId: item.productId, quantity: item.quantity, unitPrice: item.product.price, name: item.product.name })),
    takenAt: new Date().toISOString(),
  }
}

export type CartSnapshot = ReturnType<typeof buildCartSnapshot>

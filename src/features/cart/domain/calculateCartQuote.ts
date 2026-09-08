import type { Cart, CartQuote } from '../../../shared/types/domain'

export function calculateCartQuote(cart: Cart): CartQuote {
  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cart.items.reduce((total, item) => total + item.quantity * item.product.price, 0)
  return { itemCount, subtotal, deliveryFee: 0, total: subtotal, pointsEarned: Math.floor(subtotal * 0.04) }
}

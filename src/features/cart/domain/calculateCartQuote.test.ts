import { describe, expect, it } from 'vitest'
import type { Cart } from '../../../shared/types/domain'
import { products } from '../../../mocks/fixtures/seed'
import { calculateCartQuote } from './calculateCartQuote'

describe('cart calculations', () => {
  it('totals quantities, rupees and deterministic loyalty points', () => {
    const cart: Cart = {
      id: 'cart', status: 'ACTIVE', updatedAt: '2026-09-08T00:00:00.000Z',
      items: [
        { id: 'a', cartId: 'cart', productId: products[0].id, quantity: 2, product: products[0] },
        { id: 'b', cartId: 'cart', productId: products[9].id, quantity: 1, product: products[9] },
      ],
    }
    expect(calculateCartQuote(cart)).toEqual({ itemCount: 3, subtotal: 369, deliveryFee: 0, total: 369, pointsEarned: 14 })
  })
})

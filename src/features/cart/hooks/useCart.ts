import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../services/api'
import type { FulfillmentMode } from '../../../domain/customer/customer.types'
import type { CartItemModifierSelection } from '../../../domain/cart/cart.types'

export const useCart = () => useQuery({ queryKey: ['cart'], queryFn: api.cart.getCart })
export const useCartQuote = (mode: FulfillmentMode = 'DELIVERY', pointsRequested = 0) => useQuery({ queryKey: ['cart-quote', mode, pointsRequested], queryFn: () => api.cart.quoteCart(mode, pointsRequested) })

export function useCartActions() {
  const client = useQueryClient()
  const refresh = async () => { await Promise.all([client.invalidateQueries({ queryKey: ['cart'] }), client.invalidateQueries({ queryKey: ['cart-quote'] })]) }
  const add = useMutation({
    mutationFn: (input: string | { productId: string; quantity?: number; modifiers?: CartItemModifierSelection[] }) => typeof input === 'string'
      ? api.cart.addCartItem(input)
      : api.cart.addCartItem(input.productId, input.quantity, input.modifiers),
    onSuccess: refresh,
  })
  const update = useMutation({ mutationFn: ({ id, ...patch }: { id: string; quantity?: number; modifiers?: CartItemModifierSelection[] }) => api.cart.updateCartItem(id, patch), onSuccess: refresh })
  const remove = useMutation({ mutationFn: (id: string) => api.cart.removeCartItem(id), onSuccess: refresh })
  const requote = useMutation({
    mutationFn: (mode: FulfillmentMode) => api.cart.quoteCart(mode),
    onSuccess: (quote, mode) => client.setQueryData(['cart-quote', mode, 0], quote),
  })
  return { add, update, remove, requote }
}

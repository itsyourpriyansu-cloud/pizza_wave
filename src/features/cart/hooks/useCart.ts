import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../services/api'

export const useCart = () => useQuery({ queryKey: ['cart'], queryFn: api.cart.getCart })
export const useCartQuote = () => useQuery({ queryKey: ['cart-quote'], queryFn: api.cart.quoteCart })

export function useCartActions() {
  const client = useQueryClient()
  const refresh = async () => { await Promise.all([client.invalidateQueries({ queryKey: ['cart'] }), client.invalidateQueries({ queryKey: ['cart-quote'] })]) }
  const add = useMutation({ mutationFn: (productId: string) => api.cart.addCartItem(productId), onSuccess: refresh })
  const update = useMutation({ mutationFn: ({ id, quantity }: { id: string; quantity: number }) => api.cart.updateCartItem(id, quantity), onSuccess: refresh })
  return { add, update }
}

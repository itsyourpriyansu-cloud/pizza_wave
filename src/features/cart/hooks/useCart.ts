import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addCartItem, getCart, quoteCart, updateCartItem } from '../api/cart.api'

export const useCart = () => useQuery({ queryKey: ['cart'], queryFn: getCart })
export const useCartQuote = () => useQuery({ queryKey: ['cart-quote'], queryFn: quoteCart })
export function useCartActions() {
  const client = useQueryClient()
  const refresh = async () => { await Promise.all([client.invalidateQueries({ queryKey: ['cart'] }), client.invalidateQueries({ queryKey: ['cart-quote'] })]) }
  const add = useMutation({ mutationFn: addCartItem, onSuccess: refresh })
  const update = useMutation({ mutationFn: ({ id, quantity }: { id: string; quantity: number }) => updateCartItem(id, quantity), onSuccess: refresh })
  return { add, update }
}

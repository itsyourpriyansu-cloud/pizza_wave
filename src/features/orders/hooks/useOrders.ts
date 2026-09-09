import { useQuery } from '@tanstack/react-query'
import { api } from '../../../services/api'

export const useOrders = (customerId?: string) => useQuery({
  queryKey: ['orders', customerId],
  queryFn: () => api.orders.getOrders(customerId),
  enabled: Boolean(customerId),
})

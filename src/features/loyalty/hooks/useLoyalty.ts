import { useQuery } from '@tanstack/react-query'
import { api } from '../../../services/api'
export const useLoyalty = () => useQuery({ queryKey: ['loyalty'], queryFn: () => api.loyalty.getLoyalty() })
export const useLoyaltyHistory = () => useQuery({ queryKey: ['loyalty-history'], queryFn: () => api.loyalty.getLoyaltyHistory() })

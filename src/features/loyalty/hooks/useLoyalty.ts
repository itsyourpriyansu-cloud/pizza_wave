import { useQuery } from '@tanstack/react-query'
import { api } from '../../../services/api'
export const useLoyalty = () => useQuery({ queryKey: ['loyalty'], queryFn: () => api.loyalty.getLoyalty() })

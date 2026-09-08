import { useQuery } from '@tanstack/react-query'
import { api } from '../../../services/api'
export const useMenu = () => useQuery({ queryKey: ['menu'], queryFn: api.catalog.getMenu })
export const useRecommendations = () => useQuery({ queryKey: ['recommendations'], queryFn: api.catalog.getRecommendations })
export const useProductSearch = (query: string) => useQuery({ queryKey: ['search', query], queryFn: () => api.catalog.searchProducts(query), enabled: query.trim().length > 0 })

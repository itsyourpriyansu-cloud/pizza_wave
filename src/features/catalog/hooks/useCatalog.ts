import { useQuery } from '@tanstack/react-query'
import { getMenu, getRecommendations, searchProducts } from '../api/catalog.api'
export const useMenu = () => useQuery({ queryKey: ['menu'], queryFn: getMenu })
export const useRecommendations = () => useQuery({ queryKey: ['recommendations'], queryFn: getRecommendations })
export const useProductSearch = (query: string) => useQuery({ queryKey: ['search', query], queryFn: () => searchProducts(query), enabled: query.trim().length > 0 })

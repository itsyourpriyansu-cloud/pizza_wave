import { apiClient } from '../../../services/api/client'
import { endpoints } from '../../../services/api/endpoints'
import { menuResponseSchema, productSchema } from '../../../services/api/contracts'
import type { z } from 'zod'

export type MenuResponse = z.infer<typeof menuResponseSchema>
export const getMenu = async () => menuResponseSchema.parse((await apiClient.get(endpoints.menu)).data)
export const getRecommendations = async () => productSchema.array().parse((await apiClient.get(endpoints.recommendations)).data)
export const searchProducts = async (q: string) => productSchema.array().parse((await apiClient.get(endpoints.search, { params: { q } })).data)

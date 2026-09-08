import { apiClient } from './client'
import { endpoints } from './endpoints'
import { categorySchema, legacyProductViewSchema, smartCollectionSchema } from '../../domain/catalog/catalog.schema'
import { z } from 'zod'

const legacyMenuResponseSchema = z.object({ categories: z.array(categorySchema), products: z.array(legacyProductViewSchema), collections: z.array(smartCollectionSchema) })
export type LegacyMenuResponse = z.infer<typeof legacyMenuResponseSchema>

export const getCategories = async () => categorySchema.array().parse((await apiClient.get(endpoints.categories)).data)
export const getProducts = async (category?: string) => legacyProductViewSchema.array().parse((await apiClient.get(endpoints.products, { params: category ? { category } : undefined })).data)
export const getProduct = async (id: string) => legacyProductViewSchema.parse((await apiClient.get(`${endpoints.products}/${id}`)).data)
export const getMenu = async () => legacyMenuResponseSchema.parse((await apiClient.get(endpoints.menu)).data)
export const getRecommendations = async () => legacyProductViewSchema.array().parse((await apiClient.get(endpoints.recommendations)).data)
export const searchProducts = async (q: string) => legacyProductViewSchema.array().parse((await apiClient.get(endpoints.search, { params: { q } })).data)

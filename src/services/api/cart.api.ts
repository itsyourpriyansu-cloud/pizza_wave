import { apiClient } from './client'
import { endpoints } from './endpoints'
import { legacyCartSchema } from '../../domain/cart/cart.schema'
import { cartQuoteSchema } from '../../domain/pricing/pricing.schema'

export const getCart = async () => legacyCartSchema.parse((await apiClient.get(endpoints.cart)).data)
export const addCartItem = async (productId: string, quantity = 1) => legacyCartSchema.parse((await apiClient.post(endpoints.cartItems, { productId, quantity })).data)
export const updateCartItem = async (itemId: string, quantity: number) => legacyCartSchema.parse((await apiClient.patch(`${endpoints.cartItems}/${itemId}`, { quantity })).data)
export const removeCartItem = async (itemId: string) => legacyCartSchema.parse((await apiClient.delete(`${endpoints.cartItems}/${itemId}`)).data)
export const quoteCart = async () => cartQuoteSchema.parse((await apiClient.post(endpoints.cartQuote)).data)

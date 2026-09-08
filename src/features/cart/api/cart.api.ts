import { apiClient } from '../../../services/api/client'
import { endpoints } from '../../../services/api/endpoints'
import { cartQuoteSchema, cartSchema } from '../../../services/api/contracts'

export const getCart = async () => cartSchema.parse((await apiClient.get(endpoints.cart)).data)
export const addCartItem = async (productId: string) => cartSchema.parse((await apiClient.post(endpoints.cartItems, { productId, quantity: 1 })).data)
export const updateCartItem = async (itemId: string, quantity: number) => cartSchema.parse((await apiClient.patch(`${endpoints.cartItems}/${itemId}`, { quantity })).data)
export const quoteCart = async () => cartQuoteSchema.parse((await apiClient.post(endpoints.cartQuote)).data)

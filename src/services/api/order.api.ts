import { apiClient } from './client'
import { endpoints, orderById, orderComplete, orderEvents } from './endpoints'
import { orderEventSchema, orderSchema } from '../../domain/orders/order.schema'

export const getOrders = async (customerId?: string) => orderSchema.array().parse((await apiClient.get(endpoints.orders, { params: customerId ? { customerId } : undefined })).data)
export const getOrder = async (orderId: string) => orderSchema.parse((await apiClient.get(orderById(orderId))).data)
export const getOrderEvents = async (orderId: string) => orderEventSchema.array().parse((await apiClient.get(orderEvents(orderId))).data)
export const completeOrder = async (orderId: string, finalStatus: 'DELIVERED' | 'PICKED_UP' | 'STORE_COMPLETED') =>
  orderSchema.parse((await apiClient.post(orderComplete(orderId), { finalStatus })).data)

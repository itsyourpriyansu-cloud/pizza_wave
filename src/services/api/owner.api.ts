import { apiClient } from './client'
import { endpoints, ownerAcceptOrder, ownerRejectOrder, ownerResolveAttention } from './endpoints'
import { orderSchema } from '../../domain/orders/order.schema'
import { customerSchema } from '../../domain/customer/customer.schema'
import { refundSchema } from '../../domain/refunds/refund.schema'
import { z } from 'zod'

const attentionItemSchema = z.object({
  id: z.string(), type: z.string(), severity: z.string(), title: z.string(), summary: z.string(),
  orderId: z.string().optional(), customerId: z.string().optional(), suggestedAction: z.string(),
  createdAt: z.string(), resolvedAt: z.string().optional(),
})

export const getOwnerOrders = async (acceptanceStatus?: string) => orderSchema.array().parse((await apiClient.get(endpoints.ownerOrders, { params: acceptanceStatus ? { acceptanceStatus } : undefined })).data)
export const acceptOwnerOrder = async (orderId: string) => orderSchema.parse((await apiClient.post(ownerAcceptOrder(orderId))).data)
export const rejectOwnerOrder = async (orderId: string, reason: string) =>
  z.object({ order: orderSchema, refund: refundSchema }).parse((await apiClient.post(ownerRejectOrder(orderId), { reason })).data)
export const getAttentionQueue = async () => attentionItemSchema.array().parse((await apiClient.get(endpoints.ownerAttention)).data)
export const resolveAttentionItem = async (attentionId: string) => attentionItemSchema.parse((await apiClient.post(ownerResolveAttention(attentionId))).data)
export const getOwnerCustomer = async (customerId: string) => customerSchema.parse((await apiClient.get(`${endpoints.ownerCustomers}/${customerId}`)).data)

import { apiClient } from './client'
import { endpoints, paymentConfirm, paymentFail, paymentStatus } from './endpoints'
import { paymentAttemptSchema } from '../../domain/payment/payment.schema'
import { orderSchema } from '../../domain/orders/order.schema'
import { z } from 'zod'

const initiateResponseSchema = z.object({ payment: paymentAttemptSchema, redirectUrl: z.string() })
const confirmResponseSchema = z.object({ payment: paymentAttemptSchema, order: orderSchema.optional() })

export const initiatePayment = async (orderIntentId: string) => initiateResponseSchema.parse((await apiClient.post(endpoints.paymentInitiate, { orderIntentId })).data)
export const getPaymentStatus = async (merchantOrderId: string) => paymentAttemptSchema.parse((await apiClient.get(paymentStatus(merchantOrderId))).data)
export const confirmPaymentDemo = async (merchantOrderId: string) => confirmResponseSchema.parse((await apiClient.post(paymentConfirm(merchantOrderId))).data)
export const failPaymentDemo = async (merchantOrderId: string) => z.object({ payment: paymentAttemptSchema }).parse((await apiClient.post(paymentFail(merchantOrderId))).data)

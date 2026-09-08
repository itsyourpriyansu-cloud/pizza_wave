import { apiClient } from './client'
import { endpoints, kdsPrepTime, kdsProblem, kdsReady, kdsStartPrep } from './endpoints'
import { orderSchema } from '../../domain/orders/order.schema'
import { z } from 'zod'

const queueEntrySchema = z.object({ order: orderSchema, position: z.number() })
const prepTimeResponseSchema = z.object({ order: orderSchema, customerNoticeNeeded: z.boolean(), severeDelay: z.boolean() })

export const getKitchenQueue = async () => queueEntrySchema.array().parse((await apiClient.get(endpoints.kdsQueue)).data)
export const startPrep = async (orderId: string) => orderSchema.parse((await apiClient.post(kdsStartPrep(orderId))).data)
export const updatePrepTime = async (orderId: string, minutes: number, reason: string, chefId?: string) =>
  prepTimeResponseSchema.parse((await apiClient.patch(kdsPrepTime(orderId), { minutes, reason, chefId })).data)
export const markReady = async (orderId: string) => orderSchema.parse((await apiClient.post(kdsReady(orderId))).data)
export const reportKitchenProblem = async (orderId: string, reason: string) => (await apiClient.post(kdsProblem(orderId), { reason })).data as { ok: boolean }

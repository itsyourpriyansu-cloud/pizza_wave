import { apiClient } from './client'
import { endpoints } from './endpoints'
import { orderIntentSchema } from '../../domain/orders/order.schema'
import type { FulfillmentMode } from '../../domain/customer/customer.types'

export interface CreateIntentInput { fulfillmentType: FulfillmentMode; pickupSlot?: string; addressSnapshot?: { line1: string; city: string; pincode: string } }
export const createOrderIntent = async (input: CreateIntentInput) => orderIntentSchema.parse((await apiClient.post(endpoints.checkoutIntent, input)).data)
export const getOrderIntent = async (id: string) => orderIntentSchema.parse((await apiClient.get(`${endpoints.checkoutIntent}/${id}`)).data)

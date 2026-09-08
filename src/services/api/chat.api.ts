import { apiClient } from './client'
import { endpoints } from './endpoints'
import { z } from 'zod'

const conversationSchema = z.object({ id: z.string(), customerId: z.string(), channel: z.string(), status: z.string(), node: z.string(), createdAt: z.string(), updatedAt: z.string() })
const messageSchema = z.object({ id: z.string(), conversationId: z.string(), from: z.string(), text: z.string(), intent: z.string().optional(), at: z.string() })
const sendResponseSchema = z.object({ conversation: conversationSchema, intent: z.string(), reply: messageSchema })

export const sendChatMessage = async (customerId: string, text: string, conversationId?: string) =>
  sendResponseSchema.parse((await apiClient.post(endpoints.chatMessage, { customerId, text, conversationId })).data)
export const getConversationMessages = async (conversationId: string) => messageSchema.array().parse((await apiClient.get(`${endpoints.chatConversations}/${conversationId}/messages`)).data)
export const getConversation = async (conversationId: string) => conversationSchema.parse((await apiClient.get(`${endpoints.chatConversations}/${conversationId}`)).data)

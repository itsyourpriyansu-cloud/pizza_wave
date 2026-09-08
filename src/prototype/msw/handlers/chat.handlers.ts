import { http } from 'msw'
import { db } from '../../database/db'
import { createId } from '../../../domain/shared/ids'
import { classifyIntent, nextChatNode } from '../../../domain/conversation/intent.engine'
import { API, boot, error, json, now } from './_shared'

const replies: Record<string, string> = {
  TRACK_ORDER: 'Tell me your order number, or I can pull up your most recent order.',
  ORDER_STATUS: 'Your most recent order is on its way. You can also check Orders in the app.',
  REPORT_PROBLEM: 'Sorry about that. What went wrong — missing item, wrong item, food quality, or something else?',
  SELECT_ORDER_ITEM: 'Which item was affected? I will raise a support case for our founder to review.',
  CREATE_SUPPORT_CASE: 'Support case created. Our founder will follow up shortly.',
  REFUND_STATUS: 'Refunds are usually processed within 24-48 hours after approval.',
  LOYALTY_HELP: 'Wave Points: 1 point = ₹1. You earn points on every completed order based on your tier.',
  MAIN_MENU: 'You can browse the menu, track an order, or report a problem. What would you like to do?',
  HUMAN_HANDOFF: 'Connecting you with our founder — they will reply here shortly.',
  START: 'Hi! I can help you track an order, browse the menu, or report a problem.',
}

export const chatHandlers = [
  http.post(`${API}/chat/message`, async ({ request }) => {
    await boot()
    const body = await request.json() as { conversationId?: string; customerId: string; text: string }
    let conversation = body.conversationId ? await db.conversations.get(body.conversationId) : undefined
    const current = now()
    if (!conversation) {
      conversation = { id: createId('CONV'), customerId: body.customerId, channel: 'PWA_CHAT', status: 'OPEN', node: 'START', createdAt: current.toISOString(), updatedAt: current.toISOString() }
      await db.conversations.add(conversation)
    }

    const intent = classifyIntent(body.text)
    const nextNode = nextChatNode(conversation.node, intent)
    conversation = { ...conversation, node: nextNode, updatedAt: current.toISOString() }
    await db.conversations.put(conversation)

    const inboundMessage = { id: createId('MSG'), conversationId: conversation.id, from: 'CUSTOMER' as const, text: body.text, intent, at: current.toISOString() }
    const replyText = replies[nextNode] ?? 'Got it — let me help with that.'
    const outboundMessage = { id: createId('MSG'), conversationId: conversation.id, from: 'SYSTEM' as const, text: replyText, at: current.toISOString() }
    await db.messages.bulkAdd([inboundMessage, outboundMessage])

    return json({ conversation, intent, reply: outboundMessage })
  }),

  http.get(`${API}/chat/conversations/:id/messages`, async ({ params }) => {
    await boot()
    const messages = await db.messages.where('conversationId').equals(String(params.id)).sortBy('at')
    return json(messages)
  }),

  http.get(`${API}/chat/conversations/:id`, async ({ params }) => {
    await boot()
    const conversation = await db.conversations.get(String(params.id))
    return conversation ? json(conversation) : error('Conversation not found', 404)
  }),
]

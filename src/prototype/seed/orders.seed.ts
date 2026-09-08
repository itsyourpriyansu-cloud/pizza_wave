import type { Order } from '../../domain/orders/order.types'
import type { CartQuote } from '../../domain/pricing/pricing.types'

const quote = (subtotal: number, pointsToEarn: number): CartQuote => ({
  itemCount: 2, subtotal, discount: 0, pointsRequested: 0, pointsUsable: 0, pointsValue: 0,
  deliveryFee: 0, eligibleSpend: subtotal, pointsToEarn, total: subtotal, warnings: [], valid: true,
})

/** Historical completed orders — seed the CRM/loyalty history a fresh cart can't provide on its own. */
export const orderHistorySeed: Order[] = [
  {
    id: 'ORDER-HIST-001', publicOrderNumber: 'PW-00001', customerId: 'CUST001', source: 'PWA', fulfillmentType: 'DELIVERY',
    paymentStatus: 'CONFIRMED', acceptanceStatus: 'ACCEPTED', fulfillmentStatus: 'DELIVERED', refundStatus: 'NONE',
    items: [{ productId: 'PIZZA-VEG-001', name: 'Classic Veg Pizza', quantity: 1, unitPrice: 110 }, { productId: 'COFFEE-001', name: 'Cold Coffee', quantity: 1, unitPrice: 119 }],
    financialSnapshot: quote(229, 9),
    systemPrepMinutes: 17, effectivePrepMinutes: 17,
    prepStartAt: '2026-09-02T18:05:00.000Z', targetReadyAt: '2026-09-02T18:22:00.000Z', promisedAt: '2026-09-02T18:37:00.000Z',
    acceptedAt: '2026-09-02T18:00:00.000Z', createdAt: '2026-09-02T17:58:00.000Z',
    orderIntentId: 'INTENT-HIST-001', paymentId: 'PAY-HIST-001',
  },
  {
    id: 'ORDER-HIST-002', publicOrderNumber: 'PW-00002', customerId: 'CUST001', source: 'PWA', fulfillmentType: 'PICKUP',
    paymentStatus: 'CONFIRMED', acceptanceStatus: 'ACCEPTED', fulfillmentStatus: 'STORE_COMPLETED', refundStatus: 'NONE',
    items: [{ productId: 'KULHAD-001', name: 'Signature Kulhad Pizza', quantity: 1, unitPrice: 199 }, { productId: 'GARLIC-001', name: 'Cheesy Garlic Bread', quantity: 1, unitPrice: 129 }],
    financialSnapshot: quote(328, 13),
    systemPrepMinutes: 23, effectivePrepMinutes: 23,
    prepStartAt: '2026-08-24T13:10:00.000Z', targetReadyAt: '2026-08-24T13:33:00.000Z', promisedAt: '2026-08-24T13:38:00.000Z',
    acceptedAt: '2026-08-24T13:05:00.000Z', createdAt: '2026-08-24T13:02:00.000Z',
    orderIntentId: 'INTENT-HIST-002', paymentId: 'PAY-HIST-002',
  },
]

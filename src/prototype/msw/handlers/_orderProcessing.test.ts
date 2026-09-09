import { beforeEach, describe, expect, it } from 'vitest'
import type { OrderIntent } from '../../../domain/orders/order.types'
import type { PaymentAttempt } from '../../../domain/payment/payment.types'
import { db } from '../../database/db'
import { DEMO_CART_ID, resetDemoDatabase } from '../../demo/reset-demo'
import { confirmPaymentAndCreateOrder } from './_orderProcessing'

const quote = {
  itemCount: 1,
  subtotal: 299,
  discount: 0,
  pointsRequested: 0,
  pointsUsable: 0,
  pointsValue: 0,
  pointsRedeemed: 0,
  deliveryFee: 29,
  eligibleSpend: 299,
  pointsToEarn: 19,
  total: 328,
  warnings: [],
  valid: true,
}

const intent: OrderIntent = {
  id: 'INTENT-STAGE4-TEST',
  checkoutSessionId: 'CHECKOUT-STAGE4-TEST',
  customerId: 'CUST001',
  fulfillmentType: 'DELIVERY',
  cartSnapshot: {
    cartId: DEMO_CART_ID,
    items: [{ productId: 'PIZZA-VEG-001', quantity: 1, unitPrice: 299, name: 'Test Pizza', modifiers: [] }],
    takenAt: '2026-09-08T00:00:00.000Z',
  },
  addressSnapshot: { line1: 'Grand Road', city: 'Puri', pincode: '752001' },
  customerPhone: '9876543210',
  quoteSnapshot: quote,
  expectedPromiseAt: '2026-09-08T00:40:00.000Z',
  expiresAt: '2026-09-08T00:15:00.000Z',
  status: 'OPEN',
  createdAt: '2026-09-08T00:00:00.000Z',
}

const payment: PaymentAttempt = {
  id: 'PAY-STAGE4-TEST',
  orderIntentId: intent.id,
  provider: 'PHONEPE',
  merchantOrderId: 'MO-STAGE4-TEST',
  providerTransactionId: 'PHONEPE-TXN-STAGE4-TEST',
  amount: quote.total,
  status: 'CONFIRMED',
  createdAt: '2026-09-08T00:01:00.000Z',
  confirmedAt: '2026-09-08T00:02:00.000Z',
}

describe('Stage 4 payment-to-order boundary', () => {
  beforeEach(async () => {
    await resetDemoDatabase()
    await db.cartItems.add({
      id: 'CART-ITEM-STAGE4-TEST', cartId: DEMO_CART_ID, productId: 'PIZZA-VEG-001',
      quantity: 1, modifiers: [], unitPriceSnapshot: 299,
    })
    await db.orderIntents.add(intent)
    await db.payments.add(payment)
  })

  it('creates no operational state beyond awaiting acceptance', async () => {
    const order = await confirmPaymentAndCreateOrder(payment)

    expect(order.paymentStatus).toBe('CONFIRMED')
    expect(order.acceptanceStatus).toBe('AWAITING_ACCEPTANCE')
    expect(order.fulfillmentStatus).toBe('NOT_STARTED')
    expect(order.acceptedAt).toBeUndefined()
    expect(order.prepStartAt).toBeUndefined()
    expect((await db.orderIntents.get(intent.id))?.status).toBe('CONSUMED')
    expect(await db.cartItems.where('cartId').equals(DEMO_CART_ID).count()).toBe(0)

    const eventTypes = (await db.orderEvents.where('orderId').equals(order.id).toArray()).map((event) => event.type)
    expect(eventTypes).toEqual(['PAYMENT_CONFIRMED'])
  })

  it('is idempotent for repeated authoritative payment confirmation', async () => {
    const first = await confirmPaymentAndCreateOrder(payment)
    const second = await confirmPaymentAndCreateOrder(payment)

    expect(second.id).toBe(first.id)
    expect(await db.orders.where('orderIntentId').equals(intent.id).count()).toBe(1)
    expect(await db.loyaltyTransactions.where('orderId').equals(first.id).count()).toBe(1)
    expect(await db.orderEvents.where('orderId').equals(first.id).count()).toBe(1)
  })

  it('refuses to create an order from a frontend-shaped pending attempt', async () => {
    await expect(confirmPaymentAndCreateOrder({ ...payment, status: 'PENDING', providerTransactionId: undefined, confirmedAt: undefined })).rejects.toThrow('not backend-confirmed')
    expect(await db.orders.where('orderIntentId').equals(intent.id).count()).toBe(0)
    expect(await db.cartItems.where('cartId').equals(DEMO_CART_ID).count()).toBe(1)
  })
})

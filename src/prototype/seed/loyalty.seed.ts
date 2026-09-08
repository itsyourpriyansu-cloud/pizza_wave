import type { LoyaltyTransaction, TierStatus } from '../../domain/loyalty/loyalty.types'

export const loyaltyTransactionSeed: LoyaltyTransaction[] = [
  { id: 'LOY-SEED-001', customerId: 'CUST001', orderId: 'ORDER-HIST-001', type: 'EARN_AVAILABLE', status: 'AVAILABLE', points: 9, createdAt: '2026-09-02T18:40:00.000Z', expiresAt: '2027-03-01T18:40:00.000Z' },
  { id: 'LOY-SEED-002', customerId: 'CUST001', orderId: 'ORDER-HIST-002', type: 'EARN_AVAILABLE', status: 'AVAILABLE', points: 13, createdAt: '2026-08-24T13:40:00.000Z', expiresAt: '2027-02-20T13:40:00.000Z' },
  { id: 'LOY-SEED-003', customerId: 'CUST001', type: 'BONUS', status: 'AVAILABLE', points: 160, createdAt: '2026-07-01T09:00:00.000Z', expiresAt: '2026-12-28T09:00:00.000Z', note: 'Seed balance for demo continuity' },
  { id: 'LOY-SEED-004', customerId: 'CUST001', type: 'EARN_PENDING', status: 'PENDING', points: 19, createdAt: '2026-09-06T20:00:00.000Z', note: 'Awaiting fulfillment completion' },
]

export const tierStatusSeed: TierStatus[] = [
  { customerId: 'CUST001', tier: 'GOLD', since: '2026-06-15T00:00:00.000Z' },
]

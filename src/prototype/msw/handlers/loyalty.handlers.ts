import { http } from 'msw'
import { db } from '../../database/db'
import { calculateTierProgress } from '../../../domain/loyalty/loyalty.engine'
import { toDemoCustomerView } from '../../../domain/customer/customer.view'
import { API, boot, error, json } from './_shared'

export const loyaltyHandlers = [
  http.get(`${API}/loyalty`, async ({ request }) => {
    await boot()
    const customerId = new URL(request.url).searchParams.get('customerId') ?? 'CUST001'
    const customer = await db.customers.get(customerId)
    if (!customer) return error('Customer not found', 404)
    const progress = calculateTierProgress({ rolling120Orders: customer.stats.rolling120Orders, rolling120EligibleSpend: customer.stats.rolling120EligibleSpend })
    return json({ customer: toDemoCustomerView(customer), nextTier: progress.next?.id, ordersNeeded: progress.ordersNeeded, spendNeeded: progress.spendNeeded })
  }),

  http.get(`${API}/loyalty/wallet/:customerId`, async ({ params }) => {
    await boot()
    const customerId = String(params.customerId)
    const transactions = await db.loyaltyTransactions.where('customerId').equals(customerId).sortBy('createdAt')
    return json(transactions.reverse())
  }),

  http.get(`${API}/wave-id/:waveId`, async ({ params }) => {
    await boot()
    const customer = await db.customers.where('id').equals(String(params.waveId).replace('WAVE-', '')).first()
    return customer ? json(toDemoCustomerView(customer)) : error('Wave ID not found', 404)
  }),
]

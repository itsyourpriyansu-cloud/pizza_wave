import { http } from 'msw'
import { db } from '../../database/db'
import { resetDemoDatabase } from '../../demo/reset-demo'
import { loadScenario, scenarioIds } from '../../scenarios'
import { API, boot, error, json } from './_shared'
import { createCustomerSession } from '../../../domain/auth/session.policy'
import { demoClock } from '../../../domain/shared/clock'

export const demoHandlers = [
  http.post(`${API}/demo/reset`, async () => { await resetDemoDatabase(); return json({ ok: true }) }),

  http.get(`${API}/demo/scenarios`, async () => json(scenarioIds)),

  http.post(`${API}/demo/scenario/:name`, async ({ params }) => {
    const name = String(params.name)
    if (!scenarioIds.includes(name as never)) return error(`Unknown scenario: ${name}`, 404)
    const summary = await loadScenario(name as never)
    return json(summary)
  }),

  /** Legacy Stage-1 toggle kept for the current DemoToolbar. */
  http.patch(`${API}/demo/session`, async ({ request }) => {
    await boot()
    const { loggedIn } = await request.json() as { loggedIn: boolean }
    await db.config.put({ key: 'customerLoggedIn', value: loggedIn })
    await db.sessions.where('realm').equals('CUSTOMER').delete()
    if (loggedIn) await db.sessions.add({ id: 'SESSION-CUSTOMER-DEMO', realm: 'CUSTOMER', payload: createCustomerSession('CUST001', demoClock.now()) })
    return json({ loggedIn })
  }),
]

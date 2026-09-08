import { apiClient } from './client'
import { endpoints, scenarioByName } from './endpoints'
import { z } from 'zod'

const scenarioSummarySchema = z.object({ id: z.string(), title: z.string(), description: z.string(), appliedAt: z.string() })

export const resetDemo = async () => (await apiClient.post(endpoints.demoReset)).data as { ok: boolean }
export const listScenarios = async () => z.array(z.string()).parse((await apiClient.get(endpoints.demoScenarios)).data)
export const loadScenario = async (name: string) => scenarioSummarySchema.parse((await apiClient.post(scenarioByName(name))).data)
/** Legacy Stage-1 toggle kept for the current DemoToolbar. */
export const setCustomerLoggedIn = async (loggedIn: boolean) => (await apiClient.patch(endpoints.demoSession, { loggedIn })).data as { loggedIn: boolean }

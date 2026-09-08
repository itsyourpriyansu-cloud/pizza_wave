import { db } from '../database/db'
import { expireAvailabilityOverrides } from '../../domain/availability/availability.engine'
import { eventBus } from '../events/event-bus'

/**
 * Sweep run periodically (see jobs.ts) so temporary chef/owner availability overrides and
 * stale order intents clear themselves without any UI interaction — mirrors what a backend
 * cron/worker would do in production.
 */
export async function runAutomationSweep(now: Date): Promise<void> {
  const records = await db.availability.toArray()
  const live = expireAvailabilityOverrides(records, now)
  if (live.length !== records.length) {
    const expiredIds = records.filter((record) => !live.includes(record)).map((record) => record.id)
    await db.availability.bulkDelete(expiredIds)
    eventBus.emit('AVAILABILITY_CHANGED', { expiredIds })
  }

  const intents = await db.orderIntents.where('status').equals('OPEN').toArray()
  const expired = intents.filter((intent) => new Date(intent.expiresAt) <= now)
  for (const intent of expired) await db.orderIntents.update(intent.id, { status: 'EXPIRED' })
}

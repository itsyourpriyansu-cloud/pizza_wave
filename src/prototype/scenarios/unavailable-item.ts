import { db } from '../database/db'
import { resetDemoDatabase } from '../demo/reset-demo'
import { demoClock } from '../../domain/shared/clock'
import { setChefTemporaryAvailability } from '../../domain/availability/availability.engine'
import { eventBus } from '../events/event-bus'
import type { ScenarioSummary } from './scenario.types'

export async function loadUnavailableItem(): Promise<ScenarioSummary> {
  await resetDemoDatabase()
  const now = demoClock.now()
  const record = setChefTemporaryAvailability('PIZZA-MUSH-001', 'PRODUCT', 60, now, 'Out of mushrooms')
  await db.availability.put(record)
  eventBus.emit('AVAILABILITY_CHANGED', record)
  return {
    id: 'unavailableItem', title: 'Item Unavailable', appliedAt: now.toISOString(),
    description: 'Mushroom Cheese Pizza is chef-disabled for 60 minutes. A cart containing it will fail availability validation at checkout.',
  }
}

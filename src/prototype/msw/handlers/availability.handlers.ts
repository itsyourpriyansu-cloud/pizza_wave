import { http } from 'msw'
import { db } from '../../database/db'
import { setChefTemporaryAvailability, setOwnerAvailability, type ChefUnavailableDuration } from '../../../domain/availability/availability.engine'
import type { AvailabilityEntityType } from '../../../domain/availability/availability.types'
import { API, boot, json, now } from './_shared'
import { eventBus } from '../../events/event-bus'

export const availabilityHandlers = [
  http.get(`${API}/availability`, async () => { await boot(); return json(await db.availability.toArray()) }),

  http.patch(`${API}/owner/availability/:entityId`, async ({ params, request }) => {
    await boot()
    const body = await request.json() as { entityType: AvailabilityEntityType; available: boolean; reason?: string }
    const record = setOwnerAvailability(String(params.entityId), body.entityType, body.available, now(), body.reason)
    await db.availability.put(record)
    eventBus.emit('AVAILABILITY_CHANGED', record)
    return json(record)
  }),

  http.patch(`${API}/kds/availability/:entityId`, async ({ params, request }) => {
    await boot()
    const body = await request.json() as { entityType: AvailabilityEntityType; duration: ChefUnavailableDuration; reason?: string }
    const record = setChefTemporaryAvailability(String(params.entityId), body.entityType, body.duration, now(), body.reason)
    await db.availability.put(record)
    eventBus.emit('AVAILABILITY_CHANGED', record)
    return json(record)
  }),

  http.delete(`${API}/kds/availability/:entityId`, async ({ params }) => {
    await boot()
    await db.availability.where('entityId').equals(String(params.entityId)).delete()
    eventBus.emit('AVAILABILITY_CHANGED', { entityId: params.entityId, cleared: true })
    return json({ ok: true })
  }),
]

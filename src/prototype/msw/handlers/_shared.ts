import { HttpResponse } from 'msw'
import { db } from '../../database/db'
import { deriveCapabilities } from '../../../domain/store/capability.engine'
import { demoClock } from '../../../domain/shared/clock'
import { eventBus } from '../../events/event-bus'
import { createId } from '../../../domain/shared/ids'
import type { Capabilities, StoreConfig } from '../../../domain/store/store.types'
import type { OrderEventType } from '../../../domain/orders/order.types'
import { ensureDemoDatabase } from '../../demo/reset-demo'

export const API = '*/api/v1'
export const json = <T,>(value: T, status = 200) => HttpResponse.json(value as never, { status })
export const error = (message: string, status = 400) => HttpResponse.json({ message } as never, { status })

export async function boot(): Promise<void> {
  await ensureDemoDatabase()
}

export async function getStoreConfig(): Promise<StoreConfig> {
  const record = await db.config.get('storeConfig')
  return record?.value as StoreConfig
}

export async function saveStoreConfig(config: StoreConfig): Promise<void> {
  await db.config.put({ key: 'storeConfig', value: config })
  await db.config.put({ key: 'capabilities', value: deriveCapabilities(config) })
}

export async function getCapabilities(): Promise<Capabilities> {
  const record = await db.config.get('capabilities')
  if (record) return record.value as Capabilities
  const config = await getStoreConfig()
  const capabilities = deriveCapabilities(config)
  await db.config.put({ key: 'capabilities', value: capabilities })
  return capabilities
}

export async function nextOrderSequence(): Promise<number> {
  const record = await db.config.get('orderSequence')
  const next = ((record?.value as number) ?? 0) + 1
  await db.config.put({ key: 'orderSequence', value: next })
  return next
}

export async function logOrderEvent(orderId: string, type: OrderEventType, actor: 'CUSTOMER' | 'OWNER' | 'CHEF' | 'SYSTEM', metadata?: Record<string, unknown>) {
  const now = demoClock.now()
  await db.orderEvents.add({ id: createId('EVT-ORDER'), orderId, type, actor, at: now.toISOString(), metadata })
  eventBus.emit(type, metadata, { orderId })
}

export function now() {
  return demoClock.now()
}

/** One-shot flag scenarios set to steer the very next payment (see scenarios/payment-failure.ts etc). */
export async function getAndClearNextPaymentOutcome(): Promise<'AUTO_CONFIRM' | 'STAY_PENDING' | 'FAIL'> {
  const record = await db.config.get('nextPaymentOutcome')
  if (record) await db.config.delete('nextPaymentOutcome')
  return (record?.value as 'AUTO_CONFIRM' | 'STAY_PENDING' | 'FAIL' | undefined) ?? 'AUTO_CONFIRM'
}

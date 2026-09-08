import type { ScheduleInput, ScheduleOutput } from './fulfillment.types'

/**
 * Pure and deterministic given its inputs (no Date.now() reads) so it stays unit-testable
 * and reusable by both the acceptance engine and KDS "what if" previews.
 *
 * Load bands (percent of kitchenCapacityCount currently active):
 *   0-50%   -> +0 min
 *   51-75%  -> +5 min
 *   76-90%  -> +10 min
 *   >90%    -> reviewRequired = true (Owner Review), no auto schedule promise
 */
export function scheduleOrder(input: ScheduleInput): ScheduleOutput {
  const basePrepMinutes = Math.max(...input.items.map((item) => item.prepMinutes), 0)
  const complexityMinutes = input.items.reduce((total, item) => total + (item.complexity - 1) * item.quantity, 0)
  const loadPercent = input.kitchenCapacityCount > 0 ? Math.round((input.activeOrderCount / input.kitchenCapacityCount) * 100) : 0

  let loadPadding = 0
  let reviewRequired = false
  let reviewReason: string | undefined
  if (loadPercent > 90) {
    reviewRequired = true
    reviewReason = `Kitchen load at ${loadPercent}% exceeds safe auto-accept threshold.`
  } else if (loadPercent > 75) {
    loadPadding = 10
  } else if (loadPercent > 50) {
    loadPadding = 5
  }

  const systemPrepMinutes = basePrepMinutes + complexityMinutes + loadPadding + input.packingMinutes
  const prepStartAt = input.now
  const targetReadyAt = new Date(prepStartAt.getTime() + systemPrepMinutes * 60_000)

  let dispatchTargetAt: Date | undefined
  let promiseWindowStart: Date
  let promiseWindowEnd: Date

  if (input.fulfillmentType === 'DELIVERY') {
    dispatchTargetAt = new Date(targetReadyAt.getTime() + input.deliveryBufferMinutes * 60_000)
    promiseWindowStart = new Date(dispatchTargetAt.getTime())
    promiseWindowEnd = new Date(dispatchTargetAt.getTime() + 15 * 60_000)
  } else {
    promiseWindowStart = new Date(targetReadyAt.getTime() + input.pickupBufferMinutes * 60_000)
    promiseWindowEnd = new Date(promiseWindowStart.getTime() + 10 * 60_000)
  }

  return {
    systemPrepMinutes, prepStartAt: prepStartAt.toISOString(), targetReadyAt: targetReadyAt.toISOString(),
    dispatchTargetAt: dispatchTargetAt?.toISOString(),
    promiseWindowStart: promiseWindowStart.toISOString(), promiseWindowEnd: promiseWindowEnd.toISOString(),
    loadPercent, reviewRequired, reviewReason,
  }
}

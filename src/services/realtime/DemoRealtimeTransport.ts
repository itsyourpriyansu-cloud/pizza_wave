import { eventBus } from '../../prototype/events/event-bus'
import type { AppEvent } from '../../prototype/events/event-types'
import type { RealtimeTransport } from './RealtimeTransport'

/** Stands in for a future WebSocketTransport. Subscribes straight to the in-memory event bus. */
export class DemoRealtimeTransport implements RealtimeTransport {
  connect(): void {}
  disconnect(): void {}
  subscribe(listener: (event: AppEvent) => void): () => void {
    return eventBus.subscribe(listener)
  }
}

export const demoRealtimeTransport = new DemoRealtimeTransport()

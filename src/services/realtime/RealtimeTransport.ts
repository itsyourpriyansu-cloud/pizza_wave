import type { AppEvent } from '../../prototype/events/event-types'

export interface RealtimeTransport {
  connect(): void
  disconnect(): void
  subscribe(listener: (event: AppEvent) => void): () => void
}

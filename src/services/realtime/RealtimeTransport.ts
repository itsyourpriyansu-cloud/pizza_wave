import type { AppEvent } from '../events/eventTypes'
export interface RealtimeTransport { connect(): void; disconnect(): void; subscribe(listener: (event: AppEvent) => void): () => void }

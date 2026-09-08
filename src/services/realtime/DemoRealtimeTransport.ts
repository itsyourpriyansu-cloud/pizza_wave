import { eventBus } from '../events/eventBus'
import type { AppEvent } from '../events/eventTypes'
import type { RealtimeTransport } from './RealtimeTransport'
export class DemoRealtimeTransport implements RealtimeTransport { connect() {}; disconnect() {}; subscribe(listener: (event: AppEvent) => void) { return eventBus.subscribe(listener) } }

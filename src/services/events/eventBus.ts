import type { AppEvent } from './eventTypes'
type Listener = (event: AppEvent) => void
const listeners = new Set<Listener>()
export const eventBus = { emit(event: AppEvent) { listeners.forEach((listener) => listener(event)) }, subscribe(listener: Listener) { listeners.add(listener); return () => { listeners.delete(listener) } } }

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FulfillmentMode } from '../shared/types/domain'

interface AppState { fulfillmentMode: FulfillmentMode; setFulfillmentMode: (mode: FulfillmentMode) => void }
export const useAppStore = create<AppState>()(persist((set) => ({ fulfillmentMode: 'DELIVERY', setFulfillmentMode: (fulfillmentMode) => set({ fulfillmentMode }) }), { name: 'pizza-wave:app' }))

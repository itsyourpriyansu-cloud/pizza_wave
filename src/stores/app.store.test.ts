import { beforeEach, describe, expect, it } from 'vitest'
import { useAppStore } from './app.store'
describe('fulfillment store', () => {
  beforeEach(() => { localStorage.clear(); useAppStore.setState({ fulfillmentMode: 'DELIVERY' }) })
  it('supports customer modes and the future STORE type', () => {
    useAppStore.getState().setFulfillmentMode('PICKUP'); expect(useAppStore.getState().fulfillmentMode).toBe('PICKUP')
    useAppStore.getState().setFulfillmentMode('STORE'); expect(useAppStore.getState().fulfillmentMode).toBe('STORE')
  })
})

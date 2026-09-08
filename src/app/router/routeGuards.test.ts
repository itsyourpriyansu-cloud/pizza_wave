import { beforeEach, describe, expect, it } from 'vitest'
import { readKdsSession, readOwnerSession, sessionKeys } from './routeGuards'
describe('auth realm boundaries', () => {
  beforeEach(() => sessionStorage.clear())
  it('never treats an owner session as a KDS session', () => {
    sessionStorage.setItem(sessionKeys.owner, JSON.stringify({ realm: 'owner', email: 'owner@pizzawave.demo', expiresAt: 'later' }))
    expect(readOwnerSession()?.realm).toBe('owner'); expect(readKdsSession()).toBeNull()
  })
})

import type { KdsSession, OwnerSession } from '../../shared/types/domain'

export const sessionKeys = { customer: 'pizza-wave:session:customer', owner: 'pizza-wave:session:owner', kds: 'pizza-wave:session:kds' } as const
export function readOwnerSession(): OwnerSession | null { try { const value = sessionStorage.getItem(sessionKeys.owner); return value ? JSON.parse(value) as OwnerSession : null } catch { return null } }
export function readKdsSession(): KdsSession | null { try { const value = sessionStorage.getItem(sessionKeys.kds); return value ? JSON.parse(value) as KdsSession : null } catch { return null } }

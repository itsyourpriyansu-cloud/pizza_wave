import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../services/api/client'
import { endpoints } from '../../services/api/endpoints'
import type { CustomerSession } from '../../domain/auth/auth.types'
import { useAppStore } from '../../stores/app.store'

const CUSTOMER_SESSION_KEY = 'pizza-wave:customer-session'
const readCustomerSession = (): CustomerSession | undefined => {
  try {
    const stored = localStorage.getItem(CUSTOMER_SESSION_KEY)
    if (!stored) return undefined
    const session = JSON.parse(stored) as CustomerSession
    if (session.realm !== 'CUSTOMER' || new Date(session.expiresAt) <= new Date()) { localStorage.removeItem(CUSTOMER_SESSION_KEY); return undefined }
    return session
  } catch { localStorage.removeItem(CUSTOMER_SESSION_KEY); return undefined }
}

interface DemoContextValue {
  customerLoggedIn: boolean
  customerSession?: CustomerSession
  authenticateCustomer: (session: CustomerSession) => void
  setCustomerLoggedIn: (value: boolean) => Promise<void>
  reset: () => Promise<void>
}
const DemoContext = createContext<DemoContextValue | null>(null)

export function DemoProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient()
  const [customerSession, setCustomerSession] = useState<CustomerSession | undefined>(readCustomerSession)
  const [customerLoggedIn, setLoggedIn] = useState(() => Boolean(readCustomerSession()) || localStorage.getItem('pizza-wave:demo:customer') !== 'guest')
  const authenticateCustomer = (session: CustomerSession) => {
    localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(session))
    localStorage.setItem('pizza-wave:demo:customer', 'member')
    setCustomerSession(session); setLoggedIn(true)
  }
  const setCustomerLoggedIn = async (value: boolean) => {
    await apiClient.patch(endpoints.demoSession, { loggedIn: value })
    localStorage.setItem('pizza-wave:demo:customer', value ? 'member' : 'guest')
    if (!value) { localStorage.removeItem(CUSTOMER_SESSION_KEY); setCustomerSession(undefined) }
    setLoggedIn(value)
  }
  const reset = async () => {
    await apiClient.post(endpoints.demoReset)
    localStorage.removeItem('pizza-wave:app')
    localStorage.removeItem(CUSTOMER_SESSION_KEY)
    localStorage.setItem('pizza-wave:demo:customer', 'member')
    useAppStore.setState({ fulfillmentMode: 'DELIVERY', checkoutPointsRequested: 0 })
    setLoggedIn(true)
    await queryClient.invalidateQueries()
  }
  const value = useMemo(() => ({ customerLoggedIn, customerSession, authenticateCustomer, setCustomerLoggedIn, reset }), [customerLoggedIn, customerSession])
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const value = useContext(DemoContext)
  if (!value) throw new Error('useDemo must be used inside DemoProvider')
  return value
}

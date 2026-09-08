import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../services/api/client'
import { endpoints } from '../../services/api/endpoints'

interface DemoContextValue { customerLoggedIn: boolean; setCustomerLoggedIn: (value: boolean) => Promise<void>; reset: () => Promise<void> }
const DemoContext = createContext<DemoContextValue | null>(null)

export function DemoProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient()
  const [customerLoggedIn, setLoggedIn] = useState(() => localStorage.getItem('pizza-wave:demo:customer') !== 'guest')
  const setCustomerLoggedIn = async (value: boolean) => {
    await apiClient.patch(endpoints.demoSession, { loggedIn: value })
    localStorage.setItem('pizza-wave:demo:customer', value ? 'member' : 'guest')
    setLoggedIn(value)
  }
  const reset = async () => {
    await apiClient.post(endpoints.demoReset)
    localStorage.removeItem('pizza-wave:app')
    localStorage.setItem('pizza-wave:demo:customer', 'member')
    setLoggedIn(true)
    await queryClient.invalidateQueries()
  }
  const value = useMemo(() => ({ customerLoggedIn, setCustomerLoggedIn, reset }), [customerLoggedIn])
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const value = useContext(DemoContext)
  if (!value) throw new Error('useDemo must be used inside DemoProvider')
  return value
}

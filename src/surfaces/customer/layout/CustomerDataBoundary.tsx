import { useEffect, useState, type PropsWithChildren } from 'react'
import { env } from '../../../app/config/env'
import { ErrorState, Skeleton } from '../../../shared/components'

let bootPromise: Promise<void> | null = null
async function bootCustomerRuntime() {
  if (bootPromise) return bootPromise
  bootPromise = (async () => {
    if (env.VITE_ENABLE_MSW) {
      const { worker } = await import('../../../mocks/browser')
      await worker.start({ serviceWorker: { url: import.meta.env.PROD ? '/sw.js' : '/mockServiceWorker.js', options: { scope: '/app/' } }, onUnhandledRequest: 'bypass', quiet: true })
    } else if ('serviceWorker' in navigator) {
      await navigator.serviceWorker.register('/sw.js', { scope: '/app/' })
    }
  })()
  return bootPromise
}

export function CustomerDataBoundary({ children }: PropsWithChildren) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  useEffect(() => {
    if (location.pathname === '/app') history.replaceState(null, '', `/app/${location.search}${location.hash}`)
    bootCustomerRuntime().then(() => setState('ready')).catch(() => setState('error'))
  }, [])
  if (state === 'error') return <main className="boot-state"><ErrorState retry={() => location.reload()} /></main>
  if (state === 'loading') return <main className="boot-state"><div className="brand-lockup"><span className="logo-wave">W</span><strong>THE PIZZA WAVE</strong></div><Skeleton className="boot-skeleton" /></main>
  return children
}

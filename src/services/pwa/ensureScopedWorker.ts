/**
 * Ensures the worker registered for this surface is activated before the one required
 * reload. `navigator.serviceWorker.ready` can resolve another surface's registration,
 * which otherwise creates a cross-surface boot loop after navigating from /app.
 */
export async function ensureScopedWorker(workerUrl: string, scope: string): Promise<'CONTROLLED' | 'RELOAD_REQUIRED'> {
  const expectedPath = new URL(workerUrl, location.origin).pathname
  const registration = await navigator.serviceWorker.getRegistration(new URL(scope, location.origin).href)
  const controlsExpectedWorker = Boolean(navigator.serviceWorker.controller && registration?.active && new URL(navigator.serviceWorker.controller.scriptURL).pathname === expectedPath)
  if (controlsExpectedWorker) return 'CONTROLLED'

  const nextRegistration = await navigator.serviceWorker.register(workerUrl, { scope })
  const candidate = nextRegistration.installing ?? nextRegistration.waiting ?? nextRegistration.active
  if (candidate?.state !== 'activated') {
    await new Promise<void>((resolve, reject) => {
      if (!candidate) { reject(new Error(`No worker candidate for ${scope}`)); return }
      const timeout = window.setTimeout(() => reject(new Error(`Worker activation timed out for ${scope}`)), 8_000)
      const onStateChange = () => {
        if (candidate.state === 'activated') { window.clearTimeout(timeout); candidate.removeEventListener('statechange', onStateChange); resolve() }
        if (candidate.state === 'redundant') { window.clearTimeout(timeout); candidate.removeEventListener('statechange', onStateChange); reject(new Error(`Worker became redundant for ${scope}`)) }
      }
      candidate.addEventListener('statechange', onStateChange)
      onStateChange()
    })
  }
  return 'RELOAD_REQUIRED'
}


import { ChefHat, LogOut, Tablet } from 'lucide-react'
import { useState } from 'react'
import { PrimaryButton, SecondaryButton, TextInput } from '../../../shared/components'
import type { KdsSession } from '../../../shared/types/domain'

const key = 'pizza-wave:session:kds'
export default function KdsPage() {
  const [session, setSession] = useState<KdsSession | null>(() => { try { return JSON.parse(sessionStorage.getItem(key) ?? 'null') } catch { return null } }); const [pin, setPin] = useState(''); const [error, setError] = useState('')
  const login = (event: React.FormEvent) => { event.preventDefault(); if (pin !== '2580') { setError('Enter the demo chef PIN from the blueprint.'); return } const next: KdsSession = { realm: 'kds', device: 'Kitchen Tablet #1', expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString() }; sessionStorage.setItem(key, JSON.stringify(next)); setSession(next) }
  if (!session) return <main className="realm-page kds-realm"><section className="realm-card"><div className="realm-icon"><ChefHat /></div><span>KITCHEN DISPLAY SYSTEM</span><h1>Chef sign in</h1><p>Trusted device: Kitchen Tablet #1. Kitchen access never opens customer or founder data.</p><form onSubmit={login}><TextInput label="Chef PIN" type="password" inputMode="numeric" maxLength={4} value={pin} onChange={(event) => setPin(event.target.value)} />{error && <p className="form-error">{error}</p>}<PrimaryButton type="submit"><Tablet size={18} /> START SHIFT SHELL</PrimaryButton></form></section></main>
  return <main className="protected-shell kds-protected"><header><div><span>KDS · TRUSTED DEVICE</span><h1>Kitchen Tablet #1</h1></div><SecondaryButton onClick={() => { sessionStorage.removeItem(key); setSession(null) }}><LogOut size={18} /> End shift</SecondaryButton></header><section><ChefHat /><span>STAGE 1 BOUNDARY</span><h2>The kitchen surface is isolated and ready.</h2><p>The exact three operational KDS screens, timers and availability controls begin in a later approved stage.</p></section></main>
}

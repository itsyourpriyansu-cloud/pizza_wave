import { LockKeyhole, LogOut, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { PrimaryButton, SecondaryButton, TextInput } from '../../../shared/components'
import type { OwnerSession } from '../../../shared/types/domain'

const key = 'pizza-wave:session:owner'
export default function OwnerPage() {
  const [session, setSession] = useState<OwnerSession | null>(() => { try { return JSON.parse(sessionStorage.getItem(key) ?? 'null') } catch { return null } })
  const [email, setEmail] = useState('owner@pizzawave.demo'); const [password, setPassword] = useState(''); const [code, setCode] = useState(''); const [error, setError] = useState('')
  const login = (event: React.FormEvent) => { event.preventDefault(); if (email !== 'owner@pizzawave.demo' || password !== 'PizzaWave@123' || code !== '654321') { setError('Use the demo owner credentials from the blueprint.'); return } const next: OwnerSession = { realm: 'owner', email, expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() }; sessionStorage.setItem(key, JSON.stringify(next)); setSession(next) }
  if (!session) return <main className="realm-page owner-realm"><section className="realm-card"><div className="realm-icon"><ShieldCheck /></div><span>FOUNDER CONTROL CENTER</span><h1>Owner access</h1><p>Commercial policy and exceptions stay separate from customer and kitchen sessions.</p><form onSubmit={login}><TextInput label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} /><TextInput label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} /><TextInput label="Demo 2FA" inputMode="numeric" value={code} onChange={(event) => setCode(event.target.value)} />{error && <p className="form-error">{error}</p>}<PrimaryButton type="submit"><LockKeyhole size={18} /> ENTER OWNER SHELL</PrimaryButton></form></section></main>
  return <main className="protected-shell owner-protected"><header><div><span>OWNER · PROTECTED SHELL</span><h1>Good evening, Priyanshu.</h1></div><SecondaryButton onClick={() => { sessionStorage.removeItem(key); setSession(null) }}><LogOut size={18} /> Sign out</SecondaryButton></header><section><ShieldCheck /><span>STAGE 1 BOUNDARY</span><h2>The Founder Control Center is ready for its next build stage.</h2><p>Owner CRM, paid-order review, availability controls and support exceptions are intentionally not implemented yet.</p></section></main>
}

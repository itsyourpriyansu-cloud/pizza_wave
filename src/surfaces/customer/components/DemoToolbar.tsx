import { RotateCcw, SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { env } from '../../../app/config/env'
import { api } from '../../../services/api'
import { IconButton, SecondaryButton, Switch } from '../../../shared/components'
import { useCapabilities } from '../../../features/availability/hooks/useCapabilities'
import { useDemo } from '../../../app/providers/DemoProvider'

export function DemoToolbar({ pillVisible = false }: { pillVisible?: boolean }) {
  const [open, setOpen] = useState(false); const queryClient = useQueryClient(); const { data } = useCapabilities(); const { customerLoggedIn, setCustomerLoggedIn, reset } = useDemo()
  if (!env.VITE_ENABLE_DEMO_TOOLS) return null
  const setCapability = async (patch: Parameters<typeof api.config.patchDemoCapabilities>[0]) => { await api.config.patchDemoCapabilities(patch); await queryClient.invalidateQueries({ queryKey: ['capabilities'] }) }
  const triggerAvailabilityChange = async () => { await api.demo.loadScenario('unavailableItem'); await queryClient.invalidateQueries() }
  return <aside className={`demo-toolbar ${open ? 'open' : ''} ${pillVisible ? 'has-cart' : ''}`}>
    {!open ? <IconButton aria-label="Open demo tools" onClick={() => setOpen(true)}><SlidersHorizontal /></IconButton> : <><div className="dialog-head"><strong>DEMO TOOLS</strong><IconButton aria-label="Close demo tools" onClick={() => setOpen(false)}><X /></IconButton></div>
      <Switch label="Customer logged in" checked={customerLoggedIn} onChange={(value) => void setCustomerLoggedIn(value)} />
      <Switch label="Delivery enabled" checked={data?.delivery.enabled ?? true} onChange={(value) => void setCapability({ deliveryEnabled: value })} />
      <Switch label="Pickup enabled" checked={data?.pickup.enabled ?? true} onChange={(value) => void setCapability({ pickupEnabled: value })} />
      <SecondaryButton onClick={() => void triggerAvailabilityChange()}>Test item change</SecondaryButton>
      <SecondaryButton onClick={() => void reset()}><RotateCcw size={16} /> Reset demo data</SecondaryButton>
    </>}
  </aside>
}

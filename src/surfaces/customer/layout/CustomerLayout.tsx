import { Home, Menu as MenuIcon, Gift, ReceiptText, UserRound, MapPin } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useCart, useCartQuote } from '../../../features/cart/hooks/useCart'
import { useLoyalty } from '../../../features/loyalty/hooks/useLoyalty'
import { FloatingCartPill, TierPill } from '../../../shared/components'
import { useAppStore } from '../../../stores/app.store'
import { useCustomerPwa } from '../../../services/pwa/useCustomerPwa'
import { DemoToolbar } from '../components/DemoToolbar'
import { useDemo } from '../../../app/providers/DemoProvider'
import { usePizzaWaveTools } from '../../../services/webmcp/usePizzaWaveTools'

const nav = [
  { to: '/app/', label: 'Home', icon: Home, end: true }, { to: '/app/menu', label: 'Menu', icon: MenuIcon },
  { to: '/app/rewards', label: 'Rewards', icon: Gift }, { to: '/app/orders', label: 'Orders', icon: ReceiptText },
  { to: '/app/profile', label: 'You', icon: UserRound },
]

export function CustomerLayout() {
  useCustomerPwa()
  usePizzaWaveTools()
  const navigate = useNavigate(); const mode = useAppStore((state) => state.fulfillmentMode); const { data: cart } = useCart(); const { data: quote } = useCartQuote(); const { data: loyalty } = useLoyalty(); const { customerLoggedIn } = useDemo()
  return <div className="customer-shell">
    <header className="customer-topbar">
      <div className="location-block"><span>{mode === 'DELIVERY' ? 'DELIVERY TO' : 'PICKUP FROM'}</span><strong><MapPin size={15} />{mode === 'DELIVERY' ? 'Grand Road' : 'Pizza Wave · Grand Road'}</strong></div>
      {customerLoggedIn && loyalty?.customer ? <TierPill>GOLD · {loyalty.customer.pointsAvailable}</TierPill> : <NavLink className="join-link" to="/app/auth">JOIN WAVE</NavLink>}
    </header>
    <main className="customer-main"><Outlet /></main>
    {quote && quote.itemCount > 0 && <FloatingCartPill count={quote.itemCount} total={quote.total} onClick={() => navigate('/app/cart')} />}
    <nav className="bottom-nav" aria-label="Customer navigation">{nav.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => isActive ? 'active' : ''}><Icon /><span>{label}</span></NavLink>)}</nav>
    <DemoToolbar cart={cart} />
  </div>
}

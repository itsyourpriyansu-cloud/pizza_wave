import { ArrowRight, Bike, Gift, Pizza, Search, Sparkles, Store, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCapabilities } from '../../../features/availability/hooks/useCapabilities'
import { useMenu, useRecommendations } from '../../../features/catalog/hooks/useCatalog'
import { useCart, useCartActions } from '../../../features/cart/hooks/useCart'
import { useLoyalty } from '../../../features/loyalty/hooks/useLoyalty'
import { ProductCard } from '../../../features/product/components/ProductCard'
import { EmptyState, ErrorState, PointsBadge, SegmentedControl, Skeleton } from '../../../shared/components'
import { useAppStore } from '../../../stores/app.store'

export default function HomePage() {
  const mode = useAppStore((state) => state.fulfillmentMode); const setMode = useAppStore((state) => state.setFulfillmentMode)
  const capabilities = useCapabilities(); const menu = useMenu(); const recommendations = useRecommendations(); const cart = useCart(); const loyalty = useLoyalty(); const { add, update } = useCartActions()
  if (menu.isError || capabilities.isError) return <ErrorState retry={() => { void menu.refetch(); void capabilities.refetch() }} />
  const productAction = (productId: string) => ({ cartItem: cart.data?.items.find((item) => item.productId === productId), onAdd: () => add.mutate(productId), onQuantity: (quantity: number) => { const item = cart.data?.items.find((row) => row.productId === productId); if (item) update.mutate({ id: item.id, quantity }) } })
  return <div className="home-page">
    <section className="fulfillment-bar"><SegmentedControl label="Choose fulfillment" value={mode === 'STORE' ? 'DELIVERY' : mode} onChange={setMode} options={[{ value: 'DELIVERY', label: 'Delivery', disabled: !capabilities.data?.delivery.enabled }, { value: 'PICKUP', label: 'Pickup', disabled: !capabilities.data?.pickup.enabled }]} /></section>
    <Link className="search-entry" to="/app/search"><Search /><span>Search pizza, paneer, shake…</span><kbd>⌘ K</kbd></Link>
    <section className="hero-card">
      <div className="hero-copy"><span className="eyebrow">PURI’S OWN PIZZA WAVE</span><h1>Big cheese.<br />Easy choice.</h1><p>Fresh favourites, ready for delivery or pickup from Grand Road.</p><Link className="button button-primary" to="/app/menu">ORDER NOW <ArrowRight size={18} /></Link></div>
      <div className="hero-art" aria-label="Pizza imagery coming soon"><span>HOT</span><div className="hero-disc"><Pizza /></div><i className="hero-wave" /></div>
    </section>
    <section><div className="section-heading"><div><span>EXPLORE</span><h2>What are you craving?</h2></div><Link to="/app/menu">Full menu <ArrowRight /></Link></div>
      <div className="category-row">{menu.isPending ? Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="category-skeleton" />) : menu.data?.categories.length ? menu.data.categories.map((category) => <Link className={`category-tile color-${category.color}`} to={`/app/menu?category=${category.id}`} key={category.id}><span>{category.name.slice(0, 2).toUpperCase()}</span><strong>{category.name}</strong></Link>) : <EmptyState title="Menu is warming up" message="Fresh picks will appear here shortly." />}</div>
    </section>
    <section className="order-again-card"><div className="usual-mark"><Sparkles /></div><div><span>YOUR USUAL</span><h2>Saturday Night</h2><p>Classic Veg Pizza · Cold Coffee</p></div><Link to="/app/saved-orders" aria-label="Open saved order"><ArrowRight /></Link></section>
    {loyalty.data && <section className="points-card"><div><span className="eyebrow">GOLD WAVE</span><h2>{loyalty.data.customer.pointsAvailable} Wave Points</h2><p>{loyalty.data.ordersNeeded} orders + ₹{loyalty.data.spendNeeded} to Platinum</p></div><div className="points-orbit"><Gift /><PointsBadge points={loyalty.data.customer.pointsPending} /></div><div className="progress-pair"><span style={{ width: '80%' }} /><i style={{ width: '80%' }} /></div></section>}
    <section><div className="section-heading"><div><span>POPULAR IN PURI</span><h2>Best sellers</h2></div><Link to="/app/menu?collection=best-sellers">See all <ArrowRight /></Link></div><div className="product-scroll">{recommendations.isPending ? Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="product-skeleton" />) : recommendations.data?.length ? recommendations.data.map((product) => <ProductCard key={product.id} product={product} {...productAction(product.id)} />) : <EmptyState title="Fresh batch incoming" message="Best sellers will be back in a moment." />}</div></section>
    <section className="builder-card"><div><span className="eyebrow">MAKE IT YOURS</span><h2>Build your pizza,<br />your way.</h2><p>Pick the base, cheese, toppings and spice. We’ll keep the price live.</p><Link className="button button-secondary" to="/app/build/PIZZA-VEG-001">START BUILDING <ArrowRight size={18} /></Link></div><div className="builder-rings"><Pizza /></div></section>
    <section className="campaign-grid"><article className="campaign family"><UsersRound /><span>FEED THE CREW</span><h2>Good food,<br />better together.</h2><Link to="/app/menu?collection=family">Find family picks →</Link></article><article className="campaign refer"><Gift /><span>SHARE THE WAVE</span><h2>Give ₹50.<br />Get 60 points.</h2><Link to="/app/refer">Invite a friend →</Link></article></section>
    <section className="service-note"><div><Bike /><span><strong>Delivery</strong> around Puri</span></div><div><Store /><span><strong>Pickup</strong> at Grand Road</span></div></section>
  </div>
}

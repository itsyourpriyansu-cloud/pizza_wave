import { ArrowRight, Bike, Gift, MapPin, Pizza, Store } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CustomerAsset } from '../../customer/components/CustomerAsset'

export default function LandingPage() {
  return <main className="landing-page">
    <nav className="landing-nav"><div className="brand-lockup"><span className="logo-wave">W</span><strong>THE PIZZA WAVE</strong></div><a href="#visit">Grand Road, Puri</a><Link className="button button-primary" to="/app/">ORDER NOW</Link></nav>
    <section className="landing-hero"><div className="landing-copy"><span className="eyebrow">PURI, THIS ONE’S FOR YOU</span><h1>Ride the<br /><em>cheese wave.</em></h1><p>Fresh pizzas, quick bites, creamy shakes and rewards that follow every order.</p><div className="landing-actions"><Link className="button button-primary" to="/app/">START AN ORDER <ArrowRight /></Link><Link className="text-link" to="/app/menu">See the menu</Link></div></div><div className="landing-art"><span className="art-stamp">HOT<br />NOW</span><div className="pizza-orbit"><CustomerAsset src="/assets/hero/hero-main-pizza.png" alt="Fresh Pizza Wave pizza with a cheese pull" eager fallbackLabel="The Pizza Wave" /></div><div className="art-label">BAKED IN PURI<br />SERVED WITH A WAVE</div></div></section>
    <section className="landing-strip"><span>PIZZA</span><i /> <span>KULHAD</span><i /> <span>SHAKES</span><i /> <span>QUICK BITES</span></section>
    <section className="landing-features"><article><Pizza /><span>BUILD YOUR PIZZA</span><h2>Your base.<br />Your toppings.<br />Your wave.</h2><Link to="/app/build/PIZZA-VEG-001">Start building →</Link></article><article><Gift /><span>WAVE REWARDS</span><h2>Every order<br />moves you<br />forward.</h2><Link to="/app/rewards">Meet Wave Rewards →</Link></article></section>
    <section className="visit-section" id="visit"><div><span className="eyebrow">COME FIND US</span><h2>Grand Road,<br />Puri.</h2><p><MapPin /> The Pizza Wave · Grand Road</p></div><div className="service-options"><div><Bike /><strong>Delivery</strong><span>Choose your address in the app</span></div><div><Store /><strong>Pickup</strong><span>Grab a system-generated slot</span></div></div><Link className="button button-primary" to="/app/">ORDER FROM GRAND ROAD <ArrowRight /></Link></section>
    <footer><div className="brand-lockup"><span className="logo-wave">W</span><strong>THE PIZZA WAVE</strong></div><p>Brand loud. Commerce quiet.</p></footer>
  </main>
}

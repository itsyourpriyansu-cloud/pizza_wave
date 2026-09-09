import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { CustomerDataBoundary } from '../../surfaces/customer/layout/CustomerDataBoundary'
import { CustomerLayout } from '../../surfaces/customer/layout/CustomerLayout'
import { Skeleton } from '../../shared/components'

const LandingPage = lazy(() => import('../../surfaces/landing/pages/LandingPage'))
const HomePage = lazy(() => import('../../surfaces/customer/pages/HomePage'))
const MenuPage = lazy(() => import('../../surfaces/customer/pages/MenuPage'))
const SearchPage = lazy(() => import('../../surfaces/customer/pages/SearchPage'))
const ProductDetailPage = lazy(() => import('../../surfaces/customer/pages/ProductDetailPage'))
const BuildPizzaPage = lazy(() => import('../../surfaces/customer/pages/BuildPizzaPage'))
const CartPage = lazy(() => import('../../surfaces/customer/pages/CartPage'))
const AuthPage = lazy(() => import('../../surfaces/customer/pages/AuthPage'))
const CheckoutPage = lazy(() => import('../../surfaces/customer/pages/CheckoutPage'))
const PaymentPage = lazy(() => import('../../surfaces/customer/pages/PaymentPage'))
const StagePlaceholderPage = lazy(() => import('../../surfaces/customer/pages/StagePlaceholderPage'))
const OwnerPage = lazy(() => import('../../surfaces/owner/pages/OwnerPage'))
const KdsPage = lazy(() => import('../../surfaces/kds/pages/KdsPage'))
const TeamPage = lazy(() => import('../../surfaces/landing/pages/TeamPage'))

const loading = <main className="boot-state"><Skeleton className="boot-skeleton" /></main>
const customerChildren = [
  'orders', 'orders/:orderId',
  'rewards', 'rewards/history', 'offers', 'refer', 'celebrations', 'family', 'favourites', 'saved-orders', 'wave-id',
  'profile', 'profile/preferences', 'profile/addresses', 'profile/notifications', 'support',
].map((path) => ({ path, element: <StagePlaceholderPage /> }))

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/app', element: <CustomerDataBoundary><CustomerLayout /></CustomerDataBoundary>, children: [
    { index: true, element: <HomePage /> }, { path: 'menu', element: <MenuPage /> }, { path: 'search', element: <SearchPage /> },
    { path: 'product/:productId', element: <ProductDetailPage /> }, { path: 'build/:productId', element: <BuildPizzaPage /> }, { path: 'cart', element: <CartPage /> },
    { path: 'auth', element: <AuthPage /> }, { path: 'checkout', element: <CheckoutPage /> }, { path: 'payment/:paymentId', element: <PaymentPage /> }, { path: 'payment', element: <PaymentPage /> },
    ...customerChildren,
  ] },
  { path: '/owner', element: <OwnerPage /> }, { path: '/kds', element: <KdsPage /> }, { path: '/team', element: <TeamPage /> },
  { path: '*', element: <TeamPage /> },
])

export function AppRouter() { return <Suspense fallback={loading}><RouterProvider router={router} /></Suspense> }

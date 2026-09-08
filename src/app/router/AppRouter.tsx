import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { CustomerDataBoundary } from '../../surfaces/customer/layout/CustomerDataBoundary'
import { CustomerLayout } from '../../surfaces/customer/layout/CustomerLayout'
import { Skeleton } from '../../shared/components'

const LandingPage = lazy(() => import('../../surfaces/landing/pages/LandingPage'))
const HomePage = lazy(() => import('../../surfaces/customer/pages/HomePage'))
const MenuPage = lazy(() => import('../../surfaces/customer/pages/MenuPage'))
const StagePlaceholderPage = lazy(() => import('../../surfaces/customer/pages/StagePlaceholderPage'))
const OwnerPage = lazy(() => import('../../surfaces/owner/pages/OwnerPage'))
const KdsPage = lazy(() => import('../../surfaces/kds/pages/KdsPage'))
const TeamPage = lazy(() => import('../../surfaces/landing/pages/TeamPage'))

const loading = <main className="boot-state"><Skeleton className="boot-skeleton" /></main>
const customerChildren = [
  'search', 'product/:productId', 'build/:productId', 'cart', 'auth', 'checkout', 'payment', 'orders', 'orders/:orderId',
  'rewards', 'rewards/history', 'offers', 'refer', 'celebrations', 'family', 'favourites', 'saved-orders', 'wave-id',
  'profile', 'profile/preferences', 'profile/addresses', 'profile/notifications', 'support',
].map((path) => ({ path, element: <StagePlaceholderPage /> }))

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/app', element: <CustomerDataBoundary><CustomerLayout /></CustomerDataBoundary>, children: [{ index: true, element: <HomePage /> }, { path: 'menu', element: <MenuPage /> }, ...customerChildren] },
  { path: '/owner', element: <OwnerPage /> }, { path: '/kds', element: <KdsPage /> }, { path: '/team', element: <TeamPage /> },
  { path: '*', element: <TeamPage /> },
])

export function AppRouter() { return <Suspense fallback={loading}><RouterProvider router={router} /></Suspense> }

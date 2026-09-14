import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { CustomerDataBoundary } from '../../surfaces/customer/layout/CustomerDataBoundary'
import { CustomerLayout } from '../../surfaces/customer/layout/CustomerLayout'
import { OwnerDataBoundary } from '../../surfaces/owner/layout/OwnerDataBoundary'
import { KdsDataBoundary } from '../../surfaces/kds/layout/KdsDataBoundary'
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
const OrdersPage = lazy(() => import('../../surfaces/customer/pages/OrdersPage'))
const OrderTrackingPage = lazy(() => import('../../surfaces/customer/pages/OrderTrackingPage'))
const RewardsPage = lazy(() => import('../../surfaces/customer/pages/RewardsPage'))
const RewardsHistoryPage = lazy(() => import('../../surfaces/customer/pages/RewardsHistoryPage'))
const WaveIdPage = lazy(() => import('../../surfaces/customer/pages/WaveIdPage'))
const SavedOrdersPage = lazy(() => import('../../surfaces/customer/pages/SavedOrdersPage'))
const FavouritesPage = lazy(() => import('../../surfaces/customer/pages/FavouritesPage'))
const ProfilePage = lazy(() => import('../../surfaces/customer/pages/ProfilePage'))
const PreferencesPage = lazy(() => import('../../surfaces/customer/pages/PreferencesPage'))
const FamilyPage = lazy(() => import('../../surfaces/customer/pages/FamilyPage'))
const CelebrationsPage = lazy(() => import('../../surfaces/customer/pages/CelebrationsPage'))
const NotificationsPage = lazy(() => import('../../surfaces/customer/pages/NotificationsPage'))
const SupportPage = lazy(() => import('../../surfaces/customer/pages/SupportPage'))
const ReferralPage = lazy(() => import('../../surfaces/customer/pages/ReferralPage'))
const StagePlaceholderPage = lazy(() => import('../../surfaces/customer/pages/StagePlaceholderPage'))
const OwnerPage = lazy(() => import('../../surfaces/owner/pages/OwnerPage'))
const KdsPage = lazy(() => import('../../surfaces/kds/pages/KdsPage'))
const KdsQueuePage = lazy(() => import('../../surfaces/kds/pages/KdsQueuePage'))
const KdsOrderPage = lazy(() => import('../../surfaces/kds/pages/KdsOrderPage'))
const KdsAvailabilityPage = lazy(() => import('../../surfaces/kds/pages/KdsAvailabilityPage'))
const TeamPage = lazy(() => import('../../surfaces/landing/pages/TeamPage'))

const loading = <main className="boot-state"><Skeleton className="boot-skeleton" /></main>
const customerChildren = [
  'offers', 'profile/addresses',
].map((path) => ({ path, element: <StagePlaceholderPage /> }))

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/app', element: <CustomerDataBoundary><CustomerLayout /></CustomerDataBoundary>, children: [
    { index: true, element: <HomePage /> }, { path: 'menu', element: <MenuPage /> }, { path: 'search', element: <SearchPage /> },
    { path: 'product/:productId', element: <ProductDetailPage /> }, { path: 'build/:productId', element: <BuildPizzaPage /> }, { path: 'cart', element: <CartPage /> },
    { path: 'auth', element: <AuthPage /> }, { path: 'checkout', element: <CheckoutPage /> }, { path: 'payment/:paymentId', element: <PaymentPage /> }, { path: 'payment', element: <PaymentPage /> },
    { path: 'orders', element: <OrdersPage /> }, { path: 'orders/:orderId', element: <OrderTrackingPage /> },
    { path: 'rewards', element: <RewardsPage /> }, { path: 'rewards/history', element: <RewardsHistoryPage /> }, { path: 'wave-id', element: <WaveIdPage /> },
    { path: 'saved-orders', element: <SavedOrdersPage /> }, { path: 'favourites', element: <FavouritesPage /> },
    { path: 'profile', element: <ProfilePage /> }, { path: 'profile/preferences', element: <PreferencesPage /> },
    { path: 'family', element: <FamilyPage /> }, { path: 'celebrations', element: <CelebrationsPage /> },
    { path: 'profile/notifications', element: <NotificationsPage /> }, { path: 'notifications', element: <NotificationsPage /> }, { path: 'support', element: <SupportPage /> },
    { path: 'refer', element: <ReferralPage /> },
    ...customerChildren,
  ] },
  { path: '/owner', element: <OwnerDataBoundary><OwnerPage /></OwnerDataBoundary> },
  { path: '/kds', element: <KdsDataBoundary><KdsPage /></KdsDataBoundary>, children: [
    { index: true, element: <KdsQueuePage /> },
    { path: 'order/:orderId', element: <KdsOrderPage /> },
    { path: 'availability', element: <KdsAvailabilityPage /> },
  ] },
  { path: '/team', element: <TeamPage /> },
  { path: '*', element: <TeamPage /> },
])

export function AppRouter() { return <Suspense fallback={loading}><RouterProvider router={router} /></Suspense> }

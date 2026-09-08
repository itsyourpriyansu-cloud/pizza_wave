import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { categorySeed as categories, productSeed, smartCollectionSeed as smartCollections } from '../../../prototype/seed/catalog.seed'
import { primaryCustomerSeed as demoCustomer } from '../../../prototype/seed/customers.seed'
import { storeConfigSeed } from '../../../prototype/seed/store.seed'
import { deriveCapabilities } from '../../../domain/store/capability.engine'
import type { LegacyProductView } from '../../../domain/catalog/catalog.types'

const demoCapabilities = deriveCapabilities(storeConfigSeed)
const products: LegacyProductView[] = productSeed.map((p) => ({
  id: p.id, name: p.name, description: p.shortDescription, category: p.categoryId,
  price: p.basePrice, veg: p.veg, available: p.available, prepMinutes: p.prepMinutes,
  complexity: p.complexity, station: p.station, image: `/assets/products/${p.imageKey}`,
  badges: p.badges, modifierGroups: p.modifierGroups,
}))
import HomePage from './HomePage'
import MenuPage from './MenuPage'

const mocks = vi.hoisted(() => ({
  menu: {} as Record<string, unknown>,
  recommendations: {} as Record<string, unknown>,
  capabilities: {} as Record<string, unknown>,
  cart: {} as Record<string, unknown>,
  loyalty: {} as Record<string, unknown>,
}))

vi.mock('../../../features/catalog/hooks/useCatalog', () => ({ useMenu: () => mocks.menu, useRecommendations: () => mocks.recommendations }))
vi.mock('../../../features/availability/hooks/useCapabilities', () => ({ useCapabilities: () => mocks.capabilities }))
vi.mock('../../../features/cart/hooks/useCart', () => ({
  useCart: () => mocks.cart,
  useCartActions: () => ({ add: { mutate: vi.fn() }, update: { mutate: vi.fn() } }),
}))
vi.mock('../../../features/loyalty/hooks/useLoyalty', () => ({ useLoyalty: () => mocks.loyalty }))

const query = <T,>(data: T, overrides: Record<string, unknown> = {}) => ({ data, isPending: false, isError: false, refetch: vi.fn(), ...overrides })
const renderPage = (page: ReactNode, route = '/app/') => render(<MemoryRouter initialEntries={[route]}>{page}</MemoryRouter>)

beforeEach(() => {
  mocks.menu = query({ categories, products, collections: smartCollections })
  mocks.recommendations = query(products.slice(0, 2))
  mocks.capabilities = query(demoCapabilities)
  mocks.cart = query({ items: [] })
  mocks.loyalty = query({ customer: demoCustomer, nextTier: 'PLATINUM', ordersNeeded: 2, spendNeeded: 880 })
})
afterEach(cleanup)

describe('Home page query states', () => {
  it('shows loading skeletons while customer data starts', () => {
    mocks.menu = query(undefined, { isPending: true })
    const { container } = renderPage(<HomePage />)
    expect(container.querySelectorAll('.category-skeleton')).toHaveLength(5)
  })

  it('shows a recoverable error state', () => {
    mocks.menu = query(undefined, { isError: true })
    renderPage(<HomePage />)
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('shows intentional empty feedback', () => {
    mocks.menu = query({ categories: [], products: [], collections: [] })
    mocks.recommendations = query([])
    renderPage(<HomePage />)
    expect(screen.getByText('Menu is warming up')).toBeInTheDocument()
    expect(screen.getByText('Fresh batch incoming')).toBeInTheDocument()
  })
})

describe('Menu page query states', () => {
  it('shows product skeletons while loading', () => {
    mocks.menu = query(undefined, { isPending: true })
    const { container } = renderPage(<MenuPage />, '/app/menu')
    expect(container.querySelectorAll('.product-skeleton')).toHaveLength(6)
  })

  it('shows a recoverable error state', () => {
    mocks.menu = query(undefined, { isError: true })
    renderPage(<MenuPage />, '/app/menu')
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('shows an empty state for an unmatched search', () => {
    mocks.menu = query({ categories, products: [], collections: smartCollections })
    renderPage(<MenuPage />, '/app/menu')
    expect(screen.getByText('No matches yet')).toBeInTheDocument()
  })
})

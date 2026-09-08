import { describe, expect, expectTypeOf, it } from 'vitest'
import { categories, demoCapabilities, demoCustomer, products, smartCollections } from '../../mocks/fixtures/seed'
import type { MenuResponse } from '../../features/catalog/api/catalog.api'
import { capabilitiesSchema, loyaltySchema, menuResponseSchema } from './contracts'

describe('API response contracts', () => {
  it('accepts the frozen mock payloads and preserves inferred types', () => {
    const menu = menuResponseSchema.parse({ categories, products, collections: smartCollections })
    expect(menu.products).toHaveLength(12)
    expect(capabilitiesSchema.parse(demoCapabilities).store.id).toBe('STORE-PURI-GRAND-ROAD')
    expect(loyaltySchema.parse({ customer: demoCustomer, nextTier: 'PLATINUM', ordersNeeded: 2, spendNeeded: 880 }).customer.firstName).toBe('Priyanshu')
    expectTypeOf(menu).toMatchTypeOf<MenuResponse>()
  })

  it('rejects malformed product prices at the API boundary', () => {
    const malformed = { categories, collections: smartCollections, products: [{ ...products[0], price: -1 }] }
    expect(menuResponseSchema.safeParse(malformed).success).toBe(false)
  })
})

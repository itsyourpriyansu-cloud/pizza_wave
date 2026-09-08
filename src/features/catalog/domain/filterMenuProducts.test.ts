import { describe, expect, it } from 'vitest'
import { products, smartCollections } from '../../../mocks/fixtures/seed'
import { filterMenuProducts } from './filterMenuProducts'

describe('product search and smart collections', () => {
  it('searches name and description without case sensitivity', () => {
    expect(filterMenuProducts(products, { category: 'all', collection: '', query: 'PANEER' }).map((item) => item.id)).toEqual(['PIZZA-PANEER-001', 'BURGER-001'])
  })

  it('implements every seeded collection deterministically', () => {
    for (const collection of smartCollections) {
      expect(filterMenuProducts(products, { category: 'all', collection: collection.id, query: '' }).length).toBeGreaterThan(0)
    }
    expect(filterMenuProducts(products, { category: 'all', collection: 'best-sellers', query: '' }).map((item) => item.id)).toEqual(['PIZZA-VEG-001', 'SHAKE-001'])
  })
})

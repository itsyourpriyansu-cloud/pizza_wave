import type { LegacyProductView } from './catalog.types'

export interface MenuFilters { category: string; collection: string; query: string }

export function filterMenuProducts(products: LegacyProductView[], { category, collection, query }: MenuFilters) {
  const normalizedQuery = query.trim().toLowerCase()
  return products.filter((product) => {
    if (category !== 'all' && product.category !== category) return false
    const text = `${product.name} ${product.description}`.toLowerCase()
    if (normalizedQuery && !text.includes(normalizedQuery)) return false
    if (collection === 'under-199') return product.price < 199
    if (collection === 'best-sellers') return product.badges.includes('Bestseller')
    if (collection === 'veg-favourites') return product.veg
    if (collection === 'cheese-lovers') return text.includes('cheese') || text.includes('mozzarella')
    if (collection === 'quick-bites') return product.category === 'quick-bites'
    if (collection === 'something-sweet') return product.category === 'desserts'
    return true
  })
}

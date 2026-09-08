import { http } from 'msw'
import { db } from '../../database/db'
import { API, boot, json } from './_shared'
import { toLegacyProductView } from '../../../domain/catalog/catalog.view'

export const catalogHandlers = [
  http.get(`${API}/categories`, async () => { await boot(); return json(await db.categories.orderBy('sortOrder').toArray()) }),

  http.get(`${API}/products`, async ({ request }) => {
    await boot()
    const url = new URL(request.url)
    let rows = await db.products.toArray()
    const category = url.searchParams.get('category')
    if (category) rows = rows.filter((item) => item.categoryId === category)
    return json(rows.map(toLegacyProductView))
  }),

  http.get(`${API}/products/:id`, async ({ params }) => {
    await boot()
    const item = await db.products.get(String(params.id))
    return item ? json(toLegacyProductView(item)) : json({ message: 'Product not found' }, 404)
  }),

  http.get(`${API}/menu`, async () => {
    await boot()
    const collectionsRecord = await db.config.get('smartCollections')
    return json({
      categories: await db.categories.orderBy('sortOrder').toArray(),
      products: (await db.products.toArray()).map(toLegacyProductView),
      collections: collectionsRecord?.value ?? [],
    })
  }),

  http.get(`${API}/recommendations`, async () => {
    await boot()
    const rows = await db.products.toArray()
    return json(rows.filter((item) => item.badges.includes('Bestseller') || item.id === 'PIZZA-VEG-001').slice(0, 4).map(toLegacyProductView))
  }),

  http.get(`${API}/search`, async ({ request }) => {
    await boot()
    const q = new URL(request.url).searchParams.get('q')?.toLowerCase().trim() ?? ''
    const rows = await db.products.toArray()
    return json(rows.filter((item) => `${item.name} ${item.shortDescription} ${item.badges.join(' ')}`.toLowerCase().includes(q)).map(toLegacyProductView))
  }),
]

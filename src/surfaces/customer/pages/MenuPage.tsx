import { Search, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMenu } from '../../../features/catalog/hooks/useCatalog'
import { filterMenuProducts } from '../../../features/catalog/domain/filterMenuProducts'
import { useCart, useCartActions } from '../../../features/cart/hooks/useCart'
import { ProductCard } from '../../../features/product/components/ProductCard'
import { Chip, EmptyState, ErrorState, PageHeader, Skeleton } from '../../../shared/components'

export default function MenuPage() {
  const [params] = useSearchParams(); const menu = useMenu(); const cart = useCart(); const { add, update } = useCartActions()
  const [query, setQuery] = useState(''); const [category, setCategory] = useState(params.get('category') ?? 'all'); const [collection, setCollection] = useState(params.get('collection') ?? '')
  const products = useMemo(() => filterMenuProducts(menu.data?.products ?? [], { category, collection, query }), [menu.data, category, collection, query])
  if (menu.isError) return <ErrorState retry={() => void menu.refetch()} />
  const action = (productId: string) => { const item = cart.data?.items.find((row) => row.productId === productId); return { cartItem: item, onAdd: () => add.mutate(productId), onQuantity: (quantity: number) => item && update.mutate({ id: item.id, quantity }) } }
  return <div className="menu-page">
    <PageHeader eyebrow="FRESH FROM GRAND ROAD" title="Pick your favourites" action={<button className="round-filter" aria-label="Open filters"><SlidersHorizontal /></button>} />
    <label className="menu-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search paneer, cheese, shake…" aria-label="Search menu" /></label>
    <div className="sticky-categories"><Chip active={category === 'all'} onClick={() => setCategory('all')}>All</Chip>{menu.data?.categories.map((item) => <Chip key={item.id} active={category === item.id} onClick={() => setCategory(item.id)}>{item.name}</Chip>)}</div>
    <div className="smart-collections">{menu.data?.collections.map((item) => <Chip key={item.id} active={collection === item.id} onClick={() => setCollection(collection === item.id ? '' : item.id)}>{item.name}</Chip>)}</div>
    <div className="menu-count"><span>{products.length} picks</span><i /></div>
    {menu.isPending ? <div className="product-grid">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="product-skeleton" />)}</div> : products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} {...action(product.id)} />)}</div> : <EmptyState title="No matches yet" message="Try a different search or collection." />}
  </div>
}

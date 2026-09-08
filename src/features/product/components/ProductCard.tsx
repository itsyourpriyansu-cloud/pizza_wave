import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import type { CartItem, Product } from '../../../shared/types/domain'
import { IconButton, QuantityStepper } from '../../../shared/components'
import { getProductAsset } from '../../../shared/utils/assets'
import { useState } from 'react'

export function ProductCard({ product, cartItem, onAdd, onQuantity }: { product: Product; cartItem?: CartItem; onAdd: () => void; onQuantity: (value: number) => void }) {
  const [failed, setFailed] = useState(false)
  const asset = getProductAsset(product.id, product.image)
  return <motion.article className="product-card" layout whileTap={{ scale: 0.99 }}>
    <div className={`product-art art-${product.category}`}>
      {!failed ? <img src={asset.src} alt="" loading="lazy" onError={() => setFailed(true)} /> : <div className="food-fallback" aria-label={`${product.name} image coming soon`}><span>{asset.fallbackLabel}</span><i /></div>}
      {product.badges[0] && <span className="product-badge">{product.badges[0]}</span>}
    </div>
    <div className="product-copy">
      <div className={`veg-marker ${product.veg ? 'veg' : 'non-veg'}`} aria-label={product.veg ? 'Vegetarian' : 'Non-vegetarian'}><span /></div>
      <h3>{product.name}</h3><p>{product.description}</p>
      <div className="product-foot"><strong>₹{product.price}</strong>{!product.available ? <span className="unavailable">Unavailable</span> : cartItem ? <QuantityStepper value={cartItem.quantity} onChange={onQuantity} /> : <IconButton aria-label={`Add ${product.name}`} onClick={onAdd}><Plus /></IconButton>}</div>
    </div>
  </motion.article>
}

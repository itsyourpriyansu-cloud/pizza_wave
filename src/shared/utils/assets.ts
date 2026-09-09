export function getProductAsset(productId: string, requestedPath: string) {
  const stem = requestedPath.replace(/\.(avif|webp|png|jpe?g)$/i, '')
  return { src: `${stem}.png`, fallbackLabel: productId.split('-')[0] }
}

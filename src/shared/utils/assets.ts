export function getProductAsset(productId: string, requestedPath: string) {
  return { src: requestedPath, fallbackLabel: productId.split('-')[0] }
}

// Returns the correct public path for assets depending on environment
export function getPublicAssetPath(assetPath: string): string {
  // Vite injects import.meta.env.BASE_URL at build time
  // In dev, it's usually '/'; in prod, it's your base config (e.g. '/lightning-generator/')
  return `${import.meta.env.BASE_URL}${assetPath.replace(/^\//, '')}`;
}

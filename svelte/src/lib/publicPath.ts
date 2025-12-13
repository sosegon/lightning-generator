/**
 * Returns the correct public path for assets depending on environment.
 *
 * @param {string} assetPath - The relative path to the asset (e.g., 'sound/file.mp3' or '/sound/file.mp3').
 * @returns {string} The full public path to the asset, including the base URL.
 *
 * @example
 * // In development, returns '/sound/file.mp3'
 * // In production with base '/my-app/', returns '/my-app/sound/file.mp3'
 * getPublicAssetPath('sound/file.mp3');
 * getPublicAssetPath('/sound/file.mp3');
 */
export function getPublicAssetPath(assetPath: string): string {
	// Vite injects import.meta.env.BASE_URL at build time
	// In dev, it's usually '/'; in prod, it's your base config (e.g. '/lightning-generator/')
	return `${import.meta.env.BASE_URL}${assetPath.replace(/^\//, '')}`;
}

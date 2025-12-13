import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
	plugins: [svelte()],
	base: '/lightning-generator/',
	resolve: {
		alias: {
			'@root': path.resolve(__dirname, 'src'),
			'@lib': path.resolve(__dirname, 'src/lib'),
			'@types': path.resolve(__dirname, 'src/types')
		}
	}
});

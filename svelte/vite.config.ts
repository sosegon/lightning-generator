import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
	plugins: [svelte()],
	resolve: {
		alias: {
			'@root': path.resolve(__dirname, 'src'),
			Lib: path.resolve(__dirname, 'src/lib'),
			Types: path.resolve(__dirname, 'src/types')
		}
	}
});

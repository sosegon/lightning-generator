<script lang="ts">
	import { getContext } from 'svelte';
	import { VolumeX, Volume2 } from '@lucide/svelte';
	import '@root/app.css';
	import Button from './Button.svelte';
	import type { AppStateType } from './AppState.svelte';
	
	let appState: AppStateType = getContext('canvas');
</script>

<div class="control-panel">
	<Button
		onclick={() => appState.setIsMuted(!appState.isMuted)}
		class_="bg-slate-900/90 border-slate-700 hover:bg-slate-800 text-white backdrop-blur-sm"
	>
		{#if appState.isMuted}
			<VolumeX class="size-4" />
		{:else}
			<Volume2 class="size-4" />
		{/if}
	</Button>
</div>

<style>
	.control-panel {
		position: fixed;
		top: 8px;
		right: 8px;
		z-index: 1000;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.5rem;
	}
</style>

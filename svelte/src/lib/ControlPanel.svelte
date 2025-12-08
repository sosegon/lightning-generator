<script lang="ts">
	import { getContext } from 'svelte';
	import { VolumeX, Volume2, Info } from '@lucide/svelte';
	import '@root/app.css';
	import Button from './Button.svelte';
	import type { AppStateType } from './AppState.svelte';
	
	let appState: AppStateType = getContext('canvas');
</script>

<div class="fixed top-2 right-2 z-[1000] flex flex-row items-end gap-2">
	<Button
		onClick={() => appState.setIsMuted(!appState.isMuted)}
		class_="bg-slate-900/90 border-slate-700 hover:bg-slate-800 text-white backdrop-blur-sm border-1 border-solid"
	>
		{#if appState.isMuted}
			<VolumeX class="size-4" />
		{:else}
			<Volume2 class="size-4" />
		{/if}
	</Button>
	<Button
		onClick={() => appState.setShowInfo(true)}
		class_="bg-slate-900/90 border-slate-700 hover:bg-slate-800 text-white backdrop-blur-sm border-1 border-solid"
	>
		<Info class="size-4" />
	</Button>
</div>


<script lang="ts">
	import { setContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import LightningGenerator from './LightningGenerator.svelte';
	import BackgroundInstructions from './BackgroundInstructions.svelte';
	import { AppState } from './AppState.svelte';

	const appState = new AppState();

	setContext('canvas', appState);
</script>

<LightningGenerator />
{#if appState.showInstructions}
	<div transition:fade>
		<BackgroundInstructions />
	</div>
{/if}

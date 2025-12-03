<script lang="ts">
	import { setContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import LightningGenerator from './LightningGenerator.svelte';
	import BackgroundInstructions from './BackgroundInstructions.svelte';
	import ControlPanel from './ControlPanel.svelte';
	import { AppState } from './AppState.svelte';

	const appState = new AppState();

	setContext('canvas', appState);
</script>

<LightningGenerator />
<ControlPanel />
{#if appState.showInstructions}
	<div transition:fade>
		<BackgroundInstructions />
	</div>
{/if}

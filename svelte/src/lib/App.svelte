<script lang="ts">
	import { setContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import LightningGenerator from './LightningGenerator.svelte';
	import BackgroundInstructions from './BackgroundInstructions.svelte';
	import ControlPanel from './ControlPanel.svelte';
	import { AppState } from './AppState.svelte';
	import { LightningState } from './LightningState.svelte';
	import InfoDialog from './InfoDialog.svelte';

	const appState = new AppState();
	setContext('canvas', appState);

	const lightningState = new LightningState();
	setContext('lightning', lightningState);
</script>

<LightningGenerator />
<ControlPanel />
{#if appState.showInstructions}
	<div transition:fade>
		<BackgroundInstructions />
	</div>
{/if}
{#if appState.showInfo}
	<InfoDialog />
{/if}

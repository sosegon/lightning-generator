<script lang="ts">
	import { setContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import LightningGenerator from 'Lib/LightningGenerator.svelte';
	import BackgroundInstructions from 'Lib/BackgroundInstructions.svelte';
	import ControlPanel from 'Lib/ControlPanel.svelte';
	import { AppState } from 'Lib/AppState.svelte';
	import { LightningState } from 'Lib/LightningState.svelte';
	import InfoDialog from 'Lib/InfoDialog.svelte';

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

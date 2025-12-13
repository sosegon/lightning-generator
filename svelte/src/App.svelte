<script lang="ts">
	import { setContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import LightningGenerator from '@lib/LightningGenerator.svelte';
	import BackgroundInstructions from '@lib/BackgroundInstructions.svelte';
	import ControlPanel from '@lib/ControlPanel.svelte';
	import { AppState } from '@lib/AppState.svelte';
	import { LightningState } from '@lib/LightningState.svelte';
	import InfoDialog from '@lib/InfoDialog.svelte';

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

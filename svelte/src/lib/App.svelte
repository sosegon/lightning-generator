<script lang="ts">
	import { setContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import LightningGenerator from './LightningGenerator.svelte';
	import BackgroundInstructions from './BackgroundInstructions.svelte';

	// Hide BackgroundInstructions after click
	let renderInstructions = true;
	function showInstructions() {
		renderInstructions = true;
	}
	function hideInstructions() {
		renderInstructions = false;
	}

	setContext('canvas', {
		showInstructions,
		hideInstructions
	});
</script>

<LightningGenerator />
{#if renderInstructions}
	<div transition:fade>
		<BackgroundInstructions />
	</div>
{/if}

<script lang="ts">
	import { fade } from 'svelte/transition';
	import LightningGenerator from '$lib/LightningGenerator.svelte';
	import BackgroundInstructions from '$lib/BackgroundInstructions.svelte';

	// Hide BackgroundInstructions after click
	let showInstructions = true;
	function onClickCallback() {
		showInstructions = false;
	}
	function onMouseLeaveCallback() {
		showInstructions = true;
	}
</script>

<LightningGenerator {onClickCallback} {onMouseLeaveCallback} />
{#if showInstructions}
	<div transition:fade>
		<BackgroundInstructions />
	</div>
{/if}

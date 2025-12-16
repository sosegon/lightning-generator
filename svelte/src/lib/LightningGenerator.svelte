<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import { getPublicAssetPath } from './publicPath';
	import { Landscape } from '@composition';
	import type { AppStateType } from './AppState.svelte';
	import type { LightningStateType } from './LightningState.svelte';
	let container: HTMLDivElement;

	let appState: AppStateType = getContext('canvas');
	let lightningState: LightningStateType = getContext('lightning');

	onMount(() => {
		paintLandscape();
		const handleResize = () => {
			if (container) {
				container.innerHTML = '';
				paintLandscape();
			}
		};
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	function paintLandscape() {
		const showInstructions = () => {
			appState.setShowInstructions(true);
		};

		const playThunderSound = () => {
			if (!appState.isMuted) {
				// Play thunder sound
				const audio = new Audio(getPublicAssetPath('sound/lightning-strike.mp3'));
				audio.volume = 0.1;
				audio.currentTime = 0;
				audio.play();
			}
		};

		new Landscape(
			container,
			{
				skyGradientStart: '#000000',
				skyGradientEnd: '#222244',
				boltInner: '#ffffff',
				boltGlow: lightningState.color
			},
			{ sky: true, stars: true, mountains: true },
			showInstructions,
			() => {
				playThunderSound();
				return lightningState.color;
			}
		);
	}
</script>

<div id="container" bind:this={container}></div>

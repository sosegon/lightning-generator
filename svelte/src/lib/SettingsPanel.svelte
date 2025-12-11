<script lang="ts">
	import '@root/app.css';
	import { getContext } from 'svelte';
	import { Zap, XIcon } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import type { AppStateType } from './AppState.svelte';
	import type { LightningStateType } from './LightningState.svelte';

	export let class_: string;

	let appState: AppStateType = getContext('canvas');
	let lightningState: LightningStateType = getContext('lightning');

	let dialog: HTMLDialogElement; // Reference to the dialog tag
	onMount(() => {
		dialog = document.getElementById('settings-dialog') as HTMLDialogElement;
		dialog?.show();

		const handleBackdropClick = (event: MouseEvent) => {
			if (event.target === dialog) {
				closeClick();
			}
		};
		dialog?.addEventListener('click', handleBackdropClick);

		return () => {
			dialog?.removeEventListener('click', handleBackdropClick);
		};
	});

	const closeClick = () => {
		appState.setShowSettings(false);
	};
</script>

<div
	class={'p-6 bg-slate-900/95 border border-slate-700 text-white \
  backdrop-blur-sm rounded-lg w-80 '.concat(class_)}
>
	<div class="absolute top-3 right-3">
		<button on:click={closeClick} class="cursor-pointer">
			<XIcon class="size-4 text-slate-400 hover:text-white" />
		</button>
	</div>
	<!-- header -->
	<div class="flex flex-col gap-2 text-center sm:text-left">
		<div
			class="text-lg leading-none font-semibold flex items-center \
		gap-2"
		>
			<Zap class="size-5 text-blue-400" />
			<h2>Lightning Settings</h2>
		</div>
	</div>
	<!-- body -->
	<div class="space-y-4 pt-4">
		<div class="flex gap-3">
			<div class="w-full border-t border-slate-700 pt-3">
				<div class="flex gap-2 w-full justify-between">
					{#each lightningState.availableColors as colorOption (colorOption)}
						<button
							class="w-8 h-8 rounded-full border-2 focus:outline-none \
							cursor-pointer transition-opacity duration-200"
							class:opacity-100={lightningState.color === colorOption}
							class:opacity-50={lightningState.color !== colorOption}
							style="background-color: {colorOption}"
							on:click={() => lightningState.setColor(colorOption)}
							aria-label={colorOption}
						></button>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

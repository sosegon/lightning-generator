<script lang="ts">
	import '@root/app.css';
	import { getContext } from 'svelte';
	import { Zap, Mouse, XIcon, SlidersVertical } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import Button from './Button.svelte';
	import type { AppStateType } from './AppState.svelte';

	let appState: AppStateType = getContext('canvas');

	let dialog: HTMLDialogElement; // Reference to the dialog tag
	onMount(() => {
		dialog = document.getElementById('info-dialog') as HTMLDialogElement;
		dialog?.showModal();

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
		appState.setShowInfo(false);
	};
</script>

<dialog
	id="info-dialog"
	class="relative bg-slate-900/95 border border-slate-700 text-white \
	backdrop-blur-sm rounded-lg"
>
	<div class="absolute top-3 right-3">
		<button on:click={closeClick} class="cursor-pointer">
			<XIcon class="size-4 text-slate-400 hover:text-white" />
		</button>
	</div>
	<!-- header -->
	<div class="flex flex-col gap-2 text-center sm:text-left">
		<div class="text-lg leading-none font-semibold flex items-center gap-2">
			<Zap class="size-5 text-blue-400" />
			<h2>Lightning Generator</h2>
		</div>
		<p class="text-sm text-slate-300 text-left">
			Create stunning lightning effects with a single click
		</p>
	</div>
	<!-- body -->
	<div class="space-y-4 py-4">
		<div class="flex gap-3">
			<Mouse class="size-5 text-blue-400 flex-shrink-0 mt-1" />
			<div>
				<h4 class="font-medium mb-1">Generate Lightning</h4>
				<p class="text-sm text-slate-400">
					Click anywhere on the screen to create a lightning bolt that strikes at that location.
				</p>
			</div>
		</div>
		<div class="flex gap-3">
			<SlidersVertical class="size-5 text-blue-400 flex-shrink-0 mt-1" />
			<div>
				<h4 class="font-medium mb-1">Customize parameters</h4>
				<p class="text-sm text-slate-400">Use the settings panel (top-right) to adjust:</p>
				<ul class="text-sm text-slate-400 mt-2 space-y-1 list-disc list-inside ml-2">
					<li><span class="font-medium text-white">Color:</span> Choose from presets</li>
				</ul>
			</div>
		</div>
		<div class="pt-3 border-t border-slate-700">
			<p class="text-sm text-slate-400">
				Toggle sound effects on/off using the volume button in the top-right corner.
			</p>
		</div>
	</div>
	<!-- footer -->
	<Button class_="bg-blue-600 hover:bg-blue-700 text-white w-full" onClick={closeClick}
		>Got it!</Button
	>
</dialog>

<style>
	dialog {
		padding: 24px;
		position: absolute;
		width: 90%;
		max-width: 400px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.4);
	}
</style>

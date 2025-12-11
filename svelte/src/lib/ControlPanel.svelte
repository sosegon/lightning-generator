<script lang="ts">
	import { getContext } from 'svelte';
	import { VolumeX, Volume2, Info, Settings } from '@lucide/svelte';
	import '@root/app.css';
	import Button from './Button.svelte';
	import type { AppStateType } from './AppState.svelte';
	import SettingsPanel from './SettingsPanel.svelte';

	let appState: AppStateType = getContext('canvas');
	const buttonClassCommon = 'border-slate-700 border-2 border-solid p-3';
	const buttonClassActive = 'bg-orange-500/90 hover:bg-orange-400 text-black';
	const buttonClassInactive = 'bg-slate-900/90 hover:bg-slate-600 text-white';
</script>

<div class="fixed top-2 right-2 z-[1000] flex flex-col gap-2 items-end">
	<div class="flex flex-row items-end gap-2">
		<Button
			onClick={() => appState.setIsMuted(!appState.isMuted)}
			class_={`${buttonClassCommon} ${appState.isMuted ? buttonClassActive : buttonClassInactive}`}
		>
			{#if appState.isMuted}
				<VolumeX class="size-4" />
			{:else}
				<Volume2 class="size-4" />
			{/if}
		</Button>
		<Button
			onClick={() => appState.setShowInfo(true)}
			class_={`${buttonClassCommon} ${appState.showInfo ? buttonClassActive : buttonClassInactive}`}
		>
			<Info class="size-4" />
		</Button>
		<Button
			onClick={() => {
				appState.setShowSettings(!appState.showSettings);
			}}
			class_={`${buttonClassCommon} ${appState.showSettings ? buttonClassActive : buttonClassInactive}`}
		>
			<Settings class="size-4" />
		</Button>
	</div>
	{#if appState.showSettings}
		<SettingsPanel class_="top-10 right-2 z-[1000]" />
	{/if}
</div>

<script lang="ts">
	import '@root/app.css';
	import { Zap } from '@lucide/svelte';
</script>

<div class="text-center space-y-3 animate-pulse">
	<Zap class="size-16 text-blue-400/30 mx-auto" />
	<p class="text-slate-400/50 text-xl">Click anywhere to generate lightning</p>
</div>

<style>
	div {
		/* center vertically and horizontally */
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		position: absolute;
		pointer-events: none;
		p {
			user-select: none;
		}
	}
</style>

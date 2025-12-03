<script lang="ts">
	import '@root/app.css';
	export let onclick: () => void;
	export let class_: string;
</script>

<button on:click={onclick} class={class_}>
	<slot />
</button>

<style>
	button {
		cursor: pointer;
		padding: 8px;
		border-radius: 4px;
		border: 1px solid var(--primary-foreground);
	}
</style>

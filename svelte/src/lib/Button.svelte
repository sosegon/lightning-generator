<script lang="ts">
	import '@root/app.css';
	export let onClick: () => void;
	export let class_: string;
</script>

<button on:click={onClick} class={'cursor-pointer p-2 rounded-sm '.concat(class_)}>
	<slot />
</button>

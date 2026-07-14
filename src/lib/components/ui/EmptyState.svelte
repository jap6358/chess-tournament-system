<script lang="ts">
	export let title = 'Nothing here yet';
	export let message = '';
	export let icon = '♟';
</script>

<div class="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-ebony-200 py-14 text-center dark:border-ebony-600">
	<span class="text-3xl text-ebony-200 dark:text-ivory-500" aria-hidden="true">{icon}</span>
	<h3 class="font-display text-base font-semibold text-ebony-700 dark:text-ivory-100">{title}</h3>
	{#if message}
		<p class="max-w-xs text-sm text-ebony-400 dark:text-ivory-400">{message}</p>
	{/if}
	<slot />
</div>

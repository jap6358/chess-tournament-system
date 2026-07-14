<script lang="ts">
	export let rows = 5;
	export let cols = 4;
</script>

<div class="w-full animate-pulse space-y-3 p-4" role="status" aria-label="Loading content">
	{#each Array(rows) as _, r (r)}
		<div class="grid gap-3" style="grid-template-columns: repeat({cols}, minmax(0, 1fr));">
			{#each Array(cols) as _, c (c)}
				<div class="h-4 rounded bg-ebony-100 dark:bg-ebony-700" />
			{/each}
		</div>
	{/each}
</div>

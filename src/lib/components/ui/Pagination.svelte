<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let page = 1;
	export let totalPages = 1;
	export let total = 0;
	export let pageSize = 10;

	const dispatch = createEventDispatcher<{ change: { page: number } }>();

	function go(p: number) {
		if (p < 1 || p > totalPages || p === page) return;
		dispatch('change', { page: p });
	}

	$: startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
	$: endItem = Math.min(page * pageSize, total);
</script>

<div class="flex flex-col items-center justify-between gap-3 px-1 py-3 sm:flex-row">
	<p class="text-xs text-ebony-400 dark:text-ivory-400">
		Showing <span class="font-medium text-ebony-700 dark:text-ivory-100">{startItem}–{endItem}</span> of
		<span class="font-medium text-ebony-700 dark:text-ivory-100">{total}</span>
	</p>
	<div class="flex items-center gap-1">
		<button
			class="rounded-lg px-2.5 py-1.5 text-sm text-ebony-500 hover:bg-ebony-900/5 disabled:opacity-30 dark:text-ivory-300 dark:hover:bg-ivory-100/10"
			disabled={page <= 1}
			on:click={() => go(page - 1)}
			aria-label="Previous page"
		>
			‹ Prev
		</button>
		<span class="px-2 text-sm text-ebony-600 dark:text-ivory-200">
			Page {page} of {Math.max(totalPages, 1)}
		</span>
		<button
			class="rounded-lg px-2.5 py-1.5 text-sm text-ebony-500 hover:bg-ebony-900/5 disabled:opacity-30 dark:text-ivory-300 dark:hover:bg-ivory-100/10"
			disabled={page >= totalPages}
			on:click={() => go(page + 1)}
			aria-label="Next page"
		>
			Next ›
		</button>
	</div>
</div>

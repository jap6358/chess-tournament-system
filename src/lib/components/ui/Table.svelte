<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	interface Column {
		key: string;
		label: string;
		sortable?: boolean;
		align?: 'left' | 'right' | 'center';
		class?: string;
	}

	export let columns: Column[] = [];
	export let sortKey = '';
	export let sortDir: 'asc' | 'desc' = 'asc';

	const dispatch = createEventDispatcher<{
		sort: { key: string };
	}>();

	function toggleSort(col: Column) {
		if (!col.sortable) return;
		dispatch('sort', { key: col.key });
	}
</script>

<div class="overflow-x-auto">
	<table class="min-w-full divide-y divide-ebony-200 dark:divide-ebony-700">
		<thead class="bg-ebony-50 dark:bg-ebony-800">
			<tr>
				{#each columns as col}
					<th
						class={`px-4 py-3 text-sm font-semibold ${
							col.align === 'right'
								? 'text-right'
								: col.align === 'center'
								? 'text-center'
								: 'text-left'
						} ${col.class ?? ''}`}
					>
						{#if col.sortable}
							<button
								type="button"
								class="inline-flex items-center gap-1 hover:text-gold-600"
								on:click={() => toggleSort(col)}
							>
								{col.label}

								{#if sortKey === col.key}
									<span>{sortDir === 'asc' ? '▲' : '▼'}</span>
								{/if}
							</button>
						{:else}
							{col.label}
						{/if}
					</th>
				{/each}
			</tr>
		</thead>

		<tbody class="divide-y divide-ebony-100 dark:divide-ebony-700">
			<slot />
		</tbody>
	</table>
</div>
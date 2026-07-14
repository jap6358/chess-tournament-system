<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Card from '$lib/components/ui/Card.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import { formatDateTime } from '$lib/utils/format';
	import type { PageData } from './$types';

	export let data: PageData;

	$: matches = data.matches;
	$: meta = data.meta;
	$: filters = data.filters;

	const columns = [
		{ key: 'round', label: 'Round' },
		{ key: 'players', label: 'Players' },
		{ key: 'winner', label: 'Winner' },
		{ key: 'date', label: 'Date' },
		{ key: 'status', label: 'Status' }
	];

	function updateQuery(params: Record<string, string | number>) {
		const url = new URL($page.url);
		for (const [key, value] of Object.entries(params)) {
			if (value === '' || value === undefined || value === null) url.searchParams.delete(key);
			else url.searchParams.set(key, String(value));
		}
		goto(url.toString(), { keepFocus: true, noScroll: true });
	}

	function handleStatusChange(event: Event) {
	const target = event.currentTarget as HTMLSelectElement;

	updateQuery({
		status: target.value,
		page: 1
	});
}

function handleTournamentChange(event: Event) {
	const target = event.currentTarget as HTMLSelectElement;

	updateQuery({
		tournamentId: target.value,
		page: 1
	});
}
</script>

<svelte:head>
	<title>Match History — Chessmaster</title>
</svelte:head>

<div class="space-y-5">
	<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
		<SearchBar value={filters.search} placeholder="Search by player name…" on:search={(e) => updateQuery({ search: e.detail.value, page: 1 })} />
		<div class="w-full sm:w-48">
			<Select
				name="status"
				value={filters.status}
				placeholder="All statuses"
				options={[
					{ value: 'SCHEDULED', label: 'Scheduled' },
					{ value: 'COMPLETED', label: 'Completed' },
					{ value: 'BYE', label: 'Bye' }
				]}
				on:change={handleStatusChange}
			/>
		</div>
		<div class="w-full sm:w-56">
			<Select
	name="tournamentId"
	value={filters.tournamentId}
	placeholder="All tournaments"
	options={data.tournaments.map((t) => ({
		value: t.id,
		label: t.name
	}))}
	on:change={handleTournamentChange}
/>
		</div>
	</div>

	<Card padded={false}>
		{#if matches.length === 0}
			<div class="p-6"><EmptyState title="No matches found" message="Generate matches from a tournament page." icon="♗" /></div>
		{:else}
			<Table {columns}>
				{#each matches as m (m.id)}
					<tr class="hover:bg-ivory-50 dark:hover:bg-ebony-700/40">
						<td class="stat-figure px-4 py-3 text-ebony-600 dark:text-ivory-300">R{m.round}</td>
						<td class="px-4 py-3">
							<p class="text-sm font-medium text-ebony-800 dark:text-ivory-100">{m.playerOne.fullName} vs {m.playerTwo?.fullName ?? 'Bye'}</p>
							<p class="text-xs text-ebony-400 dark:text-ivory-400">{m.tournament.name}</p>
						</td>
						<td class="px-4 py-3 text-sm text-ebony-700 dark:text-ivory-200">{m.winner?.fullName ?? '—'}</td>
						<td class="px-4 py-3 text-sm text-ebony-500 dark:text-ivory-400">{formatDateTime(m.matchTime)}</td>
						<td class="px-4 py-3">
							<Badge tone={m.status === 'COMPLETED' ? 'emerald' : m.status === 'BYE' ? 'gold' : 'neutral'}>{m.status}</Badge>
						</td>
					</tr>
				{/each}
			</Table>
			<div class="px-2">
				<Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} pageSize={meta.pageSize} on:change={(e) => updateQuery({ page: e.detail.page })} />
			</div>
		{/if}
	</Card>
</div>

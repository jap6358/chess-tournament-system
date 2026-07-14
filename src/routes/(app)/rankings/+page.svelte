<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let search = '';
	$: filtered = data.rankings.filter((r) => r.player.fullName.toLowerCase().includes(search.toLowerCase()));

	const columns = [
		{ key: 'rank', label: 'Rank' },
		{ key: 'player', label: 'Player' },
		{ key: 'wins', label: 'Wins', align: 'right' as const },
		{ key: 'losses', label: 'Losses', align: 'right' as const },
		{ key: 'matches', label: 'Matches', align: 'right' as const },
		{ key: 'winPct', label: 'Win %', align: 'right' as const },
		{ key: 'rating', label: 'Rating', align: 'right' as const }
	];
</script>

<svelte:head>
	<title>Rankings — Chessmaster</title>
</svelte:head>

<div class="space-y-5">
	<SearchBar bind:value={search} placeholder="Search player…" on:search={(e) => (search = e.detail.value)} />

	<Card padded={false}>
		{#if filtered.length === 0}
			<div class="p-6"><EmptyState title="No players found" icon="♛" /></div>
		{:else}
			<Table {columns}>
				{#each filtered as row (row.player.id)}
					<tr class="hover:bg-ivory-50 dark:hover:bg-ebony-700/40 {row.rank <= 3 ? 'bg-gold-50/40 dark:bg-gold-500/5' : ''}">
						<td class="px-4 py-3 text-center text-lg">
							{#if row.medal === 'gold'}🥇{:else if row.medal === 'silver'}🥈{:else if row.medal === 'bronze'}🥉{:else}<span class="text-sm text-ebony-400 dark:text-ivory-400">{row.rank}</span>{/if}
						</td>
						<td class="px-4 py-3">
							<a href="/players/{row.player.id}" class="text-sm font-medium text-ebony-800 hover:text-gold-600 dark:text-ivory-100 dark:hover:text-gold-400">
								{row.player.fullName}
							</a>
						</td>
						<td class="stat-figure px-4 py-3 text-right text-emerald-600 dark:text-emerald-300">{row.wins}</td>
						<td class="stat-figure px-4 py-3 text-right text-garnet-600 dark:text-garnet-300">{row.losses}</td>
						<td class="stat-figure px-4 py-3 text-right text-ebony-600 dark:text-ivory-300">{row.matchesPlayed}</td>
						<td class="stat-figure px-4 py-3 text-right text-ebony-600 dark:text-ivory-300">{row.winPercentage}%</td>
						<td class="stat-figure px-4 py-3 text-right font-semibold text-ebony-900 dark:text-ivory-50">{row.player.chessRating}</td>
					</tr>
				{/each}
			</Table>
		{/if}
	</Card>
</div>

<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import { formatDateTime, formatDate, statusColor } from '$lib/utils/format';
	import type { PageData } from './$types';

	export let data: PageData;
	$: stats = data.stats;

	$: statCards = [
		{ label: 'Total Players', value: stats.totalPlayers, icon: '♟', tone: 'ebony' as const },
		{ label: 'Total Tournaments', value: stats.totalTournaments, icon: '♜', tone: 'gold' as const },
		{ label: 'Total Matches', value: stats.totalMatches, icon: '♗', tone: 'emerald' as const },
		{
			label: 'Active Tournament',
			value: stats.activeTournament ? stats.activeTournament.name : '—',
			icon: '♛',
			tone: 'garnet' as const,
			small: true
		}
	];
</script>

<svelte:head>
	<title>Dashboard — Chessmaster</title>
</svelte:head>

<div class="space-y-6">
	<!-- Stat cards -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
		{#each statCards as card (card.label)}
			<Card>
				<div class="flex items-start justify-between">
					<div class="min-w-0">
						<p class="text-xs font-medium uppercase tracking-wide text-ebony-400 dark:text-ivory-400">
							{card.label}
						</p>
						<p
							class="stat-figure mt-1.5 font-display font-semibold text-ebony-900 dark:text-ivory-50 {card.small
								? 'truncate text-base'
								: 'text-3xl'}"
							title={String(card.value)}
						>
							{card.value}
						</p>
					</div>
					<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ivory-100 text-lg dark:bg-ebony-700">
						{card.icon}
					</span>
				</div>
			</Card>
		{/each}
	</div>

	<!-- Champion + Upcoming -->
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
		<Card>
			<p class="text-xs font-medium uppercase tracking-wide text-ebony-400 dark:text-ivory-400">Reigning Champion</p>
			{#if stats.champion}
				<div class="mt-3 flex items-center gap-3">
					<span class="flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 text-2xl dark:bg-gold-500/15">
						♔
					</span>
					<div>
						<p class="font-display text-lg font-semibold text-ebony-900 dark:text-ivory-50">
							{stats.champion.fullName}
						</p>
						<p class="text-sm text-ebony-400 dark:text-ivory-400">
							{stats.champion.country} · Rating {stats.champion.chessRating} · {stats.champion.wins} wins
						</p>
					</div>
				</div>
			{:else}
				<EmptyState title="No champion yet" message="Play matches to crown a champion." icon="♔" />
			{/if}
		</Card>

		<Card>
			<p class="text-xs font-medium uppercase tracking-wide text-ebony-400 dark:text-ivory-400">Upcoming Tournament</p>
			{#if stats.upcomingTournament}
				<div class="mt-3">
					<p class="font-display text-lg font-semibold text-ebony-900 dark:text-ivory-50">
						{stats.upcomingTournament.name}
					</p>
					<p class="mt-1 text-sm text-ebony-400 dark:text-ivory-400">
						{stats.upcomingTournament.location} · {formatDate(stats.upcomingTournament.date)}
					</p>
					<a href="/tournaments/{stats.upcomingTournament.id}" class="mt-3 inline-block text-sm font-medium text-gold-600 hover:underline dark:text-gold-400">
						View tournament →
					</a>
				</div>
			{:else}
				<EmptyState title="Nothing scheduled" message="Create a tournament to see it here." icon="♜" />
			{/if}
		</Card>
	</div>

	<!-- Charts -->
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
		<Card>
			<p class="mb-2 text-xs font-medium uppercase tracking-wide text-ebony-400 dark:text-ivory-400">
				Matches Played per Tournament
			</p>
			{#if stats.matchesPerTournament.length > 0}
				<BarChart data={stats.matchesPerTournament.map((m) => ({ name: m.name, value: m.matches }))} barColor="#2E6F5E" />
			{:else}
				<EmptyState title="No matches yet" icon="♗" />
			{/if}
		</Card>
		<Card>
			<p class="mb-2 text-xs font-medium uppercase tracking-wide text-ebony-400 dark:text-ivory-400">
				Wins per Player (Top 6)
			</p>
			{#if stats.winsPerPlayer.length > 0}
				<BarChart
	data={stats.winsPerPlayer.map((p) => ({
		name: p.name,
		value: p.wins
	}))}
	barColor="#C9A227"
/>
			{:else}
				<EmptyState title="No wins recorded" icon="♛" />
			{/if}
		</Card>
	</div>

	<!-- Recent activity + top players -->
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
		<Card padded={false} class="lg:col-span-2">
			<div class="border-b border-ebony-100 p-5 pb-4 dark:border-ebony-700">
				<h2 class="font-display text-base font-semibold text-ebony-900 dark:text-ivory-50">Recent Matches</h2>
			</div>
			<div class="divide-y divide-ebony-100 dark:divide-ebony-700">
				{#if stats.recentMatches.length === 0}
					<div class="p-5"><EmptyState title="No matches yet" icon="♗" /></div>
				{/if}
				{#each stats.recentMatches as match (match.id)}
					<div class="flex items-center justify-between gap-3 p-4 sm:px-5">
						<div class="min-w-0">
							<p class="truncate text-sm font-medium text-ebony-800 dark:text-ivory-100">
								{match.playerOne.fullName} vs {match.playerTwo?.fullName ?? 'Bye'}
							</p>
							<p class="text-xs text-ebony-400 dark:text-ivory-400">
								Round {match.round} · {formatDateTime(match.matchTime)}
							</p>
						</div>
						{#if match.winner}
							<Badge tone="gold">Winner: {match.winner.fullName}</Badge>
						{:else}
							<Badge tone="neutral">Pending</Badge>
						{/if}
					</div>
				{/each}
			</div>
		</Card>

		<Card padded={false}>
			<div class="border-b border-ebony-100 p-5 pb-4 dark:border-ebony-700">
				<h2 class="font-display text-base font-semibold text-ebony-900 dark:text-ivory-50">Top Ranked Players</h2>
			</div>
			<div class="divide-y divide-ebony-100 dark:divide-ebony-700">
				{#if stats.topPlayers.length === 0}
					<div class="p-5"><EmptyState title="No players yet" icon="♟" /></div>
				{/if}
				{#each stats.topPlayers as row (row.player.id)}
					<div class="flex items-center gap-3 p-4 sm:px-5">
						<span class="w-6 text-center text-sm font-semibold text-ebony-400 dark:text-ivory-400">
							{#if row.medal === 'gold'}🥇{:else if row.medal === 'silver'}🥈{:else if row.medal === 'bronze'}🥉{:else}{row.rank}{/if}
						</span>
						<div class="min-w-0 flex-1">
							<p class="truncate text-sm font-medium text-ebony-800 dark:text-ivory-100">{row.player.fullName}</p>
							<p class="text-xs text-ebony-400 dark:text-ivory-400">{row.wins}W · {row.losses}L · Rating {row.player.chessRating}</p>
						</div>
					</div>
				{/each}
			</div>
		</Card>
	</div>
</div>

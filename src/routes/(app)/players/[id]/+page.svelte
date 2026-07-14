<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import { initials, formatDateTime, statusColor } from '$lib/utils/format';
	import type { PageData } from './$types';

	export let data: PageData;
	$: player = data.player;
	$: matches = data.matches;
</script>

<svelte:head>
	<title>{player.fullName} — Chessmaster</title>
</svelte:head>

<div class="space-y-5">
	<a href="/players" class="inline-flex items-center gap-1 text-sm text-ebony-400 hover:text-ebony-700 dark:text-ivory-400 dark:hover:text-ivory-100">
		← Back to players
	</a>

	<Card>
		<div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div class="flex items-center gap-4">
				<span class="flex h-16 w-16 items-center justify-center rounded-full bg-ebony-900 text-xl font-semibold text-ivory-50 dark:bg-gold-500 dark:text-ebony-950">
					{initials(player.fullName)}
				</span>
				<div>
					<h1 class="font-display text-xl font-semibold text-ebony-900 dark:text-ivory-50">{player.fullName}</h1>
					<p class="text-sm text-ebony-400 dark:text-ivory-400">{player.email} · {player.country}</p>
				</div>
			</div>
			<div class="grid grid-cols-3 gap-4 text-center sm:gap-6">
				<div>
					<p class="stat-figure text-xl font-semibold text-ebony-900 dark:text-ivory-50">{player.chessRating}</p>
					<p class="text-xs text-ebony-400 dark:text-ivory-400">Rating</p>
				</div>
				<div>
					<p class="stat-figure text-xl font-semibold text-emerald-600 dark:text-emerald-300">{player.wins}</p>
					<p class="text-xs text-ebony-400 dark:text-ivory-400">Wins</p>
				</div>
				<div>
					<p class="stat-figure text-xl font-semibold text-garnet-600 dark:text-garnet-300">{player.losses}</p>
					<p class="text-xs text-ebony-400 dark:text-ivory-400">Losses</p>
				</div>
			</div>
		</div>
	</Card>

	<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
		<Card>
			<p class="text-xs font-medium uppercase tracking-wide text-ebony-400 dark:text-ivory-400">Profile</p>
			<dl class="mt-3 space-y-2 text-sm">
				<div class="flex justify-between"><dt class="text-ebony-400 dark:text-ivory-400">Age</dt><dd class="text-ebony-800 dark:text-ivory-100">{player.age}</dd></div>
				<div class="flex justify-between"><dt class="text-ebony-400 dark:text-ivory-400">Gender</dt><dd class="text-ebony-800 dark:text-ivory-100">{player.gender}</dd></div>
				<div class="flex justify-between"><dt class="text-ebony-400 dark:text-ivory-400">Phone</dt><dd class="text-ebony-800 dark:text-ivory-100">{player.phone ?? '—'}</dd></div>
				<div class="flex justify-between"><dt class="text-ebony-400 dark:text-ivory-400">Win %</dt><dd class="text-ebony-800 dark:text-ivory-100">{data.winPercentage}%</dd></div>
			</dl>
		</Card>

		<Card class="lg:col-span-2">
			<p class="text-xs font-medium uppercase tracking-wide text-ebony-400 dark:text-ivory-400">Tournament Registrations</p>
			{#if player.tournaments.length === 0}
				<EmptyState title="Not registered yet" icon="♜" />
			{:else}
				<ul class="mt-3 space-y-2">
					{#each player.tournaments as reg (reg.id)}
						<li class="flex items-center justify-between rounded-xl border border-ebony-100 px-3 py-2 dark:border-ebony-700">
							<a href="/tournaments/{reg.tournament.id}" class="text-sm font-medium text-ebony-800 hover:text-gold-600 dark:text-ivory-100 dark:hover:text-gold-400">
								{reg.tournament.name}
							</a>
							<Badge tone={statusColor(reg.tournament.status)}>{reg.tournament.status}</Badge>
						</li>
					{/each}
				</ul>
			{/if}
		</Card>
	</div>

	<Card padded={false}>
		<div class="border-b border-ebony-100 p-5 pb-4 dark:border-ebony-700">
			<h2 class="font-display text-base font-semibold text-ebony-900 dark:text-ivory-50">Match History</h2>
		</div>
		{#if matches.length === 0}
			<div class="p-6"><EmptyState title="No matches played yet" icon="♗" /></div>
		{:else}
			<div class="divide-y divide-ebony-100 dark:divide-ebony-700">
				{#each matches as m (m.id)}
					<div class="flex items-center justify-between gap-3 p-4 sm:px-5">
						<div class="min-w-0">
							<p class="truncate text-sm font-medium text-ebony-800 dark:text-ivory-100">
								{m.playerOne.fullName} vs {m.playerTwo?.fullName ?? 'Bye'}
							</p>
							<p class="text-xs text-ebony-400 dark:text-ivory-400">
								{m.tournament.name} · Round {m.round} · {formatDateTime(m.matchTime)}
							</p>
						</div>
						{#if m.winner}
							<Badge tone={m.winner.id === player.id ? 'emerald' : 'garnet'}>
								{m.winner.id === player.id ? 'Won' : `Lost to ${m.winner.fullName}`}
							</Badge>
						{:else}
							<Badge tone="neutral">Pending</Badge>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</Card>
</div>

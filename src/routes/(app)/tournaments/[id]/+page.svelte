<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import { toast } from '$lib/stores/toast';
	import { formatDate, formatDateTime, statusColor } from '$lib/utils/format';
	import type { PageData } from './$types';

	export let data: PageData;

	$: tournament = data.tournament;
	$: availablePlayers = data.availablePlayers;
	$: stats = data.stats;
	$: rounds = data.rounds;
	$: rankings = data.rankings;

	// --- Registration -------------------------------------------------------
	let playerSearch = '';
	let selectedToAdd = new Set<string>();
	let registering = false;
	let removingId: string | null = null;

	$: filteredAvailable = availablePlayers.filter(
		(p) =>
			p.fullName.toLowerCase().includes(playerSearch.toLowerCase()) ||
			p.email.toLowerCase().includes(playerSearch.toLowerCase())
	);

	$: remainingSlots = tournament.maximumPlayers - tournament.players.length;

	function toggleSelect(id: string) {
		if (selectedToAdd.has(id)) {
			selectedToAdd.delete(id);
		} else {
			if (selectedToAdd.size >= remainingSlots) {
				toast.warning(`Only ${remainingSlots} slot(s) remaining in this tournament.`);
				return;
			}
			selectedToAdd.add(id);
		}
		selectedToAdd = new Set(selectedToAdd);
	}

	async function registerSelected() {
		if (selectedToAdd.size === 0) return;
		registering = true;
		const res = await fetch(`/api/tournaments/${tournament.id}/register`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ playerIds: [...selectedToAdd] })
		});
		const body = await res.json();
		registering = false;
		if (!res.ok) {
			toast.error(body.message ?? 'Could not register players.');
			return;
		}
		toast.success(`${body.registered} player(s) registered.`);
		selectedToAdd = new Set();
		await invalidateAll();
	}

	async function removePlayer(playerId: string) {
		removingId = playerId;
		const res = await fetch(`/api/tournaments/${tournament.id}/register`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ playerId })
		});
		removingId = null;
		if (!res.ok) {
			const body = await res.json();
			toast.error(body.message ?? 'Could not remove player.');
			return;
		}
		toast.success('Player removed from tournament.');
		await invalidateAll();
	}

	// --- Match generation -----------------------------------------------------
	let generating = false;

	async function generateMatches() {
		generating = true;
		const res = await fetch(`/api/tournaments/${tournament.id}/matches/generate`, { method: 'POST' });
		const body = await res.json();
		generating = false;
		if (!res.ok) {
			toast.error(body.message ?? 'Could not generate matches.');
			return;
		}
		toast.success(`Round ${body.round} generated with ${body.matches.length} match(es).`);
		await invalidateAll();
	}

	// --- Winner selection -------------------------------------------------------
	let decidingMatchId: string | null = null;

	async function decideWinner(matchId: string, winnerId?: string) {
		decidingMatchId = matchId;
		const res = await fetch(`/api/matches/${matchId}/winner`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(winnerId ? { winnerId } : {})
		});
		const body = await res.json();
		decidingMatchId = null;
		if (!res.ok) {
			toast.error(body.message ?? 'Could not record result.');
			return;
		}
		toast.success(`${body.winner.fullName} wins!`);
		await invalidateAll();
	}
</script>

<svelte:head>
	<title>{tournament.name} — Chessmaster</title>
</svelte:head>

<div class="space-y-5">
	<a href="/tournaments" class="inline-flex items-center gap-1 text-sm text-ebony-400 hover:text-ebony-700 dark:text-ivory-400 dark:hover:text-ivory-100">
		← Back to tournaments
	</a>

	<Card>
		<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<div class="flex items-center gap-2">
					<h1 class="font-display text-xl font-semibold text-ebony-900 dark:text-ivory-50">{tournament.name}</h1>
					<Badge tone={statusColor(tournament.status)}>{tournament.status}</Badge>
				</div>
				<p class="mt-1 text-sm text-ebony-400 dark:text-ivory-400">
					{tournament.location} · {formatDate(tournament.date)} · {tournament.players.length}/{tournament.maximumPlayers} players
				</p>
				{#if tournament.description}
					<p class="mt-2 max-w-2xl text-sm text-ebony-500 dark:text-ivory-300">{tournament.description}</p>
				{/if}
			</div>
			<Button on:click={generateMatches} loading={generating} disabled={tournament.players.length < 2}>
				🎲 Generate Random Matches
			</Button>
		</div>
	</Card>

	<!-- Tournament statistics -->
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
		{#each [
			{ label: 'Total Matches', value: stats.totalMatches },
			{ label: 'Completed', value: stats.completedMatches },
			{ label: 'Remaining', value: stats.remainingMatches },
			{ label: 'Avg Rating', value: stats.averageRating },
			{ label: 'Highest Rated', value: stats.highestRatedPlayer?.fullName ?? '—' },
			{ label: 'Champion', value: stats.champion?.fullName ?? '—' }
		] as s (s.label)}
			<Card>
				<p class="text-[11px] font-medium uppercase tracking-wide text-ebony-400 dark:text-ivory-400">{s.label}</p>
				<p class="stat-figure mt-1 truncate text-lg font-semibold text-ebony-900 dark:text-ivory-50" title={String(s.value)}>
					{s.value}
				</p>
			</Card>
		{/each}
	</div>

	<div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
		<!-- Registration -->
		<Card>
			<h2 class="font-display text-base font-semibold text-ebony-900 dark:text-ivory-50">Registered Players</h2>
			<p class="mt-1 text-xs text-ebony-400 dark:text-ivory-400">{remainingSlots} slot(s) remaining</p>
			{#if tournament.players.length === 0}
				<EmptyState title="No players registered" icon="♟" />
			{:else}
				<ul class="mt-3 max-h-64 space-y-1.5 overflow-y-auto pr-1">
					{#each tournament.players as tp (tp.id)}
						<li class="flex items-center justify-between rounded-lg border border-ebony-100 px-3 py-2 text-sm dark:border-ebony-700">
							<span class="text-ebony-800 dark:text-ivory-100">{tp.player.fullName}</span>
							<div class="flex items-center gap-2">
								<span class="stat-figure text-xs text-ebony-400 dark:text-ivory-400">{tp.player.chessRating}</span>
								<button
									class="text-xs font-medium text-garnet-600 hover:underline dark:text-garnet-300"
									disabled={removingId === tp.playerId}
									on:click={() => removePlayer(tp.playerId)}
								>
									Remove
								</button>
							</div>
						</li>
					{/each}
				</ul>
			{/if}

			<div class="mt-4 border-t border-ebony-100 pt-4 dark:border-ebony-700">
				<p class="mb-2 text-xs font-medium uppercase tracking-wide text-ebony-400 dark:text-ivory-400">Add players</p>
				<SearchBar bind:value={playerSearch} placeholder="Search available players…" on:search={(e) => (playerSearch = e.detail.value)} />
				{#if filteredAvailable.length === 0}
					<p class="mt-3 text-sm text-ebony-400 dark:text-ivory-400">No available players match your search.</p>
				{:else}
					<ul class="mt-3 max-h-56 space-y-1 overflow-y-auto pr-1">
						{#each filteredAvailable as p (p.id)}
							<li>
								<label class="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm hover:bg-ivory-100 dark:hover:bg-ebony-700/40">
									<input
										type="checkbox"
										class="h-4 w-4 rounded border-ebony-300 text-gold-600 focus:ring-gold-500"
										checked={selectedToAdd.has(p.id)}
										on:change={() => toggleSelect(p.id)}
									/>
									<span class="flex-1 truncate text-ebony-800 dark:text-ivory-100">{p.fullName}</span>
									<span class="stat-figure text-xs text-ebony-400 dark:text-ivory-400">{p.chessRating}</span>
								</label>
							</li>
						{/each}
					</ul>
				{/if}
				<Button class="mt-3" on:click={registerSelected} loading={registering} disabled={selectedToAdd.size === 0}>
					Register {selectedToAdd.size || ''} player(s)
				</Button>
			</div>
		</Card>

		<!-- Matches -->
		<Card padded={false}>
			<div class="border-b border-ebony-100 p-5 pb-4 dark:border-ebony-700">
				<h2 class="font-display text-base font-semibold text-ebony-900 dark:text-ivory-50">Matches</h2>
			</div>
			{#if rounds.length === 0}
				<div class="p-6"><EmptyState title="No matches yet" message="Generate random matches to begin round 1." icon="♗" /></div>
			{:else}
				<div class="max-h-[36rem] space-y-5 overflow-y-auto p-5">
					{#each rounds as round (round)}
						<div>
							<p class="mb-2 font-mono text-xs font-semibold uppercase tracking-wide text-ebony-400 dark:text-ivory-400">
								Round {round.toString().padStart(2, '0')}
							</p>
							<div class="space-y-2">
								{#each tournament.matches.filter((m) => m.round === round) as m (m.id)}
									<div class="flex items-center justify-between gap-3 rounded-xl border border-ebony-100 px-3.5 py-2.5 dark:border-ebony-700">
										<div class="min-w-0">
											<p class="truncate text-sm font-medium text-ebony-800 dark:text-ivory-100">
												{m.playerOne.fullName} <span class="text-ebony-300 dark:text-ivory-500">vs</span> {m.playerTwo?.fullName ?? 'Bye'}
											</p>
											<p class="text-xs text-ebony-400 dark:text-ivory-400">{formatDateTime(m.matchTime)}</p>
										</div>
										{#if m.winner}
											<Badge tone="gold">🏆 {m.winner.fullName}</Badge>
										{:else if m.playerTwo}
											<Button size="sm" loading={decidingMatchId === m.id} on:click={() => decideWinner(m.id)}>
												Generate Winner
											</Button>
										{:else}
											<Badge tone="neutral">Bye</Badge>
										{/if}
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</Card>
	</div>

	<!-- Tournament standings -->
	<Card padded={false}>
		<div class="border-b border-ebony-100 p-5 pb-4 dark:border-ebony-700">
			<h2 class="font-display text-base font-semibold text-ebony-900 dark:text-ivory-50">Standings</h2>
		</div>
		{#if rankings.length === 0}
			<div class="p-6"><EmptyState title="No standings yet" message="Standings appear once matches are completed." icon="♛" /></div>
		{:else}
			<div class="divide-y divide-ebony-100 dark:divide-ebony-700">
				{#each rankings as row (row.player.id)}
					<div class="flex items-center gap-3 px-5 py-3">
						<span class="w-6 text-center text-sm font-semibold text-ebony-400 dark:text-ivory-400">
							{#if row.medal === 'gold'}🥇{:else if row.medal === 'silver'}🥈{:else if row.medal === 'bronze'}🥉{:else}{row.rank}{/if}
						</span>
						<div class="min-w-0 flex-1">
							<p class="truncate text-sm font-medium text-ebony-800 dark:text-ivory-100">{row.player.fullName}</p>
						</div>
						<span class="stat-figure text-xs text-ebony-500 dark:text-ivory-300">{row.wins}W · {row.losses}L</span>
						<span class="stat-figure w-14 text-right text-xs text-ebony-400 dark:text-ivory-400">{row.winPercentage}%</span>
					</div>
				{/each}
			</div>
		{/if}
	</Card>
</div>

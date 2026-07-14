import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { getTournamentStatistics } from '$lib/server/tournamentStats';
import type { RankingRow } from '$lib/types';

export const load: PageServerLoad = async ({ params }) => {
	const tournament = await prisma.tournament.findUnique({
		where: { id: params.id },
		include: {
			players: { include: { player: true }, orderBy: { registeredAt: 'asc' } },
			matches: {
				include: { playerOne: true, playerTwo: true, winner: true },
				orderBy: [{ round: 'asc' }, { matchTime: 'asc' }]
			}
		}
	});

	if (!tournament) throw error(404, 'Tournament not found.');

	const registeredIds = new Set(tournament.players.map((p) => p.playerId));
	const availablePlayers = await prisma.player.findMany({
		where: { id: { notIn: [...registeredIds] } },
		orderBy: { fullName: 'asc' }
	});

	const stats = await getTournamentStatistics(tournament.id);
	const rounds = [...new Set(tournament.matches.map((m) => m.round))].sort((a, b) => a - b);

	// Tournament-scoped standings, derived from this tournament's matches only.
	const tally = new Map<string, { wins: number; losses: number }>();
	for (const tp of tournament.players) tally.set(tp.playerId, { wins: 0, losses: 0 });
	for (const m of tournament.matches) {
		if (!m.winnerId || !m.playerTwoId) continue;
		const loserId = m.winnerId === m.playerOneId ? m.playerTwoId : m.playerOneId;
		if (tally.has(m.winnerId)) tally.get(m.winnerId)!.wins += 1;
		if (tally.has(loserId)) tally.get(loserId)!.losses += 1;
	}
	const sortedPlayers = [...tournament.players]
		.map((tp) => tp.player)
		.sort((a, b) => {
			const aStats = tally.get(a.id)!;
			const bStats = tally.get(b.id)!;
			if (bStats.wins !== aStats.wins) return bStats.wins - aStats.wins;
			if (b.chessRating !== a.chessRating) return b.chessRating - a.chessRating;
			return a.fullName.localeCompare(b.fullName);
		});
	const rankings: RankingRow[] = sortedPlayers.map((player, index) => {
		const s = tally.get(player.id)!;
		const matchesPlayed = s.wins + s.losses;
		const rank = index + 1;
		return {
			rank,
			player,
			wins: s.wins,
			losses: s.losses,
			matchesPlayed,
			winPercentage: matchesPlayed === 0 ? 0 : Math.round((s.wins / matchesPlayed) * 1000) / 10,
			medal: rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : null
		};
	});

	return { tournament, availablePlayers, stats, rounds, rankings };
};

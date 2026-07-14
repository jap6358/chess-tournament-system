import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import type { RankingRow } from '$lib/types';

/**
 * Tournament-scoped rankings are computed from matches played *within this
 * tournament only* — a player's global win/loss totals (which span every
 * tournament they've entered) would otherwise pollute a single event's board.
 */
export const GET: RequestHandler = async ({ params }) => {
	const [registrations, matches] = await Promise.all([
		prisma.tournamentPlayer.findMany({ where: { tournamentId: params.id }, include: { player: true } }),
		prisma.match.findMany({ where: { tournamentId: params.id } })
	]);

	const players = registrations.map((r) => r.player);
	const tally = new Map<string, { wins: number; losses: number }>();
	for (const p of players) tally.set(p.id, { wins: 0, losses: 0 });

	for (const m of matches) {
		if (!m.winnerId || !m.playerTwoId) continue; // skip byes and undecided matches
		const loserId = m.winnerId === m.playerOneId ? m.playerTwoId : m.playerOneId;
		if (tally.has(m.winnerId)) tally.get(m.winnerId)!.wins += 1;
		if (tally.has(loserId)) tally.get(loserId)!.losses += 1;
	}

	const sorted = [...players].sort((a, b) => {
		const aStats = tally.get(a.id)!;
		const bStats = tally.get(b.id)!;
		if (bStats.wins !== aStats.wins) return bStats.wins - aStats.wins;
		if (b.chessRating !== a.chessRating) return b.chessRating - a.chessRating;
		return a.fullName.localeCompare(b.fullName);
	});

	const rankings: RankingRow[] = sorted.map((player, index) => {
		const stats = tally.get(player.id)!;
		const matchesPlayed = stats.wins + stats.losses;
		const rank = index + 1;
		return {
			rank,
			player,
			wins: stats.wins,
			losses: stats.losses,
			matchesPlayed,
			winPercentage: matchesPlayed === 0 ? 0 : Math.round((stats.wins / matchesPlayed) * 1000) / 10,
			medal: rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : null
		};
	});

	return json(rankings);
};

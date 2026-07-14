import { prisma } from '$lib/server/prisma';
import type { TournamentStatistics } from '$lib/types';

export async function getTournamentStatistics(tournamentId: string): Promise<TournamentStatistics> {
	const [matches, registrations] = await Promise.all([
		prisma.match.findMany({ where: { tournamentId }, include: { winner: true } }),
		prisma.tournamentPlayer.findMany({ where: { tournamentId }, include: { player: true } })
	]);

	const players = registrations.map((r) => r.player);
	const totalMatches = matches.length;
	const completedMatches = matches.filter((m) => m.status === 'COMPLETED' || m.status === 'BYE').length;
	const remainingMatches = totalMatches - completedMatches;

	const averageRating =
		players.length === 0
			? 0
			: Math.round(players.reduce((sum, p) => sum + p.chessRating, 0) / players.length);

	const highestRatedPlayer =
		players.length === 0 ? null : players.reduce((a, b) => (a.chessRating >= b.chessRating ? a : b));
	const lowestRatedPlayer =
		players.length === 0 ? null : players.reduce((a, b) => (a.chessRating <= b.chessRating ? a : b));

	// Champion = the player with the most match wins within this tournament.
	const winCounts = new Map<string, number>();
	for (const m of matches) {
		if (m.winnerId) winCounts.set(m.winnerId, (winCounts.get(m.winnerId) ?? 0) + 1);
	}
	let champion = null;
	let topWins = 0;
	for (const [playerId, wins] of winCounts.entries()) {
		if (wins > topWins) {
			topWins = wins;
			champion = players.find((p) => p.id === playerId) ?? null;
		}
	}

	return {
		totalMatches,
		completedMatches,
		remainingMatches,
		averageRating,
		highestRatedPlayer,
		lowestRatedPlayer,
		champion
	};
}

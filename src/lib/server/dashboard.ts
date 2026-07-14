import { prisma } from '$lib/server/prisma';
import { computeRankings } from '$lib/utils/ranking';
import type { DashboardStats } from '$lib/types';

export async function getDashboardStats(): Promise<DashboardStats> {
	const [totalPlayers, totalTournaments, totalMatches, allPlayers, tournaments, recentMatchesRaw] =
		await Promise.all([
			prisma.player.count(),
			prisma.tournament.count(),
			prisma.match.count(),
			prisma.player.findMany(),
			prisma.tournament.findMany({ orderBy: { date: 'asc' } }),
			prisma.match.findMany({
				orderBy: { matchTime: 'desc' },
				take: 6,
				include: { playerOne: true, playerTwo: true, winner: true }
			})
		]);

	const activeTournament = tournaments.find((t) => t.status === 'ONGOING') ?? null;
	const upcomingTournament =
		tournaments
			.filter((t) => t.status === 'UPCOMING')
			.sort((a, b) => a.date.getTime() - b.date.getTime())[0] ?? null;

	const rankings = computeRankings(allPlayers);
	const champion = rankings[0]?.player ?? null;

	const matchCounts = await prisma.match.groupBy({
		by: ['tournamentId'],
		_count: { _all: true }
	});
	const matchesPerTournament = tournaments.slice(0, 6).map((t) => ({
		name: t.name,
		matches: matchCounts.find((m) => m.tournamentId === t.id)?._count._all ?? 0
	}));

	const winsPerPlayer = rankings.slice(0, 6).map((r) => ({ name: r.player.fullName, wins: r.wins }));

	return {
		totalPlayers,
		totalTournaments,
		totalMatches,
		activeTournament,
		champion,
		upcomingTournament,
		recentMatches: recentMatchesRaw,
		topPlayers: rankings.slice(0, 5),
		matchesPerTournament,
		winsPerPlayer
	};
}

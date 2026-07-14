import type { Player, RankingRow } from '$lib/types';

/**
 * Computes dynamic rankings for a set of players.
 *
 * Sort order:
 *   1. Highest number of wins
 *   2. Tie-break: higher chess rating
 *   3. Tie-break: alphabetical by full name
 */
export function computeRankings(players: Player[]): RankingRow[] {
	const sorted = [...players].sort((a, b) => {
		if (b.wins !== a.wins) return b.wins - a.wins;
		if (b.chessRating !== a.chessRating) return b.chessRating - a.chessRating;
		return a.fullName.localeCompare(b.fullName);
	});

	return sorted.map((player, index) => {
		const matchesPlayed = player.wins + player.losses;
		const rank = index + 1;
		return {
			rank,
			player,
			wins: player.wins,
			losses: player.losses,
			matchesPlayed,
			winPercentage: matchesPlayed === 0 ? 0 : Math.round((player.wins / matchesPlayed) * 1000) / 10,
			medal: rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : null
		};
	});
}

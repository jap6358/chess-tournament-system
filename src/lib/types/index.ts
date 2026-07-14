import type { Player, Tournament, TournamentPlayer, Match } from '@prisma/client';

export type { Player, Tournament, TournamentPlayer, Match };

export type PlayerWithStats = Player & {
	winPercentage: number;
	matchesPlayed: number;
};

export type TournamentWithCount = Tournament & {
	registeredCount: number;
	matchCount: number;
};

export type MatchWithPlayers = Match & {
	playerOne: Player;
	playerTwo: Player | null;
	winner: Player | null;
};

export interface RankingRow {
	rank: number;
	player: Player;
	wins: number;
	losses: number;
	matchesPlayed: number;
	winPercentage: number;
	medal: 'gold' | 'silver' | 'bronze' | null;
}

export interface DashboardStats {
	totalPlayers: number;
	totalTournaments: number;
	totalMatches: number;
	activeTournament: Tournament | null;
	champion: Player | null;
	upcomingTournament: Tournament | null;
	recentMatches: MatchWithPlayers[];
	topPlayers: RankingRow[];
	matchesPerTournament: { name: string; matches: number }[];
	winsPerPlayer: { name: string; wins: number }[];
}

export interface TournamentStatistics {
	totalMatches: number;
	completedMatches: number;
	remainingMatches: number;
	averageRating: number;
	highestRatedPlayer: Player | null;
	lowestRatedPlayer: Player | null;
	champion: Player | null;
}

export interface PaginationMeta {
	page: number;
	pageSize: number;
	total: number;
	totalPages: number;
}

export interface Toast {
	id: string;
	type: 'success' | 'error' | 'info' | 'warning';
	message: string;
}

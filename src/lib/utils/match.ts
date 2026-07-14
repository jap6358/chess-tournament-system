/** Fisher–Yates shuffle. Returns a new array; does not mutate the input. */
export function shuffle<T>(items: T[]): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

export interface Pairing<T> {
	playerOne: T;
	playerTwo: T | null; // null = bye
}

/**
 * Randomly shuffles players and pairs them for a round.
 * If there is an odd number of players, the last one is assigned a bye.
 */
export function generatePairings<T>(players: T[]): Pairing<T>[] {
	const shuffled = shuffle(players);
	const pairings: Pairing<T>[] = [];

	for (let i = 0; i < shuffled.length; i += 2) {
		const playerOne = shuffled[i];
		const playerTwo = shuffled[i + 1] ?? null;
		pairings.push({ playerOne, playerTwo });
	}

	return pairings;
}

/** Picks a random winner between two participants (50/50). */
export function pickRandomWinner<T>(playerOne: T, playerTwo: T): T {
	return Math.random() < 0.5 ? playerOne : playerTwo;
}

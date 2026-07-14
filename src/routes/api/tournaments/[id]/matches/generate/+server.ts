import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { generatePairings } from '$lib/utils/match';

export const POST: RequestHandler = async ({ params }) => {
	const tournament = await prisma.tournament.findUnique({
		where: { id: params.id },
		include: { players: { include: { player: true } }, matches: true }
	});

	if (!tournament) {
		return json({ message: 'Tournament not found.' }, { status: 404 });
	}

	if (tournament.players.length < 2) {
		return json({ message: 'At least 2 registered players are required to generate matches.' }, { status: 400 });
	}

	const nextRound = tournament.matches.reduce((max, m) => Math.max(max, m.round), 0) + 1;
	const players = tournament.players.map((tp) => tp.player);
	const pairings = generatePairings(players);

	const created = await prisma.$transaction(
		pairings.map((pair) =>
			prisma.match.create({
				data: {
					tournamentId: tournament.id,
					round: nextRound,
					playerOneId: pair.playerOne.id,
					playerTwoId: pair.playerTwo?.id ?? null,
					status: pair.playerTwo ? 'SCHEDULED' : 'BYE',
					winnerId: pair.playerTwo ? null : pair.playerOne.id
				},
				include: { playerOne: true, playerTwo: true, winner: true }
			})
		)
	);

	// Move tournament to ONGOING if this is its first round.
	if (tournament.status === 'UPCOMING') {
		await prisma.tournament.update({ where: { id: tournament.id }, data: { status: 'ONGOING' } });
	}

	return json({ round: nextRound, matches: created }, { status: 201 });
};

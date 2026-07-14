import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { pickRandomWinner } from '$lib/utils/match';

export const PUT: RequestHandler = async ({ params, request }) => {
	const body = await request.json().catch(() => ({}));

	const match = await prisma.match.findUnique({ where: { id: params.id } });
	if (!match) {
		return json({ message: 'Match not found.' }, { status: 404 });
	}
	if (match.status === 'BYE') {
		return json({ message: 'This match was a bye and already has an automatic winner.' }, { status: 400 });
	}
	if (!match.playerTwoId) {
		return json({ message: 'This match has no second player.' }, { status: 400 });
	}
	if (match.status === 'COMPLETED' && !body.force) {
		return json({ message: 'This match already has a recorded result.' }, { status: 409 });
	}

	// Either the caller supplies a winnerId, or we pick one at random — the
	// "Generate Winners" feature described in the requirements.
	const winnerId: string =
		typeof body.winnerId === 'string' && [match.playerOneId, match.playerTwoId].includes(body.winnerId)
			? body.winnerId
			: pickRandomWinner(match.playerOneId, match.playerTwoId);

	const loserId = winnerId === match.playerOneId ? match.playerTwoId : match.playerOneId;

	const wasAlreadyDecided = match.status === 'COMPLETED' && match.winnerId;
	const previousWinnerId = match.winnerId;
	const previousLoserId = previousWinnerId
		? previousWinnerId === match.playerOneId
			? match.playerTwoId
			: match.playerOneId
		: null;

	const updated = await prisma.$transaction(async (tx) => {
		// Roll back stats from a previous result if this is a re-decision (force update).
		if (wasAlreadyDecided && previousWinnerId && previousLoserId) {
			await tx.player.update({ where: { id: previousWinnerId }, data: { wins: { decrement: 1 } } });
			await tx.player.update({ where: { id: previousLoserId }, data: { losses: { decrement: 1 } } });
		}

		await tx.player.update({ where: { id: winnerId }, data: { wins: { increment: 1 } } });
		await tx.player.update({ where: { id: loserId }, data: { losses: { increment: 1 } } });

		return tx.match.update({
			where: { id: match.id },
			data: { winnerId, status: 'COMPLETED' },
			include: { playerOne: true, playerTwo: true, winner: true }
		});
	});

	return json(updated);
};

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const GET: RequestHandler = async ({ params }) => {
	const matches = await prisma.match.findMany({
		where: { tournamentId: params.id },
		include: { playerOne: true, playerTwo: true, winner: true },
		orderBy: [{ round: 'asc' }, { matchTime: 'asc' }]
	});
	return json(matches);
};

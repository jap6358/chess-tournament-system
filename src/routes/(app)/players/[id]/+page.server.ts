import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ params }) => {
	const player = await prisma.player.findUnique({
		where: { id: params.id },
		include: {
			tournaments: { include: { tournament: true }, orderBy: { registeredAt: 'desc' } }
		}
	});

	if (!player) throw error(404, 'Player not found.');

	const matches = await prisma.match.findMany({
		where: { OR: [{ playerOneId: player.id }, { playerTwoId: player.id }] },
		include: { playerOne: true, playerTwo: true, winner: true, tournament: true },
		orderBy: { matchTime: 'desc' }
	});

	const matchesPlayed = player.wins + player.losses;

	return {
		player,
		matches,
		winPercentage: matchesPlayed === 0 ? 0 : Math.round((player.wins / matchesPlayed) * 1000) / 10
	};
};

import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { computeRankings } from '$lib/utils/ranking';

export const load: PageServerLoad = async () => {
	const players = await prisma.player.findMany();
	const rankings = computeRankings(players);
	return { rankings };
};

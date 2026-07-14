import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getTournamentStatistics } from '$lib/server/tournamentStats';

export const GET: RequestHandler = async ({ params }) => {
	const stats = await getTournamentStatistics(params.id);
	return json(stats);
};

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDashboardStats } from '$lib/server/dashboard';

export const GET: RequestHandler = async () => {
	const stats = await getDashboardStats();
	return json(stats);
};

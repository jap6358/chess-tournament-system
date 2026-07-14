import type { PageServerLoad } from './$types';
import { getDashboardStats } from '$lib/server/dashboard';

export const load: PageServerLoad = async () => {
	const stats = await getDashboardStats();
	return { stats };
};

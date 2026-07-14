import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.admin) {
		const redirectTo = encodeURIComponent(url.pathname + url.search);
		throw redirect(302, `/login?redirectTo=${redirectTo}`);
	}
	return { admin: locals.admin };
};

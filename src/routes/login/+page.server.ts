import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { comparePassword, signSession, setSessionCookie } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.admin) {
		throw redirect(302, '/dashboard');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim().toLowerCase();
		const password = String(form.get('password') ?? '');

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required.', email });
		}

		const admin = await prisma.admin.findUnique({ where: { email } });
		if (!admin) {
			return fail(401, { error: 'Invalid email or password.', email });
		}

		const valid = await comparePassword(password, admin.passwordHash);
		if (!valid) {
			return fail(401, { error: 'Invalid email or password.', email });
		}

		const token = signSession({ adminId: admin.id, email: admin.email, fullName: admin.fullName });
		setSessionCookie(cookies, token);

		throw redirect(302, '/dashboard');
	}
};

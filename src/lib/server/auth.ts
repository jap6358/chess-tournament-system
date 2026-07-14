import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { Cookies } from '@sveltejs/kit';
import { JWT_SECRET } from '$env/static/private';

export const SESSION_COOKIE = 'chess_admin_session';

export interface SessionPayload {
	adminId: string;
	email: string;
	fullName: string;
}

export function signSession(payload: SessionPayload): string {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifySession(token: string): SessionPayload | null {
	try {
		return jwt.verify(token, JWT_SECRET) as SessionPayload;
	} catch {
		return null;
	}
}

export function setSessionCookie(cookies: Cookies, token: string) {
	cookies.set(SESSION_COOKIE, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 60 * 60 * 24 * 7 // 7 days
	});
}

export function clearSessionCookie(cookies: Cookies) {
	cookies.delete(SESSION_COOKIE, { path: '/' });
}

export async function hashPassword(plain: string): Promise<string> {
	return bcrypt.hash(plain, 10);
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
	return bcrypt.compare(plain, hash);
}

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { validatePlayer } from '$lib/server/validation';
import { Prisma } from '@prisma/client';

export const GET: RequestHandler = async ({ url }) => {
	const search = url.searchParams.get('search')?.trim() ?? '';
	const country = url.searchParams.get('country') ?? '';
	const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
	const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get('pageSize') ?? 10)));
	const sortKey = url.searchParams.get('sortKey') ?? 'createdAt';
	const sortDir = url.searchParams.get('sortDir') === 'asc' ? 'asc' : 'desc';

	const allowedSortKeys = ['fullName', 'chessRating', 'country', 'createdAt', 'age'] as const;
	const effectiveSortKey = allowedSortKeys.includes(sortKey as (typeof allowedSortKeys)[number])
		? (sortKey as (typeof allowedSortKeys)[number])
		: 'createdAt';
	const orderBy: Prisma.PlayerOrderByWithRelationInput = { [effectiveSortKey]: sortDir };

	const where: Prisma.PlayerWhereInput = {
		AND: [
			search
				? {
						OR: [
							{ fullName: { contains: search, mode: 'insensitive' } },
							{ email: { contains: search, mode: 'insensitive' } }
						]
					}
				: {},
			country ? { country } : {}
		]
	};

	const [items, total] = await Promise.all([
		prisma.player.findMany({
			where,
			orderBy,
			skip: (page - 1) * pageSize,
			take: pageSize
		}),
		prisma.player.count({ where })
	]);

	return json({
		items,
		meta: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) }
	});
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json().catch(() => ({}));
	const result = validatePlayer(body);
	if (!result.valid) {
		return json({ message: 'Validation failed', errors: result.errors }, { status: 400 });
	}

	const existing = await prisma.player.findUnique({ where: { email: body.email } });
	if (existing) {
		return json(
			{ message: 'A player with this email already exists.', errors: { email: 'Email already in use.' } },
			{ status: 409 }
		);
	}

	const player = await prisma.player.create({
		data: {
			fullName: body.fullName.trim(),
			email: body.email.trim().toLowerCase(),
			country: body.country.trim(),
			age: Number(body.age),
			gender: body.gender ?? 'OTHER',
			chessRating: Number(body.chessRating),
			phone: body.phone?.trim() || null
		}
	});

	return json(player, { status: 201 });
};

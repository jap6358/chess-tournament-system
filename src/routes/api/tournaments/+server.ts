import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { validateTournament } from '$lib/server/validation';
import type { Prisma, TournamentStatus } from '@prisma/client';

export const GET: RequestHandler = async ({ url }) => {
	const search = url.searchParams.get('search')?.trim() ?? '';
	const status = url.searchParams.get('status') ?? '';
	const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
	const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get('pageSize') ?? 10)));

	const where: Prisma.TournamentWhereInput = {
		AND: [
			search ? { name: { contains: search, mode: 'insensitive' } } : {},
			status ? { status: status as TournamentStatus } : {}
		]
	};

	const [items, total] = await Promise.all([
		prisma.tournament.findMany({
			where,
			orderBy: { date: 'desc' },
			skip: (page - 1) * pageSize,
			take: pageSize,
			include: { _count: { select: { players: true, matches: true } } }
		}),
		prisma.tournament.count({ where })
	]);

	return json({
		items,
		meta: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) }
	});
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json().catch(() => ({}));
	const result = validateTournament(body);
	if (!result.valid) {
		return json({ message: 'Validation failed', errors: result.errors }, { status: 400 });
	}

	const duplicate = await prisma.tournament.findFirst({ where: { name: body.name.trim() } });
	if (duplicate) {
		return json(
			{ message: 'A tournament with this name already exists.', errors: { name: 'Name already in use.' } },
			{ status: 409 }
		);
	}

	const tournament = await prisma.tournament.create({
		data: {
			name: body.name.trim(),
			description: body.description?.trim() || null,
			location: body.location.trim(),
			date: new Date(body.date),
			status: body.status ?? 'UPCOMING',
			maximumPlayers: Number(body.maximumPlayers)
		}
	});

	return json(tournament, { status: 201 });
};

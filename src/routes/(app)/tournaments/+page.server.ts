import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import type { Prisma, TournamentStatus } from '@prisma/client';

export const load: PageServerLoad = async ({ url }) => {
	const search = url.searchParams.get('search')?.trim() ?? '';
	const status = url.searchParams.get('status') ?? '';
	const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
	const pageSize = 8;

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

	return {
		tournaments: items,
		meta: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) },
		filters: { search, status }
	};
};

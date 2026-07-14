import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import type { Prisma, MatchStatus } from '@prisma/client';

export const load: PageServerLoad = async ({ url }) => {
	const search = url.searchParams.get('search')?.trim() ?? '';
	const status = url.searchParams.get('status') ?? '';
	const tournamentId = url.searchParams.get('tournamentId') ?? '';
	const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
	const pageSize = 10;

	const where: Prisma.MatchWhereInput = {
		AND: [
			search
				? {
						OR: [
							{ playerOne: { fullName: { contains: search, mode: 'insensitive' } } },
							{ playerTwo: { fullName: { contains: search, mode: 'insensitive' } } }
						]
					}
				: {},
			status ? { status: status as MatchStatus } : {},
			tournamentId ? { tournamentId } : {}
		]
	};

	const [items, total, tournaments] = await Promise.all([
		prisma.match.findMany({
			where,
			orderBy: { matchTime: 'desc' },
			skip: (page - 1) * pageSize,
			take: pageSize,
			include: { playerOne: true, playerTwo: true, winner: true, tournament: true }
		}),
		prisma.match.count({ where }),
		prisma.tournament.findMany({ orderBy: { name: 'asc' } })
	]);

	return {
		matches: items,
		tournaments,
		meta: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) },
		filters: { search, status, tournamentId }
	};
};

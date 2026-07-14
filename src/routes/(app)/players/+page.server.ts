import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import type { Prisma } from '@prisma/client';

export const load: PageServerLoad = async ({ url }) => {
	const search = url.searchParams.get('search')?.trim() ?? '';
	const country = url.searchParams.get('country') ?? '';
	const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
	const pageSize = 8;
	const sortKey = url.searchParams.get('sortKey') ?? 'createdAt';
	const sortDir = (url.searchParams.get('sortDir') === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc';

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

	const [items, total, countries] = await Promise.all([
		prisma.player.findMany({ where, orderBy, skip: (page - 1) * pageSize, take: pageSize }),
		prisma.player.count({ where }),
		prisma.player.findMany({ distinct: ['country'], select: { country: true }, orderBy: { country: 'asc' } })
	]);

	return {
		players: items,
		countries: countries.map((c) => c.country),
		meta: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) },
		filters: { search, country, sortKey, sortDir }
	};
};

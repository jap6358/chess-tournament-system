import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { validateTournament } from '$lib/server/validation';

export const GET: RequestHandler = async ({ params }) => {
	const tournament = await prisma.tournament.findUnique({
		where: { id: params.id },
		include: {
			players: { include: { player: true } },
			matches: { include: { playerOne: true, playerTwo: true, winner: true }, orderBy: { round: 'asc' } }
		}
	});

	if (!tournament) {
		return json({ message: 'Tournament not found.' }, { status: 404 });
	}

	return json(tournament);
};

export const PUT: RequestHandler = async ({ params, request }) => {
	const body = await request.json().catch(() => ({}));
	const result = validateTournament(body);
	if (!result.valid) {
		return json({ message: 'Validation failed', errors: result.errors }, { status: 400 });
	}

	const duplicate = await prisma.tournament.findFirst({
		where: { name: body.name.trim(), NOT: { id: params.id } }
	});
	if (duplicate) {
		return json(
			{ message: 'Another tournament already uses this name.', errors: { name: 'Name already in use.' } },
			{ status: 409 }
		);
	}

	try {
		const tournament = await prisma.tournament.update({
			where: { id: params.id },
			data: {
				name: body.name.trim(),
				description: body.description?.trim() || null,
				location: body.location.trim(),
				date: new Date(body.date),
				status: body.status ?? 'UPCOMING',
				maximumPlayers: Number(body.maximumPlayers)
			}
		});
		return json(tournament);
	} catch {
		return json({ message: 'Tournament not found.' }, { status: 404 });
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		await prisma.tournament.delete({ where: { id: params.id } });
		return json({ success: true });
	} catch {
		return json({ message: 'Tournament not found.' }, { status: 404 });
	}
};

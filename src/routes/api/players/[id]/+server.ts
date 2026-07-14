import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { validatePlayer } from '$lib/server/validation';

export const GET: RequestHandler = async ({ params }) => {
	const player = await prisma.player.findUnique({
		where: { id: params.id },
		include: {
			tournaments: { include: { tournament: true } },
			matchesAsPlayer1: { include: { playerTwo: true, winner: true, tournament: true } },
			matchesAsPlayer2: { include: { playerOne: true, winner: true, tournament: true } }
		}
	});

	if (!player) {
		return json({ message: 'Player not found.' }, { status: 404 });
	}

	return json(player);
};

export const PUT: RequestHandler = async ({ params, request }) => {
	const body = await request.json().catch(() => ({}));
	const result = validatePlayer(body);
	if (!result.valid) {
		return json({ message: 'Validation failed', errors: result.errors }, { status: 400 });
	}

	const duplicate = await prisma.player.findFirst({
		where: { email: body.email.trim().toLowerCase(), NOT: { id: params.id } }
	});
	if (duplicate) {
		return json(
			{ message: 'Another player already uses this email.', errors: { email: 'Email already in use.' } },
			{ status: 409 }
		);
	}

	try {
		const player = await prisma.player.update({
			where: { id: params.id },
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
		return json(player);
	} catch {
		return json({ message: 'Player not found.' }, { status: 404 });
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		await prisma.player.delete({ where: { id: params.id } });
		return json({ success: true });
	} catch {
		return json({ message: 'Player not found.' }, { status: 404 });
	}
};

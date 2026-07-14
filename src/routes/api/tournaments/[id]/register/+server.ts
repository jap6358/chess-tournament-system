import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const POST: RequestHandler = async ({ params, request }) => {
	const body = await request.json().catch(() => ({}));
	const playerIds: string[] = Array.isArray(body.playerIds)
		? body.playerIds
		: body.playerId
			? [body.playerId]
			: [];

	if (playerIds.length === 0) {
		return json({ message: 'No players specified.' }, { status: 400 });
	}

	const tournament = await prisma.tournament.findUnique({
		where: { id: params.id },
		include: { _count: { select: { players: true } } }
	});
	if (!tournament) {
		return json({ message: 'Tournament not found.' }, { status: 404 });
	}

	const existing = await prisma.tournamentPlayer.findMany({
		where: { tournamentId: params.id, playerId: { in: playerIds } },
		select: { playerId: true }
	});
	const existingIds = new Set(existing.map((e) => e.playerId));
	const newIds = playerIds.filter((id) => !existingIds.has(id));

	if (newIds.length === 0) {
		return json({ message: 'Selected players are already registered.' }, { status: 409 });
	}

	const availableSlots = tournament.maximumPlayers - tournament._count.players;
	if (newIds.length > availableSlots) {
		return json(
			{
				message: `Only ${availableSlots} slot(s) remaining in this tournament (maximum ${tournament.maximumPlayers}).`
			},
			{ status: 409 }
		);
	}

	await prisma.tournamentPlayer.createMany({
		data: newIds.map((playerId) => ({ tournamentId: params.id, playerId })),
		skipDuplicates: true
	});

	return json({ success: true, registered: newIds.length }, { status: 201 });
};

export const DELETE: RequestHandler = async ({ params, request }) => {
	const body = await request.json().catch(() => ({}));
	const playerId = String(body.playerId ?? '');
	if (!playerId) {
		return json({ message: 'playerId is required.' }, { status: 400 });
	}

	await prisma.tournamentPlayer.deleteMany({ where: { tournamentId: params.id, playerId } });
	return json({ success: true });
};

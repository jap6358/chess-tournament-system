import { PrismaClient, Gender, TournamentStatus, MatchStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const FIRST_NAMES = [
	'Magnus', 'Hikaru', 'Fabiano', 'Wesley', 'Levon', 'Ian', 'Alireza', 'Ding',
	'Anish', 'Maxime', 'Viswanathan', 'Judit', 'Hou', 'Koneru', 'Anna', 'Aleksandra',
	'Nodirbek', 'Praggnanandhaa', 'Vincent', 'Richard', 'Sam', 'Jan-Krzysztof',
	'Teimour', 'Shakhriyar'
];
const LAST_NAMES = [
	'Carlsen', 'Nakamura', 'Caruana', 'So', 'Aronian', 'Nepomniachtchi', 'Firouzja',
	'Liren', 'Giri', 'Vachier-Lagrave', 'Anand', 'Polgar', 'Yifan', 'Humpy', 'Muzychuk',
	'Goryachkina', 'Abdusattorov', 'Rameshbabu', 'Keymer', 'Rapport', 'Shankland',
	'Duda', 'Radjabov', 'Mamedyarov'
];
const COUNTRIES = [
	'Norway', 'USA', 'Italy', 'Armenia', 'Russia', 'Iran', 'China', 'Netherlands',
	'France', 'India', 'Hungary', 'Poland', 'Uzbekistan', 'Germany', 'Azerbaijan'
];

function randomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
	return arr[randomInt(0, arr.length - 1)];
}

function shuffle<T>(arr: T[]): T[] {
	const copy = [...arr];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = randomInt(0, i);
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

async function main() {
	console.log('Seeding database…');

	// --- Admin account ---------------------------------------------------
	const adminEmail = process.env.ADMIN_EMAIL || 'admin@chessmaster.dev';
	const adminPassword = process.env.ADMIN_PASSWORD || 'ChessAdmin!123';
	const passwordHash = await bcrypt.hash(adminPassword, 10);

	await prisma.admin.upsert({
		where: { email: adminEmail },
		update: {},
		create: {
			fullName: 'Tournament Administrator',
			email: adminEmail,
			passwordHash
		}
	});
	console.log(`Admin ready: ${adminEmail} / ${adminPassword}`);

	// --- Clear existing data (safe order due to FKs) ----------------------
	await prisma.match.deleteMany();
	await prisma.tournamentPlayer.deleteMany();
	await prisma.tournament.deleteMany();
	await prisma.player.deleteMany();

	// --- Players -----------------------------------------------------------
	const usedEmails = new Set<string>();
	const players = [];
	for (let i = 0; i < 20; i++) {
		const first = FIRST_NAMES[i % FIRST_NAMES.length];
		const last = LAST_NAMES[i % LAST_NAMES.length];
		const fullName = `${first} ${last}`;
		let email = `${first.toLowerCase()}.${last.toLowerCase()}@chessmaster.dev`;
		let suffix = 1;
		while (usedEmails.has(email)) {
			email = `${first.toLowerCase()}.${last.toLowerCase()}${suffix}@chessmaster.dev`;
			suffix += 1;
		}
		usedEmails.add(email);

		const player = await prisma.player.create({
			data: {
				fullName,
				email,
				country: pick(COUNTRIES),
				age: randomInt(16, 45),
				gender: pick([Gender.MALE, Gender.FEMALE, Gender.OTHER]),
				chessRating: randomInt(1400, 2850),
				phone: `+1-${randomInt(200, 999)}-${randomInt(100, 999)}-${randomInt(1000, 9999)}`
			}
		});
		players.push(player);
	}
	console.log(`Created ${players.length} players.`);

	// --- Tournaments ---------------------------------------------------------
	const tournamentDefs = [
		{
			name: 'Grandmaster Winter Open 2026',
			description: 'An elite invitational open to the top-rated players of the season.',
			location: 'Oslo, Norway',
			date: new Date('2026-02-14T09:00:00Z'),
			status: TournamentStatus.COMPLETED,
			maximumPlayers: 8
		},
		{
			name: 'Chessmaster Spring Championship',
			description: 'A fast-paced knockout-style championship crowning a single victor.',
			location: 'Chennai, India',
			date: new Date('2026-06-01T09:00:00Z'),
			status: TournamentStatus.ONGOING,
			maximumPlayers: 10
		},
		{
			name: 'Autumn Rapid Invitational',
			description: 'A rapid time-control event for the upcoming season.',
			location: 'Paris, France',
			date: new Date('2026-11-20T09:00:00Z'),
			status: TournamentStatus.UPCOMING,
			maximumPlayers: 12
		}
	];

	for (const def of tournamentDefs) {
		const tournament = await prisma.tournament.create({ data: def });

		// Register a random subset of players (respecting maximumPlayers)
		const registered = shuffle(players).slice(0, def.maximumPlayers);
		await prisma.tournamentPlayer.createMany({
			data: registered.map((p) => ({ tournamentId: tournament.id, playerId: p.id }))
		});

		if (def.status === TournamentStatus.UPCOMING) {
			// No matches yet for an upcoming tournament.
			continue;
		}

		// Generate round 1 random pairings.
		const pool = shuffle(registered);
		let round = 1;
		const matchRecords: {
			tournamentId: string;
			round: number;
			playerOneId: string;
			playerTwoId: string | null;
			winnerId: string | null;
			status: MatchStatus;
		}[] = [];

		for (let i = 0; i < pool.length; i += 2) {
			const playerOne = pool[i];
			const playerTwo = pool[i + 1];

			if (!playerTwo) {
				// Odd player out gets a bye and an automatic advance.
				matchRecords.push({
					tournamentId: tournament.id,
					round,
					playerOneId: playerOne.id,
					playerTwoId: null,
					winnerId: playerOne.id,
					status: MatchStatus.BYE
				});
				continue;
			}

			const isDecided = def.status === TournamentStatus.COMPLETED || Math.random() > 0.4;
			const winnerId = isDecided ? pick([playerOne.id, playerTwo.id]) : null;

			matchRecords.push({
				tournamentId: tournament.id,
				round,
				playerOneId: playerOne.id,
				playerTwoId: playerTwo.id,
				winnerId,
				status: isDecided ? MatchStatus.COMPLETED : MatchStatus.SCHEDULED
			});
		}

		for (const m of matchRecords) {
			await prisma.match.create({ data: m });
			if (m.winnerId) {
				await prisma.player.update({
					where: { id: m.winnerId },
					data: { wins: { increment: 1 } }
				});
				const loserId =
					m.status === MatchStatus.COMPLETED
						? m.winnerId === m.playerOneId
							? m.playerTwoId
							: m.playerOneId
						: null;
				if (loserId) {
					await prisma.player.update({
						where: { id: loserId },
						data: { losses: { increment: 1 } }
					});
				}
			}
		}

		console.log(`Tournament "${tournament.name}" — ${registered.length} players, ${matchRecords.length} matches.`);
	}

	console.log('Seeding complete.');
}

main()
	.catch((err) => {
		console.error(err);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

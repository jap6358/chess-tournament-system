export interface ValidationResult {
	valid: boolean;
	errors: Record<string, string>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface PlayerInput {
	fullName?: unknown;
	email?: unknown;
	country?: unknown;
	age?: unknown;
	gender?: unknown;
	chessRating?: unknown;
	phone?: unknown;
}

export function validatePlayer(input: PlayerInput): ValidationResult {
	const errors: Record<string, string> = {};

	if (typeof input.fullName !== 'string' || input.fullName.trim().length < 2) {
		errors.fullName = 'Full name must be at least 2 characters.';
	}
	if (typeof input.email !== 'string' || !EMAIL_RE.test(input.email)) {
		errors.email = 'Enter a valid email address.';
	}
	if (typeof input.country !== 'string' || input.country.trim().length < 2) {
		errors.country = 'Country is required.';
	}
	const age = Number(input.age);
	if (!Number.isFinite(age) || age < 5 || age > 120) {
		errors.age = 'Age must be a number between 5 and 120.';
	}
	if (input.gender && !['MALE', 'FEMALE', 'OTHER'].includes(String(input.gender))) {
		errors.gender = 'Gender must be MALE, FEMALE, or OTHER.';
	}
	const rating = Number(input.chessRating);
	if (!Number.isFinite(rating) || rating < 0 || rating > 3500) {
		errors.chessRating = 'Chess rating must be a number between 0 and 3500.';
	}
	if (input.phone && typeof input.phone !== 'string') {
		errors.phone = 'Phone must be a string.';
	}

	return { valid: Object.keys(errors).length === 0, errors };
}

export interface TournamentInput {
	name?: unknown;
	description?: unknown;
	location?: unknown;
	date?: unknown;
	status?: unknown;
	maximumPlayers?: unknown;
}

export function validateTournament(input: TournamentInput): ValidationResult {
	const errors: Record<string, string> = {};

	if (typeof input.name !== 'string' || input.name.trim().length < 3) {
		errors.name = 'Tournament name must be at least 3 characters.';
	}
	if (typeof input.location !== 'string' || input.location.trim().length < 2) {
		errors.location = 'Location is required.';
	}
	const date = new Date(String(input.date));
	if (isNaN(date.getTime())) {
		errors.date = 'A valid date is required.';
	}
	if (input.status && !['UPCOMING', 'ONGOING', 'COMPLETED'].includes(String(input.status))) {
		errors.status = 'Status must be UPCOMING, ONGOING, or COMPLETED.';
	}
	const max = Number(input.maximumPlayers);
	if (!Number.isInteger(max) || max < 2 || max > 256) {
		errors.maximumPlayers = 'Maximum players must be an integer between 2 and 256.';
	}

	return { valid: Object.keys(errors).length === 0, errors };
}

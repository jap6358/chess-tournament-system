export function formatDate(value: Date | string, opts?: Intl.DateTimeFormatOptions): string {
	const date = typeof value === 'string' ? new Date(value) : value;
	return new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		...opts
	}).format(date);
}

export function formatDateTime(value: Date | string): string {
	const date = typeof value === 'string' ? new Date(value) : value;
	return new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit'
	}).format(date);
}

export function initials(fullName: string): string {
	return fullName
		.split(' ')
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join('');
}

export function percentage(numerator: number, denominator: number): number {
	if (denominator === 0) return 0;
	return Math.round((numerator / denominator) * 1000) / 10;
}

export function statusColor(status: string): 'gold' | 'emerald' | 'ebony' {
	switch (status) {
		case 'ONGOING':
			return 'emerald';
		case 'UPCOMING':
			return 'gold';
		default:
			return 'ebony';
	}
}

export function debounce<T extends (...args: never[]) => void>(fn: T, delay = 300) {
	let timer: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timer);
		timer = setTimeout(() => fn(...args), delay);
	};
}

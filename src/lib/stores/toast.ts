import { writable } from 'svelte/store';
import type { Toast } from '$lib/types';

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	function push(type: Toast['type'], message: string, timeoutMs = 4000) {
		const id = crypto.randomUUID();
		update((all) => [...all, { id, type, message }]);
		if (timeoutMs > 0) {
			setTimeout(() => dismiss(id), timeoutMs);
		}
		return id;
	}

	function dismiss(id: string) {
		update((all) => all.filter((t) => t.id !== id));
	}

	return {
		subscribe,
		success: (message: string) => push('success', message),
		error: (message: string) => push('error', message),
		info: (message: string) => push('info', message),
		warning: (message: string) => push('warning', message),
		dismiss
	};
}

export const toast = createToastStore();

import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

function createThemeStore() {
	const initial: Theme = browser
		? ((localStorage.getItem('theme') as Theme) ??
			(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
		: 'light';

	const { subscribe, set, update } = writable<Theme>(initial);

	function apply(theme: Theme) {
		if (!browser) return;
		document.documentElement.classList.toggle('dark', theme === 'dark');
		localStorage.setItem('theme', theme);
	}

	if (browser) apply(initial);

	return {
		subscribe,
		set: (theme: Theme) => {
			apply(theme);
			set(theme);
		},
		toggle: () =>
			update((current) => {
				const next = current === 'light' ? 'dark' : 'light';
				apply(next);
				return next;
			})
	};
}

export const theme = createThemeStore();

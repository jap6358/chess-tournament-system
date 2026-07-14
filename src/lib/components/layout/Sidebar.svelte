<script lang="ts">
	import { page } from '$app/stores';

	const nav = [
		{ href: '/dashboard', label: 'Dashboard', icon: 'M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6V11h-6v9Zm0-16v5h6V4h-6Z' },
		{ href: '/players', label: 'Players', icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3Zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5Z' },
		{ href: '/tournaments', label: 'Tournaments', icon: 'M5 4h14v2a5 5 0 0 1-4.35 4.95A5 5 0 0 1 13 14.9V17h3v2H8v-2h3v-2.1a5 5 0 0 1-1.65-3.95A5 5 0 0 1 5 6V4Z' },
		{ href: '/matches', label: 'Matches', icon: 'M9 3v18M15 3v18M3 9h18M3 15h18' },
		{ href: '/rankings', label: 'Rankings', icon: 'M8 21h8M12 17v4M7 4h10l-1 8a4 4 0 0 1-8 0L7 4Z' },
		{ href: '/settings', label: 'Settings', icon: 'M10.325 4.317a1 1 0 0 1 1.35-.936l1.06.397a1 1 0 0 0 1.03-.19l.85-.75a1 1 0 0 1 1.394.062l.92.92a1 1 0 0 1 .062 1.394l-.75.85a1 1 0 0 0-.19 1.03l.397 1.06a1 1 0 0 1-.936 1.35h-1.13a1 1 0 0 0-.868.507l-.565.98a1 1 0 0 1-1.732 0l-.565-.98a1 1 0 0 0-.868-.507h-1.13Z' }
	];

	$: currentPath = $page.url.pathname;
</script>

<aside class="hidden w-64 shrink-0 flex-col border-r border-ebony-100 bg-white dark:border-ebony-700 dark:bg-ebony-900 lg:flex">
	<div class="relative overflow-hidden border-b border-ebony-100 bg-ebony-900 px-5 py-6 dark:border-ebony-700">
		<div class="absolute inset-0 bg-board-grid bg-board opacity-40" aria-hidden="true" />
		<div class="relative flex items-center gap-2.5">
			<span class="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-500 font-display text-lg font-bold text-ebony-950">
				♞
			</span>
			<div>
				<p class="font-display text-lg font-semibold leading-none text-ivory-50">Chessmaster</p>
				<p class="mt-1 text-[11px] uppercase tracking-widest text-ivory-300/70">Tournament Manager</p>
			</div>
		</div>
	</div>

	<nav class="flex-1 space-y-1 overflow-y-auto p-3">
		{#each nav as item (item.href)}
			<a
				href={item.href}
				class="sidebar-link {currentPath.startsWith(item.href) ? 'active' : ''}"
				aria-current={currentPath.startsWith(item.href) ? 'page' : undefined}
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-5 w-5 shrink-0">
					<path stroke-linecap="round" stroke-linejoin="round" d={item.icon} />
				</svg>
				{item.label}
			</a>
		{/each}
	</nav>

	<div class="border-t border-ebony-100 p-3 dark:border-ebony-700">
		<form method="POST" action="/logout">
			<button type="submit" class="sidebar-link w-full">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-5 w-5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0-4-4m4 4H7m4 8H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6" />
				</svg>
				Log out
			</button>
		</form>
	</div>
</aside>

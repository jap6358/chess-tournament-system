<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import { initials } from '$lib/utils/format';

	export let adminName = 'Administrator';
	export let title = 'Dashboard';
	export let mobileNavOpen = false;
</script>

<header class="sticky top-0 z-30 flex items-center gap-3 border-b border-ebony-100 bg-white/80 px-4 py-3 backdrop-blur dark:border-ebony-700 dark:bg-ebony-900/80 sm:px-6">
	<button
		class="rounded-lg p-2 text-ebony-500 hover:bg-ebony-900/5 dark:text-ivory-300 lg:hidden"
		aria-label="Toggle navigation menu"
		on:click={() => (mobileNavOpen = !mobileNavOpen)}
	>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5">
			<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
		</svg>
	</button>

	<h1 class="font-display text-lg font-semibold text-ebony-900 dark:text-ivory-50">{title}</h1>

	<div class="ml-auto flex items-center gap-1.5 sm:gap-3">
		<button
			class="rounded-lg p-2 text-ebony-500 hover:bg-ebony-900/5 dark:text-ivory-300 dark:hover:bg-ivory-100/10"
			aria-label="Notifications"
		>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-5 w-5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
			</svg>
		</button>

		<button
			class="rounded-lg p-2 text-ebony-500 hover:bg-ebony-900/5 dark:text-ivory-300 dark:hover:bg-ivory-100/10"
			aria-label="Toggle color theme"
			on:click={() => theme.toggle()}
		>
			{#if $theme === 'dark'}
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-5 w-5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.66-6.66 1.41-1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M4.93 4.93 6.34 6.34M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
				</svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-5 w-5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
				</svg>
			{/if}
		</button>

		<div class="flex items-center gap-2 border-l border-ebony-100 pl-3 dark:border-ebony-700">
			<span class="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500 text-xs font-semibold text-ebony-950">
				{initials(adminName)}
			</span>
			<span class="hidden text-sm font-medium text-ebony-700 dark:text-ivory-200 sm:inline">{adminName}</span>
		</div>
	</div>
</header>

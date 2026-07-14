<script lang="ts">
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	let mobileNavOpen = false;

	const titles: Record<string, string> = {
		'/dashboard': 'Dashboard',
		'/players': 'Players',
		'/tournaments': 'Tournaments',
		'/matches': 'Match History',
		'/rankings': 'Rankings',
		'/settings': 'Settings'
	};

	$: title =
		Object.entries(titles).find(([path]) => $page.url.pathname.startsWith(path))?.[1] ?? 'Chessmaster';
</script>

<div class="flex min-h-screen bg-ivory-50 dark:bg-ebony-950">
	<Sidebar />

	{#if mobileNavOpen}
		<div class="fixed inset-0 z-40 flex lg:hidden">
			<button aria-label="Close menu" class="absolute inset-0 bg-ebony-950/50" on:click={() => (mobileNavOpen = false)} />
			<div class="relative z-10 w-64">
				<Sidebar />
			</div>
		</div>
	{/if}

	<div class="flex min-h-screen flex-1 flex-col">
		<Navbar adminName={data.admin?.fullName ?? 'Administrator'} {title} bind:mobileNavOpen />
		<main class="flex-1 p-4 sm:p-6 lg:p-8">
			<slot />
		</main>
	</div>
</div>

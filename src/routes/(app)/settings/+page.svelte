<script lang="ts">
	import { page } from '$app/stores';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { theme } from '$lib/stores/theme';

	$: admin = $page.data.admin;
</script>

<svelte:head>
	<title>Settings — Chessmaster</title>
</svelte:head>

<div class="max-w-2xl space-y-5">
	<Card>
		<h2 class="font-display text-base font-semibold text-ebony-900 dark:text-ivory-50">Admin Profile</h2>
		<dl class="mt-3 space-y-2 text-sm">
			<div class="flex justify-between">
				<dt class="text-ebony-400 dark:text-ivory-400">Full name</dt>
				<dd class="text-ebony-800 dark:text-ivory-100">{admin?.fullName ?? '—'}</dd>
			</div>
			<div class="flex justify-between">
				<dt class="text-ebony-400 dark:text-ivory-400">Email</dt>
				<dd class="text-ebony-800 dark:text-ivory-100">{admin?.email ?? '—'}</dd>
			</div>
		</dl>
	</Card>

	<Card>
		<h2 class="font-display text-base font-semibold text-ebony-900 dark:text-ivory-50">Appearance</h2>
		<p class="mt-1 text-sm text-ebony-400 dark:text-ivory-400">Switch between light and dark board themes.</p>
		<div class="mt-3 flex gap-2">
			<Button variant={$theme === 'light' ? 'primary' : 'secondary'} on:click={() => theme.set('light')}>☀ Light</Button>
			<Button variant={$theme === 'dark' ? 'primary' : 'secondary'} on:click={() => theme.set('dark')}>☾ Dark</Button>
		</div>
	</Card>

	<Card>
		<h2 class="font-display text-base font-semibold text-ebony-900 dark:text-ivory-50">About</h2>
		<p class="mt-1 text-sm text-ebony-500 dark:text-ivory-300">Chessmaster Tournament Manager — v1.0.0</p>
		<p class="mt-1 text-xs text-ebony-400 dark:text-ivory-500">Built with SvelteKit, Prisma, PostgreSQL and Tailwind CSS.</p>
	</Card>
</div>

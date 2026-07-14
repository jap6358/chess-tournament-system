<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let loading = false;
	let email = form?.email ?? '';
	let password = '';
</script>

<svelte:head>
	<title>Sign in — Chessmaster</title>
</svelte:head>

<div class="grid min-h-screen lg:grid-cols-2">
	<!-- Signature panel: an oversized chessboard motif with the tournament identity -->
	<div class="relative hidden flex-col justify-between overflow-hidden bg-ebony-950 p-12 text-ivory-50 lg:flex">
		<div class="absolute inset-0 bg-board-grid bg-board opacity-30" aria-hidden="true" />
		<div class="relative flex items-center gap-3">
			<span class="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500 font-display text-xl font-bold text-ebony-950">
				♞
			</span>
			<span class="font-display text-xl font-semibold">Chessmaster</span>
		</div>
		<div class="relative max-w-md">
			<p class="font-display text-4xl font-medium leading-tight">
				Every round tells a story. <span class="text-gold-400">Track it.</span>
			</p>
			<p class="mt-4 text-sm text-ivory-300/80">
				Register players, generate fair pairings, and crown your champion — all from one board.
			</p>
		</div>
		<p class="relative text-xs text-ivory-400/60">Chessmaster Tournament Manager · Admin Console</p>
	</div>

	<!-- Sign in form -->
	<div class="flex items-center justify-center bg-ivory-100 px-6 py-12 dark:bg-ebony-950">
		<div class="w-full max-w-sm">
			<div class="mb-8 lg:hidden">
				<span class="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500 font-display text-xl font-bold text-ebony-950">
					♞
				</span>
			</div>
			<h1 class="font-display text-2xl font-semibold text-ebony-900 dark:text-ivory-50">Welcome back</h1>
			<p class="mt-1 text-sm text-ebony-500 dark:text-ivory-400">Sign in to manage your tournaments.</p>

			<form
				method="POST"
				class="mt-8 space-y-4"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
					};
				}}
			>
				{#if form?.error}
					<div class="rounded-xl border border-garnet-300 bg-garnet-50 px-3.5 py-2.5 text-sm text-garnet-700 dark:bg-garnet-500/10 dark:text-garnet-300">
						{form.error}
					</div>
				{/if}

				<Input label="Email" name="email" type="email" bind:value={email} required placeholder="admin@chessmaster.dev" />
				<Input label="Password" name="password" type="password" bind:value={password} required placeholder="••••••••" />

				<Button type="submit" fullWidth {loading}>Sign in</Button>
			</form>

			<p class="mt-6 text-xs text-ebony-400 dark:text-ivory-500">
				Seeded admin credentials are in your <code class="font-mono">.env</code> file (<code class="font-mono">ADMIN_EMAIL</code>
				/ <code class="font-mono">ADMIN_PASSWORD</code>).
			</p>
		</div>
	</div>
</div>

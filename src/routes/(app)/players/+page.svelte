<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import ConfirmationDialog from '$lib/components/ui/ConfirmationDialog.svelte';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import { toast } from '$lib/stores/toast';
	import { initials } from '$lib/utils/format';
	import type { PageData } from './$types';
	import type { Player } from '$lib/types';

	export let data: PageData;

	$: players = data.players;
	$: meta = data.meta;
	$: filters = data.filters;

	const columns = [
		{ key: 'fullName', label: 'Name', sortable: true },
		{ key: 'chessRating', label: 'Rating', sortable: true, align: 'right' as const },
		{ key: 'country', label: 'Country', sortable: true },
		{ key: 'email', label: 'Email' },
		{ key: 'actions', label: 'Actions', align: 'right' as const }
	];

	function updateQuery(params: Record<string, string | number>) {
		const url = new URL($page.url);
		for (const [key, value] of Object.entries(params)) {
			if (value === '' || value === undefined || value === null) url.searchParams.delete(key);
			else url.searchParams.set(key, String(value));
		}
		goto(url.toString(), { keepFocus: true, noScroll: true });
	}

	function onSearch(e: CustomEvent<{ value: string }>) {
		updateQuery({ search: e.detail.value, page: 1 });
	}

	function onSort(e: CustomEvent<{ key: string }>) {
	const dir =
		filters.sortKey === e.detail.key && filters.sortDir === 'asc'
			? 'desc'
			: 'asc';

	updateQuery({
		sortKey: e.detail.key,
		sortDir: dir
	});
}

// ADD THIS HERE
function handleCountryChange(event: Event) {
	const target = event.currentTarget as HTMLSelectElement;

	updateQuery({
		country: target.value,
		page: 1
	});
}

// --- Create / Edit modal state -----------------------------------------

	// --- Create / Edit modal state ----------------------------------------
	let modalOpen = false;
	let editingPlayer: Player | null = null;
	let saving = false;
	let formErrors: Record<string, string> = {};

	let form = {
		fullName: '',
		email: '',
		country: '',
		age: 25,
		gender: 'OTHER',
		chessRating: 1200,
		phone: ''
	};

	function openCreate() {
		editingPlayer = null;
		form = { fullName: '', email: '', country: '', age: 25, gender: 'OTHER', chessRating: 1200, phone: '' };
		formErrors = {};
		modalOpen = true;
	}

	function openEdit(p: Player) {
		editingPlayer = p;
		form = {
			fullName: p.fullName,
			email: p.email,
			country: p.country,
			age: p.age,
			gender: p.gender,
			chessRating: p.chessRating,
			phone: p.phone ?? ''
		};
		formErrors = {};
		modalOpen = true;
	}

	async function submitForm() {
		saving = true;
		formErrors = {};
		const url = editingPlayer ? `/api/players/${editingPlayer.id}` : '/api/players';
		const method = editingPlayer ? 'PUT' : 'POST';

		const res = await fetch(url, {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(form)
		});
		const body = await res.json();
		saving = false;

		if (!res.ok) {
			formErrors = body.errors ?? {};
			toast.error(body.message ?? 'Something went wrong.');
			return;
		}

		toast.success(editingPlayer ? 'Player updated.' : 'Player created.');
		modalOpen = false;
		await invalidateAll();
	}

	// --- Delete confirmation -------------------------------------------------
	let deleteTarget: Player | null = null;
	let deleting = false;

	async function confirmDelete() {
		if (!deleteTarget) return;
		deleting = true;
		const res = await fetch(`/api/players/${deleteTarget.id}`, { method: 'DELETE' });
		deleting = false;
		if (!res.ok) {
			const body = await res.json();
			toast.error(body.message ?? 'Could not delete player.');
			return;
		}
		toast.success(`${deleteTarget.fullName} was removed.`);
		deleteTarget = null;
		await invalidateAll();
	}
</script>

<svelte:head>
	<title>Players — Chessmaster</title>
</svelte:head>

<div class="space-y-5">
	<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
		<div class="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
			<SearchBar value={filters.search} placeholder="Search by name or email…" on:search={onSearch} />
			<div class="w-full sm:w-48">
				<Select
    name="country"
    value={filters.country}
    placeholder="All countries"
    options={data.countries.map((c) => ({ value: c, label: c }))}
    on:change={handleCountryChange}
/>
			</div>
		</div>
		<Button on:click={openCreate}>+ Add Player</Button>
	</div>

	<Card padded={false}>
		{#if players.length === 0}
			<div class="p-6">
				<EmptyState title="No players found" message="Try a different search or add your first player." icon="♟" />
			</div>
		{:else}
			<Table {columns} sortKey={filters.sortKey} sortDir={filters.sortDir} on:sort={onSort}>
				{#each players as p (p.id)}
					<tr class="hover:bg-ivory-50 dark:hover:bg-ebony-700/40">
						<td class="px-4 py-3">
							<div class="flex items-center gap-2.5">
								<span class="flex h-8 w-8 items-center justify-center rounded-full bg-ebony-900 text-xs font-semibold text-ivory-50 dark:bg-gold-500 dark:text-ebony-950">
									{initials(p.fullName)}
								</span>
								<a href="/players/{p.id}" class="font-medium text-ebony-800 hover:text-gold-600 dark:text-ivory-100 dark:hover:text-gold-400">
									{p.fullName}
								</a>
							</div>
						</td>
						<td class="stat-figure px-4 py-3 text-right text-ebony-700 dark:text-ivory-200">{p.chessRating}</td>
						<td class="px-4 py-3 text-ebony-600 dark:text-ivory-300">{p.country}</td>
						<td class="px-4 py-3 text-ebony-500 dark:text-ivory-400">{p.email}</td>
						<td class="px-4 py-3">
							<div class="flex justify-end gap-1.5">
								<a href="/players/{p.id}" class="rounded-lg px-2 py-1 text-xs font-medium text-ebony-500 hover:bg-ebony-900/5 dark:text-ivory-300">View</a>
								<button class="rounded-lg px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-500/10" on:click={() => openEdit(p)}>
									Edit
								</button>
								<button class="rounded-lg px-2 py-1 text-xs font-medium text-garnet-600 hover:bg-garnet-50 dark:text-garnet-300 dark:hover:bg-garnet-500/10" on:click={() => (deleteTarget = p)}>
									Delete
								</button>
							</div>
						</td>
					</tr>
				{/each}
			</Table>
			<div class="px-2">
				<Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} pageSize={meta.pageSize} on:change={(e) => updateQuery({ page: e.detail.page })} />
			</div>
		{/if}
	</Card>
</div>

<Modal open={modalOpen} title={editingPlayer ? 'Edit Player' : 'Add Player'} on:close={() => (modalOpen = false)}>
	<form class="grid grid-cols-1 gap-4 sm:grid-cols-2" on:submit|preventDefault={submitForm}>
		<div class="sm:col-span-2">
			<Input label="Full name" name="fullName" bind:value={form.fullName} error={formErrors.fullName} required />
		</div>
		<Input label="Email" name="email" type="email" bind:value={form.email} error={formErrors.email} required />
		<Input label="Country" name="country" bind:value={form.country} error={formErrors.country} required />
		<Input label="Age" name="age" type="number" bind:value={form.age} min={5} max={120} error={formErrors.age} required />
		<Select
			label="Gender"
			name="gender"
			bind:value={form.gender}
			options={[
				{ value: 'MALE', label: 'Male' },
				{ value: 'FEMALE', label: 'Female' },
				{ value: 'OTHER', label: 'Other' }
			]}
		/>
		<Input label="Chess rating" name="chessRating" type="number" bind:value={form.chessRating} min={0} max={3500} error={formErrors.chessRating} required />
		<Input label="Phone (optional)" name="phone" bind:value={form.phone} error={formErrors.phone} />

		<div class="sm:col-span-2 mt-2 flex justify-end gap-2">
			<Button type="button" variant="ghost" on:click={() => (modalOpen = false)}>Cancel</Button>
			<Button type="submit" loading={saving}>{editingPlayer ? 'Save changes' : 'Create player'}</Button>
		</div>
	</form>
</Modal>

<ConfirmationDialog
	open={!!deleteTarget}
	title="Delete player"
	message={deleteTarget ? `This will permanently remove ${deleteTarget.fullName} and their match history.` : ''}
	confirmLabel="Delete"
	loading={deleting}
	on:cancel={() => (deleteTarget = null)}
	on:confirm={confirmDelete}
/>

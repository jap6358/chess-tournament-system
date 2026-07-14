<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import ConfirmationDialog from '$lib/components/ui/ConfirmationDialog.svelte';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import { toast } from '$lib/stores/toast';
	import { formatDate, statusColor } from '$lib/utils/format';
	import type { PageData } from './$types';
	import type { Tournament } from '$lib/types';

	export let data: PageData;

	$: tournaments = data.tournaments;
	$: meta = data.meta;
	$: filters = data.filters;

	function updateQuery(params: Record<string, string | number>) {
		const url = new URL($page.url);
		for (const [key, value] of Object.entries(params)) {
			if (value === '' || value === undefined || value === null) url.searchParams.delete(key);
			else url.searchParams.set(key, String(value));
		}
		goto(url.toString(), { keepFocus: true, noScroll: true });
	}

	function handleStatusChange(event: Event) {
	const target = event.currentTarget as HTMLSelectElement;

	updateQuery({
		status: target.value,
		page: 1
	});
}

	type TournamentRow = Tournament & { _count?: { players: number; matches: number } };

	// --- Create / Edit modal -------------------------------------------------
	let modalOpen = false;
	let editing: TournamentRow | null = null;
	let saving = false;
	let formErrors: Record<string, string> = {};

	let form = {
		name: '',
		description: '',
		location: '',
		date: '',
		status: 'UPCOMING',
		maximumPlayers: 16
	};

	function toDateInputValue(d: Date | string) {
		return new Date(d).toISOString().slice(0, 10);
	}

	function openCreate() {
		editing = null;
		form = { name: '', description: '', location: '', date: '', status: 'UPCOMING', maximumPlayers: 16 };
		formErrors = {};
		modalOpen = true;
	}

	function openEdit(t: TournamentRow) {
		editing = t;
		form = {
			name: t.name,
			description: t.description ?? '',
			location: t.location,
			date: toDateInputValue(t.date),
			status: t.status,
			maximumPlayers: t.maximumPlayers
		};
		formErrors = {};
		modalOpen = true;
	}

	async function submitForm() {
		saving = true;
		formErrors = {};
		const url = editing ? `/api/tournaments/${editing.id}` : '/api/tournaments';
		const method = editing ? 'PUT' : 'POST';

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

		toast.success(editing ? 'Tournament updated.' : 'Tournament created.');
		modalOpen = false;
		await invalidateAll();
	}

	// --- Delete ---------------------------------------------------------------
	let deleteTarget: TournamentRow | null = null;
	let deleting = false;

	async function confirmDelete() {
		if (!deleteTarget) return;
		deleting = true;
		const res = await fetch(`/api/tournaments/${deleteTarget.id}`, { method: 'DELETE' });
		deleting = false;
		if (!res.ok) {
			const body = await res.json();
			toast.error(body.message ?? 'Could not delete tournament.');
			return;
		}
		toast.success(`${deleteTarget.name} was removed.`);
		deleteTarget = null;
		await invalidateAll();
	}
</script>

<svelte:head>
	<title>Tournaments — Chessmaster</title>
</svelte:head>

<div class="space-y-5">
	<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
		<div class="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
			<SearchBar value={filters.search} placeholder="Search tournaments…" on:search={(e) => updateQuery({ search: e.detail.value, page: 1 })} />
			<div class="w-full sm:w-48">
				<Select
	name="status"
	value={filters.status}
	placeholder="All statuses"
	options={[
		{ value: 'UPCOMING', label: 'Upcoming' },
		{ value: 'ONGOING', label: 'Ongoing' },
		{ value: 'COMPLETED', label: 'Completed' }
	]}
	on:change={handleStatusChange}
/>
			</div>
		</div>
		<Button on:click={openCreate}>+ New Tournament</Button>
	</div>

	{#if tournaments.length === 0}
		<Card><EmptyState title="No tournaments found" message="Create your first tournament to get started." icon="♜" /></Card>
	{:else}
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
			{#each tournaments as t (t.id)}
				<Card>
					<div class="flex items-start justify-between gap-2">
						<h3 class="font-display text-base font-semibold text-ebony-900 dark:text-ivory-50">{t.name}</h3>
						<Badge tone={statusColor(t.status)}>{t.status}</Badge>
					</div>
					<p class="mt-1 text-sm text-ebony-400 dark:text-ivory-400">{t.location} · {formatDate(t.date)}</p>
					{#if t.description}
						<p class="mt-2 line-clamp-2 text-sm text-ebony-500 dark:text-ivory-300">{t.description}</p>
					{/if}
					<div class="mt-4 flex items-center gap-4 text-xs text-ebony-400 dark:text-ivory-400">
						<span>{t._count?.players ?? 0}/{t.maximumPlayers} players</span>
						<span>{t._count?.matches ?? 0} matches</span>
					</div>
					<div class="mt-4 flex items-center justify-between border-t border-ebony-100 pt-3 dark:border-ebony-700">
						<a href="/tournaments/{t.id}" class="text-sm font-medium text-gold-600 hover:underline dark:text-gold-400">
							Open →
						</a>
						<div class="flex gap-1.5">
							<button class="rounded-lg px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-500/10" on:click={() => openEdit(t)}>
								Edit
							</button>
							<button class="rounded-lg px-2 py-1 text-xs font-medium text-garnet-600 hover:bg-garnet-50 dark:text-garnet-300 dark:hover:bg-garnet-500/10" on:click={() => (deleteTarget = t)}>
								Delete
							</button>
						</div>
					</div>
				</Card>
			{/each}
		</div>
		<Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} pageSize={meta.pageSize} on:change={(e) => updateQuery({ page: e.detail.page })} />
	{/if}
</div>

<Modal open={modalOpen} title={editing ? 'Edit Tournament' : 'New Tournament'} on:close={() => (modalOpen = false)}>
	<form class="grid grid-cols-1 gap-4 sm:grid-cols-2" on:submit|preventDefault={submitForm}>
		<div class="sm:col-span-2">
			<Input label="Tournament name" name="name" bind:value={form.name} error={formErrors.name} required />
		</div>
		<div class="sm:col-span-2">
			<Input label="Description (optional)" name="description" bind:value={form.description} />
		</div>
		<Input label="Location" name="location" bind:value={form.location} error={formErrors.location} required />
		<Input label="Date" name="date" type="date" bind:value={form.date} error={formErrors.date} required />
		<Select
			label="Status"
			name="status"
			bind:value={form.status}
			options={[
				{ value: 'UPCOMING', label: 'Upcoming' },
				{ value: 'ONGOING', label: 'Ongoing' },
				{ value: 'COMPLETED', label: 'Completed' }
			]}
		/>
		<Input label="Maximum players" name="maximumPlayers" type="number" min={2} max={256} bind:value={form.maximumPlayers} error={formErrors.maximumPlayers} required />

		<div class="sm:col-span-2 mt-2 flex justify-end gap-2">
			<Button type="button" variant="ghost" on:click={() => (modalOpen = false)}>Cancel</Button>
			<Button type="submit" loading={saving}>{editing ? 'Save changes' : 'Create tournament'}</Button>
		</div>
	</form>
</Modal>

<ConfirmationDialog
	open={!!deleteTarget}
	title="Delete tournament"
	message={deleteTarget ? `This will permanently remove "${deleteTarget.name}" along with its registrations and matches.` : ''}
	confirmLabel="Delete"
	loading={deleting}
	on:cancel={() => (deleteTarget = null)}
	on:confirm={confirmDelete}
/>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';
	import Button from './Button.svelte';

	export let open = false;
	export let title = 'Are you sure?';
	export let message = 'This action cannot be undone.';
	export let confirmLabel = 'Confirm';
	export let danger = true;
	export let loading = false;

	const dispatch = createEventDispatcher<{ confirm: void; cancel: void }>();
</script>

<Modal {open} {title} size="sm" on:close={() => dispatch('cancel')}>
	<p class="text-sm text-ebony-600 dark:text-ivory-300">{message}</p>
	<div class="mt-6 flex justify-end gap-2">
		<Button variant="ghost" on:click={() => dispatch('cancel')}>Cancel</Button>
		<Button variant={danger ? 'danger' : 'primary'} {loading} on:click={() => dispatch('confirm')}>
			{confirmLabel}
		</Button>
	</div>
</Modal>

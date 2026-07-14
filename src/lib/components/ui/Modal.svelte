<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let open = false;
	export let title = '';
	export let size: 'sm' | 'md' | 'lg' = 'md';

	const dispatch = createEventDispatcher<{ close: void }>();

	const sizes: Record<string, string> = {
		sm: 'max-w-sm',
		md: 'max-w-lg',
		lg: 'max-w-2xl'
	};

	function close() {
		dispatch('close');
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}
</script>

<svelte:window on:keydown={open ? onKeydown : undefined} />

{#if open}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<button
			aria-label="Close dialog"
			class="absolute inset-0 bg-ebony-950/50 backdrop-blur-sm animate-fade-in"
			on:click={close}
		/>
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			class="relative z-10 w-full {sizes[size]} animate-fade-in rounded-2xl bg-white p-6 shadow-popover dark:bg-ebony-800"
		>
			<div class="mb-4 flex items-start justify-between gap-4">
				<h2 id="modal-title" class="font-display text-lg font-semibold text-ebony-900 dark:text-ivory-50">
					{title}
				</h2>
				<button
					aria-label="Close"
					class="rounded-lg p-1 text-ebony-400 hover:bg-ebony-900/5 hover:text-ebony-700 dark:text-ivory-400 dark:hover:bg-ivory-100/10"
					on:click={close}
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
			<div class="max-h-[70vh] overflow-y-auto">
				<slot />
			</div>
		</div>
	</div>
{/if}

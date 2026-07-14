<script lang="ts">
	import { toast } from '$lib/stores/toast';

	const icons: Record<string, string> = {
		success: '✓',
		error: '✕',
		info: 'ℹ',
		warning: '!'
	};

	const tones: Record<string, string> = {
		success: 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300',
		error: 'border-garnet-300 bg-garnet-50 text-garnet-800 dark:bg-garnet-500/10 dark:text-garnet-300',
		info: 'border-ebony-200 bg-ivory-50 text-ebony-800 dark:bg-ebony-700 dark:text-ivory-100',
		warning: 'border-gold-300 bg-gold-50 text-gold-800 dark:bg-gold-500/10 dark:text-gold-300'
	};
</script>

<div class="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4">
	{#each $toast as t (t.id)}
		<div
			class="pointer-events-auto flex w-full max-w-sm animate-toast-in items-center gap-3 rounded-xl border px-4 py-3 shadow-popover {tones[t.type]}"
			role="alert"
		>
			<span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-current/10 text-xs font-bold">
				{icons[t.type]}
			</span>
			<p class="flex-1 text-sm">{t.message}</p>
			<button
				class="text-current/60 hover:text-current"
				aria-label="Dismiss notification"
				on:click={() => toast.dismiss(t.id)}
			>
				✕
			</button>
		</div>
	{/each}
</div>

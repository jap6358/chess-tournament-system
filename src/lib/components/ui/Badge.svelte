<script lang="ts">
	export let tone: 'gold' | 'emerald' | 'garnet' | 'ebony' | 'neutral' = 'neutral';

	const tones: Record<string, string> = {
		gold: 'bg-gold-100 text-gold-700 dark:bg-gold-500/15 dark:text-gold-300',
		emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
		garnet: 'bg-garnet-100 text-garnet-700 dark:bg-garnet-500/15 dark:text-garnet-300',
		ebony: 'bg-ebony-800 text-ivory-50 dark:bg-ivory-100/10 dark:text-ivory-100',
		neutral: 'bg-ivory-200 text-ebony-600 dark:bg-ebony-700 dark:text-ivory-300'
	};
</script>

<span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium {tones[tone]}">
	<slot />
</span>

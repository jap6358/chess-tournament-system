<script lang="ts">
	export let label = 'Loading…';
	export let size: 'sm' | 'md' | 'lg' = 'md';

	const sizes: Record<string, string> = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-9 w-9' };
</script>

<div class="flex items-center justify-center gap-2 py-8 text-ebony-400 dark:text-ivory-400" role="status">
	<span class="{sizes[size]} animate-spin rounded-full border-2 border-current border-t-transparent" />
	<span class="text-sm">{label}</span>
</div>

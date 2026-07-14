<script lang="ts">
	export let variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let disabled = false;
	export let loading = false;
	export let fullWidth = false;
	let className = '';
	export { className as class };

	const variants: Record<string, string> = {
		primary: 'bg-ebony-900 text-ivory-50 hover:bg-ebony-700 dark:bg-gold-500 dark:text-ebony-950 dark:hover:bg-gold-300',
		secondary:
			'bg-ivory-200 text-ebony-800 hover:bg-ivory-300 dark:bg-ebony-700 dark:text-ivory-100 dark:hover:bg-ebony-600',
		ghost: 'bg-transparent text-ebony-700 hover:bg-ebony-900/5 dark:text-ivory-200 dark:hover:bg-ivory-100/10',
		danger: 'bg-garnet-500 text-ivory-50 hover:bg-garnet-600'
	};

	const sizes: Record<string, string> = {
		sm: 'text-xs px-3 py-1.5',
		md: 'text-sm px-4 py-2',
		lg: 'text-base px-5 py-2.5'
	};
</script>

<button
	{type}
	disabled={disabled || loading}
	class="btn {variants[variant]} {sizes[size]} {fullWidth ? 'w-full' : ''} {className}"
	on:click
>
	{#if loading}
		<span class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
	{/if}
	<slot />
</button>

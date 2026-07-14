<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { debounce } from '$lib/utils/format';

	export let value = '';
	export let placeholder = 'Search…';

	const dispatch = createEventDispatcher<{ search: { value: string } }>();
	const emit = debounce((v: string) => dispatch('search', { value: v }), 300);

	function onInput(e: Event) {
		value = (e.target as HTMLInputElement).value;
		emit(value);
	}
</script>

<div class="relative w-full max-w-sm">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ebony-300 dark:text-ivory-400/60"
	>
		<circle cx="11" cy="11" r="7" />
		<path stroke-linecap="round" d="m21 21-4.35-4.35" />
	</svg>
	<input
		type="search"
		{placeholder}
		{value}
		on:input={onInput}
		aria-label={placeholder}
		class="w-full rounded-xl border border-ebony-100 bg-white py-2 pl-9 pr-3 text-sm text-ebony-900 placeholder:text-ebony-300 focus:border-gold-500 dark:border-ebony-600 dark:bg-ebony-700 dark:text-ivory-50 dark:placeholder:text-ivory-400/40"
	/>
</div>

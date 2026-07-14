<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let label = '';
	export let name = '';
	export let value = '';
	export let options: { value: string; label: string }[] = [];
	export let error = '';
	export let required = false;
	export let placeholder = '';

	const dispatch = createEventDispatcher();

	const id = `select-${name || Math.random().toString(36).slice(2, 8)}`;

	function handleChange(event: Event) {
		dispatch('change', event);
	}
</script>

<div class="w-full">
	{#if label}
		<label
			for={id}
			class="mb-1.5 block text-sm font-medium text-ebony-700 dark:text-ivory-200"
		>
			{label}
			{#if required}
				<span class="text-garnet-500"> *</span>
			{/if}
		</label>
	{/if}

	<select
		id={id}
		name={name}
		bind:value
		required={required}
		aria-invalid={!!error}
		on:change={handleChange}
		class="w-full rounded-xl border bg-white px-3.5 py-2 text-sm text-ebony-900 focus:border-gold-500 dark:bg-ebony-700 dark:text-ivory-50 {error ? 'border-garnet-400' : 'border-ebony-100 dark:border-ebony-600'}"
	>
		{#if placeholder}
			<option value="">{placeholder}</option>
		{/if}

		{#each options as option}
			<option value={option.value}>
				{option.label}
			</option>
		{/each}
	</select>

	{#if error}
		<p class="mt-1 text-xs text-garnet-500">
			{error}
		</p>
	{/if}
</div>
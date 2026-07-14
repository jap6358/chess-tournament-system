<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let label = '';
	export let name = '';
	export let type = 'text';
	export let value: string | number = '';
	export let placeholder = '';
	export let error = '';
	export let required = false;
	export let disabled = false;
	export let min: number | undefined = undefined;
	export let max: number |undefined = undefined;
	export let step: number | undefined = undefined;
	export let hint = '';

	const dispatch = createEventDispatcher();

	const id = `field-${name || Math.random().toString(36).slice(2, 8)}`;

	$: inputClass = `
	w-full rounded-xl border bg-white px-3.5 py-2 text-sm
	text-ebony-900 placeholder:text-ebony-300
	focus:border-gold-500
	dark:bg-ebony-700
	dark:text-ivory-50
	dark:placeholder:text-ivory-400/40
	${error ? 'border-garnet-400' : 'border-ebony-100 dark:border-ebony-600'}
`;

	function handleInput(event: Event) {
		dispatch('input', event);
	}

	function handleChange(event: Event) {
		dispatch('change', event);
	}

	function handleBlur(event: Event) {
		dispatch('blur', event);
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
				<span class="text-garnet-500">*</span>
			{/if}
		</label>
	{/if}

	{#if type === 'number'}
    <input
        id={id}
        name={name}
        type="number"
        bind:value
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        on:input={handleInput}
        on:change={handleChange}
        on:blur={handleBlur}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        class={inputClass}
    />

{:else if type === 'password'}
    <input
        id={id}
        name={name}
        type="password"
        bind:value
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        on:input={handleInput}
        on:change={handleChange}
        on:blur={handleBlur}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        class={inputClass}
    />

{:else if type === 'email'}
    <input
        id={id}
        name={name}
        type="email"
        bind:value
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        on:input={handleInput}
        on:change={handleChange}
        on:blur={handleBlur}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        class={inputClass}
    />

{:else}
    <input
        id={id}
        name={name}
        type="text"
        bind:value
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        on:input={handleInput}
        on:change={handleChange}
        on:blur={handleBlur}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        class={inputClass}
    />
{/if}



	{#if error}
		<p id={`${id}-error`} class="mt-1 text-xs text-garnet-500">
			{error}
		</p>
	{:else if hint}
		<p id={`${id}-hint`} class="mt-1 text-xs text-ebony-400 dark:text-ivory-400/70">
			{hint}
		</p>
	{/if}
</div>
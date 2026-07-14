<script lang="ts">
	export let padded = true;
	let className = '';
	export { className as class };
</script>

<div class="surface {padded ? 'p-5' : ''} {className}">
	<slot />
</div>

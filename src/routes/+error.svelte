<script lang="ts">
	import { page } from '$app/stores';

	$: status = $page.status;
	$: isNotFound = status === 404;
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-4 bg-ivory-100 px-6 text-center dark:bg-ebony-950">
	<span class="font-display text-6xl font-bold text-gold-500">
		{isNotFound ? '404' : status}
	</span>
	<h1 class="font-display text-2xl font-semibold text-ebony-900 dark:text-ivory-50">
		{isNotFound ? 'This square is empty' : 'Something went wrong on our board'}
	</h1>
	<p class="max-w-md text-sm text-ebony-500 dark:text-ivory-400">
		{isNotFound
			? "The page you're looking for has moved, or never existed."
			: ($page.error?.message ?? 'An unexpected error occurred. Please try again.')}
	</p>
	<a
		href="/dashboard"
		class="btn bg-ebony-900 px-5 py-2.5 text-sm font-medium text-ivory-50 hover:bg-ebony-700 dark:bg-gold-500 dark:text-ebony-950 dark:hover:bg-gold-300"
	>
		Back to dashboard
	</a>
</div>

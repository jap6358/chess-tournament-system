<script lang="ts">
	export let data: { name: string; value: number }[] = [];
	export let barColor = '#C9A227';
	export let height = 220;
	export let valueSuffix = '';

	$: max = Math.max(1, ...data.map((d) => d.value));
	$: barWidth = data.length > 0 ? Math.min(56, 480 / data.length - 12) : 40;
</script>

<div class="w-full overflow-x-auto">
	<svg
		viewBox="0 0 {Math.max(320, data.length * (barWidth + 24) + 24)} {height}"
		class="w-full"
		style="height: {height}px"
		role="img"
		aria-label="Bar chart"
	>
		{#each data as d, i (d.name)}
			{@const barHeight = (d.value / max) * (height - 48)}
			{@const x = i * (barWidth + 24) + 16}
			<g>
				<rect
					x={x}
					y={height - 28 - barHeight}
					width={barWidth}
					height={Math.max(barHeight, 2)}
					rx="6"
					fill={barColor}
					opacity={0.9}
				/>
				<text
					x={x + barWidth / 2}
					y={height - 28 - barHeight - 8}
					text-anchor="middle"
					class="fill-ebony-600 dark:fill-ivory-300"
					font-size="11"
					font-family="IBM Plex Mono, monospace"
				>
					{d.value}{valueSuffix}
				</text>
				<text
					x={x + barWidth / 2}
					y={height - 10}
					text-anchor="middle"
					class="fill-ebony-400 dark:fill-ivory-400"
					font-size="10"
				>
					{d.name.length > 10 ? d.name.slice(0, 9) + '…' : d.name}
				</text>
			</g>
		{/each}
	</svg>
</div>

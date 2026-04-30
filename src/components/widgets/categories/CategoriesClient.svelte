<script lang="ts">
	import I18nKey from "@/i18n/i18nKey";
	import { i18n } from "@/i18n/translation";
	import { getCategoryUrl } from "@/utils/url-utils";

	interface CategoryItem {
		name: string;
		count: number;
		url: string;
	}

	interface Props {
		initialCategories?: CategoryItem[];
	}

	const { initialCategories = [] }: Props = $props();
	let categories = $state<CategoryItem[]>([]);

	$effect(() => {
		categories = initialCategories;
	});
</script>

{#if categories.length > 0}
	{#each categories as category (category.name)}
		<a
			href={category.url}
			aria-label={`View all posts in the ${category.name} category`}
		>
			<button
				class="w-full h-10 rounded-lg bg-none hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)] transition-all pl-2 hover:pl-3 text-neutral-700 hover:text-[var(--primary)] dark:text-neutral-300 dark:hover:text-[var(--primary)]"
			>
				<div class="flex items-center justify-between relative mr-2">
					<div
						class="overflow-hidden text-left whitespace-nowrap overflow-ellipsis"
					>
						{category.name}
					</div>
					<div
						class="transition px-2 h-7 ml-4 min-w-[2rem] rounded-lg text-sm font-bold text-[var(--btn-content)] dark:text-[var(--deep-text)] bg-[oklch(0.95_0.025_var(--hue))] dark:bg-[var(--primary)] flex items-center justify-center"
					>
						{category.count}
					</div>
				</div>
			</button>
		</a>
	{/each}
{:else}
	<div class="px-2 py-2 text-sm text-black/40 dark:text-white/40">
		{i18n(I18nKey.noData)}
	</div>
{/if}

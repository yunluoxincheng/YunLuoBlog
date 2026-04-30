<script lang="ts">
	import I18nKey from "@/i18n/i18nKey";
	import { i18n } from "@/i18n/translation";
	import { getTagUrl } from "@/utils/url-utils";

	interface TagItem {
		name: string;
		count: number;
		url?: string;
	}

	interface Props {
		initialTags?: TagItem[];
	}

	const { initialTags = [] }: Props = $props();
	let tags = $state<TagItem[]>([]);

	$effect(() => {
		tags = initialTags.map((item) => ({
			name: item.name,
			count: item.count,
			url: item.url || getTagUrl(item.name),
		}));
	});
</script>

{#if tags.length > 0}
	<div class="flex gap-2 flex-wrap">
		{#each tags as tag (tag.name)}
			<a
				href={tag.url || getTagUrl(tag.name)}
				aria-label={`View all posts with the ${tag.name} tag`}
				class="btn-regular h-8 text-sm px-3 rounded-lg"
			>
				{tag.name}
			</a>
		{/each}
	</div>
{:else}
	<div class="px-2 py-2 text-sm text-black/40 dark:text-white/40">
		{i18n(I18nKey.noData)}
	</div>
{/if}

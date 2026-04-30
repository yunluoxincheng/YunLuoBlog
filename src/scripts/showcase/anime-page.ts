import localAnimeList, { type AnimeItem as LocalAnimeItem } from "@/data/anime";

interface AnimeViewModel {
	title: string;
	status: string;
	rating: number;
	cover: string;
	description: string;
	episodes: string;
	year: string;
	genre: string[];
	studio: string;
	link: string;
	progress: number;
	totalEpisodes: number;
}

export interface AnimePageOptions {
	yearLabel: string;
	studioLabel: string;
	emptyText: string;
	loadingText: string;
	errorText: string;
	retryText: string;
	statusTextMap: Record<string, string>;
	fallbackAnime?: LocalAnimeItem[];
}

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function normalizeStatus(status: string): string {
	const normalized = status.toLowerCase().trim();
	if (normalized === "on-hold" || normalized === "on_hold") {
		return "onhold";
	}
	return normalized;
}

function normalizeFallbackAnime(item: LocalAnimeItem): AnimeViewModel {
	return {
		title: item.title,
		status: normalizeStatus(item.status),
		rating: Number(item.rating) || 0,
		cover: item.cover,
		description: item.description,
		episodes: item.episodes,
		year: item.year,
		genre: Array.isArray(item.genre) ? item.genre : [],
		studio: item.studio,
		link: item.link,
		progress: Number(item.progress) || 0,
		totalEpisodes: Number(item.totalEpisodes) || 0,
	};
}

function getStatusVisual(status: string): { className: string; icon: string } {
	switch (status) {
		case "watching":
			return {
				className:
					"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
				icon: "▶",
			};
		case "completed":
			return {
				className:
					"bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
				icon: "✓",
			};
		case "planned":
			return {
				className:
					"bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
				icon: "❤",
			};
		case "onhold":
			return {
				className:
					"bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
				icon: "⏸",
			};
		case "dropped":
			return {
				className:
					"bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
				icon: "✗",
			};
		default:
			return {
				className: "bg-[var(--btn-regular-bg)] text-black/70 dark:text-white/70",
				icon: "•",
			};
	}
}

function renderAnimeCard(
	item: AnimeViewModel,
	options: AnimePageOptions,
): string {
	const statusText =
		options.statusTextMap[item.status] ??
		options.statusTextMap.default ??
		item.status;
	const statusVisual = getStatusVisual(item.status);
	const genresHtml = item.genre
		.map(
			(genre) =>
				`<span class="px-1.5 py-0.5 bg-[var(--btn-regular-bg)] text-black/70 dark:text-white/70 rounded text-xs">${escapeHtml(genre)}</span>`,
		)
		.join("");
	const progressPercent =
		item.totalEpisodes > 0
			? Math.round((item.progress / item.totalEpisodes) * 100)
			: 0;
	const progressHtml =
		item.status === "watching" && item.totalEpisodes > 0
			? `<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2"><div class="w-full bg-white/20 rounded-full h-1.5 mb-1"><div class="bg-gradient-to-r from-emerald-400 to-teal-400 h-1.5 rounded-full" style="width:${progressPercent}%"></div></div><div class="text-white text-xs font-medium">${item.progress}/${item.totalEpisodes} (${progressPercent}%)</div></div>`
			: "";

	return `<div class="group relative bg-[var(--card-bg)] border border-[var(--line-divider)] rounded-[var(--radius-large)] overflow-hidden hover:shadow-lg" data-anime-status="${escapeHtml(item.status)}"><div class="relative anime-cover-container aspect-[2/3] overflow-hidden"><a href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer" class="block w-full h-full"><img src="${escapeHtml(item.cover)}" alt="${escapeHtml(item.title)}" class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110" loading="lazy"/></a><div class="absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-medium ${statusVisual.className}"><span class="mr-1">${statusVisual.icon}</span><span>${escapeHtml(statusText)}</span></div><div class="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1"><span>★</span><span>${item.rating}</span></div>${progressHtml}</div><div class="p-3"><h3 class="text-sm font-bold text-black/90 dark:text-white/90 mb-1 leading-tight">${escapeHtml(item.title)}</h3><p class="text-black/60 dark:text-white/60 text-xs mb-2 line-clamp-2" title="${escapeHtml(item.description)}">${escapeHtml(item.description)}</p><div class="space-y-1 text-xs"><div class="flex justify-between items-center"><span class="text-black/50 dark:text-white/50 shrink-0">${escapeHtml(options.yearLabel)}</span><span class="text-black/70 dark:text-white/70 truncate ml-2 text-right">${escapeHtml(item.year)}</span></div><div class="flex justify-between items-start"><span class="text-black/50 dark:text-white/50 shrink-0 mt-0.5">${escapeHtml(options.studioLabel)}</span><span class="text-black/70 dark:text-white/70 text-right ml-2 line-clamp-2 break-words" title="${escapeHtml(item.studio)}">${escapeHtml(item.studio)}</span></div><div class="flex flex-wrap gap-1 mt-2">${genresHtml}</div></div></div></div>`;
}

export function initAnimeApiPage(options: AnimePageOptions): void {
	const root = document.getElementById("anime-page-root");
	if (!root || root.dataset.apiBound === "true") {
		return;
	}
	root.dataset.apiBound = "true";

	const listContainer = document.getElementById("anime-list-container");
	const loadingState = document.getElementById("anime-loading");
	const errorState = document.getElementById("anime-error");
	const errorText = document.getElementById("anime-error-text");
	const retryButton = document.getElementById("anime-retry");
	const emptyState = document.getElementById("anime-empty");
	const emptyText = document.getElementById("anime-empty-text");
	const filterTags = Array.from(
		document.querySelectorAll<HTMLButtonElement>(".anime-filter-tag"),
	);

	if (
		!listContainer ||
		!loadingState ||
		!errorState ||
		!errorText ||
		!retryButton ||
		!emptyState ||
		!emptyText
	) {
		return;
	}

	let animeItems: AnimeViewModel[] = [];
	let currentStatus = "all";
	const fallbackAnime = (options.fallbackAnime ?? localAnimeList).map(
		normalizeFallbackAnime,
	);

	const showLoadingState = () => {
		loadingState.classList.remove("hidden");
		errorState.classList.add("hidden");
		emptyState.classList.add("hidden");
		listContainer.classList.add("hidden");
	};

	const showErrorState = () => {
		loadingState.classList.add("hidden");
		errorState.classList.remove("hidden");
		emptyState.classList.add("hidden");
		listContainer.classList.add("hidden");
	};

	const showEmptyState = () => {
		loadingState.classList.add("hidden");
		errorState.classList.add("hidden");
		emptyState.classList.remove("hidden");
		listContainer.classList.add("hidden");
	};

	const showContentState = () => {
		loadingState.classList.add("hidden");
		errorState.classList.add("hidden");
		emptyState.classList.add("hidden");
		listContainer.classList.remove("hidden");
	};

	const renderList = () => {
		const filteredList =
			currentStatus === "all"
				? animeItems
				: animeItems.filter((item) => item.status === currentStatus);

		if (filteredList.length === 0) {
			showEmptyState();
			return;
		}

		listContainer.innerHTML = filteredList
			.map((item) => renderAnimeCard(item, options))
			.join("");
		showContentState();
	};

	for (const filterTag of filterTags) {
		filterTag.addEventListener("click", () => {
			const status = filterTag.dataset.status ?? "all";
			if (status === currentStatus) {
				return;
			}

			for (const tag of filterTags) {
				tag.classList.remove("anime-active");
			}
			filterTag.classList.add("anime-active");
			currentStatus = status;
			renderList();
		});
	}

	const loadAnime = async () => {
		showLoadingState();
		errorText.textContent = options.errorText;
		retryButton.textContent = options.retryText;
		emptyText.textContent = options.emptyText;

		animeItems = fallbackAnime;

		if (animeItems.length === 0) {
			showErrorState();
			return;
		}

		renderList();
	};

	retryButton.addEventListener("click", () => {
		void loadAnime();
	});

	loadingState.setAttribute("aria-label", options.loadingText);
	void loadAnime();
}

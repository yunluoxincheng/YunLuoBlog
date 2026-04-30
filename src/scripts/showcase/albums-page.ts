import { albumsData } from "@/data/albums";
import { initFancybox } from "@/scripts/handlers/fancybox-handler";
import type { AlbumGroup, Photo } from "@/types/album";

export interface AlbumsListPageOptions {
	fallbackAlbums?: AlbumGroup[];
	filterAllText: string;
	noResultsText: string;
	loadingText: string;
	errorText: string;
	retryText: string;
	emptyTitleText: string;
	emptyDescText: string;
	photosCountText: string;
}

export interface AlbumDetailPageOptions {
	fallbackAlbums?: AlbumGroup[];
	loadingText: string;
	errorText: string;
	retryText: string;
	emptyTitleText: string;
	emptyDescText: string;
	backToListText: string;
	photosCountText: string;
	notFoundText: string;
}

function normalizeString(value: unknown): string {
	if (typeof value !== "string") {
		return "";
	}

	return value.trim();
}

function normalizeStringArray(value: unknown): string[] {
	if (!Array.isArray(value)) {
		return [];
	}

	return value
		.map((item) => normalizeString(item))
		.filter((item) => item.length > 0);
}

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function encodePathSegment(value: string): string {
	return encodeURIComponent(value);
}

function normalizeFallbackAlbum(album: AlbumGroup): AlbumGroup {
	return {
		id: normalizeString(album.id),
		title: normalizeString(album.title),
		description: normalizeString(album.description),
		cover: normalizeString(album.cover),
		date: normalizeString(album.date) || new Date().toISOString().split("T")[0],
		location: normalizeString(album.location) || undefined,
		tags: normalizeStringArray(album.tags),
		photos: (Array.isArray(album.photos) ? album.photos : [])
			.map((photo, index) => ({
				id: normalizeString(photo.id) || `${normalizeString(album.id)}-photo-${index}`,
				src: normalizeString(photo.src),
				thumbnail: normalizeString(photo.thumbnail) || undefined,
				alt: normalizeString(photo.alt) || undefined,
				title: normalizeString(photo.title) || undefined,
				description: normalizeString(photo.description) || undefined,
				tags: normalizeStringArray(photo.tags),
				date: normalizeString(photo.date) || undefined,
				location: normalizeString(photo.location) || undefined,
				width: typeof photo.width === "number" ? photo.width : undefined,
				height: typeof photo.height === "number" ? photo.height : undefined,
			}))
			.filter((photo) => photo.src.length > 0),
	};
}

function sortAlbums(input: AlbumGroup[]): AlbumGroup[] {
	return [...input].sort((left, right) => {
		const leftTime = new Date(left.date).getTime();
		const rightTime = new Date(right.date).getTime();
		if (Number.isNaN(leftTime) || Number.isNaN(rightTime)) {
			return left.title.localeCompare(right.title, "zh-CN");
		}
		return rightTime - leftTime;
	});
}

function formatDisplayDate(dateValue: string): string {
	const parsedDate = new Date(dateValue);
	if (Number.isNaN(parsedDate.getTime())) {
		return dateValue;
	}

	return parsedDate.toLocaleDateString("zh-CN");
}

function renderTags(tags: string[]): string {
	if (tags.length === 0) {
		return "";
	}

	return `<div class="flex flex-wrap gap-1 mt-2">${tags
		.slice(0, 4)
		.map(
			(tag) =>
				`<span class="text-[0.6rem] px-1.5 py-0.5 rounded bg-white/20 text-white/90 backdrop-blur-sm">${escapeHtml(tag)}</span>`,
		)
		.join("")}</div>`;
}

function renderAlbumCard(album: AlbumGroup, photosCountText: string): string {
	const tags = Array.isArray(album.tags) ? album.tags : [];
	const locationHtml = album.location
		? `<span class="inline-flex items-center gap-0.5"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>${escapeHtml(album.location)}</span>`
		: "";
	const descriptionHtml = normalizeString(album.description)
		? `<p class="text-xs text-white/75 line-clamp-1 mt-1 leading-relaxed" title="${escapeHtml(normalizeString(album.description))}">${escapeHtml(normalizeString(album.description))}</p>`
		: "";
	const coverHtml = normalizeString(album.cover)
		? `<img src="${escapeHtml(normalizeString(album.cover))}" alt="${escapeHtml(album.title)}" class="w-full h-full object-cover pointer-events-none transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async"/>`
		: `<div class="w-full h-full bg-[var(--btn-regular-bg)] flex items-center justify-center"><svg class="w-14 h-14 text-black/20 dark:text-white/20" viewBox="0 0 24 24" fill="currentColor"><path d="M22 20.59l-4.69-4.69a2 2 0 00-2.82 0L13 17.39l-3.79-3.79a2 2 0 00-2.82 0L2 18.99V5a2 2 0 012-2h16a2 2 0 012 2v15.59zM8.5 11A2.5 2.5 0 1011 8.5 2.5 2.5 0 008.5 11z"/></svg></div>`;

	return `<a href="/albums/${encodePathSegment(album.id)}/" data-tags="${escapeHtml(tags.join(","))}" class="album-card group relative block overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"><div class="aspect-4/3 relative overflow-hidden">${coverHtml}<div class="absolute top-2 right-2 px-2 py-1 rounded-full text-xs text-white font-medium bg-black/50 backdrop-blur-sm">${album.photos.length}${escapeHtml(photosCountText)}</div><div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div><div class="absolute bottom-0 left-0 right-0 p-4"><h3 class="font-bold text-base text-white line-clamp-1 drop-shadow-lg">${escapeHtml(album.title)}</h3>${descriptionHtml}<div class="flex items-center gap-3 text-xs text-white/70 mt-1.5 flex-wrap"><span>${escapeHtml(formatDisplayDate(album.date))}</span>${locationHtml}</div>${renderTags(tags)}</div></div></a>`;
}

function renderFilterButton(
	value: string,
	label: string,
	count: number,
	activeValue: string,
): string {
	return `<button class="filter-tabs-item ${value === activeValue ? "active" : ""}" data-filter-value="${escapeHtml(value)}" data-filter-attr="tags"><span>${escapeHtml(label)}</span><span class="filter-tabs-count">(${count})</span></button>`;
}

function getAlbumIdFromPath(pathname: string): string {
	const normalizedPath = pathname.split("?")[0].replace(/\/+$/, "");
	const prefix = "/albums/";
	const index = normalizedPath.indexOf(prefix);
	if (index === -1) {
		return "";
	}

	const rest = normalizedPath.slice(index + prefix.length);
	if (!rest || rest === "_loader") {
		return "";
	}

	const firstSegment = rest.split("/")[0];
	return decodeURIComponent(firstSegment);
}

function renderDetailBanner(album: AlbumGroup, options: AlbumDetailPageOptions): string {
	const title = escapeHtml(album.title);
	const description = normalizeString(album.description);
	const location = normalizeString(album.location);
	const backText = escapeHtml(options.backToListText);
	const photosText = escapeHtml(options.photosCountText);

	if (normalizeString(album.cover).length > 0) {
		return `<div class="relative w-full aspect-[3/1] min-h-[200px] max-h-[360px]"><img src="${escapeHtml(normalizeString(album.cover))}" alt="${title}" class="w-full h-full object-cover"/><div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div><a href="/albums/" class="absolute top-4 left-4 inline-flex items-center gap-1.5 text-sm text-white/90 hover:text-white bg-black/30 hover:bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg transition-colors"><svg class="text-base w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>${backText}</a><div class="absolute bottom-0 left-0 right-0 p-6"><div class="text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">${title}</div>${description ? `<p class="text-sm text-white/75 leading-relaxed mb-2 max-w-2xl line-clamp-2">${escapeHtml(description)}</p>` : ""}<div class="flex items-center gap-4 text-sm text-white/80 flex-wrap"><span class="inline-flex items-center gap-1"><svg class="text-sm w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H5V8h14v11z"/></svg>${escapeHtml(formatDisplayDate(album.date))}</span>${location ? `<span class="inline-flex items-center gap-1"><svg class="text-sm w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>${escapeHtml(location)}</span>` : ""}<span class="inline-flex items-center gap-1"><svg class="text-sm w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zm-8.5-3.5l2.5 3.01H6l3.5-4.5 2.5 3z"/></svg>${album.photos.length} ${photosText}</span></div>${album.tags && album.tags.length > 0 ? `<div class="flex flex-wrap gap-1.5 mt-2.5">${album.tags.map((tag) => `<span class="text-xs px-2 py-0.5 rounded bg-white/20 text-white/90 backdrop-blur-sm">${escapeHtml(tag)}</span>`).join("")}</div>` : ""}</div></div>`;
	}

	return `<div class="card-base px-6 py-4"><a href="/albums/" class="inline-flex items-center gap-1 text-sm text-(--primary) hover:underline mb-3"><svg class="text-base w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>${backText}</a><div class="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">${title}</div><div class="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mt-2 flex-wrap"><span class="inline-flex items-center gap-1"><svg class="text-sm w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H5V8h14v11z"/></svg>${escapeHtml(formatDisplayDate(album.date))}</span>${location ? `<span class="inline-flex items-center gap-1"><svg class="text-sm w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>${escapeHtml(location)}</span>` : ""}<span>${album.photos.length} ${photosText}</span></div></div>`;
}

function renderPhotoCard(photo: Photo, albumId: string): string {
	const source = escapeHtml(photo.src);
	const alt = escapeHtml(normalizeString(photo.alt || photo.title));

	return `<div class="gallery-photo-card break-inside-avoid mb-3"><div data-fancybox="gallery-${escapeHtml(albumId)}" data-src="${source}" data-type="image" class="block rounded-xl overflow-hidden group cursor-pointer"><img src="${source}" alt="${alt}" loading="lazy" decoding="async" class="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"/></div></div>`;
}

export function initAlbumsApiPage(options: AlbumsListPageOptions): void {
	const root = document.getElementById("albums-page-root");
	if (!root || root.dataset.apiBound === "true") {
		return;
	}
	root.dataset.apiBound = "true";

	const filterTabsContainer = document.getElementById("albums-filter-tabs");
	const grid = document.getElementById("albums-grid");
	const loadingState = document.getElementById("albums-loading");
	const errorState = document.getElementById("albums-error");
	const errorText = document.getElementById("albums-error-text");
	const retryButton = document.getElementById("albums-retry");
	const noResults = document.getElementById("albums-no-results");
	const noResultsText = document.getElementById("albums-no-results-text");
	const emptyState = document.getElementById("albums-empty");
	const emptyTitle = document.getElementById("albums-empty-title");
	const emptyDescription = document.getElementById("albums-empty-desc");

	if (
		!filterTabsContainer ||
		!grid ||
		!loadingState ||
		!errorState ||
		!errorText ||
		!retryButton ||
		!noResults ||
		!noResultsText ||
		!emptyState ||
		!emptyTitle ||
		!emptyDescription
	) {
		return;
	}

	let allAlbums: AlbumGroup[] = [];
	let currentTag = "all";

	const fallbackAlbums = sortAlbums(
		(options.fallbackAlbums ?? albumsData).map((album) =>
			normalizeFallbackAlbum(album),
		),
	);

	const showLoadingState = () => {
		loadingState.classList.remove("hidden");
		errorState.classList.add("hidden");
		grid.classList.add("hidden");
		noResults.classList.add("hidden");
		emptyState.classList.add("hidden");
	};

	const showErrorState = () => {
		loadingState.classList.add("hidden");
		errorState.classList.remove("hidden");
		grid.classList.add("hidden");
		noResults.classList.add("hidden");
		emptyState.classList.add("hidden");
	};

	const showContentState = () => {
		loadingState.classList.add("hidden");
		errorState.classList.add("hidden");
		emptyState.classList.add("hidden");
		grid.classList.remove("hidden");
	};

	const showEmptyState = () => {
		loadingState.classList.add("hidden");
		errorState.classList.add("hidden");
		grid.classList.add("hidden");
		noResults.classList.add("hidden");
		emptyState.classList.remove("hidden");
	};

	const renderFilterTabs = () => {
		const allTags = Array.from(
			new Set(
				allAlbums.flatMap((album) =>
					Array.isArray(album.tags) ? album.tags : [],
				),
			),
		).sort((left, right) => left.localeCompare(right, "zh-CN"));

		filterTabsContainer.innerHTML = [
			renderFilterButton(
				"all",
				options.filterAllText,
				allAlbums.length,
				currentTag,
			),
			...allTags.map((tag) =>
				renderFilterButton(
					tag,
					tag,
					allAlbums.filter((album) => album.tags?.includes(tag)).length,
					currentTag,
				),
			),
		].join("");
	};

	const renderAlbums = () => {
		grid.innerHTML = allAlbums
			.map((album) => renderAlbumCard(album, options.photosCountText))
			.join("");
	};

	const applyFilter = () => {
		const cards = Array.from(grid.querySelectorAll<HTMLElement>(".album-card"));
		let visibleCount = 0;

		for (const card of cards) {
			const tags = normalizeString(card.dataset.tags);
			const match =
				currentTag === "all" ||
				tags.split(",").includes(currentTag);

			if (match) {
				card.classList.remove("hidden");
				visibleCount += 1;
			} else {
				card.classList.add("hidden");
			}
		}

		if (visibleCount === 0 && allAlbums.length > 0) {
			grid.classList.add("hidden");
			noResults.classList.remove("hidden");
			noResultsText.textContent = options.noResultsText;
			return;
		}

		noResults.classList.add("hidden");
		grid.classList.remove("hidden");
	};

	const loadAlbums = async () => {
		showLoadingState();
		currentTag = "all";
		errorText.textContent = options.errorText;
		retryButton.textContent = options.retryText;
		emptyTitle.textContent = options.emptyTitleText;
		emptyDescription.textContent = options.emptyDescText;

		allAlbums = fallbackAlbums;

		if (allAlbums.length === 0) {
			showEmptyState();
			return;
		}

		renderFilterTabs();
		renderAlbums();
		showContentState();
		applyFilter();
	};

	filterTabsContainer.addEventListener("click", (event) => {
		const target = event.target as HTMLElement | null;
		const button = target?.closest<HTMLButtonElement>("button[data-filter-value]");
		if (!button) {
			return;
		}

		const nextTag = normalizeString(button.dataset.filterValue) || "all";
		if (nextTag === currentTag) {
			return;
		}

		const buttons = filterTabsContainer.querySelectorAll<HTMLButtonElement>(
			"button[data-filter-value]",
		);
		for (const item of buttons) {
			item.classList.remove("active");
		}
		button.classList.add("active");
		currentTag = nextTag;
		applyFilter();
	});

	retryButton.addEventListener("click", () => {
		void loadAlbums();
	});

	loadingState.setAttribute("aria-label", options.loadingText);
	void loadAlbums();
}

export function initAlbumDetailApiPage(options: AlbumDetailPageOptions): void {
	const root = document.getElementById("album-detail-page-root");
	if (!root || root.dataset.apiBound === "true") {
		return;
	}
	root.dataset.apiBound = "true";

	const loadingState = document.getElementById("album-detail-loading");
	const errorState = document.getElementById("album-detail-error");
	const errorText = document.getElementById("album-detail-error-text");
	const retryButton = document.getElementById("album-detail-retry");
	const emptyState = document.getElementById("album-detail-empty");
	const emptyText = document.getElementById("album-detail-empty-text");
	const content = document.getElementById("album-detail-content");
	const bannerContainer = document.getElementById("album-detail-banner");
	const galleryContainer = document.getElementById("album-detail-gallery");

	if (
		!loadingState ||
		!errorState ||
		!errorText ||
		!retryButton ||
		!emptyState ||
		!emptyText ||
		!content ||
		!bannerContainer ||
		!galleryContainer
	) {
		return;
	}

	const fallbackAlbums = (options.fallbackAlbums ?? albumsData).map((album) =>
		normalizeFallbackAlbum(album),
	);
	const albumId = getAlbumIdFromPath(window.location.pathname);

	const showLoadingState = () => {
		loadingState.classList.remove("hidden");
		errorState.classList.add("hidden");
		emptyState.classList.add("hidden");
		content.classList.add("hidden");
	};

	const showErrorState = () => {
		loadingState.classList.add("hidden");
		errorState.classList.remove("hidden");
		emptyState.classList.add("hidden");
		content.classList.add("hidden");
	};

	const showEmptyState = () => {
		loadingState.classList.add("hidden");
		errorState.classList.add("hidden");
		emptyState.classList.remove("hidden");
		content.classList.add("hidden");
	};

	const showContentState = () => {
		loadingState.classList.add("hidden");
		errorState.classList.add("hidden");
		emptyState.classList.add("hidden");
		content.classList.remove("hidden");
	};

	const renderGallery = (album: AlbumGroup) => {
		if (album.photos.length === 0) {
			galleryContainer.innerHTML = `<div class="flex flex-col items-center justify-center py-16 text-neutral-400 dark:text-neutral-500"><svg class="text-6xl mb-4 opacity-50 w-16 h-16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zm-8.5-3.5l2.5 3.01H6l3.5-4.5 2.5 3z"/></svg><p class="text-lg">${escapeHtml(options.emptyTitleText)}</p></div>`;
			return;
		}

		galleryContainer.innerHTML = `<div class="gallery-masonry">${album.photos
			.map((photo) => renderPhotoCard(photo, album.id))
			.join("")}</div>`;
	};

	const loadAlbum = async () => {
		showLoadingState();
		errorText.textContent = options.errorText;
		retryButton.textContent = options.retryText;
		emptyText.textContent = options.notFoundText;

		if (albumId.length === 0) {
			showEmptyState();
			return;
		}

		const album =
			fallbackAlbums.find((item) => item.id === albumId) ??
			null;

		if (!album) {
			showEmptyState();
			return;
		}

		bannerContainer.innerHTML = renderDetailBanner(album, options);
		renderGallery(album);
		showContentState();
		void initFancybox();
	};

	retryButton.addEventListener("click", () => {
		void loadAlbum();
	});

	loadingState.setAttribute("aria-label", options.loadingText);
	void loadAlbum();
}
import { type DiaryItem,getDiaryList } from "@/data/diary";

interface DiaryViewModel {
	id: number;
	content: string;
	date: string;
	images: string[];
	location?: string;
	mood?: string;
	tags: string[];
}

interface DiaryPageData {
	items: DiaryViewModel[];
	page: number;
	totalPages: number;
	totalElements: number;
}

export interface DiaryPageOptions {
	fallbackMoments?: DiaryItem[];
	filterAllText: string;
	noResultsText: string;
	minutesAgoText: string;
	hoursAgoText: string;
	daysAgoText: string;
	loadingText: string;
	errorText: string;
	retryText: string;
	pageLabelText: string;
	previousText: string;
	nextText: string;
	pageSize?: number;
}

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function normalizeFallbackDiary(item: DiaryItem): DiaryViewModel {
	return {
		id: item.id,
		content: item.content,
		date: item.date,
		images: Array.isArray(item.images) ? item.images : [],
		location: item.location,
		mood: item.mood,
		tags: Array.isArray(item.tags) ? item.tags : [],
	};
}

function formatRelativeTime(dateText: string, options: DiaryPageOptions): string {
	const date = new Date(dateText);
	if (Number.isNaN(date.getTime())) {
		return dateText;
	}

	const now = Date.now();
	const diffMs = now - date.getTime();
	const diffMinutes = Math.floor(diffMs / (1000 * 60));
	if (diffMinutes < 60) {
		return `${Math.max(diffMinutes, 1)} ${options.minutesAgoText}`;
	}

	const diffHours = Math.floor(diffMinutes / 60);
	if (diffHours < 24) {
		return `${diffHours} ${options.hoursAgoText}`;
	}

	const diffDays = Math.floor(diffHours / 24);
	if (diffDays < 30) {
		return `${diffDays} ${options.daysAgoText}`;
	}

	return date.toLocaleDateString();
}

function renderDiaryCard(item: DiaryViewModel, options: DiaryPageOptions): string {
	const tagsHtml = item.tags
		.map(
			(tag) =>
				`<span class="btn-regular h-6 text-xs px-2 rounded-lg">${escapeHtml(tag)}</span>`,
		)
		.join("");
	const imagesHtml = item.images
		.map(
			(image) =>
				`<div class="relative rounded-lg overflow-hidden aspect-square"><img src="${escapeHtml(image)}" alt="diary image" class="w-full h-full object-cover" loading="lazy"/></div>`,
		)
		.join("");
	const footerMeta = [
		item.location
			? `<span class="flex items-center gap-1">📍${escapeHtml(item.location)}</span>`
			: "",
		item.mood
			? `<span class="flex items-center gap-1">${escapeHtml(item.mood)}</span>`
			: "",
	]
		.filter(Boolean)
		.join("");

	return `<div class="moment-card group relative bg-transparent rounded-xl border border-black/10 dark:border-white/10 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"><div class="p-5"><p class="text-sm md:text-base text-black/90 dark:text-white/90 leading-relaxed mb-3">${escapeHtml(item.content)}</p>${
		imagesHtml.length > 0
			? `<div class="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">${imagesHtml}</div>`
			: ""
	}${
		tagsHtml.length > 0
			? `<div class="flex flex-wrap gap-1.5 mb-3">${tagsHtml}</div>`
			: ""
	}<hr class="border-t border-black/5 dark:border-white/5 my-3"/><div class="flex items-center justify-between text-xs text-black/50 dark:text-white/50 flex-wrap gap-2"><time datetime="${escapeHtml(item.date)}">${escapeHtml(
		formatRelativeTime(item.date, options),
	)}</time><div class="flex items-center gap-3">${footerMeta}</div></div></div></div>`;
}

export function initDiaryApiPage(options: DiaryPageOptions): void {
	const root = document.getElementById("diary-page-root");
	if (!root || root.dataset.apiBound === "true") {
		return;
	}
	root.dataset.apiBound = "true";

	const tagsContainer = document.getElementById("diary-tag-tabs");
	const listContainer = document.getElementById("diary-list");
	const loadingState = document.getElementById("diary-loading");
	const errorState = document.getElementById("diary-error");
	const errorText = document.getElementById("diary-error-text");
	const retryButton = document.getElementById("diary-retry");
	const noResults = document.getElementById("diary-no-results");
	const noResultsText = document.getElementById("diary-no-results-text");
	const pagination = document.getElementById("diary-pagination");
	const pageInfo = document.getElementById("diary-page-info");
	const previousButton = document.getElementById("diary-prev");
	const nextButton = document.getElementById("diary-next");

	if (
		!tagsContainer ||
		!listContainer ||
		!loadingState ||
		!errorState ||
		!errorText ||
		!retryButton ||
		!noResults ||
		!noResultsText ||
		!pagination ||
		!pageInfo ||
		!previousButton ||
		!nextButton
	) {
		return;
	}

	const pageSize = options.pageSize ?? 8;
	const fallbackList = (options.fallbackMoments ?? getDiaryList())
		.map(normalizeFallbackDiary)
		.sort(
			(a, b) =>
				new Date(b.date).getTime() - new Date(a.date).getTime(),
		);

	let currentPage = 1;
	let totalPages = 1;
	let currentTag = "all";
	let allTags: string[] = [];

	const showLoadingState = () => {
		loadingState.classList.remove("hidden");
		errorState.classList.add("hidden");
		listContainer.classList.add("hidden");
		noResults.classList.add("hidden");
		pagination.classList.add("hidden");
	};

	const showErrorState = () => {
		loadingState.classList.add("hidden");
		errorState.classList.remove("hidden");
		listContainer.classList.add("hidden");
		noResults.classList.add("hidden");
		pagination.classList.add("hidden");
	};

	const showContentState = () => {
		loadingState.classList.add("hidden");
		errorState.classList.add("hidden");
		listContainer.classList.remove("hidden");
	};

	const renderTagTabs = () => {
		const tagsHtml = [
			`<button class="filter-tabs-item ${
				currentTag === "all" ? "active" : ""
			}" data-tag="all">${escapeHtml(options.filterAllText)}</button>`,
			...allTags.map(
				(tag) =>
					`<button class="filter-tabs-item ${
						currentTag === tag ? "active" : ""
					}" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`,
			),
		].join("");

		tagsContainer.innerHTML = tagsHtml;
	};

	const renderPagination = () => {
		if (totalPages <= 1) {
			pagination.classList.add("hidden");
			return;
		}

		pagination.classList.remove("hidden");
		pageInfo.textContent = `${options.pageLabelText} ${currentPage} / ${totalPages}`;
		(previousButton as HTMLButtonElement).disabled = currentPage <= 1;
		(nextButton as HTMLButtonElement).disabled = currentPage >= totalPages;
	};

	const renderList = (items: DiaryViewModel[]) => {
		if (items.length === 0) {
			listContainer.innerHTML = "";
			noResults.classList.remove("hidden");
			noResultsText.textContent = options.noResultsText;
			pagination.classList.add("hidden");
			showContentState();
			return;
		}

		listContainer.innerHTML = items
			.map((item) => renderDiaryCard(item, options))
			.join("");
		noResults.classList.add("hidden");
		showContentState();
		renderPagination();
	};

	const getFallbackPage = (): DiaryPageData => {
		const filtered =
			currentTag === "all"
				? fallbackList
				: fallbackList.filter((item) => item.tags.includes(currentTag));
		const startIndex = (currentPage - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		const paged = filtered.slice(startIndex, endIndex);
		const pages = Math.max(Math.ceil(filtered.length / pageSize), 1);
		return {
			items: paged,
			page: currentPage,
			totalPages: pages,
			totalElements: filtered.length,
		};
	};

	const loadTags = async () => {
		allTags = Array.from(
			new Set(fallbackList.flatMap((item) => item.tags)),
		).sort((a, b) => a.localeCompare(b));
		renderTagTabs();
	};

	const loadPage = async () => {
		showLoadingState();
		errorText.textContent = options.errorText;
		retryButton.textContent = options.retryText;
		(previousButton as HTMLButtonElement).textContent = options.previousText;
		(nextButton as HTMLButtonElement).textContent = options.nextText;

		const pageData: DiaryPageData = getFallbackPage();

		if (pageData.totalElements === 0 && fallbackList.length === 0) {
			showErrorState();
			return;
		}

		currentPage = pageData.page;
		totalPages = pageData.totalPages;
		renderList(pageData.items);
	};

	tagsContainer.addEventListener("click", (event) => {
		const target = event.target as HTMLElement | null;
		const button = target?.closest<HTMLButtonElement>("button[data-tag]");
		if (!button) {
			return;
		}

		const nextTag = button.dataset.tag ?? "all";
		if (nextTag === currentTag) {
			return;
		}
		currentTag = nextTag;
		currentPage = 1;
		renderTagTabs();
		void loadPage();
	});

	previousButton.addEventListener("click", () => {
		if (currentPage <= 1) {
			return;
		}
		currentPage -= 1;
		void loadPage();
	});

	nextButton.addEventListener("click", () => {
		if (currentPage >= totalPages) {
			return;
		}
		currentPage += 1;
		void loadPage();
	});

	retryButton.addEventListener("click", () => {
		void loadPage();
	});

	loadingState.setAttribute("aria-label", options.loadingText);
	void (async () => {
		await loadTags();
		await loadPage();
	})();
}

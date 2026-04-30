import { type FriendItem,friendsData } from "@/data/friends";

interface FriendViewModel {
	title: string;
	siteurl: string;
	imgurl: string;
	desc: string;
	tags: string[];
}

export interface FriendsPageOptions {
	fallbackFriends?: FriendItem[];
	filterAllText: string;
	visitText: string;
	copySuccessText: string;
	noResultsText: string;
	loadingText: string;
	errorText: string;
	retryText: string;
}

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function shuffleFriends(list: FriendViewModel[]): FriendViewModel[] {
	const clonedList = [...list];
	for (let i = clonedList.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		[clonedList[i], clonedList[j]] = [clonedList[j], clonedList[i]];
	}
	return clonedList;
}

function normalizeFallbackFriend(item: FriendItem): FriendViewModel {
	return {
		title: item.title,
		siteurl: item.siteurl,
		imgurl: item.imgurl,
		desc: item.desc,
		tags: Array.isArray(item.tags) ? item.tags : [],
	};
}

function getHostname(siteUrl: string): string {
	try {
		return new URL(siteUrl).hostname;
	} catch {
		return siteUrl;
	}
}

function renderFriendCard(item: FriendViewModel, visitText: string): string {
	const tagsHtml = item.tags
		.map(
			(tag) =>
				`<span class="px-2 py-1 text-xs rounded-md bg-[var(--primary)]/10 text-[var(--primary)] font-medium">${escapeHtml(tag)}</span>`,
		)
		.join("");
	const title = escapeHtml(item.title);
	const description = escapeHtml(item.desc);
	const siteUrl = escapeHtml(item.siteurl);
	const hostname = escapeHtml(getHostname(item.siteurl));
	const tagsAttr = escapeHtml(item.tags.join(","));

	return `<div class="friend-card group relative bg-transparent rounded-xl border border-black/10 dark:border-white/10 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1" data-title="${title.toLowerCase()}" data-desc="${description.toLowerCase()}" data-tags="${tagsAttr}"><div class="p-6"><div class="flex items-start gap-4 mb-4"><div class="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-[var(--btn-regular-bg)] ring-2 ring-transparent transition-all duration-300"><img src="${escapeHtml(item.imgurl)}" alt="${title}" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" loading="lazy"/></div><div class="flex-1 min-w-0"><h3 class="text-xl font-bold text-black/90 dark:text-white/90 mb-1 truncate group-hover:text-[var(--primary)] transition-colors duration-200">${title}</h3><a href="${siteUrl}" target="_blank" rel="noopener noreferrer" class="text-xs text-black/50 dark:text-white/50 hover:text-[var(--primary)] truncate block transition-colors duration-200">${hostname}</a></div></div><p class="text-sm text-black/60 dark:text-white/60 mb-4 line-clamp-2 min-h-[2.5rem]">${description}</p><div class="flex flex-wrap gap-2 mb-4">${tagsHtml}</div><div class="flex gap-2"><a href="${siteUrl}" target="_blank" rel="noopener noreferrer" class="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 active:scale-95 transition-all duration-200 font-medium text-sm"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>${escapeHtml(visitText)}</a><button class="copy-link-btn px-3 py-2 rounded-lg bg-[var(--btn-regular-bg)] hover:bg-[var(--btn-regular-bg-hover)] active:scale-95 transition-all duration-200 text-black/70 dark:text-white/70" data-url="${siteUrl}"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></button></div></div><div class="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div></div>`;
}

export function initFriendsApiPage(options: FriendsPageOptions): void {
	const root = document.getElementById("friends-page-root");
	if (!root || root.dataset.apiBound === "true") {
		return;
	}
	root.dataset.apiBound = "true";

	const searchInput = document.getElementById(
		"friend-search",
	) as HTMLInputElement | null;
	const tagsContainer = document.getElementById("friends-tags");
	const grid = document.getElementById("friends-grid");
	const noResults = document.getElementById("no-results");
	const noResultsText = document.getElementById("friends-no-results-text");
	const loadingState = document.getElementById("friends-loading");
	const errorState = document.getElementById("friends-error");
	const errorText = document.getElementById("friends-error-text");
	const retryButton = document.getElementById("friends-retry");

	if (
		!searchInput ||
		!tagsContainer ||
		!grid ||
		!noResults ||
		!noResultsText ||
		!loadingState ||
		!errorState ||
		!errorText ||
		!retryButton
	) {
		return;
	}

	let allFriends: FriendViewModel[] = [];
	let currentTag = "all";
	let searchTerm = "";

	const fallbackFriends = shuffleFriends(
		(options.fallbackFriends ?? friendsData).map(normalizeFallbackFriend),
	);

	const showLoadingState = () => {
		loadingState.classList.remove("hidden");
		errorState.classList.add("hidden");
		grid.classList.add("hidden");
		noResults.classList.add("hidden");
	};

	const showErrorState = () => {
		loadingState.classList.add("hidden");
		errorState.classList.remove("hidden");
		grid.classList.add("hidden");
		noResults.classList.add("hidden");
	};

	const showContentState = () => {
		loadingState.classList.add("hidden");
		errorState.classList.add("hidden");
		grid.classList.remove("hidden");
	};

	const updateNoResults = (visibleCount: number) => {
		if (visibleCount > 0) {
			noResults.classList.add("hidden");
			grid.classList.remove("hidden");
			return;
		}

		grid.classList.add("hidden");
		noResults.classList.remove("hidden");
	};

	const applyFilters = () => {
		const cards = Array.from(
			grid.querySelectorAll<HTMLElement>(".friend-card"),
		);
		let visibleCount = 0;

		for (const card of cards) {
			const title = card.dataset.title ?? "";
			const desc = card.dataset.desc ?? "";
			const tags = card.dataset.tags ?? "";
			const matchesSearch =
				searchTerm.length === 0 ||
				title.includes(searchTerm) ||
				desc.includes(searchTerm);
			const matchesTag =
				currentTag === "all" ||
				tags.split(",").includes(currentTag);

			if (matchesSearch && matchesTag) {
				card.style.display = "";
				visibleCount += 1;
			} else {
				card.style.display = "none";
			}
		}

		updateNoResults(visibleCount);
	};

	const renderTags = () => {
		const tags = Array.from(
			new Set(allFriends.flatMap((item) => item.tags)),
		).sort((a, b) => a.localeCompare(b));
		const tagsHtml = [
			`<button class="filter-tag active" data-tag="all">${escapeHtml(options.filterAllText)}</button>`,
			...tags.map(
				(tag) =>
					`<button class="filter-tag" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`,
			),
		].join("");
		tagsContainer.innerHTML = tagsHtml;
	};

	const renderCards = () => {
		grid.innerHTML = allFriends
			.map((item) => renderFriendCard(item, options.visitText))
			.join("");
	};

	const copyLink = async (url: string, button: HTMLButtonElement) => {
		if (!navigator.clipboard?.writeText) {
			return;
		}

		await navigator.clipboard.writeText(url);
		const originalHtml = button.innerHTML;
		button.textContent = options.copySuccessText;
		button.classList.add("text-green-500");

		window.setTimeout(() => {
			button.innerHTML = originalHtml;
			button.classList.remove("text-green-500");
		}, 1500);
	};

	searchInput.addEventListener("input", () => {
		searchTerm = searchInput.value.trim().toLowerCase();
		applyFilters();
	});

	tagsContainer.addEventListener("click", (event) => {
		const target = event.target as HTMLElement | null;
		const button = target?.closest<HTMLButtonElement>("button[data-tag]");
		if (!button) {
			return;
		}

		const buttons = tagsContainer.querySelectorAll("button[data-tag]");
		for (const item of buttons) {
			item.classList.remove("active");
		}
		button.classList.add("active");
		currentTag = button.dataset.tag ?? "all";
		applyFilters();
	});

	grid.addEventListener("click", (event) => {
		const target = event.target as HTMLElement | null;
		const button = target?.closest<HTMLButtonElement>(".copy-link-btn");
		if (!button) {
			return;
		}

		const url = button.dataset.url;
		if (!url) {
			return;
		}

		void copyLink(url, button);
	});

	const loadFriends = async () => {
		showLoadingState();
		currentTag = "all";
		searchTerm = "";
		searchInput.value = "";
		errorText.textContent = options.errorText;
		noResultsText.textContent = options.noResultsText;
		retryButton.textContent = options.retryText;

		allFriends = fallbackFriends;

		if (allFriends.length === 0) {
			showErrorState();
			return;
		}

		renderTags();
		renderCards();
		showContentState();
		applyFilters();
	};

	retryButton.addEventListener("click", () => {
		void loadFriends();
	});

	loadingState.setAttribute("aria-label", options.loadingText);
	void loadFriends();
}

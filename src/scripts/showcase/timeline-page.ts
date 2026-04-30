import type { TimelineItem } from "@/components/features/timeline/types";
import { timelineData } from "@/data/timeline";

interface TimelineViewModel {
	id: string;
	title: string;
	description: string;
	type: string;
	startDate: string;
	endDate?: string;
	location?: string;
	organization?: string;
	position?: string;
	skills: string[];
	achievements: string[];
	links: Array<{
		name: string;
		url: string;
		type: string;
	}>;
	icon?: string;
	color?: string;
	featured: boolean;
}

export interface TimelinePageOptions {
	filterAllText: string;
	loadingText: string;
	errorText: string;
	retryText: string;
	noResultsText: string;
	presentText: string;
	yearsText: string;
	monthsText: string;
	typeTextMap: Record<string, string>;
	achievementsText: string;
	fallbackTimeline?: TimelineItem[];
}

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function normalizeFallbackTimeline(item: TimelineItem): TimelineViewModel {
	return {
		id: item.id,
		title: item.title,
		description: item.description,
		type: item.type,
		startDate: item.startDate,
		endDate: item.endDate,
		location: item.location,
		organization: item.organization,
		position: item.position,
		skills: Array.isArray(item.skills) ? item.skills : [],
		achievements: Array.isArray(item.achievements)
			? item.achievements
			: [],
		links: Array.isArray(item.links) ? item.links : [],
		icon: item.icon,
		color: item.color,
		featured: item.featured === true,
	};
}

function formatDate(dateText: string): string {
	const date = new Date(dateText);
	if (Number.isNaN(date.getTime())) {
		return dateText;
	}
	return date.toLocaleDateString("zh-CN", {
		year: "numeric",
		month: "short",
	});
}

function getDuration(
	startDate: string,
	endDate: string | undefined,
	options: TimelinePageOptions,
): string {
	const start = new Date(startDate);
	const end = endDate ? new Date(endDate) : new Date();
	if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
		return "";
	}
	const diffTime = Math.abs(end.getTime() - start.getTime());
	const diffMonths = Math.max(
		Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30)),
		1,
	);
	if (diffMonths < 12) {
		return `${diffMonths} ${options.monthsText}`;
	}
	const years = Math.floor(diffMonths / 12);
	const months = diffMonths % 12;
	if (months === 0) {
		return `${years} ${options.yearsText}`;
	}
	return `${years} ${options.yearsText} ${months} ${options.monthsText}`;
}

function renderTab(
	value: string,
	label: string,
	count: number,
	activeValue: string,
): string {
	return `<button class="filter-tabs-item ${
		value === activeValue ? "active" : ""
	}" data-type="${escapeHtml(value)}">${escapeHtml(label)} <span class="filter-tabs-count">(${count})</span></button>`;
}

function renderTimelineCard(
	item: TimelineViewModel,
	options: TimelinePageOptions,
): string {
	const dateRange = `${formatDate(item.startDate)} - ${
		item.endDate ? formatDate(item.endDate) : options.presentText
	}`;
	const skillsHtml = item.skills
		.map(
			(skill) =>
				`<span class="px-2 py-1 text-xs rounded-md bg-[var(--primary)]/10 text-[var(--primary)] font-medium">${escapeHtml(skill)}</span>`,
		)
		.join("");
	const achievementsHtml = item.achievements
		.map(
			(achievement) =>
				`<li class="text-sm text-black/70 dark:text-white/70">${escapeHtml(achievement)}</li>`,
		)
		.join("");
	const linksHtml = item.links
		.map(
			(link) =>
				`<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="btn-regular flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium">${escapeHtml(link.name)}</a>`,
		)
		.join("");

	return `<div class="timeline-entry" data-type="${escapeHtml(item.type)}"><div class="timeline-node" style="background-color:${escapeHtml(
		item.color || "var(--primary)",
	)}"></div><div class="timeline-card group relative rounded-xl border border-black/10 dark:border-white/10 overflow-hidden transition-all duration-300 hover:shadow-lg"><div class="p-5 sm:p-6"><div class="flex items-start gap-3 mb-3"><div class="flex-1 min-w-0"><div class="flex items-center gap-2 mb-0.5"><h3 class="text-lg font-bold text-black/90 dark:text-white/90">${escapeHtml(item.title)}</h3>${
		item.featured ? '<span class="text-[var(--primary)]">★</span>' : ""
	}</div><p class="text-sm text-black/60 dark:text-white/60">${escapeHtml(
		[item.organization, item.position].filter(Boolean).join(" · "),
	)}</p></div><span class="px-2 py-0.5 text-xs rounded-md bg-[var(--primary)]/10 text-[var(--primary)] font-medium">${escapeHtml(
		options.typeTextMap[item.type] ?? item.type,
	)}</span></div><p class="text-sm text-black/70 dark:text-white/70 mb-4 leading-relaxed">${escapeHtml(item.description)}</p>${
		skillsHtml
			? `<div class="flex flex-wrap gap-2 mb-4">${skillsHtml}</div>`
			: ""
	}${
		achievementsHtml
			? `<div class="mb-4"><h4 class="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider mb-2">${escapeHtml(options.achievementsText)}</h4><ul class="space-y-1.5">${achievementsHtml}</ul></div>`
			: ""
	}<div class="flex items-center gap-4 text-xs text-black/50 dark:text-white/50 mb-1 pt-3 border-t border-black/5 dark:border-white/5"><span>${escapeHtml(dateRange)}</span><span>${escapeHtml(
		getDuration(item.startDate, item.endDate, options),
	)}</span>${
		item.location ? `<span>${escapeHtml(item.location)}</span>` : ""
	}</div>${
		linksHtml
			? `<div class="flex flex-wrap gap-2 mt-3">${linksHtml}</div>`
			: ""
	}</div></div></div>`;
}

export function initTimelineApiPage(options: TimelinePageOptions): void {
	const root = document.getElementById("timeline-page-root");
	if (!root || root.dataset.apiBound === "true") {
		return;
	}
	root.dataset.apiBound = "true";

	const typeTabs = document.getElementById("timeline-type-tabs");
	const list = document.getElementById("timeline-list");
	const loadingState = document.getElementById("timeline-loading");
	const errorState = document.getElementById("timeline-error");
	const errorText = document.getElementById("timeline-error-text");
	const retryButton = document.getElementById("timeline-retry");
	const noResults = document.getElementById("timeline-no-results");
	const noResultsText = document.getElementById("timeline-no-results-text");

	if (
		!typeTabs ||
		!list ||
		!loadingState ||
		!errorState ||
		!errorText ||
		!retryButton ||
		!noResults ||
		!noResultsText
	) {
		return;
	}

	const fallbackTimeline = (options.fallbackTimeline ?? timelineData).map(
		normalizeFallbackTimeline,
	);
	let timelineItems: TimelineViewModel[] = [];
	let currentType = "all";

	const showLoadingState = () => {
		loadingState.classList.remove("hidden");
		errorState.classList.add("hidden");
		list.classList.add("hidden");
		noResults.classList.add("hidden");
	};

	const showErrorState = () => {
		loadingState.classList.add("hidden");
		errorState.classList.remove("hidden");
		list.classList.add("hidden");
		noResults.classList.add("hidden");
	};

	const showContentState = () => {
		loadingState.classList.add("hidden");
		errorState.classList.add("hidden");
		list.classList.remove("hidden");
	};

	const renderTabs = () => {
		const types = Array.from(new Set(timelineItems.map((item) => item.type)));
		typeTabs.innerHTML = [
			renderTab(
				"all",
				options.filterAllText,
				timelineItems.length,
				currentType,
			),
			...types.map((type) =>
				renderTab(
					type,
					options.typeTextMap[type] ?? type,
					timelineItems.filter((item) => item.type === type).length,
					currentType,
				),
			),
		].join("");
	};

	const renderTimeline = () => {
		const filtered =
			currentType === "all"
				? timelineItems
				: timelineItems.filter((item) => item.type === currentType);
		if (filtered.length === 0) {
			list.innerHTML = "";
			noResults.classList.remove("hidden");
			noResultsText.textContent = options.noResultsText;
			showContentState();
			return;
		}

		list.innerHTML = filtered
			.map((item) => renderTimelineCard(item, options))
			.join("");
		noResults.classList.add("hidden");
		showContentState();
	};

	const loadTimeline = async () => {
		showLoadingState();
		errorText.textContent = options.errorText;
		retryButton.textContent = options.retryText;

		timelineItems = fallbackTimeline;

		if (timelineItems.length === 0) {
			showErrorState();
			return;
		}

		currentType = "all";
		renderTabs();
		renderTimeline();
	};

	typeTabs.addEventListener("click", (event) => {
		const target = event.target as HTMLElement | null;
		const button = target?.closest<HTMLButtonElement>("button[data-type]");
		if (!button) {
			return;
		}
		const nextType = button.dataset.type ?? "all";
		if (nextType === currentType) {
			return;
		}
		currentType = nextType;
		renderTabs();
		renderTimeline();
	});

	retryButton.addEventListener("click", () => {
		void loadTimeline();
	});

	loadingState.setAttribute("aria-label", options.loadingText);
	void loadTimeline();
}

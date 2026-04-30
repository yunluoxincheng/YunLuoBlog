import { type Project as FallbackProject,projectsData } from "@/data/projects";
import type { ProjectStatsResponse } from "@/types/showcase";

interface ProjectViewModel {
	id: string;
	title: string;
	description: string;
	image: string;
	category: string;
	techStack: string[];
	status: string;
	visitUrl: string;
	sourceCode: string;
	featured: boolean;
	showImage: boolean;
}

export interface ProjectsPageOptions {
	filterAllText: string;
	visitText: string;
	githubText: string;
	loadingText: string;
	errorText: string;
	retryText: string;
	noResultsText: string;
	statusTextMap: Record<string, string>;
	categoryTextMap: Record<string, string>;
	statsLabelMap: {
		total: string;
		completed: string;
		inProgress: string;
		planned: string;
	};
	techStackTitle: string;
	fallbackProjects?: FallbackProject[];
}

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function normalizeFallbackProject(item: FallbackProject): ProjectViewModel {
	return {
		id: item.id,
		title: item.title,
		description: item.description,
		image: item.image,
		category: item.category,
		techStack: Array.isArray(item.techStack) ? item.techStack : [],
		status: item.status,
		visitUrl: item.visitUrl || item.liveDemo || "",
		sourceCode: item.sourceCode || "",
		featured: item.featured === true,
		showImage: item.showImage !== false,
	};
}

function getFallbackStats(items: ProjectViewModel[]): ProjectStatsResponse {
	return {
		total: items.length,
		byStatus: {
			completed: items.filter((item) => item.status === "completed")
				.length,
			inProgress: items.filter((item) => item.status === "in-progress")
				.length,
			planned: items.filter((item) => item.status === "planned").length,
		},
	};
}

function getFallbackTechStack(items: ProjectViewModel[]): string[] {
	return Array.from(new Set(items.flatMap((item) => item.techStack))).sort(
		(a, b) => a.localeCompare(b),
	);
}

function renderTab(
	value: string,
	label: string,
	count: number,
	activeValue: string,
	dataAttr: "category" | "status",
): string {
	const isActive = value === activeValue;
	return `<button class="filter-tabs-item ${
		isActive ? "active" : ""
	}" data-${dataAttr}="${escapeHtml(value)}">${escapeHtml(label)} <span class="filter-tabs-count">(${count})</span></button>`;
}

function renderProjectCard(item: ProjectViewModel, options: ProjectsPageOptions): string {
	const statusText = options.statusTextMap[item.status] ?? item.status;
	const tags = item.techStack
		.slice(0, 4)
		.map(
			(tech) =>
				`<span class="px-2 py-1 text-xs rounded-md bg-[var(--primary)]/10 text-[var(--primary)] font-medium">${escapeHtml(tech)}</span>`,
		)
		.join("");
	const extraCount = Math.max(item.techStack.length - 4, 0);
	const cover = item.showImage
		? `<div class="aspect-video overflow-hidden relative bg-gradient-to-br from-[var(--primary)]/5 to-[var(--primary)]/10"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"/>${
				item.featured
					? '<div class="absolute top-3 right-3 text-[var(--primary)]">★</div>'
					: ""
		  }</div>`
		: "";
	const actionButtons = [
		item.visitUrl
			? `<a href="${escapeHtml(item.visitUrl)}" target="_blank" rel="noopener noreferrer" class="btn-regular flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium">${escapeHtml(options.visitText)}</a>`
			: "",
		item.sourceCode
			? `<a href="${escapeHtml(item.sourceCode)}" target="_blank" rel="noopener noreferrer" class="btn-regular flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style="${
					item.visitUrl ? "" : "flex:1;"
			  }">${escapeHtml(options.githubText)}</a>`
			: "",
	]
		.filter(Boolean)
		.join("");

	return `<div class="project-card group relative rounded-xl border border-black/10 dark:border-white/10 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1" data-category="${escapeHtml(
		item.category,
	)}" data-status="${escapeHtml(item.status)}">${cover}<div class="p-5"><div class="flex items-center justify-between mb-3"><h3 class="text-lg font-bold text-black/90 dark:text-white/90 truncate group-hover:text-[var(--primary)] transition-colors duration-200">${escapeHtml(item.title)}</h3><span class="shrink-0 ml-3 px-2 py-0.5 text-xs rounded-md bg-[var(--primary)]/10 text-[var(--primary)] font-medium">${escapeHtml(statusText)}</span></div><p class="text-sm text-black/60 dark:text-white/60 mb-4 line-clamp-2 min-h-[2.5rem]">${escapeHtml(item.description)}</p><div class="flex flex-wrap gap-2 mb-4">${tags}${
		extraCount > 0
			? `<span class="px-2 py-1 text-xs rounded-md bg-[var(--btn-regular-bg)] text-black/50 dark:text-white/50 font-medium">+${extraCount}</span>`
			: ""
	}</div>${
		actionButtons ? `<div class="flex gap-2">${actionButtons}</div>` : ""
	}</div></div>`;
}

export function initProjectsApiPage(options: ProjectsPageOptions): void {
	const root = document.getElementById("projects-page-root");
	if (!root || root.dataset.apiBound === "true") {
		return;
	}
	root.dataset.apiBound = "true";

	const categoryTabs = document.getElementById("projects-category-tabs");
	const statusTabs = document.getElementById("projects-status-tabs");
	const statsContainer = document.getElementById("projects-stats");
	const techStackContainer = document.getElementById("projects-tech-stack");
	const grid = document.getElementById("projects-grid");
	const loadingState = document.getElementById("projects-loading");
	const errorState = document.getElementById("projects-error");
	const errorText = document.getElementById("projects-error-text");
	const retryButton = document.getElementById("projects-retry");
	const noResults = document.getElementById("projects-no-results");
	const noResultsText = document.getElementById("projects-no-results-text");

	if (
		!categoryTabs ||
		!statusTabs ||
		!statsContainer ||
		!techStackContainer ||
		!grid ||
		!loadingState ||
		!errorState ||
		!errorText ||
		!retryButton ||
		!noResults ||
		!noResultsText
	) {
		return;
	}

	let allProjects: ProjectViewModel[] = [];
	let projectStats: ProjectStatsResponse = {
		total: 0,
		byStatus: {
			completed: 0,
			inProgress: 0,
			planned: 0,
		},
	};
	let techStack: string[] = [];
	let currentCategory = "all";
	let currentStatus = "all";

	const fallbackProjects = (options.fallbackProjects ?? projectsData).map(
		normalizeFallbackProject,
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

	const getFilteredProjects = (): ProjectViewModel[] => {
		return allProjects.filter((item) => {
			const matchCategory =
				currentCategory === "all" || item.category === currentCategory;
			const matchStatus =
				currentStatus === "all" || item.status === currentStatus;
			return matchCategory && matchStatus;
		});
	};

	const renderStats = () => {
		statsContainer.innerHTML = `<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"><div class="btn-regular rounded-lg p-3"><p class="text-xs text-black/50 dark:text-white/50">${escapeHtml(options.statsLabelMap.total)}</p><p class="text-lg font-semibold text-black/90 dark:text-white/90">${projectStats.total}</p></div><div class="btn-regular rounded-lg p-3"><p class="text-xs text-black/50 dark:text-white/50">${escapeHtml(options.statsLabelMap.completed)}</p><p class="text-lg font-semibold text-black/90 dark:text-white/90">${projectStats.byStatus.completed}</p></div><div class="btn-regular rounded-lg p-3"><p class="text-xs text-black/50 dark:text-white/50">${escapeHtml(options.statsLabelMap.inProgress)}</p><p class="text-lg font-semibold text-black/90 dark:text-white/90">${projectStats.byStatus.inProgress}</p></div><div class="btn-regular rounded-lg p-3"><p class="text-xs text-black/50 dark:text-white/50">${escapeHtml(options.statsLabelMap.planned)}</p><p class="text-lg font-semibold text-black/90 dark:text-white/90">${projectStats.byStatus.planned}</p></div></div>`;
	};

	const renderTechStack = () => {
		if (techStack.length === 0) {
			techStackContainer.innerHTML = "";
			return;
		}

		techStackContainer.innerHTML = `<div class="mb-6"><h3 class="text-sm font-semibold text-black/70 dark:text-white/70 mb-3">${escapeHtml(options.techStackTitle)}</h3><div class="flex flex-wrap gap-2">${techStack
			.map(
				(item) =>
					`<span class="px-2 py-1 text-xs rounded-md bg-[var(--btn-regular-bg)] text-black/70 dark:text-white/70">${escapeHtml(item)}</span>`,
			)
			.join("")}</div></div>`;
	};

	const renderCategoryTabs = () => {
		const categories = Array.from(
			new Set(allProjects.map((item) => item.category)),
		).sort((a, b) => a.localeCompare(b));
		const tabs = [
			renderTab(
				"all",
				options.filterAllText,
				allProjects.length,
				currentCategory,
				"category",
			),
			...categories.map((category) =>
				renderTab(
					category,
					options.categoryTextMap[category] ?? category,
					allProjects.filter((item) => item.category === category).length,
					currentCategory,
					"category",
				),
			),
		];

		categoryTabs.innerHTML = tabs.join("");
	};

	const renderStatusTabs = () => {
		const statuses = ["completed", "in-progress", "planned"];
		const tabs = [
			renderTab(
				"all",
				options.filterAllText,
				allProjects.length,
				currentStatus,
				"status",
			),
			...statuses.map((status) =>
				renderTab(
					status,
					options.statusTextMap[status] ?? status,
					allProjects.filter((item) => item.status === status).length,
					currentStatus,
					"status",
				),
			),
		];
		statusTabs.innerHTML = tabs.join("");
	};

	const renderProjects = () => {
		const filtered = getFilteredProjects();
		if (filtered.length === 0) {
			grid.innerHTML = "";
			noResultsText.textContent = options.noResultsText;
			noResults.classList.remove("hidden");
			showContentState();
			return;
		}

		grid.innerHTML = filtered
			.map((item) => renderProjectCard(item, options))
			.join("");
		noResults.classList.add("hidden");
		showContentState();
	};

	const loadProjects = async () => {
		showLoadingState();
		errorText.textContent = options.errorText;
		retryButton.textContent = options.retryText;

		const projectList = fallbackProjects;
		const stats = getFallbackStats(projectList);
		const stack = getFallbackTechStack(projectList);

		if (projectList.length === 0) {
			showErrorState();
			return;
		}

		allProjects = projectList;
		projectStats = stats;
		techStack = stack;
		currentCategory = "all";
		currentStatus = "all";
		renderStats();
		renderTechStack();
		renderCategoryTabs();
		renderStatusTabs();
		renderProjects();
	};

	categoryTabs.addEventListener("click", (event) => {
		const target = event.target as HTMLElement | null;
		const button = target?.closest<HTMLButtonElement>("button[data-category]");
		if (!button) {
			return;
		}
		const nextValue = button.dataset.category ?? "all";
		if (nextValue === currentCategory) {
			return;
		}
		currentCategory = nextValue;
		renderCategoryTabs();
		renderProjects();
	});

	statusTabs.addEventListener("click", (event) => {
		const target = event.target as HTMLElement | null;
		const button = target?.closest<HTMLButtonElement>("button[data-status]");
		if (!button) {
			return;
		}
		const nextValue = button.dataset.status ?? "all";
		if (nextValue === currentStatus) {
			return;
		}
		currentStatus = nextValue;
		renderStatusTabs();
		renderProjects();
	});

	retryButton.addEventListener("click", () => {
		void loadProjects();
	});

	loadingState.setAttribute("aria-label", options.loadingText);
	void loadProjects();
}

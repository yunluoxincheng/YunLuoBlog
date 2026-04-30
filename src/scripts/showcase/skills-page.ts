import { type Skill as FallbackSkill,skillsData } from "@/data/skills";

interface SkillViewModel {
	id: string;
	name: string;
	description: string;
	icon: string;
	category: string;
	level: string;
	experience: {
		years: number;
		months: number;
	} | null;
	color: string;
}

export interface SkillsPageOptions {
	filterAllText: string;
	loadingText: string;
	errorText: string;
	retryText: string;
	noResultsText: string;
	categoryTextMap: Record<string, string>;
	levelTextMap: Record<string, string>;
	yearsText: string;
	monthsText: string;
	fallbackSkills?: FallbackSkill[];
}

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function normalizeFallbackSkill(item: FallbackSkill): SkillViewModel {
	return {
		id: item.id,
		name: item.name,
		description: item.description,
		icon: item.icon,
		category: item.category,
		level: item.level,
		experience: item.experience,
		color: item.color || "#3B82F6",
	};
}

function getLevelWidth(level: string): string {
	switch (level) {
		case "expert":
			return "100%";
		case "advanced":
			return "80%";
		case "intermediate":
			return "60%";
		case "beginner":
			return "40%";
		default:
			return "20%";
	}
}

function formatExperience(
	experience: SkillViewModel["experience"],
	options: SkillsPageOptions,
): string {
	if (!experience) {
		return "";
	}

	const parts: string[] = [];
	if (experience.years > 0) {
		parts.push(`${experience.years} ${options.yearsText}`);
	}
	if (experience.months > 0) {
		parts.push(`${experience.months} ${options.monthsText}`);
	}
	return parts.join(" ");
}

function renderTab(
	value: string,
	label: string,
	count: number,
	activeValue: string,
): string {
	return `<button class="filter-tabs-item ${
		value === activeValue ? "active" : ""
	}" data-category="${escapeHtml(value)}">${escapeHtml(label)} <span class="filter-tabs-count">(${count})</span></button>`;
}

function renderSkillCard(item: SkillViewModel, options: SkillsPageOptions): string {
	const levelText = options.levelTextMap[item.level] ?? item.level;
	const experienceText = formatExperience(item.experience, options);
	return `<div class="skill-card group relative bg-transparent rounded-xl border border-black/10 dark:border-white/10 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1" data-category="${escapeHtml(item.category)}"><div class="p-5"><div class="flex items-start gap-4 mb-3"><div class="w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center" style="background-color:${escapeHtml(item.color)}20"><span class="text-lg font-bold" style="color:${escapeHtml(item.color)}">${escapeHtml(item.name.charAt(0))}</span></div><div class="flex-1 min-w-0"><div class="flex items-center justify-between mb-1"><h3 class="text-lg font-bold text-black/90 dark:text-white/90 truncate group-hover:text-[var(--primary)] transition-colors duration-200">${escapeHtml(item.name)}</h3><span class="shrink-0 ml-2 px-2 py-0.5 text-xs rounded-md bg-[var(--primary)]/10 text-[var(--primary)] font-medium">${escapeHtml(levelText)}</span></div><p class="text-xs text-black/50 dark:text-white/50">${escapeHtml(experienceText)}</p></div></div><p class="text-sm text-black/60 dark:text-white/60 line-clamp-2 min-h-[2.5rem]">${escapeHtml(item.description)}</p><div class="mt-3 w-full bg-[var(--btn-regular-bg)] rounded-full h-1.5"><div class="h-1.5 rounded-full transition-all duration-500" style="width:${getLevelWidth(
		item.level,
	)};background-color:${escapeHtml(item.color)}"></div></div></div></div>`;
}

export function initSkillsApiPage(options: SkillsPageOptions): void {
	const root = document.getElementById("skills-page-root");
	if (!root || root.dataset.apiBound === "true") {
		return;
	}
	root.dataset.apiBound = "true";

	const categoryTabs = document.getElementById("skills-category-tabs");
	const grid = document.getElementById("skills-grid");
	const loadingState = document.getElementById("skills-loading");
	const errorState = document.getElementById("skills-error");
	const errorText = document.getElementById("skills-error-text");
	const retryButton = document.getElementById("skills-retry");
	const noResults = document.getElementById("skills-no-results");
	const noResultsText = document.getElementById("skills-no-results-text");

	if (
		!categoryTabs ||
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

	const fallbackSkills = (options.fallbackSkills ?? skillsData).map(
		normalizeFallbackSkill,
	);
	let skills: SkillViewModel[] = [];
	let currentCategory = "all";

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

	const renderTabs = () => {
		const categories = Array.from(
			new Set(skills.map((item) => item.category)),
		).sort((a, b) => a.localeCompare(b));
		categoryTabs.innerHTML = [
			renderTab(
				"all",
				options.filterAllText,
				skills.length,
				currentCategory,
			),
			...categories.map((category) =>
				renderTab(
					category,
					options.categoryTextMap[category] ?? category,
					skills.filter((item) => item.category === category).length,
					currentCategory,
				),
			),
		].join("");
	};

	const renderSkills = () => {
		const filtered =
			currentCategory === "all"
				? skills
				: skills.filter((item) => item.category === currentCategory);

		if (filtered.length === 0) {
			grid.innerHTML = "";
			noResults.classList.remove("hidden");
			noResultsText.textContent = options.noResultsText;
			showContentState();
			return;
		}

		grid.innerHTML = filtered
			.map((item) => renderSkillCard(item, options))
			.join("");
		noResults.classList.add("hidden");
		showContentState();
	};

	const loadSkills = async () => {
		showLoadingState();
		errorText.textContent = options.errorText;
		retryButton.textContent = options.retryText;

		skills = fallbackSkills;

		if (skills.length === 0) {
			showErrorState();
			return;
		}

		currentCategory = "all";
		renderTabs();
		renderSkills();
	};

	categoryTabs.addEventListener("click", (event) => {
		const target = event.target as HTMLElement | null;
		const button = target?.closest<HTMLButtonElement>("button[data-category]");
		if (!button) {
			return;
		}
		const nextCategory = button.dataset.category ?? "all";
		if (nextCategory === currentCategory) {
			return;
		}
		currentCategory = nextCategory;
		renderTabs();
		renderSkills();
	});

	retryButton.addEventListener("click", () => {
		void loadSkills();
	});

	loadingState.setAttribute("aria-label", options.loadingText);
	void loadSkills();
}

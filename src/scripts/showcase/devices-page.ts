import {
	type Device as FallbackDevice,
	type DeviceCategory,
	devicesData,
} from "@/data/devices";


interface DeviceViewModel {
	name: string;
	image: string;
	specs: string;
	description: string;
	link: string;
}

export interface DevicesPageOptions {
	loadingText: string;
	errorText: string;
	retryText: string;
	filterAllText: string;
	noResultsText: string;
	viewDetailsText: string;
	fallbackDevices?: DeviceCategory;
}

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function normalizeFallbackDevice(item: FallbackDevice): DeviceViewModel {
	return {
		name: item.name,
		image: item.image,
		specs: item.specs,
		description: item.description,
		link: item.link,
	};
}

function normalizeFallbackDevices(
	fallbackDevices: DeviceCategory,
): Record<string, DeviceViewModel[]> {
	const normalized: Record<string, DeviceViewModel[]> = {};
	for (const [brand, devices] of Object.entries(fallbackDevices)) {
		normalized[brand] = devices.map(normalizeFallbackDevice);
	}
	return normalized;
}

function renderBrandTab(
	value: string,
	label: string,
	activeBrand: string,
	count: number,
): string {
	return `<button data-brand="${escapeHtml(value)}" class="filter-tag px-6 py-2.5 rounded-lg font-medium transition-all ${
		value === activeBrand ? "active" : ""
	}">${escapeHtml(label)} (${count})</button>`;
}

function getAllDevices(
	groups: Record<string, DeviceViewModel[]>,
): DeviceViewModel[] {
	return Object.values(groups).flat();
}

function renderDeviceCard(
	item: DeviceViewModel,
	index: number,
	options: DevicesPageOptions,
): string {
	return `<a href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer" class="device-card group relative overflow-hidden rounded-xl border border-[var(--line-divider)] bg-[var(--card-bg)] transition-all duration-300 hover:border-[var(--primary)]/50 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-white/5 hover:scale-[1.02] hover:-translate-y-0.5 block cursor-pointer" style="animation-delay:${
		index * 100
	}ms; animation: fadeInUp 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) forwards; opacity: 0;"><div class="relative p-6 pb-0"><div class="flex justify-center items-center h-48 bg-gradient-to-br from-[var(--card-bg)] to-[var(--btn-regular-bg)] rounded-lg overflow-hidden relative"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="w-auto h-full max-h-full object-contain group-hover:scale-110 transition-all duration-500 drop-shadow-md relative z-10" loading="lazy"/></div></div><div class="p-6 pt-4 relative z-10"><div class="flex items-start justify-between mb-3"><h3 class="text-lg font-bold text-black/90 dark:text-white/90 group-hover:text-[var(--primary)] transition-colors duration-300">${escapeHtml(item.name)}</h3><div class="p-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">↗</div></div><div class="mb-4"><div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--btn-regular-bg)] text-black/70 dark:text-white/70 text-sm mb-3"><span class="font-medium">${escapeHtml(item.specs)}</span></div><p class="text-sm text-black/60 dark:text-white/60 leading-relaxed line-clamp-2">${escapeHtml(item.description)}</p></div><div class="flex items-center justify-between pt-3 border-t border-[var(--line-divider)] border-dashed opacity-0 group-hover:opacity-100 transition-all duration-300"><span class="text-sm font-medium text-[var(--primary)]">${escapeHtml(options.viewDetailsText)}</span><span class="w-5 h-5 text-[var(--primary)]">→</span></div></div></a>`;
}

export function initDevicesApiPage(options: DevicesPageOptions): void {
	const root = document.getElementById("devices-page-root");
	if (!root || root.dataset.apiBound === "true") {
		return;
	}
	root.dataset.apiBound = "true";

	const brandTabs = document.getElementById("devices-brand-tabs");
	const container = document.getElementById("devices-container");
	const loadingState = document.getElementById("devices-loading");
	const errorState = document.getElementById("devices-error");
	const errorText = document.getElementById("devices-error-text");
	const retryButton = document.getElementById("devices-retry");
	const noResults = document.getElementById("devices-no-results");
	const noResultsText = document.getElementById("devices-no-results-text");

	if (
		!brandTabs ||
		!container ||
		!loadingState ||
		!errorState ||
		!errorText ||
		!retryButton ||
		!noResults ||
		!noResultsText
	) {
		return;
	}

	const fallbackGroups = normalizeFallbackDevices(
		options.fallbackDevices ?? devicesData,
	);
	let groupedDevices: Record<string, DeviceViewModel[]> = {};
	let currentBrand = "";

	const showLoadingState = () => {
		loadingState.classList.remove("hidden");
		errorState.classList.add("hidden");
		container.classList.add("hidden");
		noResults.classList.add("hidden");
	};

	const showErrorState = () => {
		loadingState.classList.add("hidden");
		errorState.classList.remove("hidden");
		container.classList.add("hidden");
		noResults.classList.add("hidden");
	};

	const showContentState = () => {
		loadingState.classList.add("hidden");
		errorState.classList.add("hidden");
		container.classList.remove("hidden");
		noResults.classList.add("hidden");
	};

	const showEmptyState = () => {
		loadingState.classList.add("hidden");
		errorState.classList.add("hidden");
		container.classList.add("hidden");
		noResults.classList.remove("hidden");
	};

	const renderTabs = () => {
		const brands = Object.keys(groupedDevices);
		const totalCount = brands.reduce(
			(count, brand) => count + (groupedDevices[brand] || []).length,
			0,
		);
		brandTabs.innerHTML = [
			renderBrandTab(
				"all",
				options.filterAllText,
				currentBrand,
				totalCount,
			),
			...brands.map((brand) =>
				renderBrandTab(
					brand,
					brand,
					currentBrand,
					(groupedDevices[brand] || []).length,
				),
			),
		].join("");
	};

	const renderBrand = () => {
		const devices =
			currentBrand === "all"
				? getAllDevices(groupedDevices)
				: groupedDevices[currentBrand] || [];

		if (devices.length === 0) {
			showEmptyState();
			return;
		}

		container.innerHTML = devices
			.map((item, index) => renderDeviceCard(item, index, options))
			.join("");
		showContentState();
	};

	const loadDevices = async () => {
		showLoadingState();
		errorText.textContent = options.errorText;
		retryButton.textContent = options.retryText;
		noResultsText.textContent = options.noResultsText;
		groupedDevices = fallbackGroups;

		const brands = Object.keys(groupedDevices);
		if (brands.length === 0) {
			showEmptyState();
			return;
		}

		currentBrand = "all";
		renderTabs();
		renderBrand();
	};

	brandTabs.addEventListener("click", (event) => {
		const target = event.target as HTMLElement | null;
		const button = target?.closest<HTMLButtonElement>("button[data-brand]");
		if (!button) {
			return;
		}
		const nextBrand = button.dataset.brand ?? "";
		if (!nextBrand || nextBrand === currentBrand) {
			return;
		}
		currentBrand = nextBrand;
		renderTabs();
		renderBrand();
	});

	retryButton.addEventListener("click", () => {
		void loadDevices();
	});

	loadingState.setAttribute("aria-label", options.loadingText);
	void loadDevices();
}

import type { TOCConfig } from "../types/toc";

export function getRuntimeTOCConfig(): TOCConfig {
	if (typeof window === "undefined") {
		return {
			enable: true,
			mode: "sidebar",
			depth: 3,
			useJapaneseBadge: false,
		};
	}

	const siteConfig = window.siteConfig || {};
	const tocMode = (
		siteConfig.toc as { mode?: "float" | "sidebar" } | undefined
	)?.mode;
	return {
		enable: siteConfig.toc?.enable ?? true,
		mode: tocMode ?? "sidebar",
		depth: siteConfig.toc?.depth ?? 3,
		useJapaneseBadge: siteConfig.toc?.useJapaneseBadge ?? false,
	};
}

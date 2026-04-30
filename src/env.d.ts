/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

declare module "*.astro" {
	const AstroComponent: unknown;
	export default AstroComponent;
}

declare module "*.svelte" {
	const SvelteComponent: unknown;
	export default SvelteComponent;
}

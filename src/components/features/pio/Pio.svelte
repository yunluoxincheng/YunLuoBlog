<script lang="ts">
	import { onDestroy, onMount } from "svelte";

	import { pioConfig as buildTimePioConfig } from "@/config";
	import type { PioConfig as RuntimePioConfig } from "@/types/config";

	import type { PioProps } from "./types";

	export let config: Partial<PioProps["config"]> = {};

	function getRuntimePioConfig(): RuntimePioConfig {
		if (typeof window === "undefined") {
			return buildTimePioConfig;
		}

		return window.siteConfig?.pio ?? buildTimePioConfig;
	}

	function buildPioOptions(runtimeConfig: RuntimePioConfig) {
		return {
			mode: config?.mode ?? runtimeConfig.mode,
			hidden: config?.hiddenOnMobile ?? runtimeConfig.hiddenOnMobile,
			content: config?.dialog ?? runtimeConfig.dialog ?? {},
			model:
				config?.models ??
				runtimeConfig.models ??
				["/pio/models/pio/model.json"],
		};
	}

	function shouldSkipOnCurrentDevice(runtimeConfig: RuntimePioConfig): boolean {
		return Boolean(
			runtimeConfig.hiddenOnMobile &&
				window.matchMedia("(max-width: 1280px)").matches,
		);
	}

	let pioInstance: any = null;
	let pioInitialized = false;
	let pioContainer: HTMLDivElement | null = null;
	let pioCanvas: HTMLCanvasElement | null = null;
	let runtimePioConfig: RuntimePioConfig = buildTimePioConfig;
	let pioOptions = buildPioOptions(runtimePioConfig);
	let configUpdatedHandler: (() => void) | undefined;

	$: pioOptions = buildPioOptions(runtimePioConfig);

	function initPio() {
		if (
			typeof window !== "undefined" &&
			typeof (window as any).Paul_Pio !== "undefined"
		) {
			try {
				if (pioContainer && pioCanvas && !pioInitialized) {
					pioInstance = new (window as any).Paul_Pio(pioOptions);
					pioInitialized = true;
					console.log("Pio initialized successfully (Svelte)");
				} else if (!pioContainer || !pioCanvas) {
					console.warn("Pio DOM elements not found, retrying...");
					setTimeout(initPio, 100);
				}
			} catch (e) {
				console.error("Pio initialization error:", e);
			}
		} else {
			setTimeout(initPio, 100);
		}
	}

	function loadPioAssets() {
		if (typeof window === "undefined") {
			return;
		}

		const loadScript = (src: string, id: string): Promise<void> => {
			return new Promise((resolve, reject) => {
				if (document.querySelector(`#${id}`)) {
					resolve();
					return;
				}
				const script = document.createElement("script");
				script.id = id;
				script.src = src;
				script.async = true;
				script.onload = () => resolve();
				script.onerror = reject;
				document.head.appendChild(script);
			});
		};

		const loadWithIdle = () => {
			loadScript("/pio/static/l2d.js", "pio-l2d-script")
				.then(() => loadScript("/pio/static/pio.js", "pio-main-script"))
				.then(() => {
					setTimeout(initPio, 100);
				})
				.catch((error) => {
					console.error("Failed to load Pio scripts:", error);
				});
		};

		if ("requestIdleCallback" in window) {
			(window as any).requestIdleCallback(loadWithIdle, {
				timeout: 5000,
			});
		} else {
			setTimeout(loadWithIdle, 2000);
		}
	}

	function tryInitializePio(): void {
		if (!runtimePioConfig.enable) {
			return;
		}

		if (shouldSkipOnCurrentDevice(runtimePioConfig)) {
			return;
		}

		loadPioAssets();
	}

	onMount(() => {
		runtimePioConfig = getRuntimePioConfig();
		configUpdatedHandler = () => {
			runtimePioConfig = getRuntimePioConfig();
			tryInitializePio();
		};
		document.addEventListener("site-config-updated", configUpdatedHandler);
		tryInitializePio();
	});

	onDestroy(() => {
		if (configUpdatedHandler) {
			document.removeEventListener(
				"site-config-updated",
				configUpdatedHandler,
			);
		}
		console.log("Pio Svelte component destroyed (keeping instance alive)");
	});
</script>

{#if runtimePioConfig.enable}
	<div
		class={`pio-container ${runtimePioConfig.position || "right"}`}
		bind:this={pioContainer}
	>
		<div class="pio-action"></div>
		<canvas
			id="pio"
			bind:this={pioCanvas}
			width={runtimePioConfig.width || 280}
			height={runtimePioConfig.height || 250}
		></canvas>
	</div>
{/if}

<style>
	/* Pio 相关样式将通过外部CSS文件加载 */
</style>

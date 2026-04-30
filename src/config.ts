import configData from "./config-data.json";
import {
announcementConfig as defaultAnnouncementConfig,
commentConfig as defaultCommentConfig,
expressiveCodeConfig as defaultExpressiveCodeConfig,
footerConfig as defaultFooterConfig,
fullscreenWallpaperConfig as defaultFullscreenWallpaperConfig,
licenseConfig as defaultLicenseConfig,
musicPlayerConfig as defaultMusicPlayerConfig,
navBarConfig as defaultNavBarConfig,
permalinkConfig as defaultPermalinkConfig,
pioConfig as defaultPioConfig,
profileConfig as defaultProfileConfig,
randomPostsConfig as defaultRandomPostsConfig,
relatedPostsConfig as defaultRelatedPostsConfig,
sakuraConfig as defaultSakuraConfig,
shareConfig as defaultShareConfig,
sidebarLayoutConfig as defaultSidebarLayoutConfig,
siteConfig as defaultSiteConfig,
} from "./config-defaults";
import type {
AnnouncementConfig,
CommentConfig,
ExpressiveCodeConfig,
FooterConfig,
FullscreenWallpaperConfig,
LicenseConfig,
MusicPlayerConfig,
NavBarConfig,
PermalinkConfig,
PioConfig,
ProfileConfig,
RandomPostsConfig,
RelatedPostsConfig,
SakuraConfig,
ShareConfig,
SidebarLayoutConfig,
SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";
import { isPlainObject, mergeWithDefault } from "./utils/deep-merge";

type ConfigMap = Record<string, unknown>;

const loadedConfigMap: ConfigMap = resolveConfigMap(configData as ConfigMap);

function resolveConfigMap(source: ConfigMap | null | undefined): ConfigMap {
if (!source || typeof source !== "object") {
return {};
}

if (Object.keys(source).length === 0) {
return {};
}

return source;
}

function readConfig<T>(key: string, fallback: T): T {
return mergeWithDefault(fallback, loadedConfigMap[key]);
}

function normalizeNavLinkEntry(entry: unknown): unknown {
if (typeof entry === "number") {
return entry;
}

if (typeof entry === "string") {
const enumValue = (LinkPreset as unknown as Record<string, number>)[entry];
if (typeof enumValue === "number") {
return enumValue;
}

const numericValue = Number(entry);
if (!Number.isNaN(numericValue) && LinkPreset[numericValue] !== undefined) {
return numericValue;
}

return entry;
}

if (!isPlainObject(entry)) {
return entry;
}

const normalized: Record<string, unknown> = { ...entry };
if (Array.isArray(entry.children)) {
normalized.children = entry.children.map((child) =>
normalizeNavLinkEntry(child),
);
}

return normalized;
}

function normalizeNavBarConfig(config: NavBarConfig): NavBarConfig {
if (!Array.isArray(config.links)) {
return defaultNavBarConfig;
}

return {
...config,
links: config.links.map((entry) =>
normalizeNavLinkEntry(entry),
) as NavBarConfig["links"],
};
}

export const siteConfig: SiteConfig = readConfig("site", defaultSiteConfig);

export const fullscreenWallpaperConfig: FullscreenWallpaperConfig = readConfig(
"fullscreen-wallpaper",
defaultFullscreenWallpaperConfig,
);

const rawNavBarConfig = readConfig("navbar", defaultNavBarConfig);
export const navBarConfig: NavBarConfig = normalizeNavBarConfig(rawNavBarConfig);

export const profileConfig: ProfileConfig = readConfig(
"profile",
defaultProfileConfig,
);

export const licenseConfig: LicenseConfig = readConfig(
"license",
defaultLicenseConfig,
);

export const permalinkConfig: PermalinkConfig = readConfig(
"permalink",
defaultPermalinkConfig,
);

export const expressiveCodeConfig: ExpressiveCodeConfig = readConfig(
"expressive-code",
defaultExpressiveCodeConfig,
);

export const commentConfig: CommentConfig = readConfig(
"comment",
defaultCommentConfig,
);

export const shareConfig: ShareConfig = readConfig("share", defaultShareConfig);

export const announcementConfig: AnnouncementConfig = readConfig(
"announcement",
defaultAnnouncementConfig,
);

export const musicPlayerConfig: MusicPlayerConfig = readConfig(
"music-player",
defaultMusicPlayerConfig,
);

export const footerConfig: FooterConfig = readConfig("footer", defaultFooterConfig);

export const sidebarLayoutConfig: SidebarLayoutConfig = readConfig(
"sidebar-layout",
defaultSidebarLayoutConfig,
);

export const sakuraConfig: SakuraConfig = readConfig(
"sakura",
defaultSakuraConfig,
);

export const pioConfig: PioConfig = readConfig("pio", defaultPioConfig);

export const relatedPostsConfig: RelatedPostsConfig = readConfig(
"related-posts",
defaultRelatedPostsConfig,
);

export const randomPostsConfig: RandomPostsConfig = readConfig(
"random-posts",
defaultRandomPostsConfig,
);

export const widgetConfigs = {
profile: profileConfig,
announcement: announcementConfig,
music: musicPlayerConfig,
layout: sidebarLayoutConfig,
sakura: sakuraConfig,
fullscreenWallpaper: fullscreenWallpaperConfig,
pio: pioConfig,
share: shareConfig,
relatedPosts: relatedPostsConfig,
randomPosts: randomPostsConfig,
} as const;

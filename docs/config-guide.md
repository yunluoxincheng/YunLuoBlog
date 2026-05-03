# 站点配置完整指南

YunluoBlog 的核心配置集中在 `src/config-defaults.ts`。这个文件是
TypeScript 配置源，支持注释、IDE 自动补全和类型检查。

本指南覆盖两类内容：

- `src/config-defaults.ts` 中默认已经写出的全部配置项。
- `src/types/config.ts` 中声明、可以手动补充到配置里的可选字段。

## 配置文件

```text
src/
└── config-defaults.ts     # 核心配置文件
```

修改配置时，直接编辑 `src/config-defaults.ts`，提交并推送后由 CI 自动构建部署。

## 快速定位

| 想改什么 | 配置位置 |
| --- | --- |
| 站点标题、域名、语言、主题色 | `siteConfig` |
| 顶栏品牌和导航菜单 | `siteConfig.navbarTitle`、`navBarConfig` |
| 首页 Banner、壁纸、全屏壁纸 | `siteConfig.banner`、`siteConfig.wallpaperMode`、`fullscreenWallpaperConfig` |
| 文章列表、TOC、封面、OG 图片、上次编辑 | `siteConfig.postListLayout`、`siteConfig.toc`、文章显示相关字段 |
| 个人资料卡 | `profileConfig` |
| 公告、侧栏、页脚 | `announcementConfig`、`sidebarLayoutConfig`、`footerConfig` |
| 评论、分享、版权协议 | `commentConfig`、`shareConfig`、`licenseConfig` |
| 音乐播放器 | `musicPlayerConfig` |
| 樱花特效、看板娘 | `sakuraConfig`、`pioConfig` |
| 相关文章、随机文章 | `relatedPostsConfig`、`randomPostsConfig` |
| 代码块样式、固定链接 | `expressiveCodeConfig`、`permalinkConfig` |

## `siteConfig`

站点基础配置和全局开关。

| 字段 | 类型/可选值 | 说明 |
| --- | --- | --- |
| `title` | `string` | 站点标题。 |
| `subtitle` | `string` | 站点副标题，常用于浏览器标题、RSS/Atom 描述。 |
| `siteURL` | `string` | 站点完整 URL，建议以 `/` 结尾。 |
| `siteStartDate` | `string` | 站点开始运行日期，格式 `YYYY-MM-DD`，用于站点统计。 |
| `timeZone` | `-12` 到 `12` | 站点时区，当前默认来自 `SITE_TIMEZONE`。 |
| `lang` | `en`、`zh_CN`、`zh_TW`、`ja`、`ko`、`es`、`th`、`vi`、`tr`、`id` | 站点语言，当前默认来自 `SITE_LANG`。 |
| `keywords` | `string[]` | 可选。站点关键词，用于生成 `<meta name="keywords">`。默认配置未写出，可手动新增。 |

### `siteConfig.themeColor`

| 字段 | 类型/可选值 | 说明 |
| --- | --- | --- |
| `hue` | `number` | 主题色相，范围建议 `0-360`。 |
| `fixed` | `boolean` | 是否隐藏访问者的主题色选择器。`true` 表示固定主题色。 |

### `siteConfig.featurePages`

特色页面开关。关闭页面后，建议同步从 `navBarConfig.links` 移除对应导航。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `anime` | `boolean` | 番剧页面开关。 |
| `diary` | `boolean` | 日记页面开关。 |
| `friends` | `boolean` | 友链页面开关。 |
| `projects` | `boolean` | 项目页面开关。 |
| `skills` | `boolean` | 技能页面开关。 |
| `timeline` | `boolean` | 时间线页面开关。 |
| `albums` | `boolean` | 相册页面开关。 |
| `devices` | `boolean` | 设备页面开关。 |

### `siteConfig.navbarTitle`

顶栏左侧品牌标题配置。

| 字段 | 类型/可选值 | 说明 |
| --- | --- | --- |
| `mode` | `text-icon`、`logo` | 显示模式。`text-icon` 为图标加文字，`logo` 为仅显示 Logo。 |
| `text` | `string` | 顶栏标题文本。 |
| `icon` | `string` | 顶栏标题图标路径。 |
| `logo` | `string` | Logo 图片路径。 |

### `siteConfig.pageScaling`

页面自动缩放配置。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `enable` | `boolean` | 是否开启自动缩放。 |
| `targetWidth` | `number` | 目标宽度，低于此宽度时开始缩放。 |

### `siteConfig.bangumi`

Bangumi 数据源配置。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `userId` | `string` | Bangumi 用户 ID。 |
| `fetchOnDev` | `boolean` | 是否在开发环境获取 Bangumi 数据。 |

### `siteConfig.bilibili`

Bilibili 番剧数据源配置。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `vmid` | `string` | Bilibili 用户 ID。 |
| `fetchOnDev` | `boolean` | 是否在开发环境获取 Bilibili 数据。 |
| `coverMirror` | `string` | 封面图片镜像源，可留空。 |
| `useWebp` | `boolean` | 是否使用 WebP 格式。 |

如需获取 Bilibili 观看进度，不要把凭证写进配置文件。请在本地 `.env` 或
GitHub Secrets 中设置 `BILI_SESSDATA`。

### `siteConfig.anime`

番剧页面模式。

| 字段 | 类型/可选值 | 说明 |
| --- | --- | --- |
| `mode` | `bangumi`、`local`、`bilibili` | 番剧数据来源。 |

### `siteConfig.postListLayout`

文章列表布局配置。

| 字段 | 类型/可选值 | 说明 |
| --- | --- | --- |
| `defaultMode` | `list`、`grid` | 默认文章列表布局。启用双侧边栏时不建议使用 `grid`。 |
| `allowSwitch` | `boolean` | 是否允许访问者切换文章列表布局。 |
| `categoryBar.enable` | `boolean` | 是否在文章列表页显示分类导航条。 |

### `siteConfig.tagStyle`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `useNewStyle` | `boolean` | 是否使用新标签样式。`false` 为旧外框常亮样式。 |

### `siteConfig.wallpaperMode`

整体壁纸模式配置。

| 字段 | 类型/可选值 | 说明 |
| --- | --- | --- |
| `defaultMode` | `banner`、`fullscreen`、`none` | 默认壁纸模式：顶部横幅、全屏壁纸或无壁纸。 |
| `showModeSwitchOnMobile` | `off`、`mobile`、`desktop`、`both` | 布局/壁纸模式切换按钮显示范围。 |

### `siteConfig.banner`

顶部 Banner 配置。

| 字段 | 类型/可选值 | 说明 |
| --- | --- | --- |
| `src` | `string`、`string[]`、`{ desktop?, mobile? }` | Banner 图片。支持单图、多图，或桌面/移动端分别配置。 |
| `src.desktop` | `string` 或 `string[]` | 桌面端 Banner 图片。 |
| `src.mobile` | `string` 或 `string[]` | 移动端 Banner 图片。 |
| `position` | `top`、`center`、`bottom` | 图片显示位置，对应 `object-position`。 |
| `carousel.enable` | `boolean` | 多图时是否启用轮播。`false` 时随机显示一张。 |
| `carousel.interval` | `number` | 轮播间隔，单位秒。 |
| `waves.enable` | `boolean` | 是否启用水波纹效果。 |
| `waves.performanceMode` | `boolean` | 性能模式，降低动画复杂度。 |
| `waves.mobileDisable` | `boolean` | 是否在移动端禁用水波纹。 |
| `imageApi.enable` | `boolean` | 是否启用图片 API。 |
| `imageApi.url` | `string` | 图片 API 地址，要求返回每行一个图片链接的文本。 |
| `homeText.enable` | `boolean` | 是否在主页 Banner 显示自定义文字。 |
| `homeText.title` | `string` | 主页 Banner 大标题。 |
| `homeText.subtitle` | `string` 或 `string[]` | 主页 Banner 副标题。 |
| `homeText.typewriter.enable` | `boolean` | 是否启用副标题打字机效果。 |
| `homeText.typewriter.speed` | `number` | 打字速度，单位毫秒。 |
| `homeText.typewriter.deleteSpeed` | `number` | 删除速度，单位毫秒。 |
| `homeText.typewriter.pauseTime` | `number` | 完整显示后的暂停时间，单位毫秒。 |
| `credit.enable` | `boolean` | 是否显示 Banner 图片来源。 |
| `credit.text` | `string` | 图片来源文本。 |
| `credit.url` | `string` | 图片来源链接，可留空。 |
| `navbar.transparentMode` | `semi`、`full`、`semifull` | Banner 场景下导航栏透明模式。 |

### `siteConfig.toc`

目录功能配置。

| 字段 | 类型/可选值 | 说明 |
| --- | --- | --- |
| `enable` | `boolean` | TOC 总开关。 |
| `mobileTop` | `boolean` | 是否显示手机端顶部 TOC 按钮。 |
| `desktopSidebar` | `boolean` | 是否显示桌面端右侧栏 TOC。 |
| `floating` | `boolean` | 是否显示悬浮 TOC 按钮。 |
| `depth` | `1`、`2`、`3` | 目录深度。默认配置注释写到 `1-6`，但当前类型限制为 `1-3`。 |
| `useJapaneseBadge` | `boolean` | 是否使用日语假名标记代替数字。 |

### 文章与元信息显示

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `showCoverInContent` | `boolean` | 是否在文章内容页显示文章封面。 |
| `generateOgImages` | `boolean` | 是否生成 OpenGraph 图片。开启后构建会更慢。 |
| `favicon` | `Favicon[]` | 自定义 favicon，留空使用默认图标。 |
| `favicon[].src` | `string` | favicon 路径。 |
| `favicon[].theme` | `light`、`dark` | 可选。指定主题。 |
| `favicon[].sizes` | `string` | 可选。图标大小，如 `32x32`。 |
| `showLastModified` | `boolean` | 是否显示“上次编辑”卡片。 |

### `siteConfig.font`

字体配置。自定义字体还需要在 `src/styles/main.css` 中引入字体文件。
字体子集优化目前仅支持 TTF 格式字体。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `asciiFont.fontFamily` | `string` | 英文/ASCII 字体族名称。 |
| `asciiFont.fontWeight` | `string` 或 `number` | 英文/ASCII 字重。 |
| `asciiFont.localFonts` | `string[]` | 英文/ASCII 本地字体文件。 |
| `asciiFont.enableCompress` | `boolean` | 是否启用字体压缩。 |
| `cjkFont.fontFamily` | `string` | CJK 字体族名称。 |
| `cjkFont.fontWeight` | `string` 或 `number` | CJK 字重。 |
| `cjkFont.localFonts` | `string[]` | CJK 本地字体文件。 |
| `cjkFont.enableCompress` | `boolean` | 是否启用字体压缩。 |

### `siteConfig.pageProgressBar`

页面顶部进度条配置。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `enable` | `boolean` | 是否启用页面顶部进度条。 |
| `height` | `number` | 进度条高度，单位 px。 |
| `duration` | `number` | 动画时长，单位毫秒。 |

### `siteConfig.thirdPartyAnalytics`

第三方统计配置，目前用于 Microsoft Clarity。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `enable` | `boolean` | 是否启用第三方统计。 |
| `clarityId` | `string` | Clarity 项目 ID。 |

## `fullscreenWallpaperConfig`

全屏壁纸配置。只有当 `siteConfig.wallpaperMode.defaultMode` 为 `fullscreen`
或用户切换到全屏壁纸模式时才会明显生效。

| 字段 | 类型/可选值 | 说明 |
| --- | --- | --- |
| `src` | `string`、`string[]`、`{ desktop?, mobile? }` | 全屏壁纸图片。 |
| `src.desktop` | `string` 或 `string[]` | 桌面端壁纸图片。 |
| `src.mobile` | `string` 或 `string[]` | 移动端壁纸图片。 |
| `position` | `top`、`center`、`bottom` | 壁纸位置。 |
| `carousel.enable` | `boolean` | 是否启用轮播。 |
| `carousel.interval` | `number` | 轮播间隔，单位秒。 |
| `zIndex` | `number` | 壁纸层级。 |
| `opacity` | `number` | 壁纸透明度，建议 `0-1`。 |
| `blur` | `number` | 背景模糊程度。 |

## `navBarConfig`

导航栏菜单配置。

| 字段 | 类型/可选值 | 说明 |
| --- | --- | --- |
| `links` | `(NavBarLink | LinkPreset)[]` | 顶层导航链接数组。 |
| `links[].name` | `string` | 菜单名称。 |
| `links[].url` | `string` | 菜单链接。 |
| `links[].external` | `boolean` | 是否外部链接。 |
| `links[].icon` | `string` | Iconify 图标名。 |
| `links[].children` | `(NavBarLink | LinkPreset)[]` | 子菜单。 |

可用预设链接：

| 预设 | 对应页面 |
| --- | --- |
| `LinkPreset.Home` | 首页 |
| `LinkPreset.Archive` | 归档 |
| `LinkPreset.About` | 关于 |
| `LinkPreset.Friends` | 友链 |
| `LinkPreset.Anime` | 番剧 |
| `LinkPreset.Diary` | 日记 |
| `LinkPreset.Albums` | 相册 |
| `LinkPreset.Projects` | 项目 |
| `LinkPreset.Skills` | 技能 |
| `LinkPreset.Timeline` | 时间线 |

## `profileConfig`

个人资料卡配置。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `avatar` | `string` | 头像路径。相对 `/src`，或以 `/` 开头表示相对 `/public`。 |
| `name` | `string` | 用户名。 |
| `bio` | `string` | 个人简介。 |
| `typewriter.enable` | `boolean` | 是否启用简介打字机效果。 |
| `typewriter.speed` | `number` | 打字速度，单位毫秒。 |
| `links` | `array` | 社交链接数组。 |
| `links[].name` | `string` | 社交平台名称。 |
| `links[].url` | `string` | 社交链接地址。 |
| `links[].icon` | `string` | Iconify 图标名。 |

## `licenseConfig`

文章版权协议配置。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `enable` | `boolean` | 是否显示版权协议。 |
| `name` | `string` | 协议名称。 |
| `url` | `string` | 协议链接。 |

## `permalinkConfig`

文章固定链接配置。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `enable` | `boolean` | 是否启用全局 permalink。关闭时使用默认文件名链接。 |
| `format` | `string` | permalink 格式模板。 |

支持的占位符：

| 占位符 | 说明 |
| --- | --- |
| `%year%` | 4 位年份。 |
| `%monthnum%` | 2 位月份。 |
| `%day%` | 2 位日期。 |
| `%hour%` | 2 位小时。 |
| `%minute%` | 2 位分钟。 |
| `%second%` | 2 位秒。 |
| `%post_id%` | 文章序号，按发布时间升序排列。 |
| `%postname%` | 文章文件名 slug。 |
| `%raw_postname%` | 文章原始文件名，保留大小写。 |
| `%category%` | 分类名，无分类时为 `uncategorized`。 |

示例：

```typescript
format: "%year%/%monthnum%/%day%/%postname%"
```

## `expressiveCodeConfig`

代码块高亮配置。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `theme` | `string` | Expressive Code 主题。建议选择深色主题。 |
| `hideDuringThemeTransition` | `boolean` | 主题切换时是否临时隐藏代码块，减少卡顿。 |

## `commentConfig`

评论系统配置。

| 字段 | 类型/可选值 | 说明 |
| --- | --- | --- |
| `enable` | `boolean` | 是否启用评论功能。 |
| `system` | `twikoo`、`giscus` | 评论系统选择。 |

### `commentConfig.twikoo`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `envId` | `string` | Twikoo 环境地址或 ID。 |
| `region` | `string` | 可选。Twikoo 区域。默认配置未写出，可手动新增。 |
| `lang` | `string` | Twikoo 语言。 |

### `commentConfig.giscus`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `repo` | `string` | GitHub 仓库，如 `owner/repo`。 |
| `repoId` | `string` | Giscus 仓库 ID。 |
| `category` | `string` | Discussions 分类名。 |
| `categoryId` | `string` | Discussions 分类 ID。 |
| `mapping` | `string` | 页面和 discussion 的映射方式。 |
| `strict` | `string` | 是否严格匹配。 |
| `reactionsEnabled` | `string` | 是否启用反应。 |
| `emitMetadata` | `string` | 是否输出 metadata。 |
| `inputPosition` | `string` | 输入框位置。 |
| `theme` | `string` | Giscus 主题。 |
| `lang` | `string` | Giscus 语言。 |
| `loading` | `string` | 加载策略。 |

## `shareConfig`

分享功能配置。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `enable` | `boolean` | 是否启用分享功能。 |

## `announcementConfig`

公告组件配置。公告是否显示主要由 `sidebarLayoutConfig.components` 是否包含
`announcement` 控制。

| 字段 | 类型/可选值 | 说明 |
| --- | --- | --- |
| `title` | `string` | 公告标题，留空时使用 i18n 默认文案。 |
| `content` | `string` | 公告内容。 |
| `icon` | `string` | 可选。公告图标。默认配置未写出，可手动新增。 |
| `type` | `info`、`warning`、`success`、`error` | 可选。公告类型。默认配置未写出，可手动新增。 |
| `closable` | `boolean` | 是否允许用户关闭公告。 |
| `link.enable` | `boolean` | 是否启用公告链接。 |
| `link.text` | `string` | 链接文本。 |
| `link.url` | `string` | 链接地址。 |
| `link.external` | `boolean` | 是否外部链接。 |

## `musicPlayerConfig`

音乐播放器配置。

| 字段 | 类型/可选值 | 说明 |
| --- | --- | --- |
| `enable` | `boolean` | 是否启用音乐播放器。 |
| `showFloatingPlayer` | `boolean` | 是否显示悬浮播放器 UI。 |
| `floatingEntryMode` | `default`、`fab` | 悬浮入口模式。 |
| `mode` | `local`、`meting` | 播放器模式。 |
| `meting_api` | `string` | Meting API 地址模板。 |
| `id` | `string` | 歌单 ID。 |
| `server` | `string` | 音乐源服务器，如 `netease`、`tencent`、`kugou`。 |
| `type` | `string` | 播单类型，如 `playlist`。 |

本地音乐模式的歌单数据在
`src/components/widgets/music-player/constants.ts` 的 `LOCAL_PLAYLIST` 中维护。

## `footerConfig`

页脚自定义 HTML 配置。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `enable` | `boolean` | 是否启用 Footer HTML 注入。 |
| `customHtml` | `string` | 自定义页脚 HTML，例如备案号。为空时可能读取 `FooterConfig.html`。 |

## `sidebarLayoutConfig`

侧边栏布局配置，用于控制侧边栏组件的显示、排序、动画和响应式行为。

### `sidebarLayoutConfig.properties`

每个数组项都是一个侧边栏组件配置。

| 字段 | 类型/可选值 | 说明 |
| --- | --- | --- |
| `type` | `WidgetComponentType` | 组件类型。 |
| `position` | `top`、`sticky` | 组件位置。 |
| `class` | `string` | 自定义 CSS 类名。 |
| `style` | `string` | 可选。内联样式。默认配置未写出，可手动新增。 |
| `animationDelay` | `number` | 动画延迟，单位毫秒。 |
| `responsive.hidden` | `("mobile" | "tablet" | "desktop")[]` | 可选。指定设备隐藏。默认配置未写出，可手动新增。 |
| `responsive.collapseThreshold` | `number` | 折叠阈值。 |
| `customProps` | `Record<string, any>` | 可选。传给自定义组件的扩展属性。默认配置未写出，可手动新增。 |

可用组件类型：

| 类型 | 说明 |
| --- | --- |
| `profile` | 用户资料组件。 |
| `announcement` | 公告组件。 |
| `categories` | 分类组件。 |
| `tags` | 标签组件。 |
| `toc` | 目录组件。 |
| `card-toc` | 卡片式目录组件。 |
| `music-player` | 音乐播放器组件。 |
| `music-sidebar` | 侧栏音乐组件。 |
| `pio` | 看板娘组件。 |
| `site-stats` | 站点统计组件。 |
| `calendar` | 日历组件。 |
| `custom` | 自定义组件。 |

### `sidebarLayoutConfig.components`

控制各区域实际显示哪些组件，以及显示顺序。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `left` | `WidgetComponentType[]` | 左侧栏组件顺序。 |
| `right` | `WidgetComponentType[]` | 右侧栏组件顺序。 |
| `drawer` | `WidgetComponentType[]` | 移动端抽屉组件顺序。 |

### `sidebarLayoutConfig.defaultAnimation`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `enable` | `boolean` | 是否启用默认动画。 |
| `baseDelay` | `number` | 基础延迟，单位毫秒。 |
| `increment` | `number` | 每个组件递增的延迟，单位毫秒。 |

### `sidebarLayoutConfig.responsive`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `breakpoints.mobile` | `number` | 移动端断点，单位 px。 |
| `breakpoints.tablet` | `number` | 平板端断点，单位 px。 |
| `breakpoints.desktop` | `number` | 桌面端断点，单位 px。 |

## `sakuraConfig`

樱花特效配置。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `enable` | `boolean` | 是否启用樱花特效。 |
| `sakuraNum` | `number` | 樱花数量。 |
| `limitTimes` | `number` | 樱花越界限制次数，`-1` 为无限循环。 |
| `size.min` | `number` | 樱花最小尺寸倍数。 |
| `size.max` | `number` | 樱花最大尺寸倍数。 |
| `opacity.min` | `number` | 樱花最小不透明度。 |
| `opacity.max` | `number` | 樱花最大不透明度。 |
| `speed.horizontal.min` | `number` | 水平移动速度最小值。 |
| `speed.horizontal.max` | `number` | 水平移动速度最大值。 |
| `speed.vertical.min` | `number` | 垂直移动速度最小值。 |
| `speed.vertical.max` | `number` | 垂直移动速度最大值。 |
| `speed.rotation` | `number` | 旋转速度。 |
| `speed.fadeSpeed` | `number` | 消失速度，不应大于最小不透明度。 |
| `zIndex` | `number` | 层级。 |

## `pioConfig`

Pio 看板娘配置。

| 字段 | 类型/可选值 | 说明 |
| --- | --- | --- |
| `enable` | `boolean` | 是否启用看板娘。 |
| `models` | `string[]` | 模型文件路径数组。 |
| `position` | `left`、`right` | 模型位置。 |
| `width` | `number` | 模型宽度。 |
| `height` | `number` | 模型高度。 |
| `mode` | `static`、`fixed`、`draggable` | 展示模式。 |
| `hiddenOnMobile` | `boolean` | 是否在移动端隐藏。 |
| `dialog.welcome` | `string` 或 `string[]` | 欢迎词。 |
| `dialog.touch` | `string` 或 `string[]` | 触摸提示。 |
| `dialog.home` | `string` | 首页提示。 |
| `dialog.skin` | `[string, string]` | 换装提示，格式为 `[切换前, 切换后]`。 |
| `dialog.close` | `string` | 关闭提示。 |
| `dialog.link` | `string` | 关于链接。 |
| `dialog.custom` | `array` | 可选。自定义交互提示。默认配置未写出，可手动新增。 |
| `dialog.custom[].selector` | `string` | CSS 选择器。 |
| `dialog.custom[].type` | `read`、`link` | 交互类型。 |
| `dialog.custom[].text` | `string` | 自定义文本。 |

## `relatedPostsConfig`

相关文章配置。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `enable` | `boolean` | 是否启用相关文章。 |
| `maxCount` | `number` | 最多显示的相关文章数量。 |

## `randomPostsConfig`

随机文章配置。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `enable` | `boolean` | 是否启用随机文章。 |
| `maxCount` | `number` | 最多显示的随机文章数量。 |

## `widgetConfigs`

`widgetConfigs` 是把多个配置对象统一导出的运行时集合，通常不需要手动修改。

| 字段 | 对应配置 |
| --- | --- |
| `profile` | `profileConfig` |
| `announcement` | `announcementConfig` |
| `music` | `musicPlayerConfig` |
| `layout` | `sidebarLayoutConfig` |
| `sakura` | `sakuraConfig` |
| `fullscreenWallpaper` | `fullscreenWallpaperConfig` |
| `pio` | `pioConfig` |
| `share` | `shareConfig` |
| `relatedPosts` | `relatedPostsConfig` |
| `randomPosts` | `randomPostsConfig` |

## 常见配置示例

### 修改站点标题和域名

```typescript
export const siteConfig: SiteConfig = {
	title: "我的博客",
	subtitle: "记录技术与生活",
	siteURL: "https://example.com/",
	// ...
};
```

### 修改主题色

```typescript
themeColor: {
	hue: 280,
	fixed: false,
},
```

### 关闭不需要的页面

```typescript
featurePages: {
	anime: true,
	diary: false,
	friends: true,
	projects: false,
	skills: true,
	timeline: true,
	albums: true,
	devices: true,
},
```

关闭页面后，记得同步检查 `navBarConfig.links`，避免导航到不存在的页面。

### 配置音乐播放器

```typescript
export const musicPlayerConfig: MusicPlayerConfig = {
	enable: true,
	showFloatingPlayer: true,
	floatingEntryMode: "fab",
	mode: "local",
	// ...
};
```

如果使用本地模式，还需要编辑
`src/components/widgets/music-player/constants.ts` 中的 `LOCAL_PLAYLIST`。

### 配置 Twikoo 评论

```typescript
export const commentConfig: CommentConfig = {
	enable: true,
	system: "twikoo",
	twikoo: {
		envId: "https://你的-twikoo-地址",
		lang: SITE_LANG,
	},
	// ...
};
```

### 配置 Giscus 评论

```typescript
export const commentConfig: CommentConfig = {
	enable: true,
	system: "giscus",
	giscus: {
		repo: "your-github-username/your-repo-name",
		repoId: "your-repo-id",
		category: "Announcements",
		categoryId: "your-category-id",
		mapping: "pathname",
		strict: "0",
		reactionsEnabled: "1",
		emitMetadata: "0",
		inputPosition: "top",
		theme: "preferred_color_scheme",
		lang: SITE_LANG,
		loading: "lazy",
	},
};
```

### 新增站点关键词

`keywords` 在类型中支持，但默认配置里没有写出。需要时可以加到
`siteConfig` 顶层：

```typescript
keywords: ["博客", "Astro", "Svelte", "YunluoBlog"],
```

## 配置生效流程

1. 编辑 `src/config-defaults.ts`。
2. 本地验证：

```bash
pnpm type-check
pnpm build
```

3. 提交并推送：

```bash
git add src/config-defaults.ts
git commit -m "更新站点配置"
git push origin main
```

4. CI 自动构建部署，通常数分钟后刷新页面可见。

## 注意事项

- 前端项目使用 `pnpm`，不要使用 `npm` 或 `yarn`。
- `src/config-defaults.ts` 是 TypeScript 文件，修改后建议运行 `pnpm type-check`。
- 凭证类信息不要写进配置文件，例如 `BILI_SESSDATA` 应放在 `.env` 或 GitHub Secrets。
- 关闭特色页面后，需要同步检查导航菜单。
- `toc.depth` 当前类型限制为 `1 | 2 | 3`，不要只参考旧注释写成更大的值。

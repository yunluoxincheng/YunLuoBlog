# 站点配置指南

YunluoBlog 所有配置集中在 `src/config-defaults.ts`，TypeScript 文件支持注释和 IDE 自动补全。

## 配置文件

```
src/
└── config-defaults.ts     # ★ 唯一配置文件，所有配置都在这里（约 700 行）
```

## 修改方式

直接编辑 `src/config-defaults.ts`，搜关键词找到对应代码行，改完提交即可。因为是 TypeScript，支持：

- 行内注释标注每个字段的用途
- IDE 自动补全和类型检查
- 改错会有编译错误提醒

## 字段速查

> 在 `config-defaults.ts` 中搜索关键词定位。

| 想改什么 | 搜索关键词 | 位置 | 类型 |
|---------|-----------|------|------|
| 站点标题 | title / 标题 | `siteConfig.title` | string |
| 副标题（浏览器标签页） | subtitle | `siteConfig.subtitle` | string |
| 网站域名 | siteURL / 域名 | `siteConfig.siteURL` | string |
| 语言 | SITE_LANG | `SITE_LANG`（约第 24 行） | string |
| 主题色 | hue | `siteConfig.themeColor.hue` | number（0-360） |
| 壁纸 | wallpaper | `siteConfig.wallpaperMode` | object |
| TOC 目录 | toc | `siteConfig.toc` | object |
| 功能页面开关 | featurePages | `siteConfig.featurePages` | object |
| 用户名 | name | `profileConfig.name` | string |
| 个人简介 | bio | `profileConfig.bio` | string |
| 头像 | avatar | `profileConfig.avatar` | string |
| 社交链接 | links | `profileConfig.links` | array |
| Banner 大标题 | homeText | `siteConfig.banner.homeText.title` | string |
| Banner 副标题 | homeText.subtitle | `siteConfig.banner.homeText.subtitle` | array |
| 左上角品牌名 | navbarTitle | `siteConfig.navbarTitle.text` | string |
| 导航菜单 | navBarConfig | `navBarConfig.links` | array |
| 公告 | announcementConfig | `announcementConfig.content` | string |
| 评论系统 | commentConfig | `commentConfig` | object |
| 音乐播放器 | musicPlayerConfig | `musicPlayerConfig` | object |
| 页脚 | footerConfig | `footerConfig` | object |
| 侧边栏布局 | sidebarLayoutConfig | `sidebarLayoutConfig` | object |
| 看板娘 | pioConfig | `pioConfig` | object |
| 樱花特效 | sakuraConfig | `sakuraConfig` | object |
| 代码块 | expressiveCodeConfig | `expressiveCodeConfig` | object |
| 相关文章 | relatedPostsConfig | `relatedPostsConfig` | object |
| 随机文章 | randomPostsConfig | `randomPostsConfig` | object |
| 许可协议 | licenseConfig | `licenseConfig` | object |
| 分享按钮 | shareConfig | `shareConfig` | object |
| 全屏壁纸 | fullscreenWallpaperConfig | `fullscreenWallpaperConfig` | object |
| Permalink | permalinkConfig | `permalinkConfig` | object |

## 常见配置示例

### 修改站点标题和域名

```typescript
export const siteConfig: SiteConfig = {
    title: "我的博客",
    subtitle: "记录技术与生活",
    siteURL: "https://example.com/",
    lang: "zh_CN",
    // ...
```

### 修改主题色

```typescript
themeColor: {
    hue: 280,    // 0=红, 120=绿, 240=蓝, 280=紫
    fixed: false,
},
```

### 关闭不需要的页面

```typescript
featurePages: {
    anime: true,
    diary: false,     // 关闭日记页
    friends: true,
    projects: false,  // 关闭项目页
    // ...
},
```

### 配置音乐播放器

```typescript
export const musicPlayerConfig: MusicPlayerConfig = {
    enable: true,              // 开启
    mode: "local",             // 本地模式
    // ...
```

然后在 `src/components/widgets/music-player/constants.ts` 的 `LOCAL_PLAYLIST` 数组中添加歌曲。

### 配置评论（Twikoo）

```typescript
export const commentConfig: CommentConfig = {
    enable: true,
    system: "twikoo",
    twikoo: {
        envId: "https://你的twikoo地址",
        lang: SITE_LANG,
    },
    // ...
```

## 配置生效流程

1. 编辑 `src/config-defaults.ts`
2. 提交推送：

```bash
git add src/config-defaults.ts
git commit -m "更新配置"
git push origin main
```

3. CI 自动构建部署，约 3-5 分钟后刷新页面可见

## 注意事项

- 配置文件是 TypeScript，支持行内注释，比 JSON 方便很多
- IDE 会有类型检查和自动补全，改错了编译时就会报错
- 修改前建议本地 `pnpm build` 验证一次

# 站点配置指南

YunluoBlog 的配置通过文件系统管理，修改后提交 Git 即可自动生效。无需登录后台，无需数据库。

## 配置文件位置

```
src/
├── config-defaults.ts     # 默认配置（716 行，一般不需要修改）
├── config-data.json       # ★ 用户配置（528 行，这是你需要改的文件）
└── config.ts              # 配置入口（自动合并上面两个）
```

## 配置结构

### 字段速查表

> 搜关键词定位 → 在 `config-data.json` 中写入对应 JSON 路径即可。

| 想改什么 | 搜索关键词 | JSON 路径 | 类型 |
|---------|-----------|-----------|------|
| 站点标题 | 标题 / title | `site.title` | string |
| 站点副标题（浏览器标签页） | 副标题 / subtitle | `site.subtitle` | string |
| 网站域名 | 域名 / URL | `site.siteURL` | string |
| 语言 | 语言 / lang | `site.lang` | string（`zh_CN`/`en`/`ja`） |
| 主题色 | 颜色 / hue / 色相 | `site.themeColor.hue` | number（0-360） |
| 壁纸 | 壁纸 / wallpaper | `site.wallpaperMode.enable` | boolean |
| TOC 目录 | 目录 / toc | `site.toc.enable` | boolean |
| TOC 深度 | toc / depth | `site.toc.depth` | number |
| 启用/关闭日记页 | 日记 / diary | `site.featurePages.diary` | boolean |
| 启用/关闭友链页 | 友链 / friends | `site.featurePages.friends` | boolean |
| 启用/关闭相册页 | 相册 / albums | `site.featurePages.albums` | boolean |
| 启用/关闭番剧页 | 番剧 / anime | `site.featurePages.anime` | boolean |
| 启用/关闭设备页 | 设备 / devices | `site.featurePages.devices` | boolean |
| 用户名（个人信息） | 用户名 / name | `profile.name` | string |
| 个人简介 | 简介 / bio | `profile.bio` | string |
| 头像 | 头像 / avatar | `profile.avatar` | string |
| 社交链接 | 社交 / links | `profile.links` | array |
| Banner 大标题 | Banner / homeText | `site.banner.homeText.title` | string |
| Banner 副标题 | Banner / 副标题 | `site.banner.homeText.subtitle` | array |
| 左上角品牌名 | 品牌 / 导航 / navbar | `navbar.brand.text` | string |
| 导航菜单 | 导航 / navbar / links | `navbar.links` | array |
| 公告内容 | 公告 / announcement | `announcement.content` | string |
| 启用评论 | 评论 / comment | `comment.enable` | boolean |
| 评论系统切换 | 评论 / twikoo / giscus | `comment.system` | string |
| Twikoo 地址 | twikoo / envId | `comment.twikoo.envId` | string |
| Giscus 仓库 | giscus / repo | `comment.giscus.repo` | string |
| 启用音乐播放器 | 音乐 / music | `music-player.enable` | boolean |
| 音乐播放器模式 | meting / local | `music-player.mode` | string |
| 本地歌单 | 歌单 / localPlaylist | `music-player.localPlaylist` | array |
| Meting 歌单 ID | meting / id | `music-player.id` | string |
| 启用页脚 | 页脚 / footer | `footer.enable` | boolean |
| 页脚内容 | 备案 / footer | `footer.customHtml` | string |
| 启用看板娘 | 看板娘 / pio | `pio.enable` | boolean |
| 启用樱花特效 | 樱花 / sakura | `sakura.enable` | boolean |
| 代码块主题过渡 | expressive / code | `expressive-code.hideDuringThemeTransition` | boolean |

## 常见配置操作

### 修改站点标题

```json
{
  "site": {
    "title": "我的博客",
    "subtitle": "记录技术与生活"
  }
}
```

### 修改主题色

```json
{
  "site": {
    "themeColor": {
      "hue": 280,
      "fixed": false
    }
  }
}
```
> `hue` 取 0-360 之间的色相值。0 红 / 120 绿 / 240 蓝 / 280 紫。

### 添加导航链接

```json
{
  "navbar": {
    "links": [
      { "name": "首页", "url": "/", "preset": "home", "icon": "home" },
      { "name": "GitHub", "url": "https://github.com/你的用户名", "icon": "github" }
    ]
  }
}
```

### 关闭某个功能页面

```json
{
  "site": {
    "featurePages": {
      "diary": true,
      "friends": true,
      "albums": false,
      "anime": false,
      "devices": false
    }
  }
}
```

### 配置音乐播放器

```json
{
  "music-player": {
    "enable": true,
    "mode": "local",
    "localPlaylist": [
      { "name": "歌曲名", "artist": "歌手", "url": "/music/song.mp3", "cover": "/images/cover.jpg" }
    ]
  }
}
```

### 配置评论系统（Twikoo）

```json
{
  "comment": {
    "enable": true,
    "type": "twikoo",
    "twikooConfig": {
      "envId": "https://你的twikoo地址"
    }
  }
}
```

## 配置生效流程

1. 编辑 `src/config-data.json`
2. 提交推送到 GitHub：
```bash
git add src/config-data.json
git commit -m "更新站点配置"
git push origin main
```
3. GitHub Actions 自动构建并部署（约 3-5 分钟）
4. 刷新博客页面即可看到更新

## 注意事项

- `config-data.json` 中的键名必须与 `config-defaults.ts` 中的结构完全一致
- JSON 不允许尾逗号，不允许多行注释
- 修改后建议本地运行 `pnpm build` 验证格式正确后再推送

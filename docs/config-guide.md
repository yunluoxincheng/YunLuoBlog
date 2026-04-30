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

`config-data.json` 是一个多层嵌套的 JSON 文件，包含以下配置块：

| 配置块 | 说明 | 关键字段 |
|--------|------|----------|
| `site` | 站点信息 | `title`(标题), `subtitle`(副标题), `lang`(语言), `siteURL`(网站地址) |
| `site.themeColor` | 主题色 | `hue`(HSL 色相 0-360), `fixed`(是否固定) |
| `site.wallpaperMode` | 壁纸模式 | `enable`, `type`(cover/fixed) |
| `site.toc` | 目录设置 | `enable`, `mode`(float/sidebar), `depth` |
| `site.featurePages` | 功能开关 | 控制各页面的显示/隐藏 |
| `navbar` | 导航栏 | `links` 数组，每项含 `name`, `url`, `preset`, `icon` |
| `profile` | 个人信息 | `name`, `avatar`, `bio`, `socialLinks` |
| `comment` | 评论系统 | `enable`, `type`(twikoo/giscus), `twikooConfig` |
| `music-player` | 音乐播放器 | `enable`, `mode`(local/meting), `localPlaylist` |
| `footer` | 页脚 | `enable`, `links`, `copyright` |
| `announcement` | 公告 | `enable`, `content` |
| `sidebar-layout` | 侧边栏布局 | 控制左右侧边栏的部件 |
| `pio` | 看板娘 | `enable`, `model` |
| `expressive-code` | 代码块 | `hideDuringThemeTransition` |
| `sakura` | 樱花特效 | `enable` |

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

---
title: YunLuoBlog 正式上线！
description: 个人博客正式上线，从技术选型到部署上线的完整历程。
published: 2026-05-03
tags: [博客, Astro, Docker, 部署]
category: 随笔
pinned: true
---

经过近一个月的开发、改造与调试，YunLuoBlog 于 2026 年 5 月 3 日正式上线。

## 项目缘起

作为一个开发者，我一直想拥有一个属于自己的技术博客——不只是为了记录学习笔记，更是为了在互联网上有一片属于自己的空间。市面上的博客方案很多：Hexo、Hugo、WordPress、Ghost……各有优劣，但都不完全符合我的需求。我想要的是一套轻量、可控、现代化的博客系统，既能享受静态站点的极致性能，又要有美观的界面和丰富的交互体验。

最终我选择了 [Mizuki](https://github.com/LyraVoid/Mizuki) 作为前端基础——这是一个基于 Astro 6 + Svelte 5 的博客主题，由 [LyraVoid](https://github.com/LyraVoid) 开发，设计精美、功能丰富。在此向 Mizuki 的作者致以由衷的感谢，没有他的工作，这个博客不会有如此漂亮的起点。

## 架构演进

Mizuki 原版配套了一套完整的后端 Spring Boot API 服务，包含 PostgreSQL 数据库、JWT 认证、管理后台等组件。但在实际使用中，我逐渐发现这套全栈架构对于个人博客来说过于沉重：

**问题一：内容发布流程冗长。** 在后台编写文章后，需要通过构建流程将文章从数据库同步为 Markdown 文件，再由 Astro 构建成静态页面。这意味着写一篇文章需要两次构建才能上线——一次也省不了。

**问题二：配置系统割裂。** 配置被分散在三个层次：构建时默认值、JSON 用户配置、运行时 API 拉取。总共 17 个配置模块中只有 5 个能通过后台实时生效，其余的修改后仍然需要重新构建。这种设计让管理员对"哪些改完立刻生效"产生困惑。

**问题三：运维成本与收益不匹配。** 维护一套 PostgreSQL + Spring Boot + Docker Compose 多服务架构，仅为了偶尔写几篇文章的个人博客，投入产出比太低。服务器需要至少 2GB 内存才能流畅运行 Java 应用，容器编排的依赖链出错时排查也相当耗时。

于是我做了一个大胆的决定——将整个项目从全栈架构简化为纯静态站点。改造的核心思路是：**用 Git 替代数据库，用文件系统替代管理后台，用 CI/CD 替代 API 服务**。

具体来说，删除了以下组件：
- 整个 Spring Boot 后端项目（yunluoblog-server，含 16 个控制器、70+ API 端点、20 张数据库表）
- 前端 API 调用层（20 个 Axios 模块）
- 管理后台全部 18 个页面和 29 个 Svelte 组件
- 构建时同步脚本和运行时配置拉取逻辑

累计删除了超过 17,000 行代码，但同时保留了所有公开页面的功能和视觉效果。文章改为直接编写 Markdown 文件管理，配置合并为单一的 TypeScript 文件（config-defaults.ts），所有内容通过 Git 版本控制。

## 功能概览

改造后的 YunLuoBlog 保留了原主题的全部核心功能，并在此基础上进行了优化：

**内容管理**
- Markdown 编写博客文章，支持 frontmatter 定义元信息
- 分类、标签自动聚合，归档按年月分组
- 加密文章保护（客户端 AES 解密）
- RSS / Atom 订阅

**社交展示**
- 日记时间线，记录日常点滴
- 好友链接展示，支持网站卡片预览
- 项目展示（含技术栈、状态标签和访问链接）
- 技能展示页面，分类呈现技术栈
- 时间线页面，记录学历和职业经历
- 设备展示，按品牌分组呈现

**媒体与娱乐**
- 追番列表，支持本地数据或 Bilibili/Bangumi API 自动同步
- 相册浏览，支持网格和瀑布流布局
- 本地音乐播放器，支持自定义歌单
- 看板娘（Live2D 模型），可交互

**交互与体验**
- 暗色模式 / 亮色模式切换
- 自定义主题色（HSL 色相任意调节）
- Swup 页面过渡动画，SPA 般的流畅体验
- Pagefind 全文搜索，纯静态实现
- 评论系统（Twikoo / Giscus 双支持）

## 技术架构

| 层级 | 技术选型 | 说明 |
|------|---------|------|
| 构建框架 | Astro 6 | 静态站点生成，零 JS 首屏 |
| 交互组件 | Svelte 5 | rune 语法，编译时优化 |
| 样式方案 | Tailwind CSS v4 | 原子化 CSS，按需生成 |
| 内容管理 | Markdown + Git | 文章即文件，版本可追溯 |
| 全文搜索 | Pagefind | 纯静态索引，无需后端 |
| 图标系统 | Iconify (Material Design) | 按需加载，体积极小 |
| 代码高亮 | Expressive Code | 终端风格，支持行号、折叠 |
| 数学公式 | KaTeX | 服务端渲染，闪电加载 |
| 容器化 | Docker 多阶段构建 | Node 构建 → Nginx 运行，镜像 ~50MB |
| CI/CD | GitHub Actions | push 即构建，自动推送到 Docker Hub |
| 服务器 | Ubuntu + Docker Compose | 单容器部署，cron 每分钟检查更新 |
| 域名 DNS | Spaceship | 域名注册与管理 |
| CDN/SSL | 云服务器 OpenResty + Let's Encrypt | HTTPS 全站加密，自动续签 |
| 内网穿透 | FRP | 本地服务器通过云服务器对外暴露 |

## 部署流程

整个部署流程已实现完全自动化：

```text
本地编写 Markdown 文章
    → git commit && git push
    → GitHub Actions 触发构建
    → pnpm install → type-check → astro build
    → docker build → push 到 Docker Hub
    → 服务器 cron 每分钟检测新镜像
    → docker compose pull && up -d
```

从推送代码到线上生效，通常在 3-5 分钟内完成。如果配置了 webhook，甚至可以做到秒级部署。整个过程不需要登录服务器，不需要手动执行任何命令。

## 性能优化

在构建过程中做了多项性能优化：
- 静态资源 30 天强缓存（CSS/JS/图片/字体）
- Gzip 压缩传输
- 小图片自动转 WebP 格式
- CSS 单文件输出，避免多 chunk 并行加载的层叠冲突
- 生产环境移除 console 和 debugger
- 内联样式阈值设为 4KB，防止小片段内联导致的样式顺序问题
- Remark/Rehype 插件链全部在构建时完成，客户端零 Markdown 解析

## 展望

博客已经上线，但这只是开始。后续计划：
- 补充更多技术文章和项目复盘
- 优化移动端体验
- 添加图片懒加载和渐进式 WebP 支持
- 探索 Webmention 和 Fediverse 集成
- 完善 SEO（结构化数据、OG 图片自动生成）

## 致谢

再次感谢 [Mizuki](https://github.com/LyraVoid/Mizuki) 项目及其作者 [LyraVoid](https://github.com/LyraVoid)。一个好的开源项目能节省后来者无数的时间，Mizuki 就是这样优秀的作品。我在其基础上进行的改造和简化，也正是开源精神的延续——站在巨人的肩膀上，做出适合自己的选择。

同时也感谢所有开源项目维护者，是你们的无私贡献让技术世界变得更加美好。

---

欢迎通过评论区或 [GitHub](https://github.com/yunluoxincheng) 与我交流，期待与你在互联网的这片角落相遇。

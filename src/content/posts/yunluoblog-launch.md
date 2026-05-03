---
title: YunLuoBlog 正式上线！
description: 个人博客正式上线，记录从立项到部署的全过程。
published: 2026-05-03
tags: [博客, Astro, Docker, 部署]
category: 随笔
pinned: true
---

经过近一个月的开发与调试，YunLuoBlog 今天正式上线了！

## 开发历程

这个博客的前端基于 [Mizuki](https://github.com/LyraVoid/Mizuki) 主题，由 [LyraVoid](https://github.com/LyraVoid) 开发，在此致以诚挚的感谢。我在其基础上进行了大量定制和改造：

- **架构精简**：从 Astro + Spring Boot + PostgreSQL 的全栈架构简化为纯静态站点，去掉后端服务和数据库依赖
- **部署优化**：采用 Docker 多阶段构建，GitHub Actions 自动化 CI/CD，推送代码即上线
- **配置简化**：合并为单一 TypeScript 配置文件，支持注释和 IDE 自动补全

## 功能一览

- 博客文章（Markdown 编写，支持加密、分类、标签、归档）
- 日记、友链、项目展示、技能、时间线、设备展示
- 追番列表、相册浏览
- 全文搜索（Pagefind）、RSS / Atom 订阅
- 暗色模式、主题色自定义、Swup 页面过渡动画
- 音乐播放器（本地模式）
- 评论系统（Twikoo / Giscus）

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Astro 6 + Svelte 5 |
| 样式 | Tailwind CSS v4 |
| 构建部署 | Docker + Nginx + GitHub Actions |
| 域名与证书 | Spaceship + Let's Encrypt（1Panel） |

## 致谢

感谢 [Mizuki](https://github.com/LyraVoid/Mizuki) 项目提供的前端主题基础，让这个博客有了一个漂亮的起点。

---

博客会持续更新，欢迎通过评论区或 GitHub 反馈问题和建议。

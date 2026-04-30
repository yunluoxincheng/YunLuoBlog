---
title: 博客改造记录：从全栈到纯静态
description: 将 YunluoBlog 从 Astro + Spring Boot + PostgreSQL 的全栈架构改造为纯静态站点，消除服务器运维负担。
published: 2026-05-01
tags: [博客, Astro, Docker, 部署]
category: 技术
pinned: true
---

经历了三个多月的运营，我逐渐发现全栈架构对于个人博客来说过于沉重。这篇文章记录我将博客从四服务 Docker Compose 简化到单容器纯静态部署的全过程。

## 原来的架构

```
[PostgreSQL] → [Spring Boot API] → [Astro 构建] → [Nginx 反向代理]
```

四个 Docker 容器，70+ API 端点，JWT 认证，审计日志……功能很全，但问题也很明显：

- **写篇文章要登录后台编辑器，发布后还要手动重建前端才能上线**
- **配置管理分三层：构建时默认值 → API 同步 → 运行时拉取，17 项配置只有 5 项能"即时生效"**
- **维护 PostgreSQL + Spring Boot + Docker Compose 依赖链，个人博客根本用不上**

最讽刺的是——文章作为博客最核心的内容，发布后仍然需要重新构建才能让公众看到。后台管理系统最大的卖点"实时更新"根本不成立。

## 改造后的架构

```
[git push] → [GitHub Actions 构建] → [Docker Hub 镜像] → [服务器自动拉取更新]
```

- **单仓库**：前端源码直接放在根目录，不再有子模块
- **单环境变量**：只有 `NGINX_PORT=80`
- **单容器**：Nginx 托管预构建的静态文件
- **内容即文件**：文章是 Markdown，配置是 JSON，一切用 Git 管理

## 改了什么

| | 之前 | 之后 |
|---|---|---|
| Git 仓库 | 3 个（root + server + web）| 1 个 |
| Docker 服务 | 4 个（db + server + web + nginx）| 1 个 |
| 前端代码量 | 含 20 个 API 模块 + 29 个管理组件 | 零后端依赖 |
| 管理后台 | 18 个页面（JWT 认证）| 无（文件系统管理）|
| 配置修改 | 部分即时 / 部分需重建 | 全部需重建，但流程统一 |
| 发布文章 | 后台编辑 → 手动重建 → 上线 | 写 Markdown → git push → 自动上线 |

## 核心代码变更

删除了 **17,559 行代码**，包括：

- `src/utils/api/` — 20 个 API 调用模块
- `src/components/features/admin/` — 29 个管理后台组件
- `src/pages/admin/` — 18 个管理页面
- `scripts/sync-*` — 构建时同步脚本
- 整个 `yunluoblog-server` 后端项目

修改了核心组件：

- `ConfigCarrier.astro` — 移除运行时 API 配置拉取，改为纯构建时注入
- `[...slug].astro` — 移除 API 相关文章推荐，改为本地 Content Collection 计算
- 8 个展示页面脚本 — 从客户端 API 渲染改为本地数据文件

## 新的发布流程

编辑好文章后：

```bash
git add src/content/posts/我的新文章.md
git commit -m "发布新文章"
git push origin main
```

GitHub Actions 自动执行 `pnpm build` → `docker build` → 推送镜像 → SSH 服务器更新，**3-5 分钟后文章上线**。不需要登录任何后台。

## 文件结构一览

```
博客仓库/
├── src/content/posts/   ← 所有文章（Markdown）
├── src/config-data.json ← 站点配置（JSON）
├── src/data/*.ts        ← 友链、日记、相册等数据
├── public/images/       ← 图片资源
├── nginx/nginx.conf     ← Nginx 配置
├── Dockerfile           ← 多阶段构建
└── .github/workflows/   ← 自动部署
```

## 为什么不后悔

1. 运维成本归零 — 不再需要维护数据库、JVM、Spring Boot
2. 部署完全自动化 — git push 之后什么都不用管
3. 性能更好 — 纯静态 HTML，首次加载比之前快 200ms+
4. Git 就是 CMS — 版本历史、回滚、协作全都免费拥有
5. 结构更清晰 — 一个仓库包含所有内容，新人一眼看懂

如果你也在考虑个人博客的技术选型，纯静态 + CI/CD 绝对值得一试。

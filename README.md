# YunluoBlog

纯静态个人博客系统，前端使用 Astro 6 + Svelte 5 构建，Nginx + Docker 部署，Git push 后自动构建上线。

## 系统架构

```
作者 git push 文章或配置
       ↓
  GitHub Actions 自动构建
       ↓
  astro build → Docker 镜像
       ↓
  推送到 Docker Hub
       ↓
  SSH 到服务器自动更新容器
       ↓
  [Nginx :${NGINX_PORT}] 纯静态页面
```

## 仓库结构

```
yunluoblog/
├── yunluoblog-web/        # 前端 — Astro 6 + Svelte 5（submodule）
├── nginx/
│   └── nginx.conf         # Nginx 静态文件服务配置
├── Dockerfile             # 多阶段构建（node build → nginx）
├── docker-compose.yml     # 容器编排（单 nginx 服务）
├── .env.example           # 环境变量模板（仅 NGINX_PORT）
├── .github/workflows/     # CI/CD 自动部署
├── uploads/               # 上传文件存储目录
└── README.md
```

## 功能概览

- Astro 6 静态站点 + Svelte 5 交互组件
- 博客文章（Markdown 文件管理）、分类、标签、归档
- 追番、日记、友链、项目展示、技能、时间线、设备展示
- 相册（本地文件扫描）
- Pagefind 全文搜索、RSS/Atom、站点地图
- 暗色模式、主题色自定义、Swup 页面过渡动画
- 评论系统（Twikoo / Giscus）
- 音乐播放器

## 快速开始

### 本地开发

```bash
cd yunluoblog-web
pnpm install
pnpm dev
```

### 本地 Docker 部署

```bash
# 先构建前端
cd yunluoblog-web
pnpm build

# 回到根目录
cd ..
docker compose up -d --build
```

### 生产部署

```bash
# 服务器上
mkdir -p /opt/yunluoblog
cd /opt/yunluoblog

# 创建 .env 文件
echo "NGINX_PORT=80" > .env

# 创建 docker-compose.yml（参考下方配置）
# 启动
docker compose up -d
```

**配置 GitHub Secrets 后，push 到 main 分支即可自动部署。**

## 内容管理

所有内容通过文件系统管理，提交 Git 后自动部署：

| 内容类型 | 文件位置 | 格式 |
|----------|---------|------|
| 博客文章 | `yunluoblog-web/src/content/posts/*.md` | Markdown + frontmatter |
| 站点配置 | `yunluoblog-web/src/config-data.json` | JSON |
| 友链数据 | `yunluoblog-web/src/data/friends.ts` | TypeScript |
| 日记数据 | `yunluoblog-web/src/data/diary.ts` | TypeScript |
| 相册数据 | `yunluoblog-web/src/data/albums.ts` | TypeScript |
| 番剧数据 | `yunluoblog-web/src/data/anime.ts` | TypeScript |
| 项目数据 | `yunluoblog-web/src/data/projects.ts` | TypeScript |
| 技能数据 | `yunluoblog-web/src/data/skills.ts` | TypeScript |
| 时间线数据 | `yunluoblog-web/src/data/timeline.ts` | TypeScript |
| 设备数据 | `yunluoblog-web/src/data/devices.ts` | TypeScript |
| 图片资源 | `yunluoblog-web/public/images/` | 图片文件 |
| 相册照片 | `yunluoblog-web/public/albums/` | 图片文件 |

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `NGINX_PORT` | Nginx 暴露端口 | `80` |

## GitHub Secrets 配置

| Secret | 说明 |
|--------|------|
| `DOCKERHUB_USERNAME` | Docker Hub 用户名（yunluoxincheng） |
| `DOCKERHUB_TOKEN` | Docker Hub Access Token |
| `SSH_HOST` | 服务器 IP 或域名 |
| `SSH_USER` | 服务器 SSH 用户名 |
| `SSH_KEY` | SSH 私钥 |

## 许可证

MIT

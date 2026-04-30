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

## 项目结构

```
yunluoblog/
├── src/                   # 前端源码
│   ├── pages/             # Astro 页面路由
│   ├── components/        # Svelte/Astro 组件（原子设计）
│   ├── content/posts/     # 博客文章（Markdown）
│   ├── data/              # 展示类静态数据（友链、日记、相册等）
│   ├── config.ts          # 站点配置入口
│   └── config-data.json   # 用户自定义配置
├── public/                # 静态资源（图片、字体等）
├── scripts/               # 构建脚本
├── nginx/
│   └── nginx.conf         # Nginx 静态文件服务配置
├── Dockerfile             # 多阶段构建（node build → nginx）
├── docker-compose.yml     # 容器编排（单 nginx 服务）
├── .github/workflows/     # CI/CD 自动部署
└── package.json           # 前端依赖和脚本
```

## 功能

- Astro 6 静态站点 + Svelte 5 交互组件
- 博客文章（Markdown 文件管理）、分类、标签、归档
- 追番、日记、友链、项目展示、技能、时间线、设备展示
- 相册（本地文件扫描）
- Pagefind 全文搜索、RSS/Atom、站点地图
- 暗色模式、主题色自定义、Swup 页面过渡动画
- 评论系统（Twikoo / Giscus）、音乐播放器

## 快速开始

### 本地开发

```bash
pnpm install
pnpm dev
```

### 本地生产构建

```bash
pnpm build
pnpm preview
```

### Docker 构建

```bash
docker build -t yunluoblog .
docker run -p 80:80 yunluoblog
```

### 生产部署

```bash
# 服务器上准备
mkdir -p /opt/yunluoblog
cd /opt/yunluoblog
echo "NGINX_PORT=80" > .env

# 创建 docker-compose.yml（或从仓库复制）
docker compose up -d
```

## 内容管理

所有内容通过文件系统管理，提交 Git 后自动部署：

| 内容类型 | 文件位置 | 格式 |
|----------|---------|------|
| 博客文章 | `src/content/posts/*.md` | Markdown + frontmatter |
| 站点配置 | `src/config-data.json` | JSON |
| 展示数据 | `src/data/*.ts` | TypeScript |
| 图片资源 | `public/images/` | 图片文件 |
| 相册照片 | `public/albums/` | 图片文件 |

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `NGINX_PORT` | Nginx 暴露端口 | `80` |

## GitHub Secrets

| Secret | 说明 |
|--------|------|
| `DOCKERHUB_USERNAME` | Docker Hub 用户名 |
| `DOCKERHUB_TOKEN` | Docker Hub Access Token |
| `SSH_HOST` | 服务器 IP 或域名 |
| `SSH_USER` | 服务器 SSH 用户名 |
| `SSH_KEY` | SSH 私钥 |

## 许可证

MIT

---

本主题基于 [Mizuki](https://github.com/LyraVoid/Mizuki) 修改。

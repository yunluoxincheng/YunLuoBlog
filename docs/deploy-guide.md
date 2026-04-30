# 首次部署指南

## 前置条件

- 一台 Linux 服务器（已安装 Docker 和 Docker Compose）
- 一个 GitHub 账号
- 一个 Docker Hub 账号

## 步骤一：配置 GitHub Secrets

在仓库的 **Settings → Secrets and variables → Actions** 中添加以下 5 个密钥：

| Secret 名称 | 值 | 说明 |
|---|---|---|
| `DOCKERHUB_USERNAME` | `yunluoxincheng` | Docker Hub 用户名 |
| `DOCKERHUB_TOKEN` | 生成 Access Token | [Docker Hub 设置页](https://hub.docker.com/settings/security) 生成 |
| `SSH_HOST` | `1.2.3.4` | 服务器 IP 或域名 |
| `SSH_USER` | `root` | SSH 登录用户名 |
| `SSH_KEY` | 粘贴私钥内容 | `~/.ssh/id_rsa` 的内容 |

### 生成 SSH 密钥对

```bash
# 在本地执行（不是服务器）
ssh-keygen -t ed25519 -C "github-actions-yunluoblog" -f ~/.ssh/yunluoblog-deploy

# 将公钥添加到服务器
ssh-copy-id -i ~/.ssh/yunluoblog-deploy.pub root@你的服务器IP

# 查看私钥内容，粘贴到 GitHub Secret SSH_KEY
cat ~/.ssh/yunluoblog-deploy
```

## 步骤二：服务器准备

```bash
# 登录服务器
ssh root@你的服务器IP

# 安装 Docker（如未安装）
curl -fsSL https://get.docker.com | bash
systemctl enable docker
systemctl start docker

# 创建项目目录
mkdir -p /opt/yunluoblog
cd /opt/yunluoblog

# 创建环境变量文件
echo "NGINX_PORT=80" > .env

# 登录 Docker Hub（避免拉取限速）
docker login
```

## 步骤三：放置 docker-compose.yml

在 `/opt/yunluoblog/docker-compose.yml` 中：

```yaml
services:
  blog:
    image: yunluoxincheng/yunluoblog:latest
    container_name: yunluoblog
    restart: unless-stopped
    ports:
      - "${NGINX_PORT}:80"
    volumes:
      - ./uploads:/usr/share/nginx/html/uploads:ro
```

## 步骤四：首次推送触发部署

```bash
# 在本地仓库目录
git add .
git commit -m "初始化部署"
git push origin main
```

推送后，访问 GitHub 仓库的 **Actions** 标签页查看构建进度。成功后访问 `http://你的服务器IP` 即可看到博客。

## 后续更新

日常更新内容后只需：

```bash
git add src/content/posts/新文章.md
git commit -m "发布新文章"
git push origin main
```

3-5 分钟后自动上线，无需操作服务器。

## 回滚

```bash
# 服务器上查看可用镜像
docker images yunluoxincheng/yunluoblog

# 临时切换到指定版本（abc1234 替换为实际 tag）
cd /opt/yunluoblog
docker run -d -p 80:80 yunluoxincheng/yunluoblog:abc1234

# 或者修改 docker-compose.yml 后重启
docker compose up -d
```

## 常见问题

**Q: Actions 构建失败**
- 检查 GitHub Secrets 是否正确配置
- 查看 Actions 日志中的具体错误信息

**Q: SSH 连接失败**
- 确认服务器 IP、用户名、密钥正确
- 确认服务器防火墙开放 22 端口

**Q: 部署后网站 404**
- 确认服务器防火墙开放 80 端口
- 检查 `docker ps` 容器是否正常运行
- 检查 `docker logs yunluoblog` 日志

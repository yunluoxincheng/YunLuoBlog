# 首次部署指南

## 前置条件

- 一台 Linux 服务器（已安装 Docker 和 Docker Compose）
- 一个 GitHub 账号
- 一个 Docker Hub 账号

## 步骤一：配置 GitHub Secrets

在仓库的 **Settings → Secrets and variables → Actions** 中添加：

| Secret 名称 | 值 | 说明 |
|---|---|---|
| `DOCKERHUB_USERNAME` | `yunluoxincheng` | Docker Hub 用户名 |
| `DOCKERHUB_TOKEN` | 生成 Access Token | [Docker Hub 设置页](https://hub.docker.com/settings/security) 生成，权限选 Read & Write |

## 步骤二：服务器准备

```bash
# 登录服务器
ssh 用户名@你的服务器IP

# 安装 Docker（如未安装）
curl -fsSL https://get.docker.com | bash
systemctl enable docker
systemctl start docker

# 创建项目目录
mkdir -p /home/ljk/yunluoblog
cd /home/ljk/yunluoblog

# 创建环境变量
echo "NGINX_PORT=80" > .env

# 创建 docker-compose.yml
cat > docker-compose.yml << 'EOF'
services:
  blog:
    image: yunluoxincheng/yunluoblog:latest
    container_name: yunluoblog
    restart: unless-stopped
    ports:
      - "${NGINX_PORT}:80"
    volumes:
      - ./uploads:/usr/share/nginx/html/uploads:ro
EOF

# 登录 Docker Hub（避免拉取限速）
docker login
```

## 步骤三：首次拉取启动

```bash
cd /home/ljk/yunluoblog
docker compose pull
docker compose up -d
```

访问 `http://服务器IP` 验证是否正常。

## 步骤四：配置自动更新

创建自动检查脚本：

```bash
cat > /home/ljk/yunluoblog/auto-update.sh << 'EOF'
#!/bin/bash
IMAGE="yunluoxincheng/yunluoblog:latest"
CONTAINER="yunluoblog"
DIR="/home/ljk/yunluoblog"

LOCAL_ID=$(docker inspect -f '{{.Image}}' "$CONTAINER" 2>/dev/null)
docker pull "$IMAGE" > /dev/null 2>&1
REMOTE_ID=$(docker inspect -f '{{.Id}}' "$IMAGE" 2>/dev/null)

if [ -z "$LOCAL_ID" ] || [ "$LOCAL_ID" != "$REMOTE_ID" ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] New image detected, updating..."
    cd "$DIR" && docker compose up -d
    docker image prune -f
else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Already up to date"
fi
EOF

chmod +x /home/ljk/yunluoblog/auto-update.sh
```

设置定时任务（每分钟检查）：

```bash
crontab -e
```

添加：

```
*/1 * * * * bash /home/ljk/yunluoblog/auto-update.sh >> /home/ljk/yunluoblog/auto-update.log 2>&1
```

## 后续更新

日常更新内容后只需：

```bash
git add src/content/posts/新文章.md
git commit -m "发布新文章"
git push origin main
```

CI 构建推镜像 → 服务器 cron 检测到新镜像 → 自动重启，约 3-5 分钟上线。

## 回滚

```bash
# 服务器上查看可用镜像
docker images yunluoxincheng/yunluoblog

# 临时切换到指定版本（abc1234 替换为旧版 git sha）
cd /home/ljk/yunluoblog
sed -i 's/:latest/:abc1234/' docker-compose.yml
docker compose up -d
```

## 常见问题

**Q: Actions 构建失败**
- 检查 GitHub Secrets 是否正确配置
- 查看 Actions 日志中的具体错误信息

**Q: 服务器一直不更新**
- 检查 cron 日志：`cat /home/ljk/yunluoblog/auto-update.log`
- 确认 `docker login` 已执行
- 手动跑：`bash /home/ljk/yunluoblog/auto-update.sh`

**Q: 网站无法访问**
- 确认防火墙开放 80 端口
- 检查 `docker ps` 容器是否运行
- 检查 `docker logs yunluoblog`

# Cure（可愈）官方网站

基于 Vercel 部署的卒中康复严肃游戏官方网站。

🔗 **域名**: https://cure-keyu.com  
🎮 **游戏**: https://cure-keyu.com/game/  
📊 **报告**: https://cure-keyu.com/report/

---

## 项目结构

```
cure-website/
├── index.html              # 官网首页
├── vercel.json            # Vercel 配置（COOP/COEP 响应头）
├── README.md              # 本文件
├── report/
│   └── index.html         # 用户研究报告（完整聚合分析）
└── game/                  # 敦煌壁画守护者游戏
    ├── index.html         # 游戏入口
    ├── index.js           # Godot 引擎启动器
    ├── index.wasm         # Godot WebAssembly (36MB)
    ├── index.pck          # 游戏资源包 (4.9MB)
    └── ...
```

---

## 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 游戏引擎 | Godot 4.6 | WebAssembly 导出 |
| 面部识别 | MediaPipe | 本地实时推理 |
| 部署平台 | Vercel | 自动 CI/CD |
| 域名 | Cloudflare | DNS + SSL |

---

## 本地开发

```bash
# 进入项目目录
cd cure-website

# 启动本地服务器（需要 COOP/COEP 响应头）
python3 -m http.server 8000

# 访问 http://localhost:8000
```

**注意**: 游戏需要 HTTPS 或 localhost 才能调用摄像头。

---

## 部署流程

### 1. GitHub 仓库设置

```bash
# 创建新仓库并推送
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cure-website.git
git push -u origin main
```

### 2. Vercel 部署

1. 访问 [vercel.com](https://vercel.com) 注册/登录
2. 点击 "Add New Project"
3. 导入 GitHub 仓库 `cure-website`
4. 保持默认设置，点击 Deploy
5. 等待部署完成（约 2-3 分钟）

### 3. 绑定自定义域名

1. 在 Vercel Dashboard 进入项目设置
2. 选择 **Domains**
3. 添加域名：`cure-keyu.com`
4. 按提示在 Cloudflare 添加 DNS 记录
5. 等待 SSL 证书自动配置（约 1-5 分钟）

---

## 更新网站

每次更新只需 push 到 GitHub，Vercel 自动重新部署：

```bash
# 修改文件后
git add .
git commit -m "Update: xxx"
git push
```

Vercel 会在几分钟内自动更新网站。

---

## 游戏开发更新

当您在 Godot 中更新游戏后：

1. 在 Godot 中导出 Web 版本到 `export/` 目录
2. 复制新文件到本仓库：
   ```bash
   cp -r /path/to/Godot/graybox/export/* cure-website/game/
   ```
3. 提交并推送：
   ```bash
   git add game/
   git commit -m "Update game to vX.X"
   git push
   ```

---

## 配置说明

### COOP/COEP 响应头

游戏需要 `SharedArrayBuffer` 支持，必须在 `/game/*` 路径添加：

```http
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

已在 `vercel.json` 中配置。

---

## 文件大小

| 文件 | 大小 | 说明 |
|------|------|------|
| index.wasm | 36 MB | Godot 引擎 |
| index.pck | 4.9 MB | 游戏资源 |
| index.js | 312 KB | 启动脚本 |

**总计**: ~41 MB（Vercel 免费层限制内）

---

## 浏览器兼容性

- ✅ Chrome / Edge（推荐，支持 Web Serial）
- ✅ Firefox
- ✅ Safari
- ❌ IE / 旧版浏览器

**要求**: 
- 摄像头权限
- WebGL 支持
- HTTPS 或 localhost

---

## 许可证

毕业设计项目，仅供学习和研究使用。

---

## 联系

如有问题，请通过 GitHub Issues 反馈。

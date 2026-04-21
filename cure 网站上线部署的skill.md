# Cure 网站部署与开发指南

## 网站架构

Cure 网站采用**静态网站**架构，由三个独立模块组成：

```
cure-website/
├── index.html              # 模块一：首页（项目介绍）
├── vercel.json            # Vercel 部署配置
├── report/                # 模块二：研究报告
│   ├── index.html         # 概览
│   ├── symptom.html       # 口面部症状
│   ├── home.html          # 居家×症状
│   ├── emotion.html       # 情绪
│   ├── barrier.html       # 社会障碍
│   ├── style.css          # 报告样式
│   └── nav.js             # 报告导航脚本
└── game/                  # 模块三：游戏
    ├── play.html          # 游戏包装页（导航栏 + iframe）
    ├── index.html         # Godot 导出文件（❌ 不修改）
    ├── index.js           # Godot 引擎（❌ 不修改）
    ├── index.wasm         # Godot WASM（❌ 不修改）
    ├── index.pck          # 游戏资源（❌ 不修改）
    └── ...                # 其他导出文件（❌ 不修改）
```

### 设计原则

**游戏与网站解耦**：游戏文件是 Godot 引擎自动生成的独立单元，通过 `iframe` 嵌入到网站中。这确保了：
- 游戏可以独立开发和测试
- 更新游戏时无需修改网站代码
- 游戏内部文件（HTML/JS/WASM）保持原始状态

---

## 基本模块说明

### 模块一：首页 (`index.html`)
- 项目介绍和导航入口
- 响应式设计，支持移动端
- 链接到研究报告和游戏页面

### 模块二：研究报告 (`report/`)
- 聚合分析报告的多页面展示
- 包含侧边栏导航和顶部标签栏
- 独立 CSS 样式 (`style.css`)

### 模块三：游戏 (`game/`)
- `play.html`：网站包装页，包含统一导航栏和 iframe
- `index.html` 及其他：Godot Web 导出的原始文件
- 摄像头权限通过 iframe 的 `allow` 属性传递

---

## 部署流程

### 前置条件

- GitHub 账号
- Vercel 账号（免费）
- Cloudflare 账号（域名管理）

### 步骤一：推送代码到 GitHub

```bash
cd cure-website
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/cure-website.git
git push -u origin master
```

**已完成的仓库**：https://github.com/Leoyoung-dev/cure-website

### 步骤二：Vercel 部署

1. 访问 https://vercel.com
2. 使用 GitHub 账号登录
3. 点击 "Add New Project"
4. 导入 `cure-website` 仓库
5. **关键配置**：
   - Framework Preset: `Other`
   - Root Directory: `./`
   - Build Command: 留空（静态网站）
   - Output Directory: 留空
6. 点击 "Deploy"
7. 等待部署完成（约 2-3 分钟）

### 步骤三：配置自定义域名

1. 在 Vercel Dashboard → 项目 → **Settings** → **Domains**
2. 添加域名：`cure-keyu.com`
3. 在 Cloudflare DNS 添加记录：
   ```
   Type: CNAME
   Name: @
   Target: cname.vercel-dns.com
   ```
4. 等待 SSL 证书自动配置（1-5 分钟）

### 自动部署

配置完成后，每次执行 `git push` 到 GitHub，Vercel 会自动重新部署网站。

---

## Godot 游戏无缝集成

### 核心机制

网站通过 **`iframe` 嵌入**方式集成 Godot 游戏，实现完全解耦：

```html
<!-- game/play.html -->
<iframe src="./index.html" allow="camera; microphone"></iframe>
```

### 为什么使用 iframe？

| 优势 | 说明 |
|------|------|
| **不修改游戏文件** | Godot 导出的 `index.html` 保持原始状态 |
| **样式隔离** | 游戏全屏样式不会影响网站导航栏 |
| **权限传递** | `allow="camera; microphone"` 允许游戏调用摄像头 |
| **独立更新** | 替换游戏文件即可更新，无需改动网站代码 |

### 更新游戏流程

当在 Godot 中开发并导出新版游戏后：

```bash
# 1. 在 Godot 中导出 Web 版本
#    项目 → 导出 → Web → 导出项目 → export/

# 2. 复制导出文件到网站仓库（直接覆盖）
cp -r /path/to/Cure-hardware/Godot/graybox/export/* \
     /path/to/cure-website/game/

# 3. 提交更改
cd cure-website
git add game/
git commit -m "Update game: 版本说明"
git push

# 4. Vercel 自动部署（约 2-3 分钟）
```

**注意事项**：
- ✅ 可以覆盖 `game/` 下的所有文件
- ❌ **不要修改** `game/play.html`（这是网站的包装页）
- ❌ **不要修改** Godot 导出的原始文件，应该从 Godot 重新导出

### 文件映射关系

```
Godot 导出目录                    网站目录
─────────────────────────────────────────────────
Godot/graybox/export/index.html  →  game/index.html
Godot/graybox/export/index.js    →  game/index.js
Godot/graybox/export/index.wasm  →  game/index.wasm
Godot/graybox/export/index.pck   →  game/index.pck
...                              →  game/...
                                  (+) game/play.html（网站包装页，不参与覆盖）
```

### 访问路径

| 页面 | 路径 | 说明 |
|------|------|------|
| 网站首页 | `/` | `index.html` |
| 研究报告 | `/report/` | `report/index.html` |
| 游戏页面 | `/game/play.html` | `game/play.html`（含导航栏）|
| 游戏本体 | `/game/index.html` | Godot 导出文件（直接访问无导航栏）|

---

## 本地开发

### 启动本地服务器

```bash
cd cure-website
python3 -m http.server 8090
```

访问地址：
- 首页：http://localhost:8090
- 游戏：http://localhost:8090/game/play.html
- 报告：http://localhost:8090/report/

**注意**：游戏需要 HTTPS 或 localhost 才能调用摄像头。

---

## 重要配置

### vercel.json

```json
{
  "headers": [
    {
      "source": "/game/(.*)",
      "headers": [
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
        { "key": "Cross-Origin-Embedder-Policy", "value": "require-corp" }
      ]
    }
  ]
}
```

**作用**：为 Godot Web 导出添加 COOP/COEP 响应头，支持 SharedArrayBuffer。

### 导航栏统一

所有页面共享相同的顶部导航栏结构：
- 左侧：Cure Logo + 项目名称
- 右侧：项目介绍 | 研究报告 | 试玩游戏

如需修改导航栏，需要编辑：
- `index.html`（首页）
- `report/index.html`, `report/symptom.html` 等（报告页）
- `game/play.html`（游戏包装页）

---

## 技术栈

| 组件 | 技术 | 用途 |
|------|------|------|
| 游戏引擎 | Godot 4.6.2 | WebAssembly 导出 |
| 前端 | 原生 HTML/CSS/JS | 无框架，无构建步骤 |
| 部署平台 | Vercel | 静态托管 + 自动 CI/CD |
| 域名 | Cloudflare | DNS + SSL |

---

## 文件大小参考

| 文件 | 大小 | 说明 |
|------|------|------|
| `game/index.wasm` | 36 MB | Godot 引擎二进制 |
| `game/index.pck` | 4.9 MB | 游戏资源包 |
| `game/index.js` | 312 KB | 引擎启动脚本 |
| 报告文件 | ~600 KB | 聚合分析报告 |
| 首页 | ~20 KB | 项目介绍页面 |

**总计**：约 42 MB（Vercel 免费层支持）

---

## 更新记录

| 日期 | 更新内容 |
|------|----------|
| 2026-04-21 | 初始版本，完成三模块集成和部署配置 |

---

*本指南聚焦网站部署和 Godot 集成，不涉及游戏内部逻辑。*

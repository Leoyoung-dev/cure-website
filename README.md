# Cure（可愈）官方网站

本仓库是 `cure-keyu.com` 的官网发布仓库。

这份 README 以**当前新的站点方案**为准，不再沿用旧版 Godot Web 导出说明。当前目标是把官网整理成一个静态网站入口，并逐步承载多个基于前端实现的康复游戏。

- 官网域名：`https://cure-keyu.com`
- 官网仓库：`cure-website/`
- 游戏开发仓库：`Cure-hardware/`
- 当前首个上线游戏：足球守门员语言康复原型

---

## 当前方案

官网与游戏开发已经拆成两个职责清晰的目录：

- `Cure-hardware/`：真正的游戏开发目录
- `cure-website/`：真正的官网发布目录

也就是说：

- 游戏逻辑、3D 资源、语音识别、UI 迭代，都在 `Cure-hardware` 内完成
- 官网不直接开发游戏逻辑，只负责承载构建后的静态产物
- 网站上线时，不是从 `cure-website` 内部重新开发游戏，而是把 `Cure-hardware` 中构建好的游戏同步进来

---

## 当前守门员游戏的技术形态

当前守门员游戏不是 Godot，也不是 WebAssembly 引擎导出物，而是纯前端 Web 应用：

- React
- Vite
- TypeScript
- Three.js / React Three Fiber
- Zustand
- 浏览器 Web Speech API
- Web Audio API
- FBX 动作与模型资源

当前没有：

- Godot 运行时依赖
- 后端服务
- 外部游戏引擎打包产物

因此，旧版 README 中关于 Godot、`index.wasm`、`index.pck`、MediaPipe 游戏导出的描述，已经不再适用于新的守门员游戏方案。

---

## 网站目标结构

网站将逐步整理为以下结构：

```text
cure-website/
├── index.html                 # 官网首页
├── report/                    # 研究报告页面
└── game/                      # 游戏栏目入口
    ├── index.html             # 游戏大厅页
    ├── goalkeeper/            # 守门员游戏构建产物
    │   ├── index.html
    │   ├── assets/
    │   └── models/
    ├── game-2/                # 预留，未来开发
    └── game-3/                # 预留，未来开发
```

规划原则：

- `/game/` 不再只表示某一个旧游戏
- `/game/` 将变成游戏官网入口页 / 大厅页
- 当前先上线 `goalkeeper`
- 另外两个游戏先以 “开发中” 状态展示，后续逐步补齐

---

## 当前首发游戏

首发游戏是：

- 足球守门员语言康复原型

其核心目标：

- 面向失语症与构音困难用户
- 通过读词触发守门员扑救 / 出击动作
- 以语音输入驱动即时游戏反馈
- 在浏览器内直接运行，无需安装客户端

开发源目录：

- `Cure-hardware/web-maze-3d/`

这才是当前真正持续开发、持续迭代的游戏工程。

---

## 发布职责划分

### 1. `Cure-hardware`

职责：

- 开发守门员游戏
- 管理前端代码
- 管理模型、动画、贴图、音效等资源
- 构建可发布产物

关键目录：

- `Cure-hardware/web-maze-3d/`

### 2. `cure-website`

职责：

- 承载官网页面
- 承载游戏入口页
- 承载构建后的静态游戏文件
- 推送到 GitHub 后交给 Vercel 自动部署

关键结论：

- `cure-website` 不是游戏开发源
- `cure-website/game/goalkeeper/` 只放构建产物，不直接维护业务逻辑

---

## 守门员游戏的上线方式

当前推荐发布链路如下：

1. 在 `Cure-hardware/web-maze-3d/` 完成开发
2. 将该项目配置为可部署到 `/game/goalkeeper/`
3. 在 `web-maze-3d` 中执行构建
4. 将整个构建产物 `dist/` 复制到 `cure-website/game/goalkeeper/`
5. 在 `cure-website/game/index.html` 中把守门员游戏作为第一个正式上线游戏展示
6. 提交并推送 `cure-website` 仓库，由 Vercel 自动发布

这里要特别注意：

- 不能只复制一个 `index.html`
- 必须复制整个 `dist/`
- 因为运行时依赖不仅有 JS/CSS，还包括模型与贴图资源

---

## 美术资源与静态资源同步原则

守门员游戏包含多类运行时资源，例如：

- `assets/` 下的构建脚本与样式
- `models/` 下的 FBX 模型、动作文件、贴图资源
- 图标、favicon 等静态文件

因此部署时必须遵守这个原则：

- **始终复制整个 `web-maze-3d/dist/`，不要手动挑文件**

如果漏掉资源目录，线上会出现以下问题：

- 角色模型丢失
- 动画文件加载失败
- 球或贴图丢失
- 页面能打开但游戏无法正常运行

---

## 未来多游戏方案

网站未来会逐步承载 3 个游戏：

- 游戏 1：守门员语言康复游戏（当前优先上线）
- 游戏 2：开发中
- 游戏 3：开发中

因此官网层面的设计应当始终围绕“游戏大厅”而不是“单一旧游戏页”展开。

这意味着：

- 首页的“试玩游戏”入口应进入 `/game/`
- `/game/` 负责展示所有游戏卡片
- 具体游戏运行在各自独立子路径下
- 每个游戏都可以从各自开发目录独立构建并同步到官网

---

## 本地维护建议

推荐把工作流固定为：

### 开发阶段

在 `Cure-hardware/web-maze-3d/` 内开发与测试。

### 发布阶段

把构建结果同步到 `cure-website/game/goalkeeper/`。

示意命令：

```bash
cd Cure-hardware/web-maze-3d
npm run build:website

# 然后将 dist/ 全量同步到官网仓库目标目录
# 例如未来可使用 rsync / cp 进行覆盖同步
```

### 上线阶段

```bash
cd cure-website
git add .
git commit -m "Deploy goalkeeper game"
git push
```

推送后由 Vercel 自动更新线上站点。

---

## 部署与运行注意事项

- 正式站点必须使用 HTTPS
- 浏览器麦克风权限必须允许
- 语音识别能力依赖浏览器环境，推荐 Chrome / Edge
- 如果游戏部署在子路径下，前端构建配置必须与子路径一致
- 当前站点已移除旧 Godot 时代遗留的 COOP / COEP 响应头；守门员游戏是纯前端 Web Speech 应用，不再需要这组头

这也是为什么守门员游戏不能简单复制旧 Godot 文件结构，而必须按照新的前端部署方式重新整理。

---

## 2026-04-24 迁移排障记录

本次守门员游戏迁移到官网后的一个关键结论：

- 语音识别失效的根因不是 `Cure-hardware` 到 `cure-website` 的代码逻辑变化
- 本地验证表明，问题来自官网层遗留的 COOP / COEP 响应头
- 症状表现为：麦克风电平正常、浏览器权限正常，但 `SpeechRecognition` 没有返回转录文本
- 移除旧头之后，`http://localhost:8090/game/goalkeeper/` 本地测试已恢复识别

当前体量快照（2026-04-24）：

- 已删除未使用的原始球模型资产包，避免把历史实验资源一并发布到官网
- `cure-website/game/goalkeeper/` 发布目录约 `55.20 MB`
- 当前发布目录文件数为 `77`
- 当前最大的单个文件约为 `12.20 MB`：`models/Meshy_AI_SOON_99_Neon_Keeper_0423071051_texture_fbx.fbx`

这说明当前官网承载的守门员游戏仍然是“静态资源 + 浏览器运行时”的部署模式，后续若继续增大模型与贴图资源，应优先做资源瘦身，而不是回退到旧 Godot 配置。

---

## 当前迁移结论

当前网站迁移方向已经明确：

- 旧版 `/game/` Godot 游戏已废弃
- 新版守门员游戏将取代旧游戏成为首个上线作品
- `cure-website` 将转为“官网 + 游戏大厅 + 多游戏发布容器”
- `Cure-hardware` 将继续作为游戏开发源仓库

后续新增游戏时，继续沿用同一策略即可。

<div align="center">
    <img src="./public/an_AI_podcast_1400.jpg" alt="AI Podcast">
</div>

# AI Podcast（Web）

**语言：** [English](README.md) | [简体中文](README_CN.md)

- [Apple 播客 — AI Podcast](https://podcasts.apple.com/us/podcast/ai-podcast/id1798858172)

## 简介

基于 [Next.js](https://nextjs.org/) 的站点，用于浏览和播放 **AI 生成**的播客单集。单集元数据与列表由 **Cloudflare D1** 提供；音频与封面等资源的 URL 通常指向 **R2**（或其他 HTTPS 地址）。内容可来自 PDF、网页、文本、图片、音频与视频等多模态数据，再经多模态或大模型链路生成播客。

若要 **生成节目** 并维护发布流水线，请使用配套仓库：[github.com/ai-bot-pro/podcast](https://github.com/ai-bot-pro/podcast.git)（若你在本 monorepo 内开发，也可直接使用本地的 `podcast/` 目录）。

## 功能概览

- 首页：最新节目、分页、站内音频播放器  
- 单集详情路由：`/podcast/[pid]`  
- RSS：`/api/rss`（在可访问时拉取托管的 `rss.xml`，否则根据 D1 生成 feed）  
- Edge 路由（`runtime = 'edge'`），在 Cloudflare Pages 上提供低延迟 API  

## 技术栈

- Next.js 15、React 18、TypeScript、Tailwind CSS  
- 部署目标：[Cloudflare Pages](https://pages.cloudflare.com/)，配合 [`@cloudflare/next-on-pages`](https://github.com/cloudflare/next-on-pages)  
- **D1** 绑定 `PODCAST_DB`，对应 `podcast` 表  
- **R2** 在 `wrangler.toml` 中绑定为 `PODCAST_BUCKET`（预留用于资源；数据库中的 URL 也可能已指向公网 R2）  

## 安全与 Dependabot

GitHub 可能显示大量 **未解决的 Dependabot 告警**；其中许多来自**仅用于开发**的传递依赖（例如 `@cloudflare/next-on-pages` 使用的 `vercel` CLI、`wrangler`、ESLint，以及工具链中的 tar/glob 等）。它们并不会全部进入生产环境 Pages 产物，但仍应随版本周期升级。

- **Next.js** 固定为 **15.5.15**，包含关键 RSC 问题修复 [CVE-2025-66478](https://nextjs.org/blog/CVE-2025-66478)（另见 `package.json` 中的 `npm overrides`）。`@cloudflare/next-on-pages` 仍将 peer 写为 `next <= 15.5.2`；为安全起见，本项目**有意**使用更高补丁版。中长期来看，Cloudflare 建议改用 [OpenNext 适配](https://opennext.js.org/cloudflare)，替代 `next-on-pages`。  
- 在仓库的 [Security / Dependabot](https://github.com/ai-bot-pro/react-nextjs-web-podcast/security/dependabot) 跟进剩余问题，并在安全公告变化后重新执行 `npm install` / 更新锁文件。  

本仓库仅使用 **npm** 与 **`package-lock.json`**（不含 `pnpm-lock.yaml`），以便本地与 CI 构建与 `npx @cloudflare/next-on-pages` 保持一致。

## 环境要求

- Node.js 18.18+（Next.js 15 建议版本）  
- **npm**（锁文件：`package-lock.json`）  
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/)（通过 devDependencies 安装到本地）及 Cloudflare 账号（用于生产部署）  

## 快速开始

安装依赖：

```bash
npm install
```

### Cloudflare 绑定（`wrangler.toml`）

1. 在 Cloudflare 控制台创建（或选择）**D1** 数据库与 **R2** 存储桶。  
2. 更新 `wrangler.toml`：为 `PODCAST_DB` 设置 `database_id`，并将 `bucket_name` / 绑定与账号资源对齐。  
3. 在 Pages 项目设置中为生产环境绑定相同的 **D1** 与 **R2**，与本地配置一致。  
4. 修改绑定后重新生成类型：

```bash
npm run cf-typegen
```

### 本地 D1 表结构与示例数据

[`data/podcast.sql`](data/podcast.sql) 定义 `podcast` 表并包含示例行。文件顶部注释说明如何用 Wrangler 应用到**本地** D1，例如：

```bash
npx wrangler d1 execute podcast_hub --local --file=./data/podcast.sql
```

数据库名称需与 `wrangler.toml` 中的 `database_name` 一致。

### 开发服务器

项目在 [`next.config.mjs`](next.config.mjs) 中通过 `@cloudflare/next-on-pages` 的 `setupDevPlatform()`，使 `next dev` 期间可使用 D1 等绑定。请参阅[推荐开发流程](https://github.com/cloudflare/next-on-pages/blob/main/internal-packages/next-dev/README.md#recommended-development-workflow)，并定期运行下方的 **preview** 以验证 Pages 构建。

```bash
npm run dev
```

在浏览器打开 [http://localhost:3000](http://localhost:3000)。

### Pages 构建与本地预览

```bash
npm run pages:build
npm run preview
```

`preview` 会先执行 `pages:build`，再对构建产物运行 `wrangler pages dev`。

## npm 脚本

| 脚本 | 说明 |
|------|------|
| `dev` | Next.js 开发服务器，并启用 Cloudflare 开发绑定 |
| `build` | 标准 Next.js 生产构建 |
| `start` | 启动 Next.js 服务（Node 部署；非 Pages 主路径） |
| `lint` | 运行 ESLint |
| `pages:build` | 通过 `@cloudflare/next-on-pages` 构建 Pages 产物 |
| `preview` | `pages:build` + `wrangler pages dev` |
| `deploy` | 将 `rss.xml` 下载到 `public/`，再 `pages:build`，再 `wrangler pages deploy` |
| `rss-xml` | 使用 `wget` 将远程 `rss.xml` 写入 `public/rss.xml`（由 `deploy` 调用） |
| `cf-typegen` | 根据 `wrangler.toml` 生成 `env.d.ts`（`CloudflareEnv`） |

## API 路由

| 方法 / 路径 | 说明 |
|-------------|------|
| `POST /api/get-latest-podcasts` | 请求体 JSON：`{ "page": number, "limit": number }` — 分页返回 D1 中已发布单集 |
| `GET /api/get-podcast?id=<pid>` | 按 `pid` 返回单集 |
| `GET /api/rss` | RSS XML（代理或 D1 兜底） |

`/rss` 页面会重定向到 `/api/rss`。

## 部署到 Cloudflare Pages

1. 确认 `wrangler.toml` 与控制台中的 D1、R2 绑定一致。  
2. 执行：

```bash
npm run deploy
```

该命令会从配置 URL 刷新 `public/rss.xml`，使用 `next-on-pages` 构建，并通过 Wrangler 部署。Pages 项目名称与账号按你本地 Wrangler 登录与配置为准。

## 项目结构（概要）

- `src/app/` — App Router 页面与路由处理  
- `src/components/` — UI（含播放器与卡片）  
- `src/models/podcast.ts` — D1 查询  
- `data/podcast.sql` — 表结构及本地 D1 可选种子数据  

---

使用 Cloudflare [`c3`](https://developers.cloudflare.com/pages/get-started/c3) 初始化，用于在 Pages 上运行 Next.js。

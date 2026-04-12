<div align="center">
    <img src="./public/an_AI_podcast_1400.jpg" alt="AI Podcast">
</div>

# AI Podcast（网站前端）

**语言：** [English](README.md) | [简体中文](README_CN.md)

- [Apple 播客 — AI Podcast](https://podcasts.apple.com/us/podcast/ai-podcast/id1798858172)

## 简介

基于 [Next.js](https://nextjs.org/) 的 **AI 播客**浏览与收听站点。单集元数据与列表来自 **Cloudflare D1**；音频与封面等资源 URL 通常指向 **R2** 或其他 HTTPS 地址。内容可来自 PDF、网页、文本、图片、音视频等多模态数据，再经多模态或大模型链路生成播客节目。

若要 **生成节目** 并维护发布流水线，请使用配套仓库：[github.com/ai-bot-pro/podcast](https://github.com/ai-bot-pro/podcast.git)（若你在本 monorepo 内开发，也可直接使用本地的 `podcast/` 目录）。

## 功能概览

- 首页展示最新节目、分页与站内音频播放器  
- 单集详情：`/podcast/[pid]`  
- RSS：`/api/rss`（优先拉取线上 `rss.xml`，失败时根据 D1 数据生成）  
- API 使用 Edge 运行时（`runtime = 'edge'`），适配 Cloudflare Pages  

## 技术栈

- Next.js 15、React 18、TypeScript、Tailwind CSS  
- 部署：[Cloudflare Pages](https://pages.cloudflare.com/) + [`@cloudflare/next-on-pages`](https://github.com/cloudflare/next-on-pages)  
- **D1** 绑定名 `PODCAST_DB`，对应 `podcast` 表  
- **R2** 在 `wrangler.toml` 中绑定为 `PODCAST_BUCKET`（便于后续存资源；数据库里的 URL 也可能已是公网 R2 地址）  

## 环境要求

- Node.js 18.18+（Next.js 15 建议版本）  
- npm、pnpm 或 yarn  
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/)（已在 devDependencies 中）及 Cloudflare 账号（用于生产部署）  

## 快速开始

安装依赖：

```bash
npm install
```

### 配置 Cloudflare 绑定（`wrangler.toml`）

1. 在 Cloudflare 控制台创建或选择 **D1** 数据库与 **R2** 存储桶。  
2. 修改 `wrangler.toml`：将 `PODCAST_DB` 的 `database_id` 等改为你账号下的资源；R2 的 `bucket_name` 与绑定名保持一致。  
3. 在 Pages 项目「Functions」绑定中配置相同的 D1、R2，与本地一致。  
4. 绑定变更后重新生成类型：

```bash
npm run cf-typegen
```

### 本地 D1 表结构与示例数据

[`data/podcast.sql`](data/podcast.sql) 内含建表语句与示例数据。文件头部注释给出了用 Wrangler 写入**本地** D1 的示例，例如：

```bash
npx wrangler d1 execute podcast_hub --local --file=./data/podcast.sql
```

请把数据库名与 `wrangler.toml` 里的 `database_name` 对齐。

### 开发服务器

项目在 [`next.config.mjs`](next.config.mjs) 中通过 `@cloudflare/next-on-pages` 的 `setupDevPlatform()`，使 `next dev` 下可使用 D1 等绑定。详见官方 [推荐开发流程](https://github.com/cloudflare/next-on-pages/blob/main/internal-packages/next-dev/README.md#recommended-development-workflow)；发布前建议定期执行下面的 **preview**，确认 Pages 构建正常。

```bash
npm run dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000)。

### Pages 构建与本地预览

```bash
npm run pages:build
npm run preview
```

`preview` 会先执行 `pages:build`，再 `wrangler pages dev` 基于构建产物启动预览。

## npm 脚本说明

| 脚本 | 说明 |
|------|------|
| `dev` | Next 开发服务，并启用 Cloudflare 本地绑定 |
| `build` | 常规 Next 生产构建 |
| `start` | 启动 Next 服务（Node 部署场景；非 Pages 主路径） |
| `lint` | ESLint |
| `pages:build` | 使用 `@cloudflare/next-on-pages` 生成 Pages 产物 |
| `preview` | `pages:build` + `wrangler pages dev` |
| `deploy` | 拉取 `rss.xml` 到 `public/`，再 `pages:build`，最后 `wrangler pages deploy` |
| `rss-xml` | 用 `wget` 将远程 `rss.xml` 保存到 `public/rss.xml`（供 `deploy` 使用） |
| `cf-typegen` | 根据 `wrangler.toml` 生成 `env.d.ts` 中的 `CloudflareEnv` |

## API 说明

| 方法 / 路径 | 作用 |
|-------------|------|
| `POST /api/get-latest-podcasts` | 请求体 JSON：`{ "page": number, "limit": number }`，分页返回已发布节目 |
| `GET /api/get-podcast?id=<pid>` | 按 `pid` 查询单集 |
| `GET /api/rss` | 返回 RSS XML（代理或 D1 兜底生成） |

页面路由 `/rss` 会重定向到 `/api/rss`。

## 部署到 Cloudflare Pages

1. 确认 `wrangler.toml` 与控制台中的 D1、R2 绑定一致。  
2. 执行：

```bash
npm run deploy
```

该命令会更新 `public/rss.xml`、执行 `next-on-pages` 构建并通过 Wrangler 部署。项目名称与账号以你本地 `wrangler` 登录与配置为准。

## 目录结构（摘要）

- `src/app/` — App Router 页面与 Route Handlers  
- `src/components/` — 播放器、卡片等 UI  
- `src/models/podcast.ts` — D1 查询逻辑  
- `data/podcast.sql` — 本地 D1 表结构与可选种子数据  

---

项目最初通过 Cloudflare [`c3`](https://developers.cloudflare.com/pages/get-started/c3) 创建，用于在 Pages 上运行 Next.js。

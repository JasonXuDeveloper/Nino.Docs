# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Documentation website for [Nino](https://github.com/JasonXuDeveloper/Nino), a source-generated binary serializer for C# (.NET, Unity, HybridCLR). Built with **Fumadocs** on **React Router 7**, fully prerendered (`ssr: false`) and deployed to **Cloudflare Pages** with a few Pages Functions (`functions/`), set up like `/workspace/jengine.docs` (JEngine's docs), whose look and structure this site follows. Package manager: **Bun**.

The facts in the docs come from the Nino repository (`src/Nino.Core`, `src/Nino.Generator`, the unit tests, `docs/v4-design.md`, `docs/v4-benchmarks.md`). Never document an API, attribute or option that is not in the source.

## Development Commands

```bash
bun install            # install dependencies (runs fumadocs-mdx)
bun run dev            # dev server
bun run check          # tsc + Biome + internal link check: run before committing
bun run build          # prerender everything into build/client
bun run preview        # build, then wrangler pages dev (static site + functions)
bun run deploy         # build + wrangler pages deploy
bun run format         # Biome format
```

## Repository Structure

```
/
├── app/
│   ├── root.tsx               # html shell, theme, RootProvider
│   ├── routes.ts              # route table
│   ├── routes/home.tsx        # landing page (/en, /zh), copy for both locales inline
│   ├── routes/docs.tsx        # docs layout, old-version banner
│   ├── routes/search.ts       # static search index -> /api/search.json
│   └── app.css                # Tailwind + Fumadocs theme, showcase styles
├── content/docs/
│   ├── v4/                    # current (default) version, EN + ZH
│   │   └── advanced/          # Advanced Usage guides
│   ├── v3/, v2/               # archived versions, EN + ZH
│   └── <version>/meta.json, meta.zh.json   # sidebars
├── src/
│   ├── components/            # charts/ (visx bar charts), feedback/ (GitHub Discussions), ai/page-actions, showcase (stat row, tabs), search
│   ├── data/                  # v2/v3 benchmark JSON
│   ├── lib/benchmarks.ts      # every benchmark number the site shows
│   ├── lib/versions.ts        # version list and latestVersion
│   ├── lib/source.ts, i18n.ts # Fumadocs loader and i18n (en, zh; dot parser)
│   └── mdx-components.tsx     # components available in MDX
├── scripts/                   # generate-static (404, sitemap, llms.txt, .md copies), lint-links, favicons
├── functions/                 # Pages Functions: [[path]].ts (locale redirect, Markdown), api/feedback.ts
├── public/                    # favicons, og image, _redirects, _headers, _routes.json
├── app/entry.server.tsx       # prerender: wait for everything, no outlined Suspense chunks
├── react-router.config.ts     # prerenders every .mdx page
└── wrangler.jsonc             # Cloudflare Pages (pages_build_output_dir, nodejs_compat)
```

## Content Conventions

- English `page.mdx`, Chinese `page.zh.mdx`. **Every v4 page exists in both languages** with the same structure.
- Frontmatter: `title`, `description`, optional `icon` (a lucide-react name).
- Sidebars: `meta.json` / `meta.zh.json`, with `---Section---` separators.
- **Chinese headings carry an English id**: `## 键控成员 [#keyed-members]`. Links in both languages use the same English anchors, so `/zh/...#keyed-members` works. The link checker validates anchors.
- Internal links are absolute with locale and version: `/en/docs/v4/pooling#settings`.
- Code blocks are C# with Shiki notation (`// [!code highlight]`, `title="File.cs"`).
- MDX components: `Callout`, `Cards`/`Card`, `Tabs`/`Tab`, `Steps`/`Step`, `Accordions`/`Accordion`, `TypeTable`, `Files`, plus site components `BenchmarkChart`, `ShowcaseHero`/`Stats` (headline stat row), `StatCards`, `CountUp`, `BenchChart` (archived versions), `AnchorRedirect`.
- Versions are listed newest first everywhere: `src/lib/versions.ts` and `content/docs/meta.json` / `meta.zh.json` (`["v4", "v3", "v2"]`).
- Benchmark numbers live in `src/lib/benchmarks.ts` (charts) and in the MDX tables of the perf/whats-new/v3-vs-v4/vs-memorypack pages. Keep them in sync with `docs/v4-benchmarks.md` in the Nino repo. Note: v3 means **3.3.13**, not the 4.0 betas.
- Placeholders waiting for data, kept as MDX comments: `{/* GEN_N100 */}` (N = 100 build numbers vs v3), `{/* V3_DESERIALIZE */}...{/* /V3_DESERIALIZE */}` (v3-vs-v4), `{/* PERF_TABLE */}...{/* /PERF_TABLE */}` (perf).
- Interceptors are always on with Roslyn 4.8+; there is no opt-out property. Do not reintroduce one.

## Redirects

- Old site URLs: `public/_redirects` (Cloudflare `_redirects` syntax).
- Old anchors that moved to another page: `<AnchorRedirect map={{ ... }} />` on the old page.
- `v2.` / `v3.nino.xgamedev.net`: Cloudflare Single Redirect rules, documented in README.md.

## Adding a New Version (e.g. v5)

1. Copy `content/docs/v4` to `content/docs/v5`, update the pages and both `meta` files (`"title": "v5"`).
2. Add `'v5'` to the front of `versions` in `src/lib/versions.ts` and set `latestVersion = 'v5'`. v4 then shows the archived banner automatically.
   Put `"v5"` first in `content/docs/meta.json` and `meta.zh.json` so the version switcher stays newest first.
3. Point the landing page copy and the `_redirects` short links at v5 where needed.
4. `bun run check && bun run build`.

## Style

- Stock Fumadocs `neutral.css` + `preset.css`; only `--color-fd-primary` is overridden (a calm blue). No custom palettes, gradients (except the one headline span on the home page), glows or decorative animation.
- Charts: `<BenchmarkChart chart="serialize" lang="en" />` (ids in `src/components/charts/benchmark-charts.tsx`). Nino v4 is the accent, everything else neutral grey. All numbers come from `src/lib/benchmarks.ts`.
- Feedback: `remarkFeedbackBlock` wraps paragraphs in `FeedbackBlock`; every page ends with `<Feedback>`. Both post to `/api/feedback`.

## Build & Deploy

`bun run build` runs `react-router build` (prerendering every page) and then `scripts/generate-static.ts`. Cloudflare Pages serves `build/client` and runs `functions/`. The feedback API needs `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY` and `GITHUB_APP_INSTALLATION_ID` (Production only); see README.md.

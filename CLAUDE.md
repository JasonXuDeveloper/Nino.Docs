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

Two dependency fixes keep the build free of warnings; drop each once upstream no longer needs it. `overrides` in package.json lifts Tailwind's pinned lightningcss (1.32.0, which warns on fumadocs-ui's `::highlight()`) to 1.33.0. `patches/@react-router%2Fdev@7.18.4.patch` (a `bun patch`) passes `envDir: false` instead of `envFile: false`, which Vite 8 deprecates. Upgrading `@react-router/dev` needs the patch redone or removed.

Cloudflare Pages builds with the Node version in `.node-version` and the Bun version in the Pages environment variable `BUN_VERSION`; the `nodejs_compat` flag (`src/lib/github.ts` uses `node:crypto`) is set in the dashboard too. There is no Wrangler file on purpose: with one, Pages ignores the dashboard's settings. Keep `BUN_VERSION` at the Bun version used locally (the build image's default, 1.2.15, cannot read the version 2 `bun.lock` that Bun 1.3+ writes, and `bun install --frozen-lockfile` then fails the deploy).

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
│   ├── components/            # charts/ (visx bar charts), feedback/ (GitHub Discussions), ai/page-actions, showcase (reveal, CountUp, Segmented), search
│   ├── data/                  # bench-v4.json, bench-v3-runtime.json (synced), v2/v3 benchmark JSON
│   ├── lib/benchmarks.ts      # every benchmark number the site shows (runtime from data/bench-v4.json, bench-v3-runtime.json)
│   ├── lib/versions.ts        # version list and latestVersion
│   ├── lib/source.ts, i18n.ts # Fumadocs loader and i18n (en, zh; dot parser)
│   └── mdx-components.tsx     # components available in MDX
├── scripts/                   # generate-static (404, sitemap, robots, llms.txt, .md copies), og (social cards), lint-links, favicons
├── functions/                 # Pages Functions: [[path]].ts (locale redirect, Markdown), api/feedback.ts
├── public/                    # favicons, og image, _redirects, _headers, _routes.json
├── app/entry.server.tsx       # prerender: wait for everything, no outlined Suspense chunks
├── react-router.config.ts     # prerenders every .mdx page
└── vite.config.ts             # the site; `--mode scripts` for the scripts run with vite-node
```

## Content Conventions

- English `page.mdx`, Chinese `page.zh.mdx`. **Every v4 page exists in both languages** with the same structure.
- Frontmatter: `title`, `description`, optional `icon` (a lucide-react name), optional `seoTitle` (the full `<title>` when "Title – Nino v4 Docs" would be too generic, e.g. an "Overview" page; the heading keeps `title`) and `faq: true` (its `##` questions become FAQPage JSON-LD). Descriptions are the search snippet and the llms.txt summary: one or two sentences, specific, true to the source.
- Sidebars: `meta.json` / `meta.zh.json`, with `---Section---` separators.
- **Chinese headings carry an English id**: `## 键控成员 [#keyed-members]`. Links in both languages use the same English anchors, so `/zh/...#keyed-members` works. The link checker validates anchors.
- Internal links are absolute with locale and version: `/en/docs/v4/pooling#settings`.
- Code blocks are C# with Shiki notation (`// [!code highlight]`, `title="File.cs"`).
- MDX components: `Callout`, `Cards`/`Card`, `Tabs`/`Tab`, `Steps`/`Step`, `Accordions`/`Accordion`, `TypeTable`, `Files`, plus site components `BenchmarkChart`, `CountUp`, `BenchChart` (archived versions), `AnchorRedirect` and the benchmark tables below.
- Versions are listed newest first everywhere: `src/lib/versions.ts` and `content/docs/meta.json` / `meta.zh.json` (`["v4", "v3", "v2"]`).
- v4 runtime numbers (v4 and MemoryPack) come only from `src/data/bench-v4.json`. `bun run build` first runs `scripts/sync-benchmarks.ts`, which refreshes it from the "Performance Report" of the newest `v4.*` release (prereleases included) when that report covers every method the site shows; on any failure it keeps the committed file. From that same release it also reads the "📊 v3 3.3.13 vs v4 (same machine)" section (Nino's `report.yml` runs `benchmarks/v3` directly before the v4 run in the same job) into `src/data/bench-v3-runtime.json`; a release without that section keeps the committed file. Test the parser with `bun scripts/sync-benchmarks.ts --fixture scripts/fixtures/release-body.md` `--fixture scripts/fixtures/release-body-v3.md` and `--fixture scripts/fixtures/release-body-new.md` (every benchmark class and the v3 section, from the local run the committed data comes from) (add `--out <v4.json> --out-v3 <v3.json>` to write files). `GITHUB_TOKEN` raises the API limit.
- Never type a runtime number or ratio into MDX: use `<RuntimeTable op="serialize" />`, `<ReuseTable />`, `<ExtraRuntimeTables />` (reference tracking, version tolerance, fixed-size types; renders only when the synced report has those rows), `<ResultsTable />`, `<BenchSource />` and `<BenchValue k="serialize.max" />` (keys in `src/components/bench-data.tsx`). Ratios are computed in `src/lib/benchmarks.ts`.
- Runtime against v3: only `V3_RUNTIME` in `src/lib/benchmarks.ts`, read from `src/data/bench-v3-runtime.json` (v3 and v4 mean times of one back-to-back run of v3 3.3.13 from NuGet and v4 on the same machine; one v3 run directly before v4 since rc.2; older reports and the local run had a v3 run before and after v4, and v3 is then their mean). Ratios are computed from those two times, never from `bench-v4.json`; the v3 charts' footnote (`v3SourceNote`) names the release (or, for `origin: "local"`, the local run) and the machine from that run's environment; a non-null `note` replaces it. With no rows the site shows no v4-vs-v3 runtime numbers. Never type v3 numbers in by hand: they come from a release, or from a local `benchmarks/run.sh` with `origin: "local"`. v3 means **3.3.13**, never a 4.0 beta. Build-time numbers (generator benchmark) are static in `benchmarks.ts` (`build`, `buildLarge`) and the perf/v3-vs-v4 tables.
- v3 and v2 pages keep their own `src/data/bench-v3.json` / `bench-v2.json`; never point them at the synced data.
- Interceptors are always on with Roslyn 4.8+; there is no opt-out property. Do not reintroduce one.

## SEO and GEO

- Metadata and JSON-LD: `src/lib/seo.ts`; site facts (domain, links, the one-paragraph `productSummary`): `src/lib/site.ts`. Never put a value there that is not true per the Nino repository.
- `scripts/generate-static.ts` moves pages to `x.html` (slash-less URLs serve 200), and writes the sitemap (v4 only), robots.txt (all crawlers, AI included), llms.txt, Markdown copies (`<page>.md`, rendered by `src/lib/markdown.tsx`; give every new MDX component a Markdown form there) and the social cards (`scripts/og.ts`, run under Node, not Bun).
- Archived versions are `noindex` and out of the sitemap; see README.md, "Search engines and AI answer engines".

## Redirects

- Old site URLs: `public/_redirects` (Cloudflare `_redirects` syntax).
- Old anchors that moved to another page: `<AnchorRedirect map={{ ... }} />` on the old page.

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

`bun run build` runs `scripts/git-history.ts` (unshallows the clone so each page's "last updated" date, fumadocs-mdx `lastModified` from git, is right; no date when the history is missing), then `react-router build` (prerendering every page) and then `scripts/generate-static.ts`. Cloudflare Pages serves `build/client` and runs `functions/`. The feedback API needs `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY` and `GITHUB_APP_INSTALLATION_ID` (Production only); see README.md.

# nino.docs

Documentation site for [Nino](https://github.com/JasonXuDeveloper/Nino), served at <https://nino.xgamedev.net>.

Built with [Fumadocs](https://fumadocs.dev) on React Router 7, prerendered to static HTML and deployed to Cloudflare Pages (with a few Pages Functions). English and Chinese, with versioned docs (v4 is the default; v3 and v2 are archived).

## Develop

Requires [Bun](https://bun.sh).

```bash
bun install
bun run dev        # http://localhost:5173
bun run check      # type check, Biome lint, internal link check
bun run build      # static site in build/client
bun run preview    # build, then serve build/client and functions/ with wrangler pages dev
```

## Deploy (Cloudflare Pages)

The site is a Cloudflare Pages project, set up like JEngine's docs: every page is prerendered into `build/client`, and `functions/` adds a few Pages Functions.

| Setting | Value |
| --- | --- |
| Project name | `nino` |
| Build command | `bun run build` |
| Build output directory | `build/client` |
| Compatibility flags | `nodejs_compat` (from `wrangler.jsonc`) |

Each docs page shows a "last updated" date: the date of the last commit that touched its `.mdx` file (fumadocs-mdx `lastModified`, from `git log`). Pages may build from a shallow clone, so `bun run build` first runs `scripts/git-history.ts`, which fetches the full history (`git fetch --unshallow`). If that fails, or there is no git, the build still succeeds and pages show no date rather than a wrong one; look for `[git-history]` in the build log.

Deploy from Git (Pages builds each push) or by hand with `bun run deploy` (`wrangler pages deploy build/client --project-name nino`).

Functions:

- `functions/[[path]].ts`: redirects paths without a language (such as `/`) to `/en` or `/zh` (the `FD_LOCALE` cookie, else the visitor's country), serves a docs page as Markdown when the request prefers `text/markdown` (for LLM tools), and sets the headers of the `.md` copies (`text/markdown`, canonical link to the page).
- `functions/api/feedback.ts`: the "How is this guide?" and per-paragraph feedback. It posts to the **Docs Feedback** discussion category of [JasonXuDeveloper/Nino](https://github.com/JasonXuDeveloper/Nino/discussions) through a GitHub App with Discussions read and write permission.

Environment variables (Pages project, **Production**, encrypted):

| Variable | Value |
| --- | --- |
| `GITHUB_APP_ID` | the GitHub App's ID |
| `GITHUB_APP_PRIVATE_KEY` | the App's private key (PEM; `\n` escapes are accepted, PKCS#1 keys are converted) |
| `GITHUB_APP_INSTALLATION_ID` | the installation ID of the App on JasonXuDeveloper/Nino |

Feedback only works on **production**. Preview deployments and `bun run preview` have no credentials: the API answers `503`, and the page tells the reader the feedback could not be sent. Nothing else needs a secret; search is a static index (`/api/search.json`) searched in the browser.

`public/_routes.json` keeps the old-URL paths out of the functions, so the `public/_redirects` rules (which Pages does not apply to requests that reach a function) still handle them. `scripts/generate-static.ts` moves every prerendered page from `x/index.html` to `x.html`, so Pages serves each page at its slash-less URL (`/en/docs/v4/start`, the URL used by every link, canonical tag and sitemap entry) and redirects `/en/docs/v4/start/` and `.html` there with a 308; unknown paths get `404.html` with a 404 status.

## Search engines and AI answer engines

Everything is generated at build time; nothing costs anything at run time.

| What | Where |
| --- | --- |
| `<title>` ("Page – Nino v4 Docs", or the page's `seoTitle` frontmatter), description, canonical, hreflang (`en`, `zh`, `zh-CN`, `x-default`), Open Graph and Twitter cards, `robots` | `src/lib/seo.ts`, used by the `meta` exports of `app/routes/home.tsx` and `app/routes/docs.tsx` |
| JSON-LD: `WebSite`, `TechArticle` (with `dateModified` from git), `BreadcrumbList` on every docs page; `FAQPage` on pages with `faq: true`; `SoftwareSourceCode` / `SoftwareApplication` (GitHub, NuGet, OpenUPM, MIT) on the home pages | `src/lib/seo.ts` |
| Social cards: one 1200×630 PNG per page (`/og/en/docs/v4/start.png`), drawn with sharp; `public/og.png` is the fallback (`bun run og:default` redraws it) | `scripts/og.ts` |
| `sitemap.xml` (home and every v4 page in both languages, `lastmod` from git, `xhtml:link` alternates), `robots.txt` | `scripts/generate-static.ts` |
| `llms.txt` / `llms-full.txt` ([llmstxt.org](https://llmstxt.org)), Chinese at `llms.zh.txt` / `llms-full.zh.txt` (also `/zh/llms.txt`); a Markdown copy of every page at `<page>.md` (`.mdx` kept for old links) with the title, URL, version and last-updated date, components rendered to Markdown tables and text | `scripts/generate-static.ts`, `src/lib/markdown.tsx` |
| Markdown responses: `.md` files are served as `text/markdown` with a `Link: <page>; rel="canonical"` header; a page requested with `Accept: text/markdown` gets its Markdown; `.data` files are `noindex` | `functions/[[path]].ts` |

**Archived versions** (v3, v2) are `noindex, follow`, left out of the sitemap and listed only under "Optional" in `llms.txt`. Their APIs and binary formats differ from v4, so they must not rank for, or be quoted in answers about, the current version; they keep a self-referencing canonical (a canonical to the v4 page would be ignored, as the content differs) and the "old version" banner links to the v4 page.

**Crawlers, including AI crawlers, are allowed.** `robots.txt` allows every crawler and names the search engines and AI crawlers (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Google-Extended, Applebot-Extended, Bingbot, Baiduspider, ...) explicitly: the goal is to be found, quoted and cited. Only `/api/` is disallowed. In the Cloudflare dashboard, keep **Security → Bots → "Block AI bots"** off and **"Manage your robots.txt" (AI Crawl Control)** off for `nino.xgamedev.net`: either one overrides this `robots.txt` or blocks those crawlers at the edge.

### After the first deploy

1. **Cloudflare Crawler Hints**: turn on **Caching → Configuration → Crawler Hints** for the zone (free). Cloudflare then sends IndexNow signals (Bing, Yandex and others) on its own when content changes; there is nothing to run after a deploy.
2. **Google Search Console**: add a Domain property for `xgamedev.net` (verified with a DNS TXT record in Cloudflare) and submit `https://nino.xgamedev.net/sitemap.xml`.
3. **Bing Webmaster Tools**: import the site from Search Console and submit the sitemap.
4. **Baidu Search Resource Platform** (ziyuan.baidu.com): verify with the CNAME method (a DNS record in Cloudflare) and submit the sitemap.

The HTML-tag verification methods are optional: set any of these on the Pages project (Production, plain text) and the build adds the matching `<meta>` tag to every page (`src/lib/site.ts`); unset ones are left out.

| Variable | Tag |
| --- | --- |
| `VITE_GOOGLE_SITE_VERIFICATION` | `google-site-verification` |
| `VITE_BING_SITE_VERIFICATION` | `msvalidate.01` |
| `VITE_BAIDU_SITE_VERIFICATION` | `baidu-site-verification` |

## Benchmark data

The v4 runtime numbers (Nino and MemoryPack) come from `src/data/bench-v4.json`. Before every build, `scripts/sync-benchmarks.ts` reads the "Performance Report" that Nino's report workflow adds to each GitHub release, takes the newest `v4.*` release (prereleases included) whose report covers every benchmark the site shows, and rewrites the file. If anything fails (no such release yet, network, rate limit, a table it cannot read) it prints a warning and the build uses the committed file. The report workflow triggers a rebuild through a Pages deploy hook (`DOCS_DEPLOY_HOOK` secret in the Nino repo). Optional: set `GITHUB_TOKEN` on the Pages project to raise the GitHub API rate limit.

```bash
bun run sync:benchmarks                                              # sync now
bun scripts/sync-benchmarks.ts --fixture scripts/fixtures/release-body.md  # test the parser
bun scripts/sync-benchmarks.ts --fixture scripts/fixtures/release-body-new.md  # every benchmark class and the v3 section
```

Every benchmark class is required, the reference tracking, version tolerance and fixed-size rows (`ReferenceTest`, `VersionTolerantTest`, `FixedSizeTest`) included: a report without them is not used. `release-body-new.md` is the body `report.yml` would write for a local `benchmarks/run.sh` run (the run the committed data files come from, marked `"origin": "local"`), with its Payload cells in exact bytes as the benchmark now prints them.

## Redirects

Old URLs keep working:

- **Old site paths** (`/en/doc/start`, `/zh/perf/micro`, ...) are redirected by [`public/_redirects`](public/_redirects).
- **Old anchors** that moved to their own page (for example `/en/docs/v4/advanced#ninopooled`) are redirected client-side by `<AnchorRedirect>` in the target page.
- **Old version subdomains** (`v3.nino.xgamedev.net`, `v2.nino.xgamedev.net`) must be redirected in the Cloudflare dashboard, because they are separate hostnames. Make sure each subdomain has a **proxied** DNS record (for example `AAAA 100::`), then add **Rules → Redirect Rules → Single Redirect** rules, in this order, for each of `v3` and `v2`:

  | When incoming requests match | Type | URL | Status |
  | --- | --- | --- | --- |
  | Wildcard `https://v3.nino.xgamedev.net/*/doc/*` | Dynamic | `https://nino.xgamedev.net/${1}/docs/v3/${2}` | 301 |
  | Wildcard `https://v3.nino.xgamedev.net/*/perf/micro` | Dynamic | `https://nino.xgamedev.net/${1}/docs/v3/perf` | 301 |
  | Wildcard `https://v3.nino.xgamedev.net/zh*` | Static | `https://nino.xgamedev.net/zh/docs/v3` | 301 |
  | Wildcard `https://v3.nino.xgamedev.net/*` | Static | `https://nino.xgamedev.net/en/docs/v3` | 301 |

  For v2, replace `v3` with `v2` in both the hostname and the target path. Turn on "Preserve query string" for the dynamic rules.

## Content

Pages are MDX in `content/docs/<version>/`, `page.mdx` for English and `page.zh.mdx` for Chinese. See [CLAUDE.md](CLAUDE.md) for conventions.

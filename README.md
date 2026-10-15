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

Deploy from Git (Pages builds each push) or by hand with `bun run deploy` (`wrangler pages deploy build/client --project-name nino`).

Functions:

- `functions/[[path]].ts`: redirects paths without a language (such as `/`) to `/en` or `/zh` (the `FD_LOCALE` cookie, else the visitor's country), and serves a docs page as Markdown when the request prefers `text/markdown` (for LLM tools).
- `functions/api/feedback.ts`: the "How is this guide?" and per-paragraph feedback. It posts to the **Docs Feedback** discussion category of [JasonXuDeveloper/Nino](https://github.com/JasonXuDeveloper/Nino/discussions) through a GitHub App with Discussions read and write permission.

Environment variables (Pages project, **Production**, encrypted):

| Variable | Value |
| --- | --- |
| `GITHUB_APP_ID` | the GitHub App's ID |
| `GITHUB_APP_PRIVATE_KEY` | the App's private key (PEM; `\n` escapes are accepted, PKCS#1 keys are converted) |
| `GITHUB_APP_INSTALLATION_ID` | the installation ID of the App on JasonXuDeveloper/Nino |

Feedback only works on **production**. Preview deployments and `bun run preview` have no credentials: the API answers `503`, and the page tells the reader the feedback could not be sent. Nothing else needs a secret; search is a static index (`/api/search.json`) searched in the browser.

`public/_routes.json` keeps the old-URL paths out of the functions, so the `public/_redirects` rules (which Pages does not apply to requests that reach a function) still handle them. Pages serves each page at its trailing-slash URL (`/en/docs/v4/start/`) and redirects the bare path there; unknown paths get `404.html` with a 404 status.

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

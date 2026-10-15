# nino.docs

Documentation site for [Nino](https://github.com/JasonXuDeveloper/Nino), served at <https://nino.xgamedev.net>.

Built with [Fumadocs](https://fumadocs.dev) on React Router 7, prerendered to static HTML and deployed as Cloudflare Workers static assets. English and Chinese, with versioned docs (v4 is the default; v3 and v2 are archived).

## Develop

Requires [Bun](https://bun.sh).

```bash
bun install
bun run dev        # http://localhost:5173
bun run check      # type check, Biome lint, internal link check
bun run build      # static site in build/client
bun run preview    # serve build/client with wrangler, as in production
```

## Deploy

```bash
bun run deploy     # build + wrangler deploy
```

`wrangler.jsonc` deploys `build/client` as static assets (no Worker script). Unknown paths serve `404.html` with a 404 status. Search is a static index (`/api/search.json`) searched in the browser, so there are no API keys, secrets or environment variables.

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

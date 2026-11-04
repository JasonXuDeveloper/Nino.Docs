interface Env {
  ASSETS: Fetcher;
}

// /en, /en/..., and /en.html (which Pages redirects to /en)
const localizedPathPattern = /^\/(en|zh)(?:\/|\.html$|$)/;
// The not-found pages themselves (/404, /en/404, /zh/404.html, ...): Pages
// would serve them with 200, a soft 404 to search engines.
const notFoundPathPattern = /^\/(?:(en|zh)\/)?404(?:\.html)?\/?$/;
const docsMarkdownPattern = /^\/(en|zh)\/docs\/.+/;
const markdownMime = 'text/markdown; charset=utf-8';
const markdownFilePattern = /^\/(en|zh)\/docs\/.+\.mdx?$/;
const siteUrl = 'https://nino.xgamedev.net';
// Versions other than the latest are noindex (src/lib/seo.ts)
const archivedPattern = /^\/(en|zh)\/docs\/(v3|v2)(\/|\.|$)/;
const localeCookieName = 'FD_LOCALE';
const zhCountries = new Set(['CN', 'TW', 'HK', 'MO', 'SG']);
const bypassExtensions = new Set([
  '.css',
  '.js',
  '.mjs',
  '.map',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.ico',
  '.webp',
  '.avif',
  '.woff',
  '.woff2',
  '.ttf',
  '.otf',
  '.json',
  '.txt',
  '.xml',
  '.webmanifest',
]);

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request } = context;

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return context.next();
  }

  const url = new URL(request.url);

  if (shouldBypass(url.pathname)) {
    return context.next();
  }

  const notFoundPath = url.pathname.match(notFoundPathPattern);
  if (notFoundPath) {
    return notFound(context, url, notFoundPath[1] as Locale | undefined);
  }

  // Markdown copies of the docs pages (/en/docs/v4/start.md, legacy .mdx)
  if (markdownFilePattern.test(url.pathname)) {
    return withMarkdownHeaders(await context.next(), url.pathname);
  }

  // React Router data files: never a search result
  if (url.pathname.endsWith('.data')) {
    return withHeaders(await context.next(), {
      'X-Robots-Tag': 'noindex',
    });
  }

  if (prefersMarkdown(request) && docsMarkdownPattern.test(url.pathname)) {
    return serveMarkdown(context, url);
  }

  if (!localizedPathPattern.test(url.pathname)) {
    const locale = getLocale(request);
    const target = new URL(request.url);
    target.pathname = localizePath(url.pathname, locale);

    // Only redirect to a page that exists: a redirect to a 404 (/random ->
    // /en/random) is a chain search engines report instead of a plain 404.
    if (url.pathname !== '/' && url.pathname !== '/index.html') {
      const probe = await context.env.ASSETS.fetch(
        new Request(target, { method: 'HEAD', redirect: 'manual' }),
      );
      if (probe.status === 404) return notFound(context, url);
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: `${target.pathname}${target.search}`,
        'Set-Cookie': serializeLocaleCookie(locale),
      },
    });
  }

  // Docs pages answer with HTML or Markdown depending on Accept (above)
  if (docsMarkdownPattern.test(url.pathname)) {
    return withHeaders(await context.next(), { Vary: 'Accept' });
  }

  return context.next();
};

type Locale = 'en' | 'zh';

/**
 * The not-found page with status 404: /en/404.html or /zh/404.html for a
 * locale, else the bilingual /404.html. Pages serves those files with 200 at
 * their own URLs, so the status is set here.
 */
async function notFound(
  context: EventContext<Env, string, unknown>,
  url: URL,
  locale?: Locale,
) {
  const page = await context.env.ASSETS.fetch(
    new URL(locale ? `/${locale}/404` : '/404', url),
  );
  return new Response(context.request.method === 'HEAD' ? null : page.body, {
    status: 404,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Robots-Tag': 'noindex',
    },
  });
}

function shouldBypass(pathname: string) {
  if (
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/images/') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/static.json' ||
    pathname === '/manifest.webmanifest'
  ) {
    return true;
  }

  const extension = pathname.match(/\.[a-z0-9]+$/i)?.[0].toLowerCase();
  return extension ? bypassExtensions.has(extension) : false;
}

function prefersMarkdown(request: Request) {
  const accept = request.headers.get('accept');
  if (!accept) return false;

  const parts = accept.split(',').map((part) => part.trim().toLowerCase());
  const markdownIndex = parts.findIndex((part) =>
    part.startsWith('text/markdown'),
  );
  if (markdownIndex === -1) return false;

  const htmlIndex = parts.findIndex((part) => part.startsWith('text/html'));
  return htmlIndex === -1 || markdownIndex < htmlIndex;
}

async function serveMarkdown(
  context: EventContext<Env, string, unknown>,
  url: URL,
) {
  const assetUrl = new URL(url);
  // The Markdown copy of /en/docs/v4/start (or .../start/) is
  // /en/docs/v4/start.md.
  const pathname = url.pathname.replace(/\/+$/, '');
  assetUrl.pathname = /\.mdx?$/.test(pathname) ? pathname : `${pathname}.md`;

  const response = await context.env.ASSETS.fetch(assetUrl);
  if (response.status === 404) return context.next();

  const markdown = withMarkdownHeaders(response, assetUrl.pathname);
  markdown.headers.set('Vary', 'Accept');
  return markdown;
}

function withHeaders(response: Response, headers: Record<string, string>) {
  const result = new Response(response.body, response);
  for (const [name, value] of Object.entries(headers))
    result.headers.set(name, value);
  return result;
}

/**
 * Markdown copies are served as text/markdown and point search engines at the
 * HTML page (rel="canonical"), so they never compete with it in results.
 */
function withMarkdownHeaders(response: Response, pathname: string) {
  if (!response.ok) return response;
  const page = pathname.replace(/\.mdx?$/, '');
  return withHeaders(response, {
    'Content-Type': markdownMime,
    'Cache-Control':
      response.headers.get('cache-control') ?? 'public, max-age=3600',
    Link: `<${siteUrl}${page}>; rel="canonical"`,
    ...(archivedPattern.test(pathname) ? { 'X-Robots-Tag': 'noindex' } : {}),
  });
}

function getLocale(request: Request): Locale {
  const cookieLocale = request.headers
    .get('cookie')
    ?.split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${localeCookieName}=`))
    ?.split('=')[1];

  if (cookieLocale === 'en' || cookieLocale === 'zh') return cookieLocale;

  const cf = request.cf as IncomingRequestCfProperties | undefined;
  const country =
    typeof cf?.country === 'string'
      ? cf.country
      : request.headers.get('cf-ipcountry');

  return country && zhCountries.has(country.toUpperCase()) ? 'zh' : 'en';
}

function localizePath(pathname: string, locale: Locale) {
  // `/index.html` is the root page, not a page under /en (which would 404)
  if (pathname === '/' || pathname === '/index.html') return `/${locale}`;
  return `/${locale}${pathname}`;
}

function serializeLocaleCookie(locale: Locale) {
  return `${localeCookieName}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`;
}

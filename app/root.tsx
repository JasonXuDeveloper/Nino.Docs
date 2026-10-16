import { RootProvider } from 'fumadocs-ui/provider/react-router';
import type { ReactNode } from 'react';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigate,
} from 'react-router';
import SearchDialog from '@/components/search';
import { getLocale } from '@/lib/i18n';
import { i18nUI } from '@/lib/i18n-ui';
import { languageTag, siteName, siteVerification } from '@/lib/site';
import type { Route } from './+types/root';
import NotFound from './routes/not-found';
import './app.css';

export const links: Route.LinksFunction = () => [
  { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
  {
    rel: 'icon',
    href: '/favicon-32x32.png',
    type: 'image/png',
    sizes: '32x32',
  },
  {
    rel: 'icon',
    href: '/favicon-16x16.png',
    type: 'image/png',
    sizes: '16x16',
  },
  { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
  { rel: 'manifest', href: '/manifest.webmanifest' },
];

function localeOf(pathname: string) {
  return getLocale(pathname.split('/')[1]);
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const locale = localeOf(pathname);

  // Remember the choice (read by the `/` page) and stay on the same page.
  function onLocaleChange(next: string) {
    // biome-ignore lint/suspicious/noDocumentCookie: one cookie, read by the inline script of `/`
    document.cookie = `FD_LOCALE=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    const rest = pathname.replace(/^\/(en|zh)(?=\/|$)/, '');
    navigate(`/${next}${rest}${window.location.hash}`);
  }

  return (
    <html lang={languageTag[locale]} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:site_name" content={siteName} />
        <meta name="theme-color" content="#2a4a8a" />
        {siteVerification.google && (
          <meta
            name="google-site-verification"
            content={siteVerification.google}
          />
        )}
        {siteVerification.bing && (
          <meta name="msvalidate.01" content={siteVerification.bing} />
        )}
        {siteVerification.baidu && (
          <meta
            name="baidu-site-verification"
            content={siteVerification.baidu}
          />
        )}
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-screen flex-col">
        <RootProvider
          i18n={{ ...i18nUI.provider(locale), onLocaleChange }}
          search={{ SearchDialog }}
        >
          {children}
        </RootProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error) && error.status === 404) return <NotFound />;

  const message =
    import.meta.env.DEV && error instanceof Error
      ? error.message
      : 'An unexpected error occurred.';

  return (
    <main className="mx-auto w-full max-w-3xl p-8 pt-16">
      <h1 className="text-2xl font-semibold">Error</h1>
      <p className="mt-2 text-fd-muted-foreground">{message}</p>
    </main>
  );
}

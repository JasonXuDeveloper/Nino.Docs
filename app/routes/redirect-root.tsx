import { useEffect } from 'react';

// `/` picks the language in the browser: the `nino_locale` cookie (set by the
// language switcher), else the browser language. There is no server.
const pickLocale = `(function(){var m=document.cookie.match(/(?:^|; )nino_locale=(en|zh)/);var l=m?m[1]:(navigator.language||'').toLowerCase().indexOf('zh')===0?'zh':'en';location.replace('/'+l+location.hash);})()`;

export function meta() {
  return [
    { title: 'Nino' },
    { name: 'robots', content: 'noindex' },
    { tagName: 'link', rel: 'canonical', href: 'https://nino.xgamedev.net/en' },
  ];
}

export default function RedirectRoot() {
  // Client-side navigation to `/` (the inline script only runs on page load)
  useEffect(() => {
    const cookie = document.cookie.match(/(?:^|; )nino_locale=(en|zh)/)?.[1];
    const locale =
      cookie ??
      (navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en');
    window.location.replace(`/${locale}${window.location.hash}`);
  }, []);

  return (
    <main className="flex flex-1 items-center justify-center p-8 text-fd-muted-foreground">
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static redirect script
        dangerouslySetInnerHTML={{ __html: pickLocale }}
      />
      <noscript>
        <meta httpEquiv="refresh" content="0; url=/en" />
      </noscript>
      <p>
        <a href="/en">English</a> · <a href="/zh">简体中文</a>
      </p>
    </main>
  );
}

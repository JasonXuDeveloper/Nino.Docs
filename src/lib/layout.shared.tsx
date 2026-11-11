import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { BookOpen, Gauge, MessageCircle } from 'lucide-react';
import type { Locale } from './i18n';
import { githubUrl } from './site';
import { latestVersion } from './versions';

export function baseOptions(lang: Locale): BaseLayoutProps {
  const zh = lang === 'zh';
  return {
    nav: {
      title: (
        <span className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt=""
            width={28}
            height={28}
            className="size-7"
          />
          <span className="font-semibold text-base">Nino</span>
        </span>
      ),
      url: `/${lang}`,
    },
    links: [
      {
        text: zh ? '文档' : 'Docs',
        url: `/${lang}/docs/${latestVersion}`,
        icon: <BookOpen />,
        active: 'nested-url',
        on: 'nav',
      },
      {
        text: zh ? '性能' : 'Performance',
        url: `/${lang}/docs/${latestVersion}/benchmarks`,
        icon: <Gauge />,
        on: 'nav',
      },
      // The Chinese community's QQ group (1054653934); the English site has none.
      ...(zh
        ? [
            {
              text: 'QQ 群',
              url: 'https://qm.qq.com/q/Octgj3BS8g',
              icon: <MessageCircle />,
              external: true,
              on: 'nav' as const,
            },
          ]
        : []),
    ],
    githubUrl,
  };
}

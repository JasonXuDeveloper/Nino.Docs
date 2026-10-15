import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { BookOpen, Gauge } from 'lucide-react';
import type { Locale } from './i18n';
import { latestVersion } from './versions';

export const githubUrl = 'https://github.com/JasonXuDeveloper/Nino';

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
        url: `/${lang}/docs/${latestVersion}/perf`,
        icon: <Gauge />,
        on: 'nav',
      },
    ],
    githubUrl,
  };
}

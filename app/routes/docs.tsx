import browserCollections from 'collections/browser';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import { Banner } from 'fumadocs-ui/components/banner';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  EditOnGitHub,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { Link, redirect } from 'react-router';
import { getLocale, type Locale } from '@/lib/i18n';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';
import { isVersion, latestVersion } from '@/lib/versions';
import { getMDXComponents } from '@/mdx-components';
import type { Route } from './+types/docs';

const siteUrl = 'https://nino.xgamedev.net';
const repoUrl = 'https://github.com/JasonXuDeveloper/nino.docs';

export async function loader({ params }: Route.LoaderArgs) {
  const lang = getLocale(params.lang);
  const version = params.version;
  if (!isVersion(version)) throw redirect(`/${lang}/docs/${latestVersion}`);

  const rest = params['*']?.split('/').filter(Boolean) ?? [];
  const page = source.getPage([version, ...rest], lang);
  if (!page) throw new Response('Not found', { status: 404 });

  // For old versions: the same page in the latest version, if it exists.
  const latestUrl =
    version === latestVersion
      ? undefined
      : (source.getPage([latestVersion, ...rest], lang)?.url ??
        `/${lang}/docs/${latestVersion}`);

  return {
    lang,
    version,
    latestUrl,
    path: page.path,
    url: page.url,
    alternates: {
      en: source.getPage(page.slugs, 'en')?.url,
      zh: source.getPage(page.slugs, 'zh')?.url,
    },
    pageTree: await source.serializePageTree(source.getPageTree(lang)),
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData) return [];
  const { url, alternates, lang } = loaderData;

  return [
    { tagName: 'link', rel: 'canonical', href: `${siteUrl}${url}` },
    { property: 'og:url', content: `${siteUrl}${url}` },
    { property: 'og:locale', content: lang === 'zh' ? 'zh_CN' : 'en_US' },
    ...Object.entries(alternates)
      .filter(([, href]) => href)
      .map(([hrefLang, href]) => ({
        tagName: 'link',
        rel: 'alternate',
        hrefLang,
        href: `${siteUrl}${href}`,
      })),
  ];
}

interface ContentProps {
  lang: Locale;
  path: string;
  url: string;
}

const clientLoader = browserCollections.docs.createClientLoader<ContentProps>({
  component({ default: Mdx, frontmatter, toc }, { lang, path, url }) {
    const title = `${frontmatter.title} | Nino`;

    return (
      <DocsPage toc={toc} full={frontmatter.full}>
        <title>{title}</title>
        {frontmatter.description && (
          <meta name="description" content={frontmatter.description} />
        )}
        <meta property="og:title" content={title} />
        <DocsTitle>{frontmatter.title}</DocsTitle>
        <DocsDescription className="mb-0">
          {frontmatter.description}
        </DocsDescription>
        <div className="flex flex-row flex-wrap items-center gap-2 border-b pt-2 pb-4">
          <MarkdownCopyButton markdownUrl={`${url}.mdx`} />
          <ViewOptionsPopover
            markdownUrl={`${url}.mdx`}
            githubUrl={`${repoUrl}/blob/main/content/docs/${path}`}
          />
        </div>
        <DocsBody>
          <Mdx components={getMDXComponents()} />
        </DocsBody>
        <EditOnGitHub href={`${repoUrl}/edit/main/content/docs/${path}`}>
          {lang === 'zh' ? '在 GitHub 上编辑此页' : 'Edit this page on GitHub'}
        </EditOnGitHub>
      </DocsPage>
    );
  },
});

function OldVersionBanner({
  lang,
  version,
  latestUrl,
}: {
  lang: Locale;
  version: string;
  latestUrl: string;
}) {
  return (
    <Banner className="nino-banner">
      {lang === 'zh' ? (
        <span>
          你正在阅读旧版本 Nino {version} 的文档。最新版本为 {latestVersion}：
          <Link to={latestUrl} className="font-semibold underline">
            切换到最新文档
          </Link>
        </span>
      ) : (
        <span>
          You are reading the docs for Nino {version}, an old version. The
          latest version is {latestVersion}:{' '}
          <Link to={latestUrl} className="font-semibold underline">
            go to the latest docs
          </Link>
        </span>
      )}
    </Banner>
  );
}

export default function DocsRoute({ loaderData }: Route.ComponentProps) {
  const { pageTree, lang, version, latestUrl, path, url } =
    useFumadocsLoader(loaderData);

  return (
    <>
      {latestUrl && (
        <OldVersionBanner lang={lang} version={version} latestUrl={latestUrl} />
      )}
      <DocsLayout tree={pageTree} {...baseOptions(lang)}>
        {clientLoader.useContent(path, { lang, path, url })}
      </DocsLayout>
    </>
  );
}

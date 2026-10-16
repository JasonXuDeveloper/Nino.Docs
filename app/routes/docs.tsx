import browserCollections from 'collections/browser';
import type * as PageTree from 'fumadocs-core/page-tree';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import { Banner } from 'fumadocs-ui/components/banner';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/docs/page';
import { Link, redirect } from 'react-router';
import { LLMCopyButton, ViewOptions } from '@/components/ai/page-actions';
import { handlePageFeedback } from '@/components/feedback/actions';
import { Feedback } from '@/components/feedback/client';
import { LastUpdated } from '@/components/last-updated';
import { firstCommitDate } from '@/lib/git-dates.server';
import { getLocale, type Locale } from '@/lib/i18n';
import { baseOptions } from '@/lib/layout.shared';
import { faqFromMarkdown, pageBodyMarkdown } from '@/lib/markdown';
import { type DocSeo, docMeta, markdownPath } from '@/lib/seo';
import { docsRepoUrl as repoUrl } from '@/lib/site';
import { docExtras, source } from '@/lib/source';
import { isVersion, latestVersion } from '@/lib/versions';
import { getMDXComponents } from '@/mdx-components';
import type { Route } from './+types/docs';

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

  // From the docs home to this page, for the BreadcrumbList.
  const breadcrumbs = [
    { name: 'Nino', url: `/${lang}` },
    {
      name: `Nino ${version} ${lang === 'zh' ? '文档' : 'Docs'}`,
      url: `/${lang}/docs/${version}`,
    },
  ];
  // A folder's index page is named after its folder in the sidebar
  // ("Advanced Guides" rather than "Overview").
  const folderNames = new Map<string, string>();
  const collect = (nodes: PageTree.Node[]) => {
    for (const node of nodes) {
      if (node.type !== 'folder') continue;
      // $id is "<lang>:<folder path>", e.g. "en:v4/advanced"
      const folder = node.$id?.slice(node.$id.indexOf(':') + 1);
      if (folder && typeof node.name === 'string')
        folderNames.set(folder, node.name);
      collect(node.children);
    }
  };
  collect(source.getPageTree(lang).children);
  for (let i = 1; i <= rest.length; i++) {
    const slugs = [version, ...rest.slice(0, i)];
    const parent = source.getPage(slugs, lang);
    if (parent)
      breadcrumbs.push({
        name: folderNames.get(slugs.join('/')) ?? parent.data.title,
        url: parent.url,
      });
  }

  const lastModified = page.data.lastModified;
  const seo: DocSeo = {
    lang,
    version,
    latest: version === latestVersion,
    url: page.url,
    title: page.data.title,
    seoTitle: docExtras(page).seoTitle,
    description: page.data.description,
    lastModified:
      lastModified && !Number.isNaN(lastModified.getTime())
        ? lastModified.toISOString()
        : undefined,
    published: firstCommitDate(`content/docs/${page.path}`),
    alternates: {
      en: source.getPage(page.slugs, 'en')?.url,
      zh: source.getPage(page.slugs, 'zh')?.url,
    },
    breadcrumbs,
    faq: docExtras(page).faq
      ? faqFromMarkdown(await pageBodyMarkdown(page, lang))
      : undefined,
  };

  return {
    lang,
    version,
    latestUrl,
    path: page.path,
    url: page.url,
    seo,
    pageTree: await source.serializePageTree(source.getPageTree(lang)),
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData) return [];
  return docMeta(loaderData.seo);
}

interface ContentProps {
  lang: Locale;
  path: string;
  url: string;
}

const clientLoader = browserCollections.docs.createClientLoader<ContentProps>({
  component(
    { default: Mdx, frontmatter, toc, lastModified },
    { lang, path, url },
  ) {
    // <title>, description, canonical, social cards and JSON-LD come from
    // `meta` above (src/lib/seo.ts).
    return (
      <DocsPage toc={toc} full={frontmatter.full}>
        <DocsTitle>{frontmatter.title}</DocsTitle>
        <DocsDescription className="mb-0">
          {frontmatter.description}
        </DocsDescription>
        <div className="mb-4 flex flex-row items-center gap-2 border-b pt-2 pb-4">
          <LLMCopyButton markdownUrl={markdownPath(url)} locale={lang} />
          <ViewOptions
            markdownUrl={markdownPath(url)}
            githubUrl={`${repoUrl}/blob/main/content/docs/${path}`}
            locale={lang}
          />
        </div>
        <DocsBody>
          <Mdx components={getMDXComponents()} />
        </DocsBody>
        <LastUpdated date={lastModified} lang={lang} />
        <Feedback onSendAction={handlePageFeedback} />
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
    <Banner>
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

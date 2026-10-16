import { docs } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/plugins/lucide-icons';
import { i18n } from './i18n';

// Pages are served at /{lang}/docs/{version}/{page}
export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  i18n,
  plugins: [lucideIconsPlugin()],
});

/** Frontmatter fields added in source.config.ts (`docSchema`) */
export interface DocExtras {
  seoTitle?: string;
  faq?: boolean;
}

export function docExtras(page: { data: object }): DocExtras {
  return page.data as DocExtras;
}

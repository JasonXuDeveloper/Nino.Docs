import { execFileSync } from 'node:child_process';
import {
  rehypeCodeDefaultOptions,
  remarkImage,
  remarkMdxMermaid,
} from 'fumadocs-core/mdx-plugins';
import { remarkFeedbackBlock } from 'fumadocs-core/mdx-plugins/remark-feedback-block';
import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config';
import lastModified from 'fumadocs-mdx/plugins/last-modified';
import { rehypeMermaid, remarkMermaidSource } from './src/lib/mermaid';
import { remarkReleaseVersion } from './src/lib/remark-release';

// "Last updated" dates come from `git log`, but only with the full history:
// in a shallow clone the oldest commit looks like it added every file, so
// most pages would get a wrong date. scripts/git-history.ts fetches the
// history before the build; if that failed (or there is no git), pages show
// no date rather than a wrong one.
function hasFullGitHistory() {
  try {
    return (
      execFileSync('git', ['rev-parse', '--is-shallow-repository'], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim() === 'false'
    );
  } catch {
    return false;
  }
}

/** Set by vite.config.ts for `--mode scripts`. */
const contentOnly = process.env.DOCS_CONTENT_ONLY === '1';

/**
 * Frontmatter: Fumadocs' fields plus
 * - `seoTitle`: the <title> and social title when the page title alone is too
 *   generic for search results ("Overview"); the page heading keeps `title`.
 * - `faq`: the page's questions (## headings ending in "?") become FAQPage
 *   structured data.
 * Typed as the base schema: the extended type makes tsc's inference of the
 * collection types explode (TS2589). Read the extra fields through
 * `DocExtras` (src/lib/source.ts).
 */
const docSchema = frontmatterSchema.extend({
  seoTitle: frontmatterSchema.shape.description,
  faq: frontmatterSchema.shape.full,
}) as unknown as typeof frontmatterSchema;

// One collection for every version and language:
// content/docs/{version}/{page}.mdx (English) and {page}.zh.mdx (Chinese)
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: docSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  plugins: [
    lastModified({
      versionControl: hasFullGitHistory() ? 'git' : async () => undefined,
    }),
  ],
  mdxOptions: {
    // `language-*` class on code blocks, so the Markdown copies keep the
    // language of each fence (src/lib/markdown.tsx).
    rehypeCodeOptions: { ...rehypeCodeDefaultOptions, addLanguageClass: true },
    remarkPlugins: [
      [remarkImage, { external: false, publicDir: 'public' }],
      // %NINO_VERSION% and %NINO_OPENUPM_VERSION% -> the newest release
      // (scripts/sync-release.ts), in code blocks and text; before Fumadocs'
      // remarkStructure, so the search index has the version too.
      remarkReleaseVersion,
      // ```mermaid fences -> <Mermaid chart="...">fence</Mermaid>: the
      // attribute is the Markdown copy's source, rehypeMermaid below
      // replaces the fence inside with the SVG.
      remarkMdxMermaid,
      remarkMermaidSource,
      // Block-level feedback: a "Feedback" button on each paragraph
      remarkFeedbackBlock,
    ],
    // Diagrams are drawn at build time (src/lib/mermaid.ts), before
    // rehype-code highlights fences. The scripts (`--mode scripts`) read the
    // Markdown form of a page, which keeps the diagram source: they skip the
    // drawing.
    rehypePlugins: (plugins) =>
      contentOnly ? plugins : [rehypeMermaid, ...plugins],
  },
});

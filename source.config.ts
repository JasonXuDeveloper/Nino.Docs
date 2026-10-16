import { execFileSync } from 'node:child_process';
import { remarkImage } from 'fumadocs-core/mdx-plugins';
import { remarkFeedbackBlock } from 'fumadocs-core/mdx-plugins/remark-feedback-block';
import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config';
import lastModified from 'fumadocs-mdx/plugins/last-modified';

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

// One collection for every version and language:
// content/docs/{version}/{page}.mdx (English) and {page}.zh.mdx (Chinese)
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema,
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
    remarkPlugins: [
      [remarkImage, { external: false, publicDir: 'public' }],
      // Block-level feedback: a "Feedback" button on each paragraph
      remarkFeedbackBlock,
    ],
  },
});

import { remarkImage } from 'fumadocs-core/mdx-plugins';
import { remarkFeedbackBlock } from 'fumadocs-core/mdx-plugins/remark-feedback-block';
import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config';

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
  mdxOptions: {
    remarkPlugins: [
      [remarkImage, { external: false, publicDir: 'public' }],
      // Block-level feedback: a "Feedback" button on each paragraph
      remarkFeedbackBlock,
    ],
  },
});

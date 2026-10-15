import { glob } from 'node:fs/promises';
import type { Config } from '@react-router/dev/config';

// content/docs/v4/advanced/pooling.zh.mdx -> /zh/docs/v4/advanced/pooling
function getDocUrl(file: string) {
  const parts = file.replace(/\\/g, '/').split('/');
  const name = parts.pop() ?? '';
  const lang = name.endsWith('.zh.mdx') ? 'zh' : 'en';
  const stem = name.replace(/(\.zh)?\.mdx$/, '');
  const slugs = stem === 'index' ? parts : [...parts, stem];
  return `/${lang}/docs/${slugs.join('/')}`;
}

export default {
  // Fully static: every page is prerendered into build/client, no server.
  ssr: false,
  future: {
    v8_middleware: true,
    v8_splitRouteModules: true,
    v8_viteEnvironmentApi: true,
    v8_passThroughRequests: true,
    v8_trailingSlashAwareDataRequests: true,
  },
  async prerender({ getStaticPaths }) {
    const paths = new Set(['/', '/en', '/zh', '/404', ...getStaticPaths()]);
    for await (const file of glob('**/*.mdx', { cwd: 'content/docs' })) {
      paths.add(getDocUrl(file));
    }
    return [...paths];
  },
} satisfies Config;

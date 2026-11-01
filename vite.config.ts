import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { fumadocsMdx } from 'fumadocs-mdx/vite';
import { defineConfig } from 'vite';

const root = path.dirname(fileURLToPath(import.meta.url));

// `--mode scripts`: the scripts in scripts/ (run with vite-node) only load the
// content, compiled without drawing diagrams (source.config.ts).
export default defineConfig(({ mode }) => {
  if (mode === 'scripts') process.env.DOCS_CONTENT_ONLY = '1';
  return {
    plugins:
      mode === 'scripts'
        ? [fumadocsMdx()]
        : [fumadocsMdx(), tailwindcss(), reactRouter()],
    optimizeDeps:
      mode === 'scripts' ? { noDiscovery: true, include: [] } : undefined,
    resolve: {
      alias: {
        '@': path.resolve(root, 'src'),
        collections: path.resolve(root, '.source'),
      },
    },
  };
});

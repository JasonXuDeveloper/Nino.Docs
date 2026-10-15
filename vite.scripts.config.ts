import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fumadocsMdx } from 'fumadocs-mdx/vite';
import { defineConfig } from 'vite';

const root = path.dirname(fileURLToPath(import.meta.url));

// Used by the scripts in scripts/ (run with vite-node) to load the content.
export default defineConfig({
  plugins: [fumadocsMdx()],
  optimizeDeps: { noDiscovery: true, include: [] },
  resolve: {
    alias: {
      '@': path.resolve(root, 'src'),
      collections: path.resolve(root, '.source'),
    },
  },
});

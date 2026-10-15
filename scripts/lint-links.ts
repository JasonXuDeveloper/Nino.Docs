/**
 * Checks every internal link in the docs: the target page must exist and,
 * when the link has a #fragment, the target page must have that heading.
 *
 * Usage: bun run lint:links
 */
import { source } from '../src/lib/source';

type Page = ReturnType<typeof source.getPages>[number];

const pages = [...source.getPages('en'), ...source.getPages('zh')];
const byUrl = new Map(pages.map((page) => [page.url, page]));
// Links to pages that are not docs pages
const otherPages = new Set(['/en', '/zh']);

function headingsOf(page: Page) {
  const toc = (page.data.toc ?? []) as Array<{ url: string }>;
  return new Set(toc.map((item) => decodeURIComponent(item.url.slice(1))));
}

function linksOf(content: string) {
  const links: string[] = [];
  // Skip code blocks and inline code
  const text = content.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
  for (const match of text.matchAll(/\]\(([^)\s]+)\)/g)) links.push(match[1]);
  for (const match of text.matchAll(/href=["']([^"']+)["']/g))
    links.push(match[1]);
  return links;
}

async function main() {
  const errors: string[] = [];

  for (const page of pages) {
    const content = await page.data.getText('raw');
    for (const link of linksOf(content)) {
      if (/^(https?:|mailto:)/.test(link)) continue;

      const [rawPath, rawHash] = link.split('#');
      const path = rawPath === '' ? page.url : rawPath.replace(/\/$/, '');
      if (!path.startsWith('/')) {
        errors.push(`${page.path}: relative link ${link}`);
        continue;
      }
      if (otherPages.has(path)) continue;

      const target = byUrl.get(decodeURI(path));
      if (!target) {
        errors.push(`${page.path}: broken link ${link}`);
        continue;
      }
      const hash = rawHash && decodeURIComponent(rawHash);
      if (hash && !headingsOf(target).has(hash)) {
        errors.push(`${page.path}: no heading #${hash} in ${path}`);
      }
    }
  }

  if (errors.length > 0) {
    console.error(errors.join('\n'));
    console.error(`\n${errors.length} broken link(s)`);
    process.exit(1);
  }
  console.log(`Checked ${pages.length} pages: all internal links resolve.`);
}

void main();

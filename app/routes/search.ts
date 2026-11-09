import { createFromSource } from 'fumadocs-core/search/server';
import analyzerRules from '@/data/analyzer-rules.json';
import { source } from '@/lib/source';

// Prerendered to /api/search.json at build time; the search dialog downloads
// it and searches in the browser, so no search server or API key is needed.
const server = createFromSource(source, {
  localeMap: {
    en: { language: 'english' },
    // Intl.Segmenter based word splitting, which handles Chinese
    zh: { language: 'multilingual' },
  },
  buildIndex(page) {
    return {
      id: page.url,
      url: page.url,
      title: page.data.title ?? '',
      description: page.data.description,
      structuredData: withRules(page),
      tag: page.slugs[0],
    };
  },
});

type IndexedPage = ReturnType<typeof source.getPages>[number];

// The analyzers page renders its rules from analyzer-rules.json, so their text is not in the
// page's MDX: add one heading per rule (its id, the anchor the table gives it) and its text, so a
// search for "NINO007" or a rule's words lands on its row.
function withRules(page: IndexedPage) {
  const data = page.data.structuredData;
  if (page.slugs.join('/') !== 'v4/analyzers') return data;
  const lang = page.locale === 'zh' ? 'zh' : 'en';
  return {
    headings: [
      ...data.headings,
      ...analyzerRules.rules.map((rule) => ({
        id: rule.id.toLowerCase(),
        content: rule.id,
      })),
    ],
    contents: [
      ...data.contents,
      ...analyzerRules.rules.map((rule) => ({
        heading: rule.id.toLowerCase(),
        content: `${rule[lang].problem}. ${rule[lang].fix}`,
      })),
    ],
  };
}

export async function loader() {
  return server.staticGET();
}

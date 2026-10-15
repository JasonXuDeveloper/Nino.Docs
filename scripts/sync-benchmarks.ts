/**
 * Syncs the v4 runtime benchmarks from the "Performance Report" that Nino's
 * report workflow appends to each GitHub release, into src/data/bench-v4.json.
 *
 *   bun scripts/sync-benchmarks.ts                       # newest v4.* release with a report
 *   bun scripts/sync-benchmarks.ts --fixture <file.md>   # parse a release body from a file
 *   bun scripts/sync-benchmarks.ts --fixture <file> --out <file.json>
 *
 * Runs before every build. It never fails the build: on any error (network,
 * rate limit, no matching release, a table it cannot read) it prints a warning
 * and leaves the committed src/data/bench-v4.json as it is. Set GITHUB_TOKEN
 * to raise the API rate limit.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const repo = 'JasonXuDeveloper/Nino';
const dataFile = fileURLToPath(
  new URL('../src/data/bench-v4.json', import.meta.url),
);

export interface BenchRow {
  method: string;
  category: string | null;
  meanNs: number;
  allocatedBytes: number | null;
  payloadBytes: number | null;
  rerun?: boolean;
}

export interface BenchFile {
  origin: 'release' | 'local' | 'fixture';
  tag: string;
  url: string;
  publishedAt: string | null;
  environment: string | null;
  rows: BenchRow[];
}

interface Release {
  tag_name: string;
  html_url: string;
  published_at: string | null;
  created_at: string;
  draft: boolean;
  body: string | null;
}

/* ------------------------------------------------------------------ */
/* Parsing                                                             */
/* ------------------------------------------------------------------ */

const timeUnits: Record<string, number> = {
  ns: 1,
  μs: 1e3, // U+03BC, what BenchmarkDotNet writes
  µs: 1e3, // U+00B5
  us: 1e3,
  ms: 1e6,
  s: 1e9,
};

const sizeUnits: Record<string, number> = {
  b: 1,
  kb: 1024,
  mb: 1024 ** 2,
  gb: 1024 ** 3,
};

function clean(cell: string) {
  return cell
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/[   ]/g, ' ')
    .trim();
}

function number(text: string) {
  return Number.parseFloat(text.replace(/,/g, ''));
}

/** "151.2 ns", "1,234.5 ns", "17.04 μs", "1.2 ms" -> nanoseconds */
export function parseTime(text: string): number | null {
  const match = /^([\d,]*\.?\d+)\s*(ns|μs|µs|us|ms|s)$/.exec(clean(text));
  if (!match) return null;
  return number(match[1]) * timeUnits[match[2]];
}

/** "-", "0 B", "1,024 B", "12.5 KB", "1146" -> bytes; null if unreadable */
export function parseSize(text: string): number | null {
  const value = clean(text);
  if (value === '' || value === '?' || /^n\/?a$/i.test(value)) return null;
  if (value === '-' || value === '0') return 0;
  const match = /^([\d,]*\.?\d+)\s*(B|KB|MB|GB)?$/i.exec(value);
  if (!match) return null;
  const unit = (match[2] ?? 'b').toLowerCase();
  return Math.round(number(match[1]) * sizeUnits[unit]);
}

function cells(line: string) {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  return trimmed.split('|').map(clean);
}

const isSeparator = (row: string[]) =>
  row.length > 0 && row.every((cell) => /^:?-+:?$/.test(cell));

/** The markdown tables of a text: groups of consecutive lines starting with "|" */
function tables(text: string) {
  const result: string[][][] = [];
  let current: string[][] = [];
  for (const line of text.split(/\r?\n/)) {
    if (line.trim().startsWith('|')) {
      current.push(cells(line));
    } else if (current.length > 0) {
      result.push(current);
      current = [];
    }
  }
  if (current.length > 0) result.push(current);
  return result;
}

function column(header: string[], ...names: string[]) {
  const wanted = names.map((name) => name.toLowerCase());
  return header.findIndex((cell) => wanted.includes(cell.toLowerCase()));
}

/** Parses the "Performance Report" section of a release body. Throws when it finds no usable table. */
export function parseReport(body: string) {
  const start = body.search(/Performance Report/i);
  if (start < 0) throw new Error('no "Performance Report" section');
  const section = body.slice(start);

  const rows: BenchRow[] = [];
  for (const table of tables(section)) {
    if (table.length < 3 || !isSeparator(table[1])) continue;
    const header = table[0];
    const method = column(header, 'Method');
    const mean = column(header, 'Mean');
    if (method < 0 || mean < 0) continue;
    const allocated = column(header, 'Allocated');
    const payload = column(header, 'Payload');
    const category = column(header, 'Categories', 'Category');

    for (const row of table.slice(2)) {
      if (isSeparator(row)) continue;
      const name = row[method];
      const ns = parseTime(row[mean] ?? '');
      if (!name || ns === null) continue;
      rows.push({
        method: name,
        category: category >= 0 ? row[category] || null : null,
        meanNs: Math.round(ns * 1000) / 1000,
        allocatedBytes: allocated >= 0 ? parseSize(row[allocated] ?? '') : null,
        payloadBytes: payload >= 0 ? parseSize(row[payload] ?? '') : null,
      });
    }
  }
  if (rows.length === 0)
    throw new Error('no benchmark table with Method and Mean columns');
  if (!rows.some((row) => row.method === 'NinoSerializeSimpleClass'))
    throw new Error('the report has no NinoSerializeSimpleClass row');

  // BenchmarkDotNet's environment summary: the code block before the first table.
  const firstTable = section.indexOf('\n|');
  const head = firstTable < 0 ? section : section.slice(0, firstTable);
  const fence = /```[a-z]*\r?\n([\s\S]*?)```/i.exec(head);
  const environment = fence ? fence[1].trim() : null;

  return { rows, environment };
}

/**
 * Every method the site shows (src/lib/benchmarks.ts). A report without all of
 * them is not used: the site keeps one consistent run instead of mixing runs.
 */
export const requiredMethods = [
  ...[
    'SimpleClass',
    'SimpleClasses',
    'PolymorphicClass',
    'PolymorphicClassArray',
    'PolymorphicFooArray',
    'SimpleStruct',
    'SimpleStructs',
    'Vectors',
  ].flatMap((name) => [`NinoSerialize${name}`, `MemoryPackSerialize${name}`]),
  ...[
    'SimpleClass',
    'SimpleClasses',
    'PolymorphicClass',
    'PolymorphicClassArray',
    'PolymorphicFooArray',
    'SimpleStructs',
    'Vectors',
  ].flatMap((name) => [
    `NinoDeserialize${name}`,
    `MemoryPackDeserialize${name}`,
  ]),
  'NinoNodeNew',
  'NinoNodePooled',
  'MemoryPackNodeNew',
  'MemoryPackNodeOverwrite',
  'NinoLeavesNew',
  'NinoLeavesInPlace',
  'NinoLeavesPooledElements',
  'MemoryPackLeavesNew',
  'MemoryPackLeavesOverwrite',
  'NinoDeserializeNew',
  'NinoDeserializePooled',
  'MemoryPackDeserializeNew',
  'MemoryPackDeserializeOverwrite',
];

export function missingMethods(rows: BenchRow[]) {
  const have = new Set(rows.map((row) => row.method));
  return requiredMethods.filter((method) => !have.has(method));
}

/* ------------------------------------------------------------------ */
/* GitHub                                                              */
/* ------------------------------------------------------------------ */

async function latestRelease(): Promise<Release> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'nino-docs-benchmark-sync',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN)
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const response = await fetch(
    `https://api.github.com/repos/${repo}/releases?per_page=50`,
    { headers, signal: AbortSignal.timeout(15_000) },
  );
  if (!response.ok)
    throw new Error(`GitHub API ${response.status} ${response.statusText}`);
  const releases = (await response.json()) as Release[];

  const match = releases
    .filter(
      (release) =>
        !release.draft &&
        release.tag_name.startsWith('v4.') &&
        release.body?.includes('Performance Report'),
    )
    .sort((a, b) =>
      (b.published_at ?? b.created_at).localeCompare(
        a.published_at ?? a.created_at,
      ),
    )[0];
  if (!match)
    throw new Error('no v4.* release with a "Performance Report" yet');
  return match;
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

function argument(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function summary(file: BenchFile) {
  return `${file.rows.length} rows from ${file.tag} (${file.origin})`;
}

async function main() {
  const fixture = argument('--fixture');
  const out = argument('--out');

  if (fixture) {
    const { rows, environment } = parseReport(readFileSync(fixture, 'utf8'));
    const file: BenchFile = {
      origin: 'fixture',
      tag: 'fixture',
      url: `https://github.com/${repo}/releases`,
      publishedAt: null,
      environment,
      rows,
    };
    const missing = missingMethods(rows);
    if (missing.length > 0)
      console.warn(
        `[benchmarks] fixture lacks ${missing.length} of the ${requiredMethods.length} methods the site needs (a release like this would not be used)`,
      );
    if (out) {
      writeFileSync(out, `${JSON.stringify(file, null, 2)}\n`);
      console.log(`[benchmarks] wrote ${out}: ${summary(file)}`);
    } else {
      console.log(JSON.stringify(file, null, 2));
    }
    return;
  }

  try {
    const release = await latestRelease();
    const { rows, environment } = parseReport(release.body ?? '');
    const missing = missingMethods(rows);
    if (missing.length > 0)
      throw new Error(
        `${release.tag_name}'s report lacks ${missing.length} of the methods the site shows (${missing.slice(0, 3).join(', ')}${missing.length > 3 ? ', ...' : ''})`,
      );
    const file: BenchFile = {
      origin: 'release',
      tag: release.tag_name,
      url: release.html_url,
      publishedAt: release.published_at ?? release.created_at,
      environment,
      rows,
    };
    writeFileSync(out ?? dataFile, `${JSON.stringify(file, null, 2)}\n`);
    console.log(`[benchmarks] synced ${summary(file)}`);
  } catch (error) {
    const kept = JSON.parse(readFileSync(dataFile, 'utf8')) as BenchFile;
    console.warn(
      `[benchmarks] warning: ${error instanceof Error ? error.message : String(error)}; keeping src/data/bench-v4.json (${summary(kept)})`,
    );
  }
}

main().catch((error) => {
  // Fixture mode reports parse errors; normal mode never gets here.
  console.error(
    `[benchmarks] ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exitCode = process.argv.includes('--fixture') ? 1 : 0;
});

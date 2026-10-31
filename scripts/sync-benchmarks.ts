/**
 * Syncs the runtime benchmarks that Nino's report workflow appends to each
 * GitHub release:
 *
 * - the "Performance Report" (v4 and MemoryPack) into src/data/bench-v4.json;
 * - the "v3 3.3.13 vs v4 (same machine)" section (Nino 3.3.13 run before and
 *   after the v4 run on the same runner) into src/data/bench-v3-runtime.json,
 *   from the same release;
 * - the "Arm64 benchmark" section (the same benchmark classes on GitHub's
 *   ubuntu-24.04-arm runners, a table in the Performance Report's format) into
 *   src/data/bench-v4-arm64.json, from the same release. When the body is too
 *   long for it (GitHub's limit), report.yml attaches the section to the release
 *   as arm64-benchmark.md instead, and it is read from there;
 * - the sections of the runtimes outside .NET ("🐹 Go runtime benchmark",
 *   "🦀 Rust runtime benchmark", "🌐 TypeScript runtime benchmark", written by
 *   Nino's benchmarks/runtimes_report.py after every other section) into
 *   src/data/bench-runtimes.json, from the same release;
 * - the Unity section ("🎮 Unity benchmark (Burst, IL2CPP)": an IL2CPP player
 *   on GitHub's Linux x64 runner, each case timed without and with the Burst
 *   kernels, one "### Unity <version>" table per Unity version) into
 *   src/data/bench-unity.json, from the same release.
 *
 * The Performance Report and the Arm64 section have a row per method, and every
 * row is kept: since MessagePack (MessagePack-CSharp) and protobuf-net joined
 * the .NET benchmark, their `MessagePack…` and `Protobuf…` rows too. Releases
 * before that lack them; `requiredMethods` never asks for them.
 *
 *   bun scripts/sync-benchmarks.ts                       # newest v4.* release with a report
 *   bun scripts/sync-benchmarks.ts --fixture <file.md>   # parse a release body from a file
 *   bun scripts/sync-benchmarks.ts --fixture <file> --out <file.json> [--out-v3 <file.json>] [--out-arm64 <file.json>] [--out-runtimes <file.json>] [--out-unity <file.json>]
 *
 * Fixtures: scripts/fixtures/release-body.md (made-up numbers, the methods the
 * site requires), release-body-v3.md (with the v3 section),
 * release-body-new.md (a sample of the ReferenceTest, VersionTolerantTest and
 * FixedSizeTest rows; its numbers are noise, only its format matters) and
 * release-body-arm64.md (release-body-new.md plus an Arm64 section whose
 * numbers are a copy of its x64 ones: for parser tests only) and
 * release-body-libraries.md (release-body-arm64.md plus MessagePack and
 * protobuf-net rows and the three runtime sections, with invented numbers: for
 * parser tests only) and release-body-unity.md (release-body-libraries.md plus
 * a Unity section, with invented numbers: for parser tests only).
 *
 * Runs before every build. It never fails the build: on any error (network,
 * rate limit, no matching release, a table it cannot read) it prints a warning
 * and leaves the committed JSON as it is. A release without the v3 or the
 * Arm64 section (or whose Arm64 table lacks a method the site shows) keeps the
 * committed src/data/bench-v3-runtime.json or src/data/bench-v4-arm64.json; a
 * release without any runtime section keeps src/data/bench-runtimes.json (a
 * language whose table it cannot read is left out, with a warning), and a
 * release without the Unity section (or with one it cannot read) keeps
 * src/data/bench-unity.json.
 * Set GITHUB_TOKEN to raise the API rate limit.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = 'JasonXuDeveloper/Nino';
const dataFile = fileURLToPath(
  new URL('../src/data/bench-v4.json', import.meta.url),
);
const v3DataFile = fileURLToPath(
  new URL('../src/data/bench-v3-runtime.json', import.meta.url),
);

const arm64DataFile = fileURLToPath(
  new URL('../src/data/bench-v4-arm64.json', import.meta.url),
);

const runtimesDataFile = fileURLToPath(
  new URL('../src/data/bench-runtimes.json', import.meta.url),
);

const unityDataFile = fileURLToPath(
  new URL('../src/data/bench-unity.json', import.meta.url),
);

/** Heading of the v3 section in the release body (report.yml's V3_HEADING) */
export const v3Heading = 'v3 3.3.13 vs v4 (same machine)';

/**
 * Heading of the Arm64 section (report.yml's ARM64_HEADING). It never contains
 * "Performance Report", so the x64 report is still found by those words.
 */
export const arm64Heading = '## 📊 Arm64 benchmark';

/** The release asset that holds the Arm64 section (report.yml's ARM64_ASSET) */
export const arm64Asset = 'arm64-benchmark.md';

/**
 * Headings of the runtimes outside .NET (Nino's benchmarks/runtimes_report.py,
 * HEADINGS), in the order the site shows them.
 */
export const runtimeHeadings = {
  go: '## 🐹 Go runtime benchmark',
  rust: '## 🦀 Rust runtime benchmark',
  typescript: '## 🌐 TypeScript runtime benchmark',
} as const;

export type RuntimeLang = keyof typeof runtimeHeadings;

/**
 * Heading of the Unity section (Nino's release workflow): an IL2CPP player
 * timed without and with the Burst kernels, a "### Unity <version>" table per
 * Unity version.
 */
export const unityHeading = '## 🎮 Unity benchmark (Burst, IL2CPP)';

export interface BenchRow {
  method: string;
  category: string | null;
  meanNs: number;
  allocatedBytes: number | null;
  payloadBytes: number | null;
  rerun?: boolean;
}

/**
 * src/data/bench-v4.json and bench-v4-arm64.json. `origin: 'none'` (empty
 * rows, empty tag and url) is the committed Arm64 file before any release had
 * an Arm64 section: the site then shows x64 only.
 */
export interface BenchFile {
  origin: 'release' | 'local' | 'fixture' | 'none';
  tag: string;
  url: string;
  publishedAt: string | null;
  environment: string | null;
  rows: BenchRow[];
}

/** Nino v3 3.3.13 against v4, both measured in the same job on the same machine */
export interface V3RuntimeFile {
  origin: 'release' | 'local' | 'fixture';
  tag: string;
  url: string;
  publishedAt: string | null;
  /** BenchmarkDotNet's environment summary of the v3 run */
  environment: string | null;
  /** How many v3 runs v3Ns is the mean of (1 since rc.2: v3 runs once, before v4) */
  runs: number;
  /** Free text shown instead of the generated description (local runs only) */
  note: string | null;
  /** Mean times in ns, keyed "serialize:SimpleClass" (case keys of src/lib/benchmarks.ts) */
  rows: Record<string, { v3Ns: number; v4Ns: number }>;
}

/** One serializer's value in a runtime row: ns (time), bytes (size) or a count (allocs) */
export interface RuntimeCell {
  value: number;
  /** As printed: "±2%" (a time's spread), absent when the report gives none */
  spread?: string;
}

/** A row of a runtime section: one case and operation, a cell per serializer that has one */
export interface RuntimeRow {
  case: string;
  operation: string;
  kind: 'time' | 'size' | 'allocs';
  cells: Record<string, RuntimeCell>;
}

/** One language's section */
export interface RuntimeSection {
  lang: RuntimeLang;
  tag: string;
  /** The machine (Go: CPU and OS) or runtime (TypeScript: Node and tinybench) the section names, if any */
  environment: string | null;
  /** Column order of the report: Nino first */
  serializers: string[];
  rows: RuntimeRow[];
}

/**
 * src/data/bench-runtimes.json. `origin: 'none'` (no languages, empty tag and
 * url) is the committed file before any release had a runtime section.
 */
export interface RuntimesFile {
  origin: 'release' | 'fixture' | 'none';
  tag: string;
  url: string;
  publishedAt: string | null;
  languages: RuntimeSection[];
}

/** One case of a Unity table: median times per call without and with the Burst kernels */
export interface UnityRow {
  case: string;
  operation: string;
  withoutNs: number;
  withNs: number;
}

/** One Unity version's table */
export interface UnityVersion {
  /** As the heading names it: "6000.3.27f1" */
  unity: string;
  rows: UnityRow[];
}

/**
 * src/data/bench-unity.json. `origin: 'none'` (no versions, empty tag and url)
 * is the committed file before any release had a Unity section. The report's
 * Speedup column is not kept: src/lib/benchmarks.ts computes it from the times.
 */
export interface UnityFile {
  origin: 'release' | 'fixture' | 'none';
  tag: string;
  url: string;
  publishedAt: string | null;
  /** The section's description of the run (Unity, player, CPU, Burst, kernels) */
  environment: string | null;
  versions: UnityVersion[];
}

interface Release {
  tag_name: string;
  html_url: string;
  published_at: string | null;
  created_at: string;
  draft: boolean;
  body: string | null;
  assets?: { name: string; browser_download_url: string }[];
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
    .replace(/\\\|/g, '|')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
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

/**
 * "0 B", "1,024 B", "12.5 KB", "1146" -> bytes; null if unreadable. "-" is 0
 * for Allocated (BenchmarkDotNet's "nothing allocated") and null for Payload.
 */
export function parseSize(text: string, dash: 0 | null = 0): number | null {
  const value = clean(text);
  if (value === '' || value === '?' || /^n\/?a$/i.test(value)) return null;
  if (value === '-') return dash;
  if (value === '0') return 0;
  const match = /^([\d,]*\.?\d+)\s*(B|KB|MB|GB)?$/i.exec(value);
  if (!match) return null;
  const unit = (match[2] ?? 'b').toLowerCase();
  return Math.round(number(match[1]) * sizeUnits[unit]);
}

function cells(line: string) {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  // A cell's own "|" is escaped with a backslash, as Nino's report scripts write it
  return trimmed.split(/(?<!\\)\|/).map(clean);
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

/** From `start` to the next "## " heading after it (or the end of the body) */
function sectionFrom(body: string, start: number) {
  const rest = body.slice(start);
  const lineEnd = rest.indexOf('\n');
  if (lineEnd < 0) return rest;
  const next = rest.slice(lineEnd).search(/\n##\s/);
  return next < 0 ? rest : rest.slice(0, lineEnd + next);
}

/**
 * BenchmarkDotNet's environment summary: the first code block of a section
 * (with `beforeTables`, only before its first table).
 */
function environmentOf(section: string, beforeTables = true) {
  const firstTable = beforeTables ? section.indexOf('\n|') : -1;
  const head = firstTable < 0 ? section : section.slice(0, firstTable);
  const fence = /```[a-z]*\r?\n([\s\S]*?)```/i.exec(head);
  return fence ? fence[1].trim() : null;
}

/**
 * The BenchmarkDotNet tables (Method and Mean columns) of one section and its
 * environment: the Performance Report and the Arm64 section share this format.
 * Throws when it finds no usable table.
 */
function parseBenchSection(section: string, name: string) {
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
        // As printed (BenchmarkDotNet's 4 decimals), minus float noise
        meanNs: Math.round(ns * 1e4) / 1e4,
        allocatedBytes: allocated >= 0 ? parseSize(row[allocated] ?? '') : null,
        payloadBytes: payload >= 0 ? parseSize(row[payload] ?? '', null) : null,
      });
    }
  }
  if (rows.length === 0)
    throw new Error(`${name}: no benchmark table with Method and Mean columns`);
  if (!rows.some((row) => row.method === 'NinoSerializeSimpleClass'))
    throw new Error(`${name}: no NinoSerializeSimpleClass row`);

  return { rows, environment: environmentOf(section) };
}

/** Parses the "Performance Report" section (x64) of a release body. Throws when it finds no usable table. */
export function parseReport(body: string) {
  const start = body.search(/Performance Report/i);
  if (start < 0) throw new Error('no "Performance Report" section');
  return parseBenchSection(sectionFrom(body, start), 'the Performance Report');
}

/**
 * Parses the Arm64 section (from its heading to the next "## " heading).
 * Returns null when the body has none; throws when it has no usable table.
 */
export function parseArm64Section(body: string) {
  const start = body.indexOf(arm64Heading);
  if (start < 0) return null;
  return parseBenchSection(sectionFrom(body, start), 'the Arm64 section');
}

/**
 * Parses the v3 section of a release body: the compare.py tables (case,
 * "v3 3.3.13", "v4", ...), one per v3 run (one since rc.2; older reports have
 * two, before and after v4). v3Ns is the mean of the runs; v4Ns
 * is the v4 run they were all compared with. Returns null when the body has no
 * v3 section; throws when the section has no usable table.
 */
export function parseV3Section(body: string) {
  const start = body.indexOf(v3Heading);
  if (start < 0) return null;
  const section = sectionFrom(body, start);

  const v3: Record<string, number[]> = {};
  const v4: Record<string, number> = {};
  let runs = 0;
  for (const table of tables(section)) {
    if (table.length < 3 || !isSeparator(table[1])) continue;
    const header = table[0];
    const name = column(header, 'case');
    const v3Col = column(header, 'v3 3.3.13');
    const v4Col = column(header, 'v4');
    if (name < 0 || v3Col < 0 || v4Col < 0) continue;
    runs++;
    for (const row of table.slice(2)) {
      const match = /^(Serialize|Deserialize)(\w+)$/.exec(row[name] ?? '');
      const v3Ns = parseTime(row[v3Col] ?? '');
      const v4Ns = parseTime(row[v4Col] ?? '');
      // v4 may read 0.00 ns: too fast to measure (src/lib/benchmarks.ts, FLOOR_NS)
      if (!match || v3Ns === null || v4Ns === null || v3Ns <= 0 || v4Ns < 0)
        continue;
      const key = `${match[1].toLowerCase()}:${match[2]}`;
      v3[key] = [...(v3[key] ?? []), v3Ns];
      v4[key] ??= v4Ns;
    }
  }
  if (runs === 0) throw new Error('the v3 section has no comparison table');
  if (!v3['serialize:SimpleClass'])
    throw new Error('the v3 section has no SerializeSimpleClass row');

  const round = (ns: number) => Math.round(ns * 1e4) / 1e4;
  const rows: V3RuntimeFile['rows'] = {};
  for (const [key, times] of Object.entries(v3))
    rows[key] = {
      v3Ns: round(times.reduce((a, b) => a + b, 0) / times.length),
      v4Ns: round(v4[key]),
    };
  // The compare tables come first; the environment is the first v3 report's.
  return { rows, runs, environment: environmentOf(section, false) };
}

/** "28.5 KiB", "640 B" (runtimes_report.py's sizes) -> bytes */
function parseRuntimeSize(text: string): number | null {
  const match = /^([\d,]*\.?\d+)\s*(B|KiB|MiB)$/.exec(clean(text));
  if (!match) return null;
  const scale = { B: 1, KiB: 1024, MiB: 1024 ** 2 }[match[2] as 'B'];
  return Math.round(number(match[1]) * scale);
}

/** "7.45 μs ±2%", "1.23 ms ±0.4% (813/s)", "151.2 ns" -> ns and the spread */
function parseRuntimeTime(text: string): RuntimeCell | null {
  const match = /^(.+?)\s*(±\s*[\d.]+\s*%)?\s*(\([^)]*\/s\))?$/.exec(
    clean(text),
  );
  const ns = match ? parseTime(match[1]) : null;
  if (!match || ns === null) return null;
  const cell: RuntimeCell = { value: Math.round(ns * 1e4) / 1e4 };
  if (match[2]) cell.spread = match[2].replace(/\s+/g, '');
  return cell;
}

/** The machine or runtime a section's introduction names */
function runtimeEnvironment(lang: RuntimeLang, section: string) {
  if (lang === 'go') {
    const machine = /\bon ([^`]+?)\. Allocations/.exec(section)?.[1];
    return machine && machine !== 'a GitHub runner' ? machine : null;
  }
  if (lang === 'typescript') {
    const node = /\bin Node (v[\d.]+)/.exec(section)?.[1];
    const tinybench = /\btinybench ([\d.]+)/.exec(section)?.[1];
    if (!node) return null;
    return tinybench ? `Node ${node}, tinybench ${tinybench}` : `Node ${node}`;
  }
  return null;
}

/**
 * One runtime section: its first table with Case (or Scenario) and Operation
 * columns, a column per serializer. Returns null when the body has none;
 * throws when the section has no table in that format (the TypeScript table of
 * releases before tinybench compared with JSON only, in another format).
 */
export function parseRuntimeSection(
  body: string,
  lang: RuntimeLang,
  tag: string,
): RuntimeSection | null {
  const start = body.indexOf(runtimeHeadings[lang]);
  if (start < 0) return null;
  const section = sectionFrom(body, start);
  for (const table of tables(section)) {
    if (table.length < 3 || !isSeparator(table[1])) continue;
    const header = table[0];
    const name = column(header, 'Case', 'Scenario');
    const operation = column(header, 'Operation');
    if (name !== 0 || operation !== 1 || header.length < 3) continue;
    const serializers = header.slice(2);
    const rows: RuntimeRow[] = [];
    for (const row of table.slice(2)) {
      const op = row[operation] ?? '';
      if (!row[name] || !op) continue;
      const kind =
        op === 'size' ? 'size' : op.endsWith('allocs') ? 'allocs' : 'time';
      const cells: Record<string, RuntimeCell> = {};
      serializers.forEach((serializer, i) => {
        const text = row[i + 2] ?? '';
        if (!text || text === '-' || text === '—') return;
        const cell =
          kind === 'time'
            ? parseRuntimeTime(text)
            : kind === 'size'
              ? (() => {
                  const bytes = parseRuntimeSize(text);
                  return bytes === null ? null : { value: bytes };
                })()
              : /^\d+$/.test(clean(text).replace(/,/g, ''))
                ? { value: number(text) }
                : null;
        if (cell) cells[serializer] = cell;
      });
      if (Object.keys(cells).length > 0)
        rows.push({ case: row[name], operation: op, kind, cells });
    }
    if (rows.length === 0) continue;
    return {
      lang,
      tag,
      environment: runtimeEnvironment(lang, section),
      serializers,
      rows,
    };
  }
  throw new Error(
    `the ${lang} runtime section has no table with Case and Operation columns`,
  );
}

/**
 * Every runtime section of a body that can be read; a section that cannot is
 * left out with a warning.
 */
export function parseRuntimeSections(body: string, tag: string) {
  const sections: RuntimeSection[] = [];
  for (const lang of Object.keys(runtimeHeadings) as RuntimeLang[]) {
    try {
      const section = parseRuntimeSection(body, lang, tag);
      if (section) sections.push(section);
    } catch (error) {
      console.warn(`[benchmarks] warning: ${message(error)}; left out`);
    }
  }
  return sections;
}

/**
 * The Unity section: its introduction (the environment, minus the sentence
 * that explains the columns, which the site explains itself) and one table per
 * "### Unity <version>" heading, with Case, Operation, Without Burst and With
 * Burst columns. Returns null when the body has none; throws when it has no
 * table in that format.
 */
export function parseUnitySection(body: string) {
  const start = body.indexOf(unityHeading);
  if (start < 0) return null;
  const section = sectionFrom(body, start);
  const parts = section.split(/\n###\s+/);

  // The first paragraph: a line per Unity version (player, machine, Burst,
  // kernels) and the sentence on the columns. The paragraph after it (the
  // tag and how the player is measured) is what benchmarks-unity explains itself.
  const intro = (
    parts[0]
      .slice(unityHeading.length)
      .trim()
      .split(/\r?\n\s*\r?\n/)[0] ?? ''
  )
    .split(/\r?\n/)
    .filter((line) => !/^\s*(<\/?\w+[^>]*>|\|)/.test(line))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  const environment =
    intro
      .split(/(?<=\.)\s+(?=[A-Z"“])/)
      .filter((sentence) => !/^Each time\b/.test(sentence))
      .join(' ')
      .trim() || null;

  const versions: UnityVersion[] = [];
  for (const part of parts.slice(1)) {
    const unity = /^Unity\s+(\S+)/.exec(part)?.[1];
    if (!unity) continue;
    const rows: UnityRow[] = [];
    for (const table of tables(part)) {
      if (table.length < 3 || !isSeparator(table[1])) continue;
      const header = table[0];
      const name = column(header, 'Case');
      const operation = column(header, 'Operation');
      const without = column(header, 'Without Burst');
      const withBurst = column(header, 'With Burst');
      if (name < 0 || operation < 0 || without < 0 || withBurst < 0) continue;
      for (const row of table.slice(2)) {
        const withoutNs = parseTime(row[without] ?? '');
        const withNs = parseTime(row[withBurst] ?? '');
        if (
          !row[name] ||
          !row[operation] ||
          withoutNs === null ||
          withNs === null
        )
          continue;
        rows.push({
          case: row[name],
          operation: row[operation],
          withoutNs: Math.round(withoutNs * 1e4) / 1e4,
          withNs: Math.round(withNs * 1e4) / 1e4,
        });
      }
    }
    if (rows.length > 0) versions.push({ unity, rows });
  }
  if (versions.length === 0)
    throw new Error(
      'the Unity section has no "### Unity <version>" table with Case, Operation, Without Burst and With Burst columns',
    );
  return { environment, versions };
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
  // ReferenceTest (MemoryPack in its CircularReference mode), VersionTolerantTest
  // and FixedSizeTest. NinoDeserializeFixedStruct (and its MemoryPack pair) is
  // synced but never shown: it is below a nanosecond.
  ...['Graph', 'TolerantClass', 'TolerantClasses'].flatMap((name) =>
    ['Serialize', 'Deserialize'].flatMap((verb) => [
      `Nino${verb}${name}`,
      `MemoryPack${verb}${name}`,
    ]),
  ),
  ...['FixedStruct', 'FixedClass', 'FixedClasses'].flatMap((name) =>
    ['Serialize', 'Deserialize'].flatMap((verb) => [
      `Nino${verb}${name}`,
      `MemoryPack${verb}${name}`,
    ]),
  ),
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
  if (file.origin === 'none') return 'no data yet';
  return `${file.rows.length} rows from ${file.tag} (${file.origin})`;
}

function v3Summary(file: V3RuntimeFile) {
  return `${Object.keys(file.rows).length} v3 cases (${file.runs} v3 runs) from ${file.tag} (${file.origin})`;
}

function runtimesSummary(file: RuntimesFile) {
  if (file.origin === 'none') return 'no data yet';
  const langs = file.languages
    .map((l) => `${l.lang} (${l.rows.length} rows)`)
    .join(', ');
  return `${langs} from ${file.tag} (${file.origin})`;
}

function unitySummary(file: UnityFile) {
  if (file.origin === 'none') return 'no data yet';
  const versions = file.versions
    .map((v) => `Unity ${v.unity} (${v.rows.length} rows)`)
    .join(', ');
  return `${versions} from ${file.tag} (${file.origin})`;
}

function write(out: string, data: unknown) {
  writeFileSync(out, `${JSON.stringify(data, null, 2)}\n`);
}

function message(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function lacking(missing: string[]) {
  return `lacks ${missing.length} of the methods the site shows (${missing.slice(0, 3).join(', ')}${missing.length > 3 ? ', ...' : ''})`;
}

/** Where a parsed section came from, for the JSON files */
interface Origin {
  origin: 'release' | 'fixture';
  tag: string;
  url: string;
  publishedAt: string | null;
}

function releaseOrigin(release: Release): Origin {
  return {
    origin: 'release',
    tag: release.tag_name,
    url: release.html_url,
    publishedAt: release.published_at ?? release.created_at,
  };
}

/** A parsed section as a JSON file, keys in the committed files' order */
function benchFile(
  origin: Origin,
  { environment, rows }: ReturnType<typeof parseBenchSection>,
): BenchFile {
  return { ...origin, environment, rows };
}

const fixtureOrigin: Origin = {
  origin: 'fixture',
  tag: 'fixture',
  url: `https://github.com/${repo}/releases`,
  publishedAt: null,
};

function v3File(
  origin: Origin,
  v3: NonNullable<ReturnType<typeof parseV3Section>>,
): V3RuntimeFile {
  return {
    ...origin,
    environment: v3.environment,
    runs: v3.runs,
    note: null,
    rows: v3.rows,
  };
}

/** The v3 section of the release the v4 numbers came from; keeps the committed file when it has none */
function syncV3(release: Release, out: string | undefined) {
  const kept = () => {
    const file = JSON.parse(readFileSync(v3DataFile, 'utf8')) as V3RuntimeFile;
    return `keeping src/data/bench-v3-runtime.json (${v3Summary(file)})`;
  };
  try {
    const v3 = parseV3Section(release.body ?? '');
    if (!v3) {
      console.warn(
        `[benchmarks] ${release.tag_name} has no "${v3Heading}" section; ${kept()}`,
      );
      return;
    }
    const file = v3File(releaseOrigin(release), v3);
    write(out ?? v3DataFile, file);
    console.log(`[benchmarks] synced ${v3Summary(file)}`);
  } catch (error) {
    console.warn(`[benchmarks] warning: ${message(error)}; ${kept()}`);
  }
}

/**
 * The Arm64 section of the release the x64 numbers came from, under the same
 * rule (every method the site shows); keeps the committed file otherwise.
 */
async function syncArm64(release: Release, out: string | undefined) {
  const kept = () => {
    const file = JSON.parse(readFileSync(arm64DataFile, 'utf8')) as BenchFile;
    return `keeping src/data/bench-v4-arm64.json (${summary(file)})`;
  };
  try {
    const asset = release.assets?.find((a) => a.name === arm64Asset);
    let text = release.body ?? '';
    if (asset) {
      const response = await fetch(asset.browser_download_url, {
        signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok)
        throw new Error(
          `${arm64Asset}: ${response.status} ${response.statusText}`,
        );
      text = await response.text();
    }
    const arm64 = parseArm64Section(text);
    if (!arm64) {
      console.warn(
        `[benchmarks] ${release.tag_name} has no "${arm64Heading}" section; ${kept()}`,
      );
      return;
    }
    const missing = missingMethods(arm64.rows);
    if (missing.length > 0)
      throw new Error(
        `${release.tag_name}'s Arm64 section ${lacking(missing)}`,
      );
    const file = benchFile(releaseOrigin(release), arm64);
    write(out ?? arm64DataFile, file);
    console.log(`[benchmarks] synced Arm64: ${summary(file)}`);
  } catch (error) {
    console.warn(`[benchmarks] warning: ${message(error)}; ${kept()}`);
  }
}

/**
 * The runtime sections of the release the .NET numbers came from; keeps the
 * committed file when it has none.
 */
function syncRuntimes(release: Release, out: string | undefined) {
  const kept = () => {
    const file = JSON.parse(
      readFileSync(runtimesDataFile, 'utf8'),
    ) as RuntimesFile;
    return `keeping src/data/bench-runtimes.json (${runtimesSummary(file)})`;
  };
  try {
    const languages = parseRuntimeSections(
      release.body ?? '',
      release.tag_name,
    );
    if (languages.length === 0) {
      console.warn(
        `[benchmarks] ${release.tag_name} has no runtime section; ${kept()}`,
      );
      return;
    }
    const file: RuntimesFile = { ...releaseOrigin(release), languages };
    write(out ?? runtimesDataFile, file);
    console.log(`[benchmarks] synced runtimes: ${runtimesSummary(file)}`);
  } catch (error) {
    console.warn(`[benchmarks] warning: ${message(error)}; ${kept()}`);
  }
}

/**
 * The Unity section of the release the .NET numbers came from; keeps the
 * committed file when it has none or it cannot be read.
 */
function syncUnity(release: Release, out: string | undefined) {
  const kept = () => {
    const file = JSON.parse(readFileSync(unityDataFile, 'utf8')) as UnityFile;
    return `keeping src/data/bench-unity.json (${unitySummary(file)})`;
  };
  try {
    const unity = parseUnitySection(release.body ?? '');
    if (!unity) {
      console.warn(
        `[benchmarks] ${release.tag_name} has no "${unityHeading}" section; ${kept()}`,
      );
      return;
    }
    const file: UnityFile = { ...releaseOrigin(release), ...unity };
    write(out ?? unityDataFile, file);
    console.log(`[benchmarks] synced Unity: ${unitySummary(file)}`);
  } catch (error) {
    console.warn(`[benchmarks] warning: ${message(error)}; ${kept()}`);
  }
}

/** Fixture mode: every section the file has, written to --out* or printed */
function fixture(path: string) {
  const body = readFileSync(path, 'utf8');
  const output = (flag: string, data: unknown, text: string) => {
    const out = argument(flag);
    if (out) {
      write(out, data);
      console.log(`[benchmarks] wrote ${out}: ${text}`);
    } else {
      console.log(JSON.stringify(data, null, 2));
    }
  };
  const warnMissing = (what: string, rows: BenchRow[]) => {
    const missing = missingMethods(rows);
    if (missing.length > 0)
      console.warn(
        `[benchmarks] ${what} lacks ${missing.length} of the ${requiredMethods.length} methods the site needs (a release like this would not be used): ${missing.join(', ')}`,
      );
  };

  const x64 = benchFile(fixtureOrigin, parseReport(body));
  warnMissing('fixture', x64.rows);
  output('--out', x64, summary(x64));

  const v3 = parseV3Section(body);
  if (v3) {
    const file = v3File(fixtureOrigin, v3);
    output('--out-v3', file, v3Summary(file));
  } else console.log('[benchmarks] fixture has no v3 section');

  const arm64 = parseArm64Section(body);
  if (arm64) {
    const file = benchFile(fixtureOrigin, arm64);
    warnMissing("fixture's Arm64 section", file.rows);
    output('--out-arm64', file, `Arm64: ${summary(file)}`);
  } else console.log('[benchmarks] fixture has no Arm64 section');

  const languages = parseRuntimeSections(body, fixtureOrigin.tag);
  if (languages.length > 0) {
    const file: RuntimesFile = { ...fixtureOrigin, languages };
    output('--out-runtimes', file, `runtimes: ${runtimesSummary(file)}`);
  } else console.log('[benchmarks] fixture has no runtime section');

  const unity = parseUnitySection(body);
  if (unity) {
    const file: UnityFile = { ...fixtureOrigin, ...unity };
    output('--out-unity', file, `Unity: ${unitySummary(file)}`);
  } else console.log('[benchmarks] fixture has no Unity section');
}

async function main() {
  const fixturePath = argument('--fixture');
  if (fixturePath) {
    fixture(fixturePath);
    return;
  }

  try {
    const release = await latestRelease();
    const file = benchFile(
      releaseOrigin(release),
      parseReport(release.body ?? ''),
    );
    const missing = missingMethods(file.rows);
    if (missing.length > 0)
      throw new Error(`${release.tag_name}'s report ${lacking(missing)}`);
    write(argument('--out') ?? dataFile, file);
    console.log(`[benchmarks] synced ${summary(file)}`);
    // Only from the release the v4 numbers came from, so the site never mixes releases.
    syncV3(release, argument('--out-v3'));
    await syncArm64(release, argument('--out-arm64'));
    syncRuntimes(release, argument('--out-runtimes'));
    syncUnity(release, argument('--out-unity'));
  } catch (error) {
    const kept = JSON.parse(readFileSync(dataFile, 'utf8')) as BenchFile;
    console.warn(
      `[benchmarks] warning: ${message(error)}; keeping src/data/bench-v4.json (${summary(kept)}), src/data/bench-v3-runtime.json, src/data/bench-v4-arm64.json, src/data/bench-runtimes.json and src/data/bench-unity.json`,
    );
  }
}

// Run only when executed directly (the parser is importable).
const isMain =
  process.argv[1] !== undefined &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isMain)
  main().catch((error) => {
    // Fixture mode reports parse errors; normal mode never gets here.
    console.error(
      `[benchmarks] ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exitCode = process.argv.includes('--fixture') ? 1 : 0;
  });

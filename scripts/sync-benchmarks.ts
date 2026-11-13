/**
 * Syncs the benchmarks of Nino's newest v4 release into src/data. Nino's
 * report workflow attaches every result to the release as an asset and lists
 * them in benchmarks-manifest.json (Nino's
 * benchmarks/reports/release_assets.py); the body only charts them. From
 * the assets (`assetNames`):
 *
 * - dotnet-x64.md, the merged BenchmarkDotNet report of every class (v4,
 *   MemoryPack and the other libraries), into src/data/bench-v4.json;
 * - dotnet-v3-x64.md, Nino 3.3.13's SimpleTest and PolymorphicTest run
 *   directly before v4 on the same runners, against dotnet-x64.md's v4 times,
 *   into src/data/bench-v3-runtime.json;
 * - dotnet-arm64.md, the same classes on GitHub's Arm64 runners, into
 *   src/data/bench-v4-arm64.json;
 * - runtime-go-x64.md, runtime-rust-x64.md and runtime-typescript-x64.md, the
 *   sections of the runtimes outside .NET ("🐹 Go runtime benchmark", ...,
 *   written by Nino's benchmarks/reports/runtimes_report.py), into
 *   src/data/bench-runtimes.json;
 * - unity-x64.md, the Unity section ("🎮 Unity benchmark (Burst, IL2CPP)": an
 *   IL2CPP player on GitHub's Linux x64 runner, each case timed without and
 *   with the Burst kernels, one "### Unity <version>" table per Unity
 *   version), into src/data/bench-unity.json;
 * - build-x64.md, the build section ("🏗️ Build: v3 3.3.13 vs v4 (source
 *   generator)": Nino v3 3.3.13's source generator against the release's on
 *   one x64 runner, at 330 and 1,100 types, written by Nino's
 *   benchmarks/reports/generator_report.py), into src/data/bench-build.json.
 *
 * A release without the manifest (v4.0.0-rc.9 and older) had these as
 * sections of its body, which are parsed instead: the "Performance Report",
 * the "v3 3.3.13 vs v4 (same machine)" section (compare_v3.py's tables), the
 * "Arm64 benchmark" section (or its copy attached as arm64-benchmark.md when
 * the body had no room for it), and the runtime, Unity and build sections.
 *
 * The x64 and Arm64 reports have a row per method, and every row is kept,
 * whatever its method prefix (`MessagePack…`, `Protobuf…`, `GoogleProtobuf…`,
 * `Json…`) or benchmark class (WorkloadTest's workloads, SimpleTest and
 * PolymorphicTest among them). `requiredMethods` never asks for the other
 * libraries or the workloads: releases before they joined the benchmark lack
 * them, and the site then leaves them out.
 *
 *   bun scripts/sync-benchmarks.ts                       # newest v4.* release with a report
 *   bun scripts/sync-benchmarks.ts --fixture <file.md>   # parse a release body from a file
 *   bun scripts/sync-benchmarks.ts --fixture <dir>       # read a manifest and its assets from a directory
 *   bun scripts/sync-benchmarks.ts --fixture <file|dir> --out <file.json> [--out-v3 <file.json>] [--out-arm64 <file.json>] [--out-runtimes <file.json>] [--out-unity <file.json>] [--out-build <file.json>]
 *
 * Fixtures: scripts/fixtures/release-assets/ (a manifest and its assets, as
 * Nino's release_body.py publish wrote them in a dry run from
 * release-body-build.md's data plus Google.Protobuf and System.Text.Json rows
 * in SimpleTest and PolymorphicTest, and every library's and v3's rows of
 * NullableTest and CollectionsTest's nullable collections, numbers invented:
 * for reader tests only).
 * Bodies of releases without the manifest: scripts/fixtures/release-body.md
 * (made-up numbers, the methods the site requires), release-body-v3.md (with
 * the v3 section), release-body-new.md (a sample of the ReferenceTest,
 * VersionTolerantTest and FixedSizeTest rows; its numbers are noise, only its
 * format matters) and release-body-arm64.md (release-body-new.md plus an
 * Arm64 section whose numbers are a copy of its x64 ones: for parser tests
 * only) and release-body-libraries.md (release-body-arm64.md plus MessagePack
 * and protobuf-net rows and the three runtime sections, with invented numbers:
 * for parser tests only) and release-body-unity.md (release-body-libraries.md
 * plus a Unity section, with invented numbers: for parser tests only) and
 * release-body-workloads.md (release-body-unity.md plus WorkloadTest's rows
 * for every library in the x64 report and the Arm64 section, with invented
 * numbers: for parser tests only) and release-body-build.md
 * (release-body-workloads.md plus the build section, its numbers from Nino's
 * benchmarks/reports/fixtures/generator: for parser tests only).
 *
 * Runs before every build. It never fails the build: on any error (network,
 * rate limit, no matching release, an asset or table it cannot read) it prints
 * a warning and leaves the committed JSON as it is. A release without the v3
 * or the Arm64 results (or whose Arm64 report lacks a method the site shows)
 * keeps the committed src/data/bench-v3-runtime.json or
 * src/data/bench-v4-arm64.json; a release without any runtime section keeps
 * src/data/bench-runtimes.json (a language whose table it cannot read is left
 * out, with a warning), and a release without the Unity section (or with one
 * it cannot read) keeps src/data/bench-unity.json, and one without the build
 * section (or with one it cannot read) keeps src/data/bench-build.json.
 * Set GITHUB_TOKEN to raise the API rate limit.
 */
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
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
const buildDataFile = fileURLToPath(
  new URL('../src/data/bench-build.json', import.meta.url),
);

/** Heading of the v3 section in the release body (report.yml's V3_HEADING) */
export const v3Heading = 'v3 3.3.13 vs v4 (same machine)';

/**
 * Heading of the Arm64 section (report.yml's ARM64_HEADING). It never contains
 * "Performance Report", so the x64 report is still found by those words.
 */
export const arm64Heading = '## 📊 Arm64 benchmark';

/** The release asset that held the Arm64 section of a body with no room for it (releases before the manifest) */
export const arm64Asset = 'arm64-benchmark.md';

/** The manifest of a release's benchmark assets (Nino's benchmarks/reports/release_assets.py, MANIFEST) */
export const manifestAsset = 'benchmarks-manifest.json';

/** The assets the site reads (release_assets.py, NAMES): fixed names, the same for every release */
export const assetNames = {
  x64: 'dotnet-x64.md',
  arm64: 'dotnet-arm64.md',
  v3: 'dotnet-v3-x64.md',
  runtime: (lang: RuntimeLang) => `runtime-${lang}-x64.md`,
  unity: 'unity-x64.md',
  build: 'build-x64.md',
} as const;

/** One asset of the manifest; release_body.py adds the chart fields, which the site does not read */
export interface ManifestEntry {
  name: string;
  kind: string;
  arch?: string;
  lang?: string;
  format?: string;
  environment?: string | null;
}

/** benchmarks-manifest.json */
export interface Manifest {
  schema: number;
  tag: string;
  assets: ManifestEntry[];
}

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

/**
 * Heading of the build section (Nino's benchmarks/reports/generator_report.py,
 * HEADING): v3 3.3.13's source generator against the release's, one
 * "### <types> types (N = <roots>)" table per workload.
 */
export const buildHeading = '## 🏗️ Build: v3 3.3.13 vs v4 (source generator)';

/** The rows of each build table (generator_report.py's ROWS), in order: key and label */
export const buildRows = [
  ['source', 'Generated source'],
  ['emit', 'Compiling the generated code (emit)'],
  ['generate', 'Running the generator'],
  ['member', 'Re-generating after editing a member'],
  ['comment', 'Re-generating after editing a comment'],
  ['il', 'IL of the generated code'],
] as const;

export type BuildKey = (typeof buildRows)[number][0];

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

/** One side (v3 or v4) of a build row */
export interface BuildCell {
  /** As published: "18.7 MB (363,233 lines)", "0.84 s" */
  text: string;
  /** In `unit`: 18.7, 0.84 */
  value: number;
  /** Millions of chars (source), of bytes (IL), or seconds */
  unit: 'MB' | 's';
  /** Lines of generated source (the source row only) */
  lines?: number;
}

/** One row of a build table */
export interface BuildRow {
  key: BuildKey;
  v3: BuildCell;
  v4: BuildCell;
  /** "14× smaller", "221× faster", "on par" or "—" (v4 not ahead), as published */
  ratio: string;
}

/** One workload of the build section */
export interface BuildSize {
  types: number;
  roots: number;
  /** How many runs each time is the median of; null when the source does not say (a local run: see `note`) */
  measured: { v3: number; v4: number } | null;
  rows: BuildRow[];
}

/**
 * src/data/bench-build.json. `origin: 'local'` (empty tag and url, a `note`
 * naming the machine and the runs) is the committed file before any release
 * had the build section.
 */
export interface BuildFile {
  origin: 'release' | 'local' | 'fixture';
  tag: string;
  url: string;
  publishedAt: string | null;
  /** "<CPU>, <n> cores, <.NET runtime>, Roslyn <version>" */
  environment: string | null;
  /** Shown instead of the generated description (local runs only) */
  note: { en: string; zh: string } | null;
  sizes: BuildSize[];
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
 * Parses the v3 section of a release body: the compare_v3.py tables (case,
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
      // v4 may read 0.00 ns: under the floor (src/lib/benchmarks.ts, FLOOR_NS)
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

/**
 * The v3 results of a release with the manifest: dotnet-v3-x64.md (v3
 * 3.3.13's report, one run directly before v4) against the v4 times of the
 * same methods in dotnet-x64.md, as parseV3Section reads them from a body.
 * Throws when the report has no usable table or no SerializeSimpleClass row.
 */
export function parseV3Report(text: string, x64: BenchRow[]) {
  const v3 = parseBenchSection(text, 'the v3 report');
  const v4 = new Map(x64.map((row) => [row.method, row.meanNs]));
  const rows: V3RuntimeFile['rows'] = {};
  for (const row of v3.rows) {
    // A method without a verb reads into existing objects (PooledGraphTest's NinoLeavesInPlace): deserialize
    const match = /^Nino(Serialize|Deserialize)?(\w+)$/.exec(row.method);
    const v4Ns = v4.get(row.method);
    // v4 may read 0.00 ns: under the floor (src/lib/benchmarks.ts, FLOOR_NS)
    if (!match || v4Ns === undefined || row.meanNs <= 0 || v4Ns < 0) continue;
    rows[`${(match[1] ?? 'Deserialize').toLowerCase()}:${match[2]}`] = {
      v3Ns: row.meanNs,
      v4Ns,
    };
  }
  if (!rows['serialize:SimpleClass'])
    throw new Error(
      'the v3 report has no SerializeSimpleClass row in both runs',
    );
  return { rows, runs: 1, environment: v3.environment };
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

/** "18.7 MB (363,233 lines)", "2.21 MB", "0.84 s", "1,234 s" -> a build cell; null if unreadable */
export function parseBuildCell(text: string): BuildCell | null {
  const value = clean(text);
  const match = /^([\d,]*\.?\d+)\s*(MB|s)(?:\s*\(([\d,]+)\s+lines\))?$/.exec(
    value,
  );
  if (!match) return null;
  const cell: BuildCell = {
    text: value,
    value: number(match[1]),
    unit: match[2] as BuildCell['unit'],
  };
  if (match[3]) cell.lines = number(match[3]);
  return cell;
}

/**
 * The build section: its Environment line, the measured runs its paragraph
 * names ("v3: 3 at 330 types, 2 at 1,100 types; v4: ..."), and one table per
 * "### <types> types (N = <roots>)" heading with the six rows of `buildRows`.
 * Returns null when the body has none; throws when a table lacks a row, a cell
 * cannot be read, or there is no Environment line or no table (generator_report.py's parse()).
 */
export function parseBuildSection(body: string) {
  const start = body.indexOf(buildHeading);
  if (start < 0) return null;
  const section = sectionFrom(body, start);
  const environment =
    /^Environment:\s*(.+)$/m.exec(section)?.[1].trim() ?? null;

  const runsOf = (side: 'v3' | 'v4') => {
    const list = new RegExp(`\\b${side}: ([^;)]*)`).exec(section)?.[1] ?? '';
    const runs = new Map<number, number>();
    for (const m of list.matchAll(/(\d+) at ([\d,]+) types/g))
      runs.set(number(m[2]), number(m[1]));
    return runs;
  };
  const v3Runs = runsOf('v3');
  const v4Runs = runsOf('v4');

  const labels = new Map<string, BuildKey>(
    buildRows.map(([key, label]) => [label, key]),
  );
  const sizes: BuildSize[] = [];
  for (const part of section.split(/\n###\s+/).slice(1)) {
    const head = /^([\d,]+) types \(N = (\d+)\)/.exec(part);
    if (!head) continue;
    const types = number(head[1]);
    const byKey = new Map<BuildKey, BuildRow>();
    for (const table of tables(part)) {
      if (table.length < 3 || !isSeparator(table[1])) continue;
      for (const row of table.slice(2)) {
        const key = labels.get(row[0] ?? '');
        if (!key || row.length !== 4) continue;
        const v3 = parseBuildCell(row[1]);
        const v4 = parseBuildCell(row[2]);
        if (!v3 || !v4)
          throw new Error(
            `the build table of ${head[1]} types has a cell it cannot read in "${row[0]}": ${row[1]} | ${row[2]}`,
          );
        byKey.set(key, { key, v3, v4, ratio: row[3] });
      }
    }
    const missing = buildRows.filter(([key]) => !byKey.has(key));
    if (missing.length > 0)
      throw new Error(
        `the build table of ${head[1]} types lacks rows: ${missing.map(([, label]) => label).join(', ')}`,
      );
    const v3 = v3Runs.get(types);
    const v4 = v4Runs.get(types);
    sizes.push({
      types,
      roots: number(head[2]),
      measured: v3 !== undefined && v4 !== undefined ? { v3, v4 } : null,
      rows: buildRows.map(([key]) => byKey.get(key) as BuildRow),
    });
  }
  if (!environment || sizes.length === 0)
    throw new Error('the build section has no Environment line or no table');
  sizes.sort((a, b) => a.types - b.types);
  return { environment, sizes };
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

const apiHeaders = () => {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'nino-docs-benchmark-sync',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN)
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return headers;
};

/** An asset's text (its browser_download_url: no API call) */
async function download(url: string, name: string) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok)
    throw new Error(`${name}: ${response.status} ${response.statusText}`);
  return response.text();
}

/** A release's manifest; null when it has none */
async function releaseManifest(release: Release) {
  const asset = release.assets?.find((a) => a.name === manifestAsset);
  if (!asset) return null;
  return JSON.parse(
    await download(asset.browser_download_url, manifestAsset),
  ) as Manifest;
}

/** The text of every asset the site reads that the manifest lists, or the error that kept one from it */
async function releaseAssets(release: Release, manifest: Manifest) {
  const wanted = new Set<string>([
    assetNames.x64,
    assetNames.arm64,
    assetNames.v3,
    assetNames.unity,
    assetNames.build,
    ...(Object.keys(runtimeHeadings) as RuntimeLang[]).map(assetNames.runtime),
  ]);
  const names = manifest.assets
    .map((entry) => entry.name)
    .filter((name) => wanted.has(name));
  const results = await Promise.allSettled(
    names.map((name) => {
      const asset = release.assets?.find((a) => a.name === name);
      if (!asset)
        return Promise.reject(
          new Error(`${name}: listed in the manifest, not attached`),
        );
      return download(asset.browser_download_url, name);
    }),
  );
  const files = new Map<string, string | Error>();
  names.forEach((name, i) => {
    const result = results[i];
    files.set(
      name,
      result.status === 'fulfilled'
        ? result.value
        : new Error(message(result.reason)),
    );
  });
  return files;
}

type BenchSection = ReturnType<typeof parseBenchSection>;
type V3Section = NonNullable<ReturnType<typeof parseV3Section>>;

/**
 * What one release (or fixture) holds, each part parsed on demand: null when
 * it has none, a throw when it cannot be read. From the assets of a release
 * with the manifest, or from the body of one without.
 */
interface Sources {
  /** Where the results came from, for the messages */
  from: string;
  x64(): BenchSection;
  v3(): V3Section | null;
  arm64(): BenchSection | null;
  runtimes(tag: string): RuntimeSection[];
  unity(): ReturnType<typeof parseUnitySection>;
  build(): ReturnType<typeof parseBuildSection>;
}

/** The sections of a body from before the manifest (arm64Text: arm64-benchmark.md, when it was attached) */
function bodySources(body: string, arm64Text?: string): Sources {
  return {
    from: 'the release body',
    x64: () => parseReport(body),
    v3: () => parseV3Section(body),
    arm64: () => parseArm64Section(arm64Text ?? body),
    runtimes: (tag) => parseRuntimeSections(body, tag),
    unity: () => parseUnitySection(body),
    build: () => parseBuildSection(body),
  };
}

/** The assets of a release with the manifest: name -> text, or the error that kept it; absent = not listed */
function assetSources(files: Map<string, string | Error>): Sources {
  const text = (name: string) => {
    const file = files.get(name);
    if (file instanceof Error) throw file;
    return file ?? null;
  };
  const x64 = () => {
    const report = text(assetNames.x64);
    if (report === null) throw new Error(`no ${assetNames.x64}`);
    return parseBenchSection(report, assetNames.x64);
  };
  return {
    from: manifestAsset,
    x64,
    v3: () => {
      const report = text(assetNames.v3);
      return report === null ? null : parseV3Report(report, x64().rows);
    },
    arm64: () => {
      const report = text(assetNames.arm64);
      return report === null
        ? null
        : parseBenchSection(report, assetNames.arm64);
    },
    runtimes: (tag) => {
      const sections: RuntimeSection[] = [];
      for (const lang of Object.keys(runtimeHeadings) as RuntimeLang[]) {
        try {
          const section = text(assetNames.runtime(lang));
          const parsed = section && parseRuntimeSection(section, lang, tag);
          if (parsed) sections.push(parsed);
        } catch (error) {
          console.warn(`[benchmarks] warning: ${message(error)}; left out`);
        }
      }
      return sections;
    },
    unity: () => {
      const section = text(assetNames.unity);
      return section === null ? null : parseUnitySection(section);
    },
    build: () => {
      const section = text(assetNames.build);
      return section === null ? null : parseBuildSection(section);
    },
  };
}

/**
 * The newest v4.* release with .NET results: a manifest that lists
 * dotnet-x64.md, or (before the manifest) a body with a "Performance
 * Report"; and what it holds.
 */
async function latestRelease(): Promise<{
  release: Release;
  sources: Sources;
}> {
  const response = await fetch(
    `https://api.github.com/repos/${repo}/releases?per_page=50`,
    { headers: apiHeaders(), signal: AbortSignal.timeout(15_000) },
  );
  if (!response.ok)
    throw new Error(`GitHub API ${response.status} ${response.statusText}`);
  const releases = (await response.json()) as Release[];

  const candidates = releases
    .filter(
      (release) =>
        !release.draft &&
        release.tag_name.startsWith('v4.') &&
        (release.assets?.some((a) => a.name === manifestAsset) ||
          release.body?.includes('Performance Report')),
    )
    .sort((a, b) =>
      (b.published_at ?? b.created_at).localeCompare(
        a.published_at ?? a.created_at,
      ),
    );
  for (const release of candidates) {
    // A manifest that cannot be read throws: the committed files stay.
    const manifest = await releaseManifest(release);
    if (manifest) {
      if (!manifest.assets.some((entry) => entry.name === assetNames.x64)) {
        console.warn(
          `[benchmarks] ${release.tag_name}'s ${manifestAsset} lists no ${assetNames.x64}; trying an older release`,
        );
        continue;
      }
      return {
        release,
        sources: assetSources(await releaseAssets(release, manifest)),
      };
    }
    if (!release.body?.includes('Performance Report')) continue;
    const asset = release.assets?.find((a) => a.name === arm64Asset);
    const arm64Text = asset
      ? await download(asset.browser_download_url, arm64Asset)
      : undefined;
    return { release, sources: bodySources(release.body, arm64Text) };
  }
  throw new Error(
    `no v4.* release with ${manifestAsset} or a "Performance Report" yet`,
  );
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

function buildSummary(file: BuildFile) {
  const sizes = file.sizes.map((size) => `${size.types} types`).join(', ');
  return `${sizes} from ${file.tag || 'a local run'} (${file.origin})`;
}

function write(out: string, data: unknown) {
  writeFileSync(out, `${formatJson(data)}\n`);
}

/** Biome's line width: an array of plain values that fits on a line is written on one. */
const LINE_WIDTH = 80;

/**
 * JSON as `biome format` writes it (2-space indent, objects expanded, an array of plain values on one line when
 * the line fits), so `bun run check` passes on the files a sync writes.
 */
function formatJson(
  value: unknown,
  indent = '',
  prefix = '',
  suffix = '',
): string {
  if (Array.isArray(value) && value.length > 0) {
    if (value.every((v) => v === null || typeof v !== 'object')) {
      const line = `[${value.map((v) => JSON.stringify(v)).join(', ')}]`;
      if (
        indent.length + prefix.length + line.length + suffix.length <=
        LINE_WIDTH
      )
        return line;
    }
    const inner = `${indent}  `;
    const items = value.map(
      (v, i) =>
        `${inner}${formatJson(v, inner, '', i < value.length - 1 ? ',' : '')}`,
    );
    return `[\n${items.join(',\n')}\n${indent}]`;
  }
  if (
    value !== null &&
    typeof value === 'object' &&
    Object.keys(value).length > 0
  ) {
    const inner = `${indent}  `;
    const entries = Object.entries(value).filter(([, v]) => v !== undefined);
    const items = entries.map(([k, v], i) => {
      const key = `${JSON.stringify(k)}: `;
      return `${inner}${key}${formatJson(v, inner, key, i < entries.length - 1 ? ',' : '')}`;
    });
    return `{\n${items.join(',\n')}\n${indent}}`;
  }
  return JSON.stringify(value);
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

function v3File(origin: Origin, v3: V3Section): V3RuntimeFile {
  return {
    ...origin,
    environment: v3.environment,
    runs: v3.runs,
    note: null,
    rows: v3.rows,
  };
}

/** The v3 results of the release the v4 numbers came from; keeps the committed file when it has none */
function syncV3(release: Release, sources: Sources, out: string | undefined) {
  const kept = () => {
    const file = JSON.parse(readFileSync(v3DataFile, 'utf8')) as V3RuntimeFile;
    return `keeping src/data/bench-v3-runtime.json (${v3Summary(file)})`;
  };
  try {
    const v3 = sources.v3();
    if (!v3) {
      console.warn(
        `[benchmarks] ${release.tag_name} has no v3 results in ${sources.from}; ${kept()}`,
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
 * The Arm64 results of the release the x64 numbers came from, under the same
 * rule (every method the site shows); keeps the committed file otherwise.
 */
function syncArm64(
  release: Release,
  sources: Sources,
  out: string | undefined,
) {
  const kept = () => {
    const file = JSON.parse(readFileSync(arm64DataFile, 'utf8')) as BenchFile;
    return `keeping src/data/bench-v4-arm64.json (${summary(file)})`;
  };
  try {
    const arm64 = sources.arm64();
    if (!arm64) {
      console.warn(
        `[benchmarks] ${release.tag_name} has no Arm64 results in ${sources.from}; ${kept()}`,
      );
      return;
    }
    const missing = missingMethods(arm64.rows);
    if (missing.length > 0)
      throw new Error(`${release.tag_name}'s Arm64 report ${lacking(missing)}`);
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
function syncRuntimes(
  release: Release,
  sources: Sources,
  out: string | undefined,
) {
  const kept = () => {
    const file = JSON.parse(
      readFileSync(runtimesDataFile, 'utf8'),
    ) as RuntimesFile;
    return `keeping src/data/bench-runtimes.json (${runtimesSummary(file)})`;
  };
  try {
    const languages = sources.runtimes(release.tag_name);
    if (languages.length === 0) {
      console.warn(
        `[benchmarks] ${release.tag_name} has no runtime section in ${sources.from}; ${kept()}`,
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
function syncUnity(
  release: Release,
  sources: Sources,
  out: string | undefined,
) {
  const kept = () => {
    const file = JSON.parse(readFileSync(unityDataFile, 'utf8')) as UnityFile;
    return `keeping src/data/bench-unity.json (${unitySummary(file)})`;
  };
  try {
    const unity = sources.unity();
    if (!unity) {
      console.warn(
        `[benchmarks] ${release.tag_name} has no "${unityHeading}" section in ${sources.from}; ${kept()}`,
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

/**
 * The build section of the release the .NET numbers came from; keeps the
 * committed file when it has none or it cannot be read.
 */
function syncBuild(
  release: Release,
  sources: Sources,
  out: string | undefined,
) {
  const kept = () => {
    const file = JSON.parse(readFileSync(buildDataFile, 'utf8')) as BuildFile;
    return `keeping src/data/bench-build.json (${buildSummary(file)})`;
  };
  try {
    const build = sources.build();
    if (!build) {
      console.warn(
        `[benchmarks] ${release.tag_name} has no "${buildHeading}" section in ${sources.from}; ${kept()}`,
      );
      return;
    }
    const file: BuildFile = { ...releaseOrigin(release), ...build, note: null };
    write(out ?? buildDataFile, buildFile(file));
    console.log(`[benchmarks] synced build: ${buildSummary(file)}`);
  } catch (error) {
    console.warn(`[benchmarks] warning: ${message(error)}; ${kept()}`);
  }
}

/** Keys in the committed file's order */
function buildFile(file: BuildFile): BuildFile {
  const { origin, tag, url, publishedAt, environment, note, sizes } = file;
  return { origin, tag, url, publishedAt, environment, note, sizes };
}

/**
 * A fixture: a release body (a file), or a manifest and its assets (a
 * directory, read as a release's assets are).
 */
function fixtureSources(path: string): Sources {
  if (!statSync(path).isDirectory())
    return bodySources(readFileSync(path, 'utf8'));
  const manifest = JSON.parse(
    readFileSync(join(path, manifestAsset), 'utf8'),
  ) as Manifest;
  const files = new Map<string, string | Error>();
  for (const { name } of manifest.assets) {
    const file = join(path, name);
    files.set(
      name,
      existsSync(file)
        ? readFileSync(file, 'utf8')
        : new Error(`${name}: listed in the manifest, not in ${path}`),
    );
  }
  return assetSources(files);
}

/** Fixture mode: every part the fixture has, written to --out* or printed */
function fixture(path: string) {
  const sources = fixtureSources(path);
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

  const x64 = benchFile(fixtureOrigin, sources.x64());
  warnMissing('fixture', x64.rows);
  output('--out', x64, summary(x64));

  const v3 = sources.v3();
  if (v3) {
    const file = v3File(fixtureOrigin, v3);
    output('--out-v3', file, v3Summary(file));
  } else console.log('[benchmarks] fixture has no v3 results');

  const arm64 = sources.arm64();
  if (arm64) {
    const file = benchFile(fixtureOrigin, arm64);
    warnMissing("fixture's Arm64 report", file.rows);
    output('--out-arm64', file, `Arm64: ${summary(file)}`);
  } else console.log('[benchmarks] fixture has no Arm64 results');

  const languages = sources.runtimes(fixtureOrigin.tag);
  if (languages.length > 0) {
    const file: RuntimesFile = { ...fixtureOrigin, languages };
    output('--out-runtimes', file, `runtimes: ${runtimesSummary(file)}`);
  } else console.log('[benchmarks] fixture has no runtime section');

  const unity = sources.unity();
  if (unity) {
    const file: UnityFile = { ...fixtureOrigin, ...unity };
    output('--out-unity', file, `Unity: ${unitySummary(file)}`);
  } else console.log('[benchmarks] fixture has no Unity section');

  const build = sources.build();
  if (build) {
    const file = buildFile({ ...fixtureOrigin, ...build, note: null });
    output('--out-build', file, `build: ${buildSummary(file)}`);
  } else console.log('[benchmarks] fixture has no build section');
}

async function main() {
  const fixturePath = argument('--fixture');
  if (fixturePath) {
    fixture(fixturePath);
    return;
  }

  try {
    const { release, sources } = await latestRelease();
    const file = benchFile(releaseOrigin(release), sources.x64());
    const missing = missingMethods(file.rows);
    if (missing.length > 0)
      throw new Error(`${release.tag_name}'s report ${lacking(missing)}`);
    write(argument('--out') ?? dataFile, file);
    console.log(`[benchmarks] synced ${summary(file)} from ${sources.from}`);
    // Only from the release the v4 numbers came from, so the site never mixes releases.
    syncV3(release, sources, argument('--out-v3'));
    syncArm64(release, sources, argument('--out-arm64'));
    syncRuntimes(release, sources, argument('--out-runtimes'));
    syncUnity(release, sources, argument('--out-unity'));
    syncBuild(release, sources, argument('--out-build'));
  } catch (error) {
    const kept = JSON.parse(readFileSync(dataFile, 'utf8')) as BenchFile;
    console.warn(
      `[benchmarks] warning: ${message(error)}; keeping src/data/bench-v4.json (${summary(kept)}), src/data/bench-v3-runtime.json, src/data/bench-v4-arm64.json, src/data/bench-runtimes.json, src/data/bench-unity.json and src/data/bench-build.json`,
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

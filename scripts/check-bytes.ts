/**
 * Checks that every byte the site shows is a byte Nino writes: each row of a
 * `<Bytes>` figure in the v4 pages and each row of the byte playground
 * (src/data/byte-examples.json) must appear, in order, in a dump of Nino's
 * specification (docs/spec/wire-format.md: Appendix A's dumps of a real run,
 * and every other hex run in it) or in a file of the conformance corpus
 * (tests/conformance/corpus/valid/*.bin, written by Nino itself). A row found in
 * neither fails: a figure the spec has no dump for gets one there first.
 *
 *   bun run check:bytes          # Nino from $NINO_DIR, else ../Nino
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const nino = resolve(process.env.NINO_DIR ?? join(root, '..', 'Nino'));
const specPath = join(nino, 'docs', 'spec', 'wire-format.md');
// tests/conformance since rc.10; conformance/ at the root before.
const corpusDir =
  [
    join(nino, 'tests', 'conformance', 'corpus', 'valid'),
    join(nino, 'conformance', 'corpus', 'valid'),
  ].find(existsSync) ?? '';
if (!existsSync(specPath)) {
  console.error(`No Nino checkout at ${nino} (set NINO_DIR).`);
  process.exit(1);
}

const byte = /^[0-9A-Fa-f]{2}$/;

/**
 * The bytes of a run of hex tokens: `01 00×7` repeats a byte, `|` (`\|` in a
 * table cell) separates fields, and any other word ends the run (`...`: what
 * follows is abbreviated).
 */
function tokens(text: string): string[][] {
  const runs: string[][] = [];
  let run: string[] = [];
  const flush = () => {
    if (run.length > 0) runs.push(run);
    run = [];
  };
  for (const raw of text.split(/\s+/)) {
    const word = raw.replace(/[`,;\\]/g, '');
    if (word === '|' || word === '') continue;
    const repeat = /^([0-9A-Fa-f]{2})×(\d+)$/.exec(word);
    if (repeat) {
      for (let i = 0; i < Number(repeat[2]); i++)
        run.push(repeat[1].toUpperCase());
    } else if (byte.test(word)) run.push(word.toUpperCase());
    else flush();
  }
  flush();
  return runs;
}

/** Every hex run of the specification: per fence (its dump lines joined), per table cell, per inline code span. */
function specHaystacks(spec: string): string[] {
  const out: string[] = [];
  for (const fence of spec.matchAll(/```[^\n]*\n([\s\S]*?)```/g)) {
    // A dump is the first hex run of each line (a comment follows it)
    const dump = fence[1].split('\n').flatMap((line) => tokens(line)[0] ?? []);
    if (dump.length > 0) out.push(dump.join(' '));
    for (const line of fence[1].split('\n'))
      out.push(...tokens(line).map((run) => run.join(' ')));
  }
  for (const code of spec.matchAll(/`([^`\n]+)`/g))
    out.push(...tokens(code[1]).map((run) => run.join(' ')));
  return out.filter(Boolean);
}

function corpusHaystacks(): string[] {
  if (!existsSync(corpusDir)) return [];
  return readdirSync(corpusDir)
    .filter((name) => name.endsWith('.bin'))
    .map((name) =>
      [...readFileSync(join(corpusDir, name))]
        .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
        .join(' '),
    );
}

const haystacks = [
  ...specHaystacks(readFileSync(specPath, 'utf8')),
  ...corpusHaystacks(),
];
const found = (needle: string) =>
  haystacks.some((hay) => ` ${hay} `.includes(` ${needle} `));

const errors: string[] = [];
let checked = 0;

/** `<Bytes ... />` blocks of an MDX file: each `fields: [...]` is a row. */
function checkMdx(file: string) {
  const text = readFileSync(file, 'utf8');
  for (const block of text.matchAll(/<Bytes\b([\s\S]*?)\/>\n/g)) {
    for (const row of block[1].split(/fields:\s*\[/).slice(1)) {
      const hex = [...row.matchAll(/hex:\s*'([^']*)'/g)].map((m) => m[1]);
      if (hex.length === 0) continue;
      const needle = tokens(hex.join(' ')).flat().join(' ');
      checked++;
      if (!found(needle)) errors.push(`${relative(root, file)}: ${needle}`);
    }
  }
}

function walk(dir: string) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.name.endsWith('.mdx')) checkMdx(path);
  }
}
walk(join(root, 'content', 'docs', 'v4'));

interface Field {
  hex: string;
}
const examples = JSON.parse(
  readFileSync(join(root, 'src', 'data', 'byte-examples.json'), 'utf8'),
) as {
  examples: {
    id: string;
    rows?: { fields: Field[] }[];
    strings?: { value: string; def: Field[]; utf8: Field[] }[];
  }[];
};
for (const example of examples.examples) {
  const rows: [string, Field[]][] = [
    ...(example.rows ?? []).map((row, i): [string, Field[]] => [
      `row ${i + 1}`,
      row.fields,
    ]),
    ...(example.strings ?? []).flatMap((s): [string, Field[]][] => [
      [`${s.value} default`, s.def],
      [`${s.value} utf8`, s.utf8],
    ]),
  ];
  for (const [name, fields] of rows) {
    const needle = tokens(fields.map((f) => f.hex).join(' '))
      .flat()
      .join(' ');
    checked++;
    if (!found(needle))
      errors.push(`byte-examples.json ${example.id} ${name}: ${needle}`);
  }
}

if (errors.length > 0) {
  console.error(
    `${errors.join('\n')}\n\n${errors.length} row(s) whose bytes appear in no dump of ${relative(root, specPath)} nor in the corpus`,
  );
  process.exit(1);
}
console.log(
  `Checked ${checked} byte rows against ${relative(root, specPath)} and the corpus: all found.`,
);

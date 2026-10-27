/**
 * Compiles every C# fence of the v4 docs against the current Nino source, so
 * an example a reader copies cannot drift from the API.
 *
 * - English pages (content/docs/v4/**\/*.mdx): each page becomes one C# file in
 *   scripts/csharp-check/Generated/. Type declarations go into a namespace of
 *   their own per page (Docs.Page_<path>), statements into a method, and
 *   members (fields, methods without a class) into a class per fence. Each
 *   fence's class derives from the page's `Snippets` class, where
 *   scripts/csharp-check/Context/<page>.cs declares what the page leaves to the
 *   reader (an `order` to serialize, an `app` to map routes on). `#line`
 *   directives map every diagnostic back to the page and line.
 * - A fence that declares a type an earlier fence of its page declared (a
 *   before and after, two tabs) gets a nested namespace, so it shadows the
 *   first one instead of clashing with it.
 * - Chinese pages (*.zh.mdx) must hold the same fences as their English page,
 *   line by line once comments are removed (they translate only comments):
 *   cheaper than compiling them twice, and it catches a fix made to one
 *   language only.
 *
 * Markers in the fence's meta (kept out of the rendered page by Fumadocs,
 * which only reads `title`, `tab`, `noCopy` and `lineNumbers`):
 *   ```csharp nocheck              not compiled: a signature listing, pseudo-code
 *                                  or an excerpt (say why in the prose)
 *   ```csharp expect="NINO019"     must report NINO019 (one or more ids,
 *                                  comma-separated), and may report nothing else
 *
 * The build fails on any error, any NINO warning a fence does not expect, and
 * any use of an obsolete API (CS0612, CS0618).
 *
 *   bun run check:csharp                       # Nino from $NINO_DIR, else ../Nino
 *   bun scripts/check-csharp.ts --nino <dir>   # a Nino checkout
 *   bun scripts/check-csharp.ts --generate     # write the C# files only
 */
import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const docsDir = join(root, 'content/docs/v4');
const projectDir = join(root, 'scripts/csharp-check');
const generatedDir = join(projectDir, 'Generated');
const contextDir = join(projectDir, 'Context');

type Fence = {
  file: string; // absolute path of the page
  line: number; // 1-based line of the first code line
  meta: string;
  code: string[];
};

type Marker = { nocheck: boolean; expect: string[] };

function markerOf(meta: string): Marker {
  const expect = /(?:^|\s)expect="([^"]*)"/.exec(meta)?.[1];
  return {
    nocheck: /(?:^|\s)nocheck(?:\s|$)/.test(meta),
    expect: expect ? expect.split(',').map((id) => id.trim()) : [],
  };
}

function pages(dir: string, zh: boolean): string[] {
  return readdirSync(dir)
    .flatMap((name) => {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) return pages(path, zh);
      if (!name.endsWith('.mdx')) return [];
      return name.endsWith('.zh.mdx') === zh ? [path] : [];
    })
    .sort();
}

function fencesOf(file: string): Fence[] {
  const lines = readFileSync(file, 'utf8').split('\n');
  const fences: Fence[] = [];
  for (let i = 0; i < lines.length; i++) {
    const open = /^(\s*)(`{3,})(csharp|cs|c#)(?:\s+(.*))?$/.exec(lines[i]);
    if (!open) {
      // skip fences of other languages, so their content is never taken for a C# fence
      const other = /^\s*(`{3,})\S*/.exec(lines[i]);
      if (other) {
        const close = new RegExp(`^\\s*${other[1]}\\s*$`);
        while (++i < lines.length && !close.test(lines[i]));
      }
      continue;
    }
    const indent = open[1].length;
    const close = new RegExp(`^\\s*${open[2]}\\s*$`);
    const code: string[] = [];
    const line = i + 2;
    while (++i < lines.length && !close.test(lines[i]))
      code.push(
        lines[i].slice(
          Math.min(indent, /^\s*/.exec(lines[i])?.[0].length ?? 0),
        ),
      );
    fences.push({ file, line, meta: open[4] ?? '', code });
  }
  return fences;
}

/** Removes Shiki's notation comments (`// [!code highlight]`). */
function stripNotation(line: string): string {
  return line
    .replace(/\s*\/\/\s*\[!code [^\]]*\]\s*$/, '')
    .replace(/\s*\/\*\s*\[!code [^\]]*\]\s*\*\//g, '');
}

/**
 * Scans C# text: calls `onCode` with each character outside comments, strings
 * and character literals, and returns the text with comments removed.
 */
function scan(
  text: string,
  onCode?: (ch: string, index: number) => void,
): string {
  let out = '';
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    const next = text[i + 1];
    if (ch === '/' && next === '/') {
      while (i < text.length && text[i] !== '\n') i++;
      continue;
    }
    if (ch === '/' && next === '*') {
      const end = text.indexOf('*/', i + 2);
      i = end < 0 ? text.length : end + 2;
      out += ' ';
      continue;
    }
    if (
      ch === '"' ||
      ch === "'" ||
      ((ch === '$' || ch === '@') &&
        (next === '"' || next === '$' || next === '@'))
    ) {
      const start = i;
      let verbatim = false;
      while (text[i] === '$' || text[i] === '@') {
        if (text[i] === '@') verbatim = true;
        i++;
      }
      const quote = text[i];
      if (quote !== '"' && quote !== "'") {
        out += text.slice(start, i);
        continue;
      }
      if (text.startsWith('"""', i)) {
        const end = text.indexOf('"""', i + 3);
        i = end < 0 ? text.length : end + 3;
        out += text.slice(start, i);
        continue;
      }
      i++;
      while (i < text.length) {
        if (!verbatim && text[i] === '\\') i += 2;
        else if (verbatim && text[i] === '"' && text[i + 1] === '"') i += 2;
        else if (text[i] === quote || (!verbatim && text[i] === '\n')) break;
        else i++;
      }
      i++;
      out += text.slice(start, i);
      continue;
    }
    onCode?.(ch, i);
    out += ch;
    i++;
  }
  return out;
}

/** The code of a line without its comments and trailing spaces. */
function codeOnly(line: string): string {
  return scan(line).trimEnd();
}

type Chunk = {
  kind: 'using' | 'namespace' | 'assembly' | 'type' | 'member' | 'statement';
  start: number;
  end: number;
};

const modifiers =
  /^(public|private|protected|internal|static|readonly|override|virtual|abstract|sealed|const|async|unsafe|extern|partial|new|volatile)\b/;
const typeKeyword =
  /\b(class|struct|interface|enum|record(\s+(struct|class))?|delegate)\s+[A-Za-z_@]\w*/;

function headOf(
  lines: string[],
  start: number,
  end: number,
): { head: string; attributed: boolean; assembly: boolean } {
  let attributed = false;
  let assembly = false;
  for (let i = start; i <= end; i++) {
    let text = codeOnly(lines[i]).trim();
    if (text === '') continue;
    // attributes before the declaration, alone on their line or before it
    while (text.startsWith('[')) {
      let depth = 0;
      let j = 0;
      for (; j < text.length; j++) {
        if (text[j] === '[') depth++;
        else if (text[j] === ']' && --depth === 0) break;
      }
      if (j >= text.length) break;
      if (/^\[\s*assembly\s*:/.test(text)) assembly = true;
      attributed = true;
      text = text.slice(j + 1).trim();
    }
    if (text === '') continue;
    return { head: text, attributed, assembly };
  }
  return { head: '', attributed, assembly };
}

/** Splits a fence into top-level chunks: usings, types, members and statements. */
function chunksOf(lines: string[]): Chunk[] {
  const text = lines.join('\n');
  const lineStarts = [0];
  for (let i = 0; i < text.length; i++)
    if (text[i] === '\n') lineStarts.push(i + 1);
  const depthAtLineEnd: number[] = new Array(lines.length).fill(0);
  let depth = 0;
  let line = 0;
  scan(text, (ch, index) => {
    while (line + 1 < lineStarts.length && lineStarts[line + 1] <= index)
      line++;
    if (ch === '{' || ch === '(' || ch === '[') depth++;
    else if (ch === '}' || ch === ')' || ch === ']') depth--;
    depthAtLineEnd[line] = depth;
  });
  // carry the depth over lines with no code
  let carried = 0;
  for (let i = 0; i < lines.length; i++) {
    if (codeOnly(lines[i]).trim() === '') depthAtLineEnd[i] = carried;
    carried = depthAtLineEnd[i];
  }

  const chunks: Chunk[] = [];
  let start = 0;
  for (let i = 0; i < lines.length; i++) {
    const code = codeOnly(lines[i]).trim();
    if (code === '' || depthAtLineEnd[i] !== 0) continue;
    // an assembly attribute is a chunk of its own
    if (/^\[\s*assembly\s*:.*\]$/.test(code)) {
      if (start < i) chunks.push({ kind: 'statement', start, end: i - 1 });
      chunks.push({ kind: 'statement', start: i, end: i });
      start = i + 1;
      continue;
    }
    if (!/[;}]$/.test(code)) continue;
    let next = i + 1;
    while (next < lines.length && codeOnly(lines[next]).trim() === '') next++;
    const following = next < lines.length ? codeOnly(lines[next]).trim() : '';
    if (
      /^(else|catch|finally|while\s*\(.*\)\s*;|\.|\?|:|=>|where\b)/.test(
        following,
      ) &&
      !code.endsWith(';')
    )
      continue;
    if (/^(\.|\?\?|=>)/.test(following)) continue;
    chunks.push({ kind: 'statement', start, end: i });
    start = i + 1;
  }
  if (
    start < lines.length &&
    lines.slice(start).some((l) => codeOnly(l).trim() !== '')
  )
    chunks.push({ kind: 'statement', start, end: lines.length - 1 });

  for (const chunk of chunks) {
    const { head, attributed, assembly } = headOf(
      lines,
      chunk.start,
      chunk.end,
    );
    if (assembly && head === '') chunk.kind = 'assembly';
    else if (
      /^using\s+(static\s+)?[\w.]+\s*;$/.test(head) ||
      /^using\s+\w+\s*=\s*[\w.:<>, ]+;$/.test(head)
    )
      chunk.kind = 'using';
    else if (/^namespace\s+[\w.]+\s*;$/.test(head)) chunk.kind = 'namespace';
    else if (/^namespace\s/.test(head)) chunk.kind = 'type';
    else {
      const signature = head.split(/[=({]/)[0];
      if (
        typeKeyword.test(signature) &&
        !/^(var|new|return|await|using)\b/.test(head)
      )
        chunk.kind = 'type';
      else if (
        (modifiers.test(head) && !/^unsafe\s*(\{|$)/.test(head)) ||
        attributed
      )
        chunk.kind = 'member';
    }
  }
  return chunks;
}

type Declared = { name: string; partial: boolean; generic: boolean };

function declaredTypes(lines: string[], chunks: Chunk[]): Declared[] {
  const types: Declared[] = [];
  for (const chunk of chunks) {
    if (chunk.kind !== 'type') continue;
    const { head } = headOf(lines, chunk.start, chunk.end);
    const match = typeKeyword.exec(head.split(/[=({]/)[0]);
    if (match)
      types.push({
        name: match[0].split(/\s+/).pop() as string,
        partial: /\bpartial\b/.test(head),
        generic: head
          .slice((match.index ?? 0) + match[0].length)
          .trimStart()
          .startsWith('<'),
      });
  }
  return types;
}

/** The using directives at the top of the page's Context file: they apply to the page's fences too. */
function contextUsings(name: string): string[] {
  const file = join(contextDir, `${name}.cs`);
  if (!existsSync(file)) return [];
  const usings: string[] = [];
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    if (/^\s*namespace\b/.test(line)) break;
    if (/^\s*using\s+[^(]+;\s*$/.test(line) && !/^\s*global\b/.test(line))
      usings.push(line.trim());
  }
  return usings;
}

function namespaceOf(page: string): string {
  return `Docs.Page_${relative(docsDir, page)
    .replace(/\.mdx$/, '')
    .replace(/[^A-Za-z0-9]+/g, '_')}`;
}

/** The C# file of one page. */
function generate(page: string, name: string, fences: Fence[]): string {
  const ns = namespaceOf(page);
  const out: string[] = [
    // not marked auto-generated: analyzers skip generated code, and the NINO rules must see the fences
    '// Written by scripts/check-csharp.ts from the page below: edit the page, not this file.',
    `// ${relative(root, page)}`,
    '#nullable disable',
    '#pragma warning disable CS0105, CS0108, CS0114, CS0162, CS0168, CS0169, CS0219, CS0414, CS0649, CS1998, CS4014, CS8321',
  ];
  const assembly: string[] = [];
  const body: string[] = [];
  const declared = new Map<string, boolean>();
  const usedNamespaces = new Set<string>([ns]);
  const aliases: string[] = [];

  const emit = (
    target: string[],
    fence: Fence,
    lines: string[],
    from: number,
    to: number,
  ) => {
    for (let i = from; i <= to; i++) {
      target.push(`#line ${fence.line + i} "${fence.file}"`);
      target.push(lines[i]);
    }
    target.push('#line default');
  };

  for (const fence of fences) {
    const marker = markerOf(fence.meta);
    if (marker.nocheck) continue;
    const lines = fence.code.map(stripNotation);
    const chunks = chunksOf(lines);
    // a partial declaration adds to an earlier partial one; anything else redeclares the type
    const types = declaredTypes(lines, chunks);
    const isolated = types.some(
      ({ name, partial }) =>
        declared.has(name) && !(partial && declared.get(name)),
    );
    const fenceNs = isolated ? `${ns}.L${fence.line}` : ns;
    for (const { name, partial, generic } of types) {
      if (declared.has(name)) continue;
      declared.set(name, partial);
      // a type the page declares first in an isolated fence is still the page's
      if (isolated && !generic)
        aliases.push(`using ${name} = ${fenceNs}.${name};`);
    }

    body.push(
      '',
      `// ${relative(root, fence.file)}:${fence.line}`,
      `namespace ${fenceNs}`,
      '{',
    );
    for (const chunk of chunks.filter((c) => c.kind === 'using'))
      emit(body, fence, lines, chunk.start, chunk.end);
    for (const chunk of chunks.filter((c) => c.kind === 'assembly'))
      emit(assembly, fence, lines, chunk.start, chunk.end);
    const fileNamespace = chunks.find((c) => c.kind === 'namespace');
    if (fileNamespace) {
      const name = /namespace\s+([\w.]+)/.exec(
        lines.slice(fileNamespace.start, fileNamespace.end + 1).join(' '),
      )?.[1];
      body.push(`namespace ${name}`, '{');
      usedNamespaces.add(`${fenceNs}.${name}`);
    }
    for (const chunk of chunks.filter((c) => c.kind === 'type'))
      emit(body, fence, lines, chunk.start, chunk.end);
    const members = chunks.filter((c) => c.kind === 'member');
    const statements = chunks.filter((c) => c.kind === 'statement');
    if (members.length > 0 || statements.length > 0) {
      body.push(
        `public class Fence_L${fence.line} : global::${ns}.Snippets`,
        '{',
      );
      for (const chunk of members)
        emit(body, fence, lines, chunk.start, chunk.end);
      if (statements.length > 0) {
        const code = statements
          .map((c) => lines.slice(c.start, c.end + 1).join('\n'))
          .join('\n');
        const awaits = /\bawait\b/.test(scan(code));
        body.push(
          awaits ? 'public async Task Run()' : 'public void Run()',
          '{',
        );
        for (const chunk of statements)
          emit(body, fence, lines, chunk.start, chunk.end);
        body.push('}');
      }
      body.push('}');
    }
    if (fileNamespace) body.push('}');
    body.push('}');
  }

  // the page's context class, which Context/<page>.cs extends
  body.push(
    '',
    `namespace ${ns}`,
    '{',
    'public partial class Snippets { }',
    '}',
  );
  for (const used of usedNamespaces) out.push(`using ${used};`);
  // what Context/<page>.cs declares is in scope everywhere on the page, in the types the fences declare too
  out.push(`using static ${ns}.Snippets;`, ...aliases);
  out.push(...contextUsings(name));
  return [...out, ...assembly, ...body, ''].join('\n');
}

/** The fence without comments, notation and trailing spaces, for comparing the languages. */
function normalized(fence: Fence): string {
  return scan(fence.code.map(stripNotation).join('\n'))
    .split('\n')
    .map((l) => l.trimEnd())
    .filter((l) => l.trim() !== '')
    .join('\n');
}

function checkChinese(english: string[]): string[] {
  const errors: string[] = [];
  for (const page of english) {
    const zh = page.replace(/\.mdx$/, '.zh.mdx');
    if (!existsSync(zh)) continue;
    const en = fencesOf(page);
    const cn = fencesOf(zh);
    if (en.length !== cn.length) {
      errors.push(
        `${relative(root, zh)}: ${cn.length} C# fences, ${relative(root, page)} has ${en.length}`,
      );
      continue;
    }
    en.forEach((fence, i) => {
      const other = cn[i];
      const sameMarker =
        JSON.stringify(markerOf(fence.meta)) ===
        JSON.stringify(markerOf(other.meta));
      if (normalized(fence) !== normalized(other) || !sameMarker)
        errors.push(
          `${relative(root, zh)}:${other.line}: differs from ${relative(root, page)}:${fence.line} beyond comments`,
        );
    });
  }
  return errors;
}

function ninoDir(): string {
  const arg = process.argv.indexOf('--nino');
  const dir =
    arg >= 0
      ? process.argv[arg + 1]
      : (process.env.NINO_DIR ?? join(root, '../Nino'));
  const resolved = resolve(dir);
  if (!existsSync(join(resolved, 'build/UseNinoGenerator.props'))) {
    console.error(
      `No Nino checkout at ${resolved}: pass --nino <dir> or set NINO_DIR.`,
    );
    process.exit(2);
  }
  return resolved;
}

function main() {
  const english = pages(docsDir, false);
  const errors = checkChinese(english);

  rmSync(generatedDir, { recursive: true, force: true });
  mkdirSync(generatedDir, { recursive: true });
  const fences = new Map<string, Fence[]>();
  let compiled = 0;
  let skipped = 0;
  for (const page of english) {
    const list = fencesOf(page);
    if (list.length === 0) continue;
    fences.set(page, list);
    for (const fence of list)
      markerOf(fence.meta).nocheck ? skipped++ : compiled++;
    const name = relative(docsDir, page)
      .replace(/\.mdx$/, '')
      .replace(/[\\/]/g, '.');
    writeFileSync(join(generatedDir, `${name}.cs`), generate(page, name, list));
  }
  console.log(
    `${compiled} C# fences to compile, ${skipped} marked nocheck, in ${fences.size} pages`,
  );
  if (process.argv.includes('--generate')) return;

  const nino = ninoDir();
  const build = spawnSync(
    'dotnet',
    [
      'build',
      join(projectDir, 'DocsCheck.csproj'),
      `-p:NinoDir=${nino}`,
      '-nologo',
      '-clp:NoSummary;ForceNoAlign',
      '-v:q',
      '-p:TreatWarningsAsErrors=false',
      '-p:ContinuousIntegrationBuild=false',
    ],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
  );
  const output = `${build.stdout ?? ''}${build.stderr ?? ''}`;

  type Diagnostic = {
    file: string;
    line: number;
    severity: string;
    id: string;
    message: string;
  };
  const diagnostics = new Map<string, Diagnostic>();
  for (const raw of output.split('\n')) {
    const match =
      /^(.*?)\((\d+),\d+(?:,\d+,\d+)?\): (error|warning) ([A-Z]+\d+): (.*?)(?: \[[^\]]*\])?$/.exec(
        raw.trim(),
      );
    if (!match) continue;
    const [, file, line, severity, id, message] = match;
    const diagnostic = { file, line: Number(line), severity, id, message };
    diagnostics.set(`${file}:${line}:${id}:${message}`, diagnostic);
  }

  const fenceAt = (file: string, line: number) =>
    fences
      .get(resolve(file))
      ?.find((f) => line >= f.line && line < f.line + f.code.length);
  const seen = new Set<Fence>();
  for (const d of diagnostics.values()) {
    const fence = fenceAt(d.file, d.line);
    const expected = fence ? markerOf(fence.meta).expect : [];
    if (fence && expected.includes(d.id)) {
      seen.add(fence);
      continue;
    }
    const counts =
      d.severity === 'error' ||
      d.id.startsWith('NINO') ||
      d.id === 'CS0612' ||
      d.id === 'CS0618';
    if (!counts) continue;
    const where =
      fence || d.file.endsWith('.mdx')
        ? `${relative(root, d.file)}:${d.line}`
        : d.file;
    errors.push(`${where}: ${d.severity} ${d.id}: ${d.message}`);
  }
  for (const list of fences.values())
    for (const fence of list) {
      const { expect, nocheck } = markerOf(fence.meta);
      if (!nocheck && expect.length > 0 && !seen.has(fence))
        errors.push(
          `${relative(root, fence.file)}:${fence.line}: expected ${expect.join(', ')}, the compiler reported none`,
        );
    }
  if (build.status !== 0 && errors.length === 0) {
    // a failure the parser above did not attribute (restore, a missing project)
    console.error(output);
    errors.push(`dotnet build failed with exit code ${build.status}`);
  }

  if (errors.length > 0) {
    for (const error of errors) console.error(error);
    console.error(`\n${errors.length} problem(s) in the C# fences.`);
    if ([...diagnostics.values()].some((d) => d.severity === 'error'))
      console.error(
        'The compiler runs no analyzer while there are errors: fix them, then look again for NINO warnings.',
      );
    process.exit(1);
  }
  console.log(
    'Every checked C# fence compiles against Nino, with no NINO warning.',
  );
}

main();

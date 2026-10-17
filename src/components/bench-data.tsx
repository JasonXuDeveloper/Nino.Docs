/**
 * MDX components that print the v4 runtime benchmarks from src/lib/benchmarks.ts
 * (synced from the release report), so no page types those numbers in.
 */
import {
  benchRows,
  benchSource,
  extraRuntime,
  formatBytes,
  formatRatio,
  formatTime,
  isOnPar,
  payload,
  type RuntimeCase,
  ratioRange,
  reuse,
  reuseSpeedup,
  runtime,
  sourceNote,
} from '@/lib/benchmarks';
import type { Locale } from '@/lib/i18n';

type Op = 'serialize' | 'deserialize';

function caseName(row: RuntimeCase, zh: boolean) {
  const name = zh && row.zh ? row.zh : row.name;
  return row.code ? <code>{name}</code> : name;
}

function ratioCell(
  ratio: number | undefined,
  zh: boolean,
  against: string,
  tooFast?: boolean,
) {
  if (tooFast)
    return (
      <>
        <strong>{zh ? '更快' : 'faster'}</strong>
        {zh ? '（快到测不出）' : ' (too fast to measure)'}
      </>
    );
  if (ratio === undefined) return zh ? '持平' : 'on par';
  const r = ratio.toFixed(2);
  if (ratio > 1) return <strong>{zh ? `快 ${r} 倍` : `${r}× faster`}</strong>;
  return zh ? `${r} 倍（${against} 更快）` : `${r}× (${against} faster)`;
}

/** Where the numbers come from, with a link to the release or the local report */
export function BenchSource({ lang = 'en' }: { lang?: Locale }) {
  const zh = lang === 'zh';
  return (
    <p className="text-sm text-fd-muted-foreground">
      <a href={benchSource.url} target="_blank" rel="noopener noreferrer">
        {sourceNote(zh)}
      </a>
    </p>
  );
}

/**
 * v4 vs MemoryPack (and v3, once measured) for one operation. `set="extra"`:
 * reference tracking, version tolerance and fixed-size types, which render only
 * once the synced report includes them (a note says so until then).
 */
export function RuntimeTable({
  op,
  set = 'main',
  lang = 'en',
}: {
  op: Op;
  set?: 'main' | 'extra';
  lang?: Locale;
}) {
  const zh = lang === 'zh';
  const rows = (set === 'extra' ? extraRuntime : runtime)[op];
  if (rows.length === 0)
    return (
      <p className="text-sm text-fd-muted-foreground">
        {zh
          ? '这些用例已经在基准测试项目中，但目前发布的报告还没有包含它们。等某个版本的发布报告包含它们后，结果会显示在这里。'
          : 'These cases are in the benchmark project, but the published report does not include them yet. Their results appear here once a release report does.'}
      </p>
    );
  const withV3 = rows.some((row) => row.vsV3 !== undefined);
  const rerun = rows.some((row) => row.rerun);
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>{zh ? '用例' : 'Case'}</th>
            <th className="text-right">v4</th>
            <th className="text-right">MemoryPack</th>
            <th className="text-right">
              {zh ? 'v4 对比 MemoryPack' : 'v4 vs MemoryPack'}
            </th>
            {withV3 && (
              <th className="text-right">{zh ? 'v4 对比 v3' : 'v4 vs v3'}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <td>
                {caseName(row, zh)}
                {row.rerun && ' *'}
              </td>
              <td className="text-right tabular-nums">{row.v4.text}</td>
              <td className="text-right tabular-nums">{row.memorypack.text}</td>
              <td className="text-right tabular-nums">
                {ratioCell(row.ratio, zh, 'MemoryPack', row.tooFast)}
              </td>
              {withV3 && (
                <td className="text-right tabular-nums">
                  {row.v3TooFast
                    ? ratioCell(undefined, zh, 'v3', true)
                    : row.vsV3 === undefined
                      ? '—'
                      : ratioCell(
                          isOnPar(row.vsV3) ? undefined : row.vsV3,
                          zh,
                          'v3',
                        )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {rerun && (
        <p className="text-sm text-fd-muted-foreground">
          {zh
            ? '* 将 SimpleStruct 声明为 Pack = 4 后，以相同设置单独重跑。'
            : '* Re-run separately with the same settings after SimpleStruct was declared with Pack = 4.'}
        </p>
      )}
    </>
  );
}

/**
 * Reference tracking, version tolerance and fixed-size types: a serialize and
 * a deserialize table once the synced report includes these benchmarks, one
 * note until then. RuntimeTable is called, not rendered as an element, so the
 * Markdown copies (src/lib/markdown.tsx) get the table itself.
 */
export function ExtraRuntimeTables({ lang = 'en' }: { lang?: Locale }) {
  const zh = lang === 'zh';
  if (extraRuntime.serialize.length + extraRuntime.deserialize.length === 0)
    return RuntimeTable({ op: 'serialize', set: 'extra', lang });
  return (
    <>
      {extraRuntime.serialize.length > 0 && (
        <>
          <p>
            <strong>{zh ? '序列化' : 'Serialize'}</strong>
          </p>
          {RuntimeTable({ op: 'serialize', set: 'extra', lang })}
        </>
      )}
      {extraRuntime.deserialize.length > 0 && (
        <>
          <p>
            <strong>{zh ? '反序列化' : 'Deserialize'}</strong>
          </p>
          {RuntimeTable({ op: 'deserialize', set: 'extra', lang })}
        </>
      )}
    </>
  );
}

/** Deserializing into existing objects: Nino new / reusing vs MemoryPack new / overwrite */
export function ReuseTable({ lang = 'en' }: { lang?: Locale }) {
  const zh = lang === 'zh';
  return (
    <table>
      <thead>
        <tr>
          <th>{zh ? '用例' : 'Case'}</th>
          <th className="text-right">{zh ? 'Nino 新建' : 'Nino new'}</th>
          <th className="text-right">{zh ? 'Nino 复用' : 'Nino reusing'}</th>
          <th className="text-right">
            {zh ? 'MemoryPack 新建' : 'MemoryPack new'}
          </th>
          <th className="text-right">
            {zh ? 'MemoryPack 覆盖' : 'MemoryPack overwrite'}
          </th>
        </tr>
      </thead>
      <tbody>
        {reuse.map((row) => {
          const best = reuseSpeedup(row) >= 2;
          const reused = `${row.ninoReuse.text} (${formatBytes(row.ninoReuseBytes)})`;
          return (
            <tr key={row.name}>
              <td>{zh ? row.zh : row.name}</td>
              <td className="text-right tabular-nums">{row.ninoNew.text}</td>
              <td className="text-right tabular-nums">
                {best ? <strong>{reused}</strong> : reused}
              </td>
              <td className="text-right tabular-nums">
                {row.memorypackNew.text}
              </td>
              <td className="text-right tabular-nums">
                {row.memorypackOverwrite.text} (
                {formatBytes(row.memorypackOverwriteBytes)})
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/** Every row of the report, as measured, with the environment */
export function ResultsTable({ lang = 'en' }: { lang?: Locale }) {
  const zh = lang === 'zh';
  const size = (value: number | null) =>
    value === null ? '—' : formatBytes(value);
  // The report prints payloads in KB with two decimals; show them the same way.
  const payloadSize = (value: number | null) =>
    value === null
      ? '—'
      : value < 1024
        ? formatBytes(value)
        : `${(value / 1024).toFixed(2)} KB`;
  return (
    <>
      {/* Called, not rendered as an element, so the Markdown copy (src/lib/markdown.tsx) gets its text instead of a JSX tag */}
      {BenchSource({ lang })}
      {benchSource.environment && (
        <pre className="overflow-x-auto rounded-lg border bg-fd-secondary/50 p-4 text-xs">
          <code>{benchSource.environment}</code>
        </pre>
      )}
      <table>
        <thead>
          <tr>
            <th>{zh ? '方法' : 'Method'}</th>
            <th className="text-right">{zh ? '平均耗时' : 'Mean'}</th>
            <th className="text-right">{zh ? '分配' : 'Allocated'}</th>
            <th className="text-right">{zh ? '载荷' : 'Payload'}</th>
          </tr>
        </thead>
        <tbody>
          {benchRows.map((row) => (
            <tr key={row.method}>
              <td>
                <code>{row.method}</code>
              </td>
              <td className="text-right tabular-nums">
                {formatTime(row.meanNs)}
              </td>
              <td className="text-right tabular-nums">
                {size(row.allocatedBytes)}
              </td>
              <td className="text-right tabular-nums">
                {payloadSize(row.payloadBytes || null)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

/**
 * One number from the data, for prose:
 * serialize.max / serialize.min / deserialize.max / deserialize.min (ratios
 * against MemoryPack), reuse.max (vs MemoryPack's overwrite), payload.v4 /
 * payload.memorypack (bytes for one SimpleClass), or
 * serialize:<case key> / deserialize:<case key> (ratio of one case).
 */
export function BenchValue({ k }: { k: string }) {
  return <>{benchValue(k)}</>;
}

export function benchValue(k: string): string {
  const [op, which] = k.split(/[.:]/) as [string, string];
  if (k === 'reuse.max')
    return formatRatio(Math.max(...reuse.map(reuseSpeedup)));
  if (op === 'payload') {
    const value = which === 'v4' ? payload.v4 : payload.memorypack;
    return value === null ? '—' : value.toLocaleString('en-US');
  }
  if ((op === 'serialize' || op === 'deserialize') && k.includes('.')) {
    const range = ratioRange(op);
    const value = which === 'max' ? range.max : range.min;
    return Number.isFinite(value) ? formatRatio(value) : '—';
  }
  if (op === 'serialize' || op === 'deserialize') {
    const row = runtime[op].find((r) => r.key === which);
    if (!row) return '—';
    return formatRatio(row.ratio ?? 1);
  }
  throw new Error(`Unknown benchmark value: ${k}`);
}

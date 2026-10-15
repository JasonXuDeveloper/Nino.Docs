/**
 * MDX components that print the v4 runtime benchmarks from src/lib/benchmarks.ts
 * (synced from the release report), so no page types those numbers in.
 */
import {
  benchRows,
  benchSource,
  formatBytes,
  formatTime,
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

function ratioCell(ratio: number | undefined, zh: boolean, against: string) {
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

/** v4 vs MemoryPack (and v3, once measured) for one operation */
export function RuntimeTable({ op, lang = 'en' }: { op: Op; lang?: Locale }) {
  const zh = lang === 'zh';
  const rows = runtime[op];
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
                {ratioCell(row.ratio, zh, 'MemoryPack')}
              </td>
              {withV3 && (
                <td className="text-right tabular-nums">
                  {row.vsV3 === undefined
                    ? '—'
                    : ratioCell(
                        Math.abs(row.vsV3 - 1) < 0.05 ? undefined : row.vsV3,
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
          {zh ? '* 以 20 次迭代重新运行。' : '* Re-run with 20 iterations.'}
        </p>
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
  return (
    <>
      <BenchSource lang={lang} />
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
                {size(row.payloadBytes || null)}
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
    return `${Math.max(...reuse.map(reuseSpeedup)).toFixed(1)}×`;
  if (op === 'payload') {
    const value = which === 'v4' ? payload.v4 : payload.memorypack;
    return value === null ? '—' : value.toLocaleString('en-US');
  }
  if ((op === 'serialize' || op === 'deserialize') && k.includes('.')) {
    const range = ratioRange(op);
    const value = which === 'max' ? range.max : range.min;
    return Number.isFinite(value) ? `${value.toFixed(2)}×` : '—';
  }
  if (op === 'serialize' || op === 'deserialize') {
    const row = runtime[op].find((r) => r.key === which);
    if (!row) return '—';
    return row.ratio === undefined ? '1.00×' : `${row.ratio.toFixed(2)}×`;
  }
  throw new Error(`Unknown benchmark value: ${k}`);
}

import { useState } from 'react';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';

/*
 * The bytes Nino writes for one small object, shown next to its source.
 *
 * Produced with Nino 4.0.0-beta.47 (net8.0) and checked against the
 * generated formatter:
 *
 *   var data = new GameData { Score = 4200, PlayerName = "Nino",
 *     LastPlayed = new DateTime(2026, 10, 1, 0, 0, 0, DateTimeKind.Utc) };
 *   NinoSerializer.Serialize(data)
 *   // AB-BC-30-A1-68-10-00-00-04-00-00-00-4E-00-69-00-6E-00-6F-00-00-C0-BD-EF-4E-1F-DF-48
 *
 * Type id (FNV-1a of "GameData"), then the members in declaration order:
 * int, string (char count + UTF-16), DateTime (raw 8 bytes).
 */

type Key = 'type' | 'score' | 'name' | 'date';

interface Line {
  code: string;
  comment?: string;
  key?: Key;
  /** Bytes; a nested array is a dimmed prefix (e.g. a length) */
  bytes?: (string | string[])[];
}

const lines: Line[] = [
  { code: '[NinoType]' },
  {
    code: 'public class GameData',
    key: 'type',
    bytes: ['AB', 'BC', '30', 'A1'],
  },
  { code: '{' },
  {
    code: '  public int Score;',
    comment: '// 4200',
    key: 'score',
    bytes: ['68', '10', '00', '00'],
  },
  {
    code: '  public string PlayerName;',
    comment: '// "Nino"',
    key: 'name',
    bytes: [
      ['04', '00', '00', '00'],
      '4E',
      '00',
      '69',
      '00',
      '6E',
      '00',
      '6F',
      '00',
    ],
  },
  {
    code: '  public DateTime LastPlayed;',
    comment: '// 2026-10-01',
    key: 'date',
    bytes: ['00', 'C0', 'BD', 'EF', '4E', '1F', 'DF', '48'],
  },
  { code: '}' },
];

const total = 28;

const text: Record<
  Locale,
  {
    source: string;
    output: string;
    idle: string;
    explain: Record<Key, string>;
  }
> = {
  en: {
    source: 'GameData.cs',
    output: 'NinoSerializer.Serialize(data)',
    idle: `${total} bytes, with no field names or tags: members are written in declaration order. Select a member to see its bytes.`,
    explain: {
      type: 'Type id, 4 bytes: the FNV-1a hash of "GameData". Deserialization uses it to restore the right subclass.',
      score: 'Score, an int: 4 bytes, little-endian. 0x00001068 is 4200.',
      name: 'PlayerName, a string: the length (4), then the UTF-16 characters of "Nino".',
      date: 'LastPlayed, a DateTime: its 8 bytes copied straight from memory.',
    },
  },
  zh: {
    source: 'GameData.cs',
    output: 'NinoSerializer.Serialize(data)',
    idle: `共 ${total} 字节，不含字段名或标签：成员按声明顺序写入。选择一个成员查看对应的字节。`,
    explain: {
      type: '类型 ID，4 字节：“GameData” 的 FNV-1a 哈希。反序列化时据此还原正确的子类。',
      score: 'Score，int：4 字节，小端序。0x00001068 即 4200。',
      name: 'PlayerName，string：先写长度 4，再写 “Nino” 的 UTF-16 字符。',
      date: 'LastPlayed，DateTime：直接从内存复制 8 字节。',
    },
  },
};

function Bytes({ bytes }: { bytes: (string | string[])[] }) {
  return (
    <span className="flex flex-wrap gap-x-[1ch]">
      {bytes.map((b, i) =>
        Array.isArray(b) ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed data
          <span key={i} className="flex gap-x-[1ch] text-fd-muted-foreground">
            {b.map((x, j) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed data
              <span key={j}>{x}</span>
            ))}
          </span>
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed data
          <span key={i}>{b}</span>
        ),
      )}
    </span>
  );
}

export function ByteMap({
  lang,
  className,
}: {
  lang: Locale;
  className?: string;
}) {
  const t = text[lang];
  const [active, setActive] = useState<Key | null>(null);

  return (
    <figure
      className={cn(
        'nino-bytes overflow-hidden rounded-xl border bg-fd-card text-fd-card-foreground',
        className,
      )}
    >
      <div className="grid grid-cols-1 border-b font-[family-name:var(--font-bytes)] text-[13px] text-fd-muted-foreground md:grid-cols-[calc(46ch+1rem)_minmax(0,1fr)]">
        <span className="px-4 py-2.5 font-sans text-xs">{t.source}</span>
        <span className="hidden border-l py-2.5 pl-5 font-sans text-xs md:block">
          {t.output}
        </span>
      </div>

      <ul
        className="bg-no-repeat py-3 font-[family-name:var(--font-bytes)] text-[13px] leading-6 md:bg-[linear-gradient(var(--color-fd-border),var(--color-fd-border))] md:bg-[length:1px_100%] md:bg-[position:calc(1rem+46ch)_0]"
        onPointerLeave={() => setActive(null)}
      >
        {lines.map((line) => {
          const on = line.key !== undefined && line.key === active;
          const interactive = line.key !== undefined;
          return (
            <li
              key={line.code}
              tabIndex={interactive ? 0 : undefined}
              aria-label={
                line.key
                  ? `${t.explain[line.key]} ${line.bytes?.flat().join(' ')}`
                  : undefined
              }
              onPointerEnter={
                interactive ? () => setActive(line.key ?? null) : undefined
              }
              onFocus={
                interactive ? () => setActive(line.key ?? null) : undefined
              }
              onBlur={() => setActive(null)}
              className={cn(
                'grid grid-cols-1 px-4 outline-none md:pr-4 md:pl-0 md:grid-cols-[calc(46ch+1rem)_minmax(0,1fr)]',
                interactive &&
                  'cursor-default focus-visible:ring-2 focus-visible:ring-fd-ring focus-visible:ring-inset',
                on && 'bg-fd-primary/10',
              )}
            >
              <span className="whitespace-pre md:pl-4">
                {line.code}
                {line.comment && (
                  <span className="hidden text-fd-muted-foreground sm:inline">
                    {'  '}
                    {line.comment}
                  </span>
                )}
              </span>
              {line.bytes && (
                <span
                  className={cn(
                    'pb-1 pl-[4ch] md:pb-0 md:pl-5',
                    on ? 'text-fd-primary' : 'text-fd-foreground',
                  )}
                >
                  <Bytes bytes={line.bytes} />
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <figcaption
        aria-live="polite"
        className="min-h-[4.5rem] border-t px-4 py-3 text-sm text-fd-muted-foreground"
      >
        {active ? t.explain[active] : t.idle}
      </figcaption>
    </figure>
  );
}

/**
 * Byte-layout figures and support matrices: the two places the site's small
 * category palette (app/app.css, `--nino-cat-*`) is allowed (AGENTS.md, Style).
 * Both are static (prerendered, no client code) and have a Markdown form in
 * src/lib/markdown.tsx.
 */
import { Check, Minus, TriangleAlert, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * What a run of bytes is. Each kind has one colour on every page: a header or
 * presence byte, a length or count, a type id or key, the value itself,
 * padding (hatched), and `changed`: the bytes a comparison is about (a member
 * one version adds, bytes another reader misreads).
 */
export type ByteKind = 'header' | 'length' | 'id' | 'value' | 'pad' | 'changed';

export interface ByteField {
  /** The bytes in hex, separated by spaces: `"03 E9 00"`. */
  hex: string;
  kind: ByteKind;
  /** What the bytes are, under them. */
  label: ReactNode;
}

export interface ByteRow {
  /** The row's name, before it (`"Default"`, `"v1"`). */
  title?: ReactNode;
  fields: ByteField[];
}

const kindClass: Record<ByteKind, string> = {
  header: 'bg-(--nino-cat-1)',
  length: 'bg-(--nino-cat-2)',
  id: 'bg-(--nino-cat-3)',
  value: 'bg-(--nino-cat-4)',
  pad: 'nino-pad text-fd-muted-foreground',
  changed: 'bg-(--nino-cat-5)',
};

export function byteCells(hex: string) {
  return hex.trim().split(/\s+/).filter(Boolean);
}

/**
 * Rows of bytes, each field tinted by its kind and labelled under its bytes.
 * Stack rows to compare two encodings or two versions of a type.
 */
export function Bytes({
  rows,
  caption,
}: {
  rows: ByteRow[];
  caption?: ReactNode;
  /**
   * Why these bytes are derived from the specification's rules instead of
   * copied from one of its dumps or the corpus: `bun run check:bytes` then
   * lists the figure instead of failing it.
   */
  derived?: string;
}) {
  return (
    <figure className="not-prose my-6 flex flex-col gap-4">
      {rows.map((row, r) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: static figure
          key={r}
          className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-3"
        >
          {row.title ? (
            <div className="shrink-0 pt-1 text-xs font-medium text-fd-muted-foreground sm:w-40">
              {row.title}
            </div>
          ) : null}
          <div className="flex flex-wrap gap-x-1.5 gap-y-2">
            {row.fields.map((field, f) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: static figure
                key={f}
                className="flex min-w-0 flex-col gap-1"
              >
                <div className="flex">
                  {byteCells(field.hex).map((cell, c) => (
                    <span
                      // biome-ignore lint/suspicious/noArrayIndexKey: static figure
                      key={c}
                      className={cn(
                        'border-fd-border border-y border-r px-1 py-0.5 font-mono text-[0.8rem] leading-5 first:rounded-l first:border-l last:rounded-r',
                        kindClass[field.kind],
                      )}
                    >
                      {cell}
                    </span>
                  ))}
                </div>
                <div className="max-w-56 text-xs leading-snug text-fd-muted-foreground">
                  {field.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {caption ? (
        <figcaption className="text-sm text-fd-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/**
 * A matrix cell: `yes`, `no`, `partial` or `n/a`, optionally followed by
 * `: a short note` (`"partial: .NET 8+ only"`), or a pair of the mark and a
 * note with markup (`['yes', <>a <code>[NinoUtf8]</code> member</>]`); any
 * other text or markup is shown as it is.
 */
export type Cell = string | [string, ReactNode] | ReactNode;

/** A matrix row, or a group heading across the matrix (`{ group: 'Platforms' }`). */
export type MatrixRow =
  | { label: ReactNode; cells: Cell[] }
  | { group: ReactNode };

export function parseCell(cell: Cell): { mark?: string; note?: ReactNode } {
  if (Array.isArray(cell)) return { mark: cell[0], note: cell[1] };
  if (typeof cell !== 'string') return { note: cell };
  const match = /^(yes|no|partial|n\/a)(?::\s*(.*))?$/s.exec(cell.trim());
  if (!match) return { note: cell };
  return { mark: match[1], note: match[2] };
}

const marks: Record<string, { icon: ReactNode; className: string }> = {
  yes: {
    icon: <Check className="size-4" aria-label="yes" />,
    className: 'bg-(--nino-cat-2)',
  },
  no: {
    icon: <X className="size-4" aria-label="no" />,
    className: 'bg-(--nino-cat-5)',
  },
  partial: {
    icon: <TriangleAlert className="size-4" aria-label="partly" />,
    className: 'bg-(--nino-cat-4)',
  },
  'n/a': {
    icon: <Minus className="size-4" aria-label="not applicable" />,
    className: 'text-fd-muted-foreground',
  },
};

/**
 * A support matrix: rows of features or types against columns of runtimes or
 * libraries, each cell a mark (yes, no, partly) with an optional short note.
 */
export function Matrix({
  columns,
  rows,
  corner,
}: {
  columns: ReactNode[];
  rows: MatrixRow[];
  corner?: ReactNode;
}) {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-lg border border-fd-border">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-fd-card">
            <th className="sticky left-0 bg-fd-card px-3 py-2 text-left font-medium">
              {corner}
            </th>
            {columns.map((column, i) => (
              <th
                // biome-ignore lint/suspicious/noArrayIndexKey: static table
                key={i}
                className="px-3 py-2 text-left font-medium"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) =>
            'group' in row ? (
              <tr
                // biome-ignore lint/suspicious/noArrayIndexKey: static table
                key={r}
                className="border-t border-fd-border bg-fd-card"
              >
                <th
                  colSpan={columns.length + 1}
                  className="px-3 py-1.5 text-left text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground"
                >
                  {row.group}
                </th>
              </tr>
            ) : (
              <tr
                // biome-ignore lint/suspicious/noArrayIndexKey: static table
                key={r}
                className="border-t border-fd-border"
              >
                <th className="sticky left-0 bg-fd-background px-3 py-2 text-left align-top font-normal">
                  {row.label}
                </th>
                {row.cells.map((cell, c) => {
                  const { mark, note } = parseCell(cell);
                  const style = mark ? marks[mark] : undefined;
                  return (
                    <td
                      // biome-ignore lint/suspicious/noArrayIndexKey: static table
                      key={c}
                      className="px-3 py-2 align-top"
                    >
                      <div className="flex items-start gap-2">
                        {style ? (
                          <span
                            className={cn(
                              'mt-0.5 inline-flex shrink-0 rounded p-0.5',
                              style.className,
                            )}
                          >
                            {style.icon}
                          </span>
                        ) : null}
                        {note ? (
                          <span className="text-fd-muted-foreground">
                            {note}
                          </span>
                        ) : null}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}

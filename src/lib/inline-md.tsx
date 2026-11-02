/**
 * Inline Markdown in data files (src/data/*.json): `code`, [links](href) and
 * **bold**, nothing else. The page renders it as React; the Markdown copies
 * (src/lib/markdown.tsx) use the source text as it is.
 */
import type { ReactNode } from 'react';

const token = /`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;

export function inlineMd(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(token)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    if (m[1] !== undefined) out.push(<code key={at}>{m[1]}</code>);
    else if (m[2] !== undefined)
      out.push(
        <a key={at} href={m[3]}>
          {inlineMd(m[2])}
        </a>,
      );
    else out.push(<strong key={at}>{inlineMd(m[4])}</strong>);
    last = at + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** The plain text of inline Markdown, for search and filtering. */
export function inlineText(text: string) {
  return text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*]/g, '')
    .toLowerCase();
}

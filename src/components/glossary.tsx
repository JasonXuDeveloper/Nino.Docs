/**
 * The glossary (src/data/glossary.json, English and Chinese): `<Glossary>`
 * lists every term on the glossary page, `<Term id="raw">raw</Term>` marks a
 * word in prose and shows its definition in a popover: on hover with a mouse,
 * on tap, and with Enter or Space after tabbing to it (Escape closes). The
 * Markdown copies (src/lib/markdown.tsx) link the word to its glossary entry.
 * Use a Term once per page, where the word is first used; pass `lang="zh"` on
 * Chinese pages.
 */
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'fumadocs-ui/components/ui/popover';
import { type PointerEvent, type ReactNode, useRef, useState } from 'react';
import data from '@/data/glossary.json';
import type { Locale } from '@/lib/i18n';
import { inlineMd } from '@/lib/inline-md';

export interface GlossaryTerm {
  id: string;
  en: { term: string; definition: string };
  zh: { term: string; definition: string };
}

export const glossary = data.terms as GlossaryTerm[];

export function glossaryHref(id: string, lang: Locale) {
  return `/${lang}/docs/v4/glossary#${id}`;
}

function find(id: string) {
  const term = glossary.find((t) => t.id === id);
  if (!term) throw new Error(`Unknown glossary term "${id}"`);
  return term;
}

export function Glossary({ lang = 'en' }: { lang?: Locale }) {
  return (
    <dl className="not-prose my-6 divide-y divide-fd-border rounded-lg border border-fd-border">
      {glossary.map((t) => (
        <div
          key={t.id}
          id={t.id}
          className="scroll-mt-24 px-4 py-3 target:bg-fd-primary/10 sm:grid sm:grid-cols-[11rem_1fr] sm:gap-4"
        >
          <dt className="font-medium">
            <a href={`#${t.id}`} className="no-underline hover:underline">
              {t[lang].term}
            </a>
          </dt>
          <dd className="mt-1 text-sm text-fd-muted-foreground sm:mt-0 [&_a]:text-fd-foreground [&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded [&_code]:bg-fd-muted [&_code]:px-1 [&_code]:text-[0.85em]">
            {inlineMd(t[lang].definition)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function Term({
  id,
  lang,
  children,
}: {
  id: string;
  lang?: Locale;
  children: ReactNode;
}) {
  const term = find(id);
  const locale: Locale = lang ?? 'en';
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hover = (next: boolean) => (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(next), next ? 150 : 200);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onPointerEnter={hover(true)}
          onPointerLeave={hover(false)}
          className="cursor-help underline decoration-fd-muted-foreground decoration-dotted underline-offset-4 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-fd-primary"
        >
          {children}
        </button>
      </PopoverTrigger>
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onPointerEnter={hover(true)}
        onPointerLeave={hover(false)}
        className="max-w-80 p-3 text-sm leading-relaxed [&_code]:rounded [&_code]:bg-fd-muted [&_code]:px-1 [&_code]:text-[0.85em] [&_a]:underline [&_a]:underline-offset-2"
      >
        <p className="mb-1 font-medium">{term[locale].term}</p>
        <p className="text-fd-muted-foreground">
          {inlineMd(term[locale].definition)}
        </p>
        <a
          href={glossaryHref(id, locale)}
          className="mt-2 inline-block text-xs text-fd-primary"
        >
          {locale === 'zh' ? '术语表' : 'Glossary'} →
        </a>
      </PopoverContent>
    </Popover>
  );
}

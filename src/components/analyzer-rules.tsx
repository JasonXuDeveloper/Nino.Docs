/**
 * The analyzer rules (NINO001-NINO033 and nino-gen's NINOGEN ids) as one
 * filterable list, from src/data/analyzer-rules.json, the single source of the
 * analyzers page and its Markdown copy (src/lib/markdown.tsx). The prerendered
 * HTML holds every rule; filtering only hides rows, so the page reads the same
 * without JavaScript. Each rule's row has the id `nino007`, so
 * `/en/docs/v4/analyzers#nino007` lands on it and highlights it.
 */
import { CircleX, Info, Search, TriangleAlert, Wrench } from 'lucide-react';
import { type ReactNode, useMemo, useState } from 'react';
import data from '@/data/analyzer-rules.json';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';
import { inlineMd, inlineText } from '@/lib/inline-md';

export type Severity = 'error' | 'warning' | 'info';

const severities: readonly Severity[] = ['error', 'warning', 'info'];

export interface AnalyzerRule {
  id: string;
  category: string;
  severity: Severity;
  codeFix: boolean;
  en: { problem: string; fix: string };
  zh: { problem: string; fix: string };
}

export const analyzerRules = data.rules as AnalyzerRule[];
export const analyzerCategories = data.categories as {
  id: string;
  en: string;
  zh: string;
}[];

const diagnosticsUrl =
  'https://github.com/JasonXuDeveloper/Nino/blob/main/docs/diagnostics.md';

/** Where a rule is explained in full. */
export function ruleHref(rule: AnalyzerRule, lang: Locale) {
  return rule.id.startsWith('NINOGEN')
    ? `/${lang}/docs/v4/advanced/codegen#diagnostics`
    : `${diagnosticsUrl}#${rule.id.toLowerCase()}`;
}

export const ruleText = {
  en: {
    head: ['Id', 'Severity', 'Problem', 'What to do', 'Code fix'],
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    all: 'All',
    fixOnly: 'Has a code fix',
    severity: 'Severity',
    category: 'Category',
    search: 'Filter by id or text (e.g. 007, partial)',
    shown: (n: number, total: number) => `${n} of ${total} rules`,
    none: 'No rule matches.',
    fix: 'code fix',
  },
  zh: {
    head: ['编号', '级别', '问题', '怎么改', '代码修复'],
    error: '错误',
    warning: '警告',
    info: '提示',
    all: '全部',
    fixOnly: '有代码修复',
    severity: '级别',
    category: '类别',
    search: '按编号或文字筛选（如 007、partial）',
    shown: (n: number, total: number) => `共 ${total} 条，显示 ${n} 条`,
    none: '没有匹配的规则。',
    fix: '代码修复',
  },
} satisfies Record<Locale, unknown>;

export function SeverityPill({
  severity,
  lang,
}: {
  severity: Severity;
  lang: Locale;
}) {
  const Icon =
    severity === 'error'
      ? CircleX
      : severity === 'warning'
        ? TriangleAlert
        : Info;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        severity === 'error'
          ? 'bg-(--nino-cat-5)'
          : severity === 'warning'
            ? 'bg-(--nino-cat-4)'
            : 'bg-fd-muted',
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {ruleText[lang][severity]}
    </span>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors',
        active
          ? 'border-fd-primary bg-fd-primary/10 text-fd-foreground'
          : 'border-fd-border text-fd-muted-foreground hover:text-fd-foreground',
      )}
    >
      {children}
    </button>
  );
}

export function AnalyzerRules({ lang = 'en' }: { lang?: Locale }) {
  const t = ruleText[lang];
  const [query, setQuery] = useState('');
  const [severity, setSeverity] = useState<Severity | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [fixOnly, setFixOnly] = useState(false);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return new Set(
      analyzerRules
        .filter(
          (rule) =>
            (!severity || rule.severity === severity) &&
            (!category || rule.category === category) &&
            (!fixOnly || rule.codeFix) &&
            (!q ||
              rule.id.toLowerCase().includes(q) ||
              inlineText(`${rule[lang].problem} ${rule[lang].fix}`).includes(
                q,
              )),
        )
        .map((rule) => rule.id),
    );
  }, [query, severity, category, fixOnly, lang]);

  return (
    <div className="not-prose my-6 flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <label className="relative block">
          <span className="sr-only">{t.search}</span>
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-fd-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search}
            className="w-full rounded-lg border border-fd-border bg-fd-background py-2 pl-8 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-fd-primary"
          />
        </label>
        {/* Three groups, each wrapping inside its own box: severity, code fix
            (stacked under severity from sm, so the categories get the width),
            then the categories, which wrap under their own first chip right of
            the divider, and take lines of their own on phones. */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
          <div className="flex shrink-0 flex-wrap gap-1.5 sm:flex-col sm:items-start">
            <fieldset className="flex min-w-0 flex-wrap gap-1.5">
              <legend className="sr-only">{t.severity}</legend>
              <Chip
                active={severity === null}
                onClick={() => setSeverity(null)}
              >
                {t.all}
              </Chip>
              {severities.map((s) => (
                <Chip
                  key={s}
                  active={severity === s}
                  onClick={() => setSeverity(severity === s ? null : s)}
                >
                  {t[s]}
                </Chip>
              ))}
            </fieldset>
            <Chip active={fixOnly} onClick={() => setFixOnly(!fixOnly)}>
              <Wrench className="size-3" aria-hidden />
              {t.fixOnly}
            </Chip>
          </div>
          <span
            className="hidden w-px self-stretch bg-fd-border sm:block"
            aria-hidden
          />
          <fieldset className="flex min-w-0 flex-1 flex-wrap gap-1.5">
            <legend className="sr-only">{t.category}</legend>
            {analyzerCategories.map((c) => (
              <Chip
                key={c.id}
                active={category === c.id}
                onClick={() => setCategory(category === c.id ? null : c.id)}
              >
                {c[lang]}
              </Chip>
            ))}
          </fieldset>
        </div>
        <p className="text-xs text-fd-muted-foreground" aria-live="polite">
          {t.shown(visible.size, analyzerRules.length)}
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-fd-border text-sm">
        <div className="hidden grid-cols-[7rem_5.5rem_minmax(0,3fr)_minmax(0,2fr)_4.5rem] gap-3 bg-fd-card px-3 py-2 text-xs font-medium text-fd-muted-foreground md:grid">
          {t.head.map((h) => (
            <div key={h}>{h}</div>
          ))}
        </div>
        {analyzerCategories.map((c) => {
          const rules = analyzerRules.filter(
            (rule) => rule.category === c.id && visible.has(rule.id),
          );
          if (rules.length === 0) return null;
          return (
            <section key={c.id} id={c.id} className="scroll-mt-24">
              <h3 className="border-t border-fd-border bg-fd-card px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
                {c[lang]}
              </h3>
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  id={rule.id.toLowerCase()}
                  className="grid scroll-mt-24 grid-cols-[auto_auto_minmax(0,1fr)] items-center gap-x-3 gap-y-1.5 border-t border-fd-border px-3 py-2.5 target:bg-fd-primary/10 md:grid-cols-[7rem_5.5rem_minmax(0,3fr)_minmax(0,2fr)_4.5rem] md:items-start [&_code]:rounded [&_code]:bg-fd-muted [&_code]:px-1 [&_code]:text-[0.8em] [&_code]:[overflow-wrap:anywhere] [&_a]:underline [&_a]:underline-offset-2"
                >
                  <a
                    href={ruleHref(rule, lang)}
                    className="font-mono text-[0.8rem] font-medium no-underline!"
                  >
                    {rule.id}
                  </a>
                  <div>
                    <SeverityPill severity={rule.severity} lang={lang} />
                  </div>
                  <div className="justify-self-end md:order-last md:justify-self-start">
                    {rule.codeFix ? (
                      <span
                        className="inline-flex items-center gap-1 text-xs text-fd-muted-foreground"
                        title={t.fix}
                      >
                        <Wrench className="size-3.5" aria-label={t.fix} />
                        <span className="md:sr-only">{t.fix}</span>
                      </span>
                    ) : null}
                  </div>
                  <div className="col-span-3 min-w-0 md:col-span-1">
                    {inlineMd(rule[lang].problem)}
                  </div>
                  <div className="col-span-3 min-w-0 text-fd-muted-foreground md:col-span-1">
                    <span className="md:hidden">→ </span>
                    {inlineMd(rule[lang].fix)}
                  </div>
                </div>
              ))}
            </section>
          );
        })}
        {visible.size === 0 ? (
          <p className="border-t border-fd-border px-3 py-4 text-fd-muted-foreground">
            {t.none}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/**
 * One release of the changelog as a step of a timeline: its `##` version
 * heading, the date, a badge per subsection (Wire Format, New, Performance,
 * Fixes) with its number of entries, then the entries. The badges are counted
 * from the children themselves (the `###` ids and the list after each), so
 * they cannot disagree with the text. A `collapsed` release is prerendered
 * open (the page reads in full without JavaScript) and folds when mounted,
 * as `hidden="until-found"`: find-in-page and a link to one of its anchors
 * open it, and so does the button.
 */
import { ChevronDown, FileDiff, Gauge, Sparkles, Wrench } from 'lucide-react';
import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';

type Kind = 'wire-format' | 'new' | 'performance' | 'fixes';

const kinds: Record<
  Kind,
  { en: string; zh: string; icon: ReactNode; className?: string }
> = {
  'wire-format': {
    en: 'Wire format',
    zh: '二进制格式',
    icon: <FileDiff className="size-3.5" aria-hidden />,
    className: 'bg-(--nino-cat-5) border-transparent',
  },
  new: {
    en: 'New',
    zh: '新功能',
    icon: <Sparkles className="size-3.5" aria-hidden />,
  },
  performance: {
    en: 'Performance',
    zh: '性能',
    icon: <Gauge className="size-3.5" aria-hidden />,
  },
  fixes: {
    en: 'Fixes',
    zh: '修复',
    icon: <Wrench className="size-3.5" aria-hidden />,
  },
};

type Props = { id?: string; children?: ReactNode };

function kindOf(id: unknown): Kind | undefined {
  if (typeof id !== 'string') return undefined;
  const match = /^(wire-format|new|performance|fixes)(?:-\d+)?$/.exec(id);
  return match?.[1] as Kind | undefined;
}

/** The release's subsections and how many entries each lists. */
export function releaseBadges(children: ReactNode) {
  const counts: { kind: Kind; id: string; count: number }[] = [];
  let current: (typeof counts)[number] | undefined;
  for (const child of Children.toArray(children)) {
    if (!isValidElement<Props>(child)) continue;
    const kind = kindOf(child.props.id);
    if (kind) {
      current = { kind, id: child.props.id as string, count: 0 };
      counts.push(current);
    } else if (current && current.count === 0) {
      current.count = Children.toArray(child.props.children).filter(
        isValidElement,
      ).length;
    }
  }
  return counts;
}

export const releaseKinds = kinds;

export function Release({
  date,
  collapsed = false,
  lang = 'en',
  children,
}: {
  /** The release date, `YYYY-MM-DD`; none for the next release */
  date?: string;
  collapsed?: boolean;
  lang?: Locale;
  children: ReactNode;
}) {
  const zh = lang === 'zh';
  const all = Children.toArray(children);
  const headingAt = all.findIndex(
    (child) =>
      isValidElement<Props>(child) &&
      typeof child.props.id === 'string' &&
      !kindOf(child.props.id),
  );
  const heading = all[headingAt] as ReactElement<Props> | undefined;
  const body = all.filter((_, i) => i !== headingAt);
  const badges = releaseBadges(body);
  const total = badges.reduce((sum, b) => sum + b.count, 0);

  // Open in the prerendered HTML, so the page reads in full without
  // JavaScript; a collapsed release folds once mounted
  const [open, setOpen] = useState(true);
  const bodyId = useId();
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!collapsed) return;
    const hash = decodeURIComponent(window.location.hash.slice(1));
    const target = hash ? document.getElementById(hash) : null;
    if (!(target && bodyRef.current?.contains(target))) setOpen(false);
  }, [collapsed]);

  // React writes `hidden` as a boolean, so `until-found` is set here
  useEffect(() => {
    const node = bodyRef.current;
    if (!node) return;
    if (open) node.removeAttribute('hidden');
    else node.setAttribute('hidden', 'until-found');
  }, [open]);

  // A link to an anchor inside a collapsed release opens it
  useEffect(() => {
    if (open) return;
    const reveal = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (!hash) return;
      const target = document.getElementById(hash);
      if (target && bodyRef.current?.contains(target)) {
        setOpen(true);
        requestAnimationFrame(() => target.scrollIntoView());
      }
    };
    reveal();
    const node = bodyRef.current;
    const onMatch = () => setOpen(true);
    node?.addEventListener('beforematch', onMatch);
    window.addEventListener('hashchange', reveal);
    return () => {
      node?.removeEventListener('beforematch', onMatch);
      window.removeEventListener('hashchange', reveal);
    };
  }, [open]);

  return (
    <section className="relative border-l-2 border-fd-border pl-5 sm:pl-6 [&>h2]:mt-0">
      <span
        className={cn(
          'absolute top-2 -left-[7px] size-3 rounded-full border-2 border-fd-background',
          date ? 'bg-fd-muted-foreground' : 'bg-fd-primary',
        )}
        aria-hidden
      />
      {heading}
      <div className="not-prose -mt-2 mb-4 flex flex-wrap items-center gap-1.5 text-xs">
        {date ? (
          <time dateTime={date} className="mr-1 text-fd-muted-foreground">
            {date}
          </time>
        ) : null}
        {badges.map((b) => (
          <a
            key={b.id}
            href={`#${b.id}`}
            className={cn(
              'inline-flex items-center gap-1 rounded-full border border-fd-border px-2 py-0.5 text-fd-foreground no-underline',
              kinds[b.kind].className,
            )}
          >
            {kinds[b.kind].icon}
            {kinds[b.kind][zh ? 'zh' : 'en']}
            {b.count > 0 ? (
              <span className="tabular-nums text-fd-muted-foreground">
                {b.count}
              </span>
            ) : null}
          </a>
        ))}
        {collapsed ? (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={bodyId}
            onClick={() => setOpen(!open)}
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-fd-muted-foreground hover:text-fd-foreground"
          >
            <ChevronDown
              className={cn(
                'size-3.5 transition-transform',
                open && 'rotate-180',
              )}
              aria-hidden
            />
            {open
              ? zh
                ? '收起'
                : 'Hide'
              : zh
                ? `展开${total > 0 ? ` ${total} 项` : ''}`
                : `Show${total > 0 ? ` ${total} ${total === 1 ? 'entry' : 'entries'}` : ''}`}
          </button>
        ) : null}
      </div>
      <div id={bodyId} ref={bodyRef} className="pb-4">
        {body}
      </div>
    </section>
  );
}

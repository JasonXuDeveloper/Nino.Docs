/**
 * A ```mermaid fence of the docs, drawn at build time (src/lib/mermaid.ts):
 * the children are the SVG, so the page loads no Mermaid and the diagram is
 * there before hydration. `chart` (the source) is for the Markdown copies.
 * Mermaid's `neutral` theme is grayscale; the dark theme inverts it. A diagram
 * is at most 420px tall and as wide as the column, so it sits inline with the text;
 * a wide one shrinks to 70 % of its size at most, then scrolls (keepLegible).
 * A label is never clipped: until the diagram font has loaded, or if a glyph
 * falls back to a wider font, it may run past its box but stays readable.
 */
import type { ReactNode } from 'react';

export function Mermaid({ children }: { chart: string; children?: ReactNode }) {
  return (
    <div className="not-prose my-6 overflow-x-auto [&_svg]:mx-auto [&_svg]:block [&_svg]:h-auto [&_svg]:max-h-[420px] [&_svg]:w-auto [&_svg]:max-w-full dark:[&_svg]:hue-rotate-180 dark:[&_svg]:invert-[.88] [&_foreignObject]:overflow-visible">
      {children}
    </div>
  );
}

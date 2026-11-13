import type { FeedbackBlockProps } from 'fumadocs-core/mdx-plugins/remark-feedback-block';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import {
  type ComponentProps,
  isValidElement,
  Children as ReactChildren,
  type ReactNode,
} from 'react';
import { AnalyzerRules } from '@/components/analyzer-rules';
import { AnchorRedirect } from '@/components/anchor-redirect';
import { BenchChart } from '@/components/bench-chart';
import {
  BenchSource,
  BenchValue,
  BuildTables,
  ExtraRuntimeTables,
  IfWorkloads,
  LibraryTables,
  ResultsTable,
  ReuseTable,
  RuntimesTables,
  RuntimeTable,
  UnityHighlights,
  UnityTables,
  WorkloadTables,
} from '@/components/bench-data';
import { BytePlayground } from '@/components/byte-playground';
import { Bytes, Matrix } from '@/components/bytes';
import {
  BenchmarkChart,
  DotnetGroupCharts,
  RuntimesChart,
  UnityChart,
} from '@/components/charts';
import { handleBlockFeedback } from '@/components/feedback/actions';
import { FeedbackBlock } from '@/components/feedback/client';
import { Glossary, Term } from '@/components/glossary';
import { Mermaid } from '@/components/mermaid';
import { Release } from '@/components/release';
import { CountUp } from '@/components/showcase';

/**
 * Inline code, marked for table cells (app/app.css): a long token (an MSBuild
 * element, a full signature) may break anywhere on a wide screen, instead of
 * the whole table scrolling sideways for one cell; a run of hex bytes
 * (`04 61 00 2D 4E`) stays on one line. Short tokens and code blocks (whose
 * children are highlighted lines) are left alone.
 */
const hexBytes = /^(?:[0-9A-F]{2}|…)(?: (?:[0-9A-F]{2}|…))+$/;

function InlineCode({ className, ...props }: ComponentProps<'code'>) {
  const text =
    !className && typeof props.children === 'string' ? props.children : '';
  const marked = hexBytes.test(text)
    ? 'nino-bytes'
    : text.length > 24
      ? 'nino-long-code'
      : className;
  return <code className={marked} {...props} />;
}

/** The length of the text in a cell, through links, emphasis and code. */
function textLength(node: ReactNode): number {
  // A Chinese character takes the room of about two Latin letters.
  if (typeof node === 'string')
    return node.length + (node.match(/[\u3400-\u9fff]/g)?.length ?? 0);
  if (typeof node === 'number') return String(node).length;
  if (isValidElement<{ children?: ReactNode }>(node))
    return textLength(node.props.children);
  let length = 0;
  ReactChildren.forEach(node, (child) => {
    if (child !== node) length += textLength(child);
  });
  return length;
}

/**
 * A table cell of running text (over 60 characters) is marked, so that on a
 * phone it keeps a width a sentence can be read at (app/app.css).
 */
function TableCell({ className, ...props }: ComponentProps<'td'>) {
  const long = !className && textLength(props.children) > 60;
  return <td className={long ? 'nino-long-cell' : className} {...props} />;
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    code: InlineCode,
    td: TableCell,
    img: (props: ComponentProps<'img'>) => (
      <ImageZoom {...(props as ComponentProps<typeof ImageZoom>)} />
    ),
    Accordion,
    AnalyzerRules,
    AnchorRedirect,
    Accordions,
    BenchChart,
    BenchmarkChart,
    DotnetGroupCharts,
    RuntimesChart,
    UnityChart,
    BenchSource,
    BenchValue,
    BuildTables,
    BytePlayground,
    Bytes,
    ExtraRuntimeTables,
    IfWorkloads,
    ResultsTable,
    LibraryTables,
    ReuseTable,
    RuntimesTables,
    RuntimeTable,
    UnityHighlights,
    UnityTables,
    WorkloadTables,
    CountUp,
    File,
    Files,
    Folder,
    Glossary,
    Matrix,
    Mermaid,
    Release,
    Step,
    Steps,
    Tab,
    Tabs,
    Term,
    TypeTable,
    FeedbackBlock: ({
      children,
      ...props
    }: FeedbackBlockProps & { children: ReactNode }) => (
      <FeedbackBlock {...props} onSendAction={handleBlockFeedback}>
        {children}
      </FeedbackBlock>
    ),
    ...components,
  };
}

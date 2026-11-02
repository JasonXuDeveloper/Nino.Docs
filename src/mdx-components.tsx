import type { FeedbackBlockProps } from 'fumadocs-core/mdx-plugins/remark-feedback-block';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import type { ComponentProps, ReactNode } from 'react';
import { AnalyzerRules } from '@/components/analyzer-rules';
import { AnchorRedirect } from '@/components/anchor-redirect';
import { BenchChart } from '@/components/bench-chart';
import {
  BenchSource,
  BenchValue,
  ExtraRuntimeTables,
  LibraryTables,
  ResultsTable,
  ReuseTable,
  RuntimesTables,
  RuntimeTable,
  UnityHighlights,
  UnityTables,
} from '@/components/bench-data';
import { BytePlayground } from '@/components/byte-playground';
import { Bytes, Matrix } from '@/components/bytes';
import { BenchmarkChart } from '@/components/charts';
import { handleBlockFeedback } from '@/components/feedback/actions';
import { FeedbackBlock } from '@/components/feedback/client';
import { Glossary, Term } from '@/components/glossary';
import { Mermaid } from '@/components/mermaid';
import { Release } from '@/components/release';
import { CountUp } from '@/components/showcase';

/**
 * Inline code: a long token (an MSBuild element, a full signature) is marked
 * so that a table cell may break it anywhere on a wide screen (app/app.css),
 * instead of the whole table scrolling sideways for one cell. Short tokens
 * and code blocks (whose children are highlighted lines) are left alone.
 */
function InlineCode({ className, ...props }: ComponentProps<'code'>) {
  const long =
    !className &&
    typeof props.children === 'string' &&
    props.children.length > 24;
  return <code className={long ? 'nino-long-code' : className} {...props} />;
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    code: InlineCode,
    img: (props: ComponentProps<'img'>) => (
      <ImageZoom {...(props as ComponentProps<typeof ImageZoom>)} />
    ),
    Accordion,
    AnalyzerRules,
    AnchorRedirect,
    Accordions,
    BenchChart,
    BenchmarkChart,
    BenchSource,
    BenchValue,
    BytePlayground,
    Bytes,
    ExtraRuntimeTables,
    ResultsTable,
    LibraryTables,
    ReuseTable,
    RuntimesTables,
    RuntimeTable,
    UnityHighlights,
    UnityTables,
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

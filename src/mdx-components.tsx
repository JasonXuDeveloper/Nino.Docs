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
import { AnchorRedirect } from '@/components/anchor-redirect';
import { BenchChart } from '@/components/bench-chart';
import {
  BenchSource,
  BenchValue,
  ResultsTable,
  ReuseTable,
  RuntimeTable,
} from '@/components/bench-data';
import { BenchmarkChart } from '@/components/charts';
import { handleBlockFeedback } from '@/components/feedback/actions';
import { FeedbackBlock } from '@/components/feedback/client';
import { CountUp, ShowcaseHero, StatCards } from '@/components/showcase';
import { Stats } from '@/components/stats';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    img: (props: ComponentProps<'img'>) => (
      <ImageZoom {...(props as ComponentProps<typeof ImageZoom>)} />
    ),
    Accordion,
    AnchorRedirect,
    Accordions,
    BenchChart,
    BenchmarkChart,
    BenchSource,
    BenchValue,
    ResultsTable,
    ReuseTable,
    RuntimeTable,
    CountUp,
    File,
    Files,
    Folder,
    ShowcaseHero,
    StatCards,
    Stats,
    Step,
    Steps,
    Tab,
    Tabs,
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

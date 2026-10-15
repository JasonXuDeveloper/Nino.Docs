import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import type { ComponentProps } from 'react';
import { AnchorRedirect } from '@/components/anchor-redirect';
import { BenchChart } from '@/components/bench-chart';
import { BenchmarkChart } from '@/components/charts';
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
    ...components,
  };
}

/**
 * The byte playground: pick a worked example of the specification (and, for
 * strings, a value and an encoding) and see the bytes Nino writes for it,
 * each run labelled. Every byte comes from src/data/byte-examples.json, which
 * `bun run check:bytes` checks against the specification's dumps of a real
 * run; nothing is computed here. The first example is prerendered; the
 * Markdown copy lists every example (src/lib/markdown.tsx).
 */
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { useState } from 'react';
import data from '@/data/byte-examples.json';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';
import { type ByteField, type ByteKind, Bytes } from './bytes';

export interface ExampleField {
  hex: string;
  kind: string;
  en: string;
  zh: string;
}
export interface ByteExample {
  id: string;
  spec: string;
  en: { title: string; note: string };
  zh: { title: string; note: string };
  code: string;
  rows?: { en: string; zh: string; fields: ExampleField[] }[];
  strings?: { value: string; def: ExampleField[]; utf8: ExampleField[] }[];
}

export const byteExamples = data.examples as ByteExample[];
export const specUrl =
  'https://github.com/JasonXuDeveloper/Nino/blob/main/docs/spec/wire-format.md#appendix-a-worked-examples';

export function exampleFields(
  fields: ExampleField[],
  lang: Locale,
): ByteField[] {
  return fields.map((f) => ({
    hex: f.hex,
    kind: f.kind as ByteKind,
    label: f[lang],
  }));
}

/**
 * An example's code is its types, then a blank line and the value written
 * (the last paragraph), which the playground shows as two blocks. An example
 * with one paragraph (strings: the value is picked) has types only.
 */
export function splitCode(code: string) {
  const at = code.lastIndexOf('\n\n');
  return at < 0
    ? { type: code, value: undefined }
    : { type: code.slice(0, at), value: code.slice(at + 2) };
}

export function byteCount(fields: ExampleField[]) {
  return fields.reduce((n, f) => n + f.hex.trim().split(/\s+/).length, 0);
}

function Pick<T extends string>({
  label,
  value,
  options,
  onChange,
  mono = true,
}: {
  mono?: boolean;
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="flex flex-wrap gap-1.5">
      <legend className="sr-only">{label}</legend>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'rounded-full border px-2.5 py-1 text-xs transition-colors',
            mono && 'font-mono',
            value === o.value
              ? 'border-fd-primary bg-fd-primary/10 text-fd-foreground'
              : 'border-fd-border text-fd-muted-foreground hover:text-fd-foreground',
          )}
        >
          {o.label}
        </button>
      ))}
    </fieldset>
  );
}

export function BytePlayground({ lang = 'en' }: { lang?: Locale }) {
  const zh = lang === 'zh';
  const [id, setId] = useState(byteExamples[0].id);
  const [str, setStr] = useState('"abc"');
  const [encoding, setEncoding] = useState<'def' | 'utf8'>('def');
  const example = byteExamples.find((e) => e.id === id) ?? byteExamples[0];
  const { type, value } = splitCode(example.code);

  const rows =
    example.strings !== undefined
      ? (() => {
          const s =
            example.strings.find((x) => x.value === str) ?? example.strings[0];
          const fields = encoding === 'def' ? s.def : s.utf8;
          return [
            {
              title: `${encoding === 'def' ? 'Def' : 'U8'} = ${s.value}`,
              fields,
            },
          ];
        })()
      : (example.rows ?? []).map((row) => ({
          title: row[lang],
          fields: row.fields,
        }));

  return (
    <div className="not-prose my-6 rounded-xl border border-fd-border">
      <div className="flex flex-col gap-2 border-b border-fd-border p-3">
        <Pick
          label={zh ? '例子' : 'Example'}
          mono={false}
          value={id}
          options={byteExamples.map((e) => ({
            value: e.id,
            label: e[lang].title,
          }))}
          onChange={setId}
        />
        {example.strings ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Pick
              label={zh ? '值' : 'Value'}
              value={str}
              options={example.strings.map((s) => ({
                value: s.value,
                label: s.value,
              }))}
              onChange={setStr}
            />
            <Pick
              label={zh ? '编码' : 'Encoding'}
              value={encoding}
              options={[
                { value: 'def', label: zh ? '默认' : 'default' },
                { value: 'utf8', label: '[NinoUtf8]' },
              ]}
              onChange={setEncoding}
            />
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-3 p-3 sm:p-4">
        <DynamicCodeBlock
          lang="csharp"
          code={type}
          codeblock={{
            title: zh ? '数据结构' : 'Type',
            className: 'my-0',
          }}
        />
        {value !== undefined ? (
          <DynamicCodeBlock
            lang="csharp"
            code={value}
            codeblock={{
              title: zh ? '写入的数据' : 'Value written',
              className: 'my-0',
            }}
          />
        ) : null}
        <p className="text-sm text-fd-muted-foreground">{example[lang].note}</p>
        <section className="not-prose overflow-hidden rounded-xl border bg-fd-card text-sm">
          <div className="flex h-9.5 items-center border-b px-4 text-fd-muted-foreground">
            {zh ? '写出的字节' : 'Bytes written'}
          </div>
          <div aria-live="polite" className="px-4 py-3">
            <Bytes
              stacked
              rows={rows.map((row) => ({
                title: (
                  <>
                    <code className="text-[0.75rem]">{row.title}</code>
                    <span className="font-normal">
                      {zh
                        ? ` · ${byteCount(row.fields)} 字节`
                        : ` · ${byteCount(row.fields)} bytes`}
                    </span>
                  </>
                ),
                fields: exampleFields(row.fields, lang),
              }))}
            />
          </div>
          <p className="border-t px-4 py-2.5 text-xs text-fd-muted-foreground">
            {zh ? '字节来自' : 'Bytes from'}{' '}
            <a href={specUrl} className="underline underline-offset-2">
              {zh
                ? `规范附录 ${example.spec}`
                : `the specification, Appendix ${example.spec}`}
            </a>
            {zh
              ? '：Nino 4.0.0-rc.8 实际运行的输出。'
              : ': the output of a real run of Nino 4.0.0-rc.8.'}
          </p>
        </section>
      </div>
    </div>
  );
}

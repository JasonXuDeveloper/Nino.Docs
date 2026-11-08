import { replaceSource } from 'fumadocs-core/mdx-plugins/stringifier';
import type { Root } from 'mdast';
import { visit } from 'unist-util-visit';
import type { VFile } from 'vfile';
import { release } from './release';

/**
 * Replaces `%NINO_VERSION%` and `%NINO_OPENUPM_VERSION%` with the newest
 * release (./release) in code blocks, inline code and text, so the install
 * instructions follow each release without an edit. An unknown `%NINO_...%`
 * fails the build.
 */

const placeholders: Record<string, string> = {
  '%NINO_VERSION%': release.version,
  '%NINO_OPENUPM_VERSION%': release.openupm,
};

const pattern = /%NINO_[A-Z_]+%/g;

function replace(value: string, file: string | undefined) {
  return value.replace(pattern, (name) => {
    const version = placeholders[name];
    if (version === undefined)
      throw new Error(
        `${file ?? 'a page'}: unknown placeholder ${name} (known: ${Object.keys(placeholders).join(', ')})`,
      );
    return version;
  });
}

export function remarkReleaseVersion() {
  return (tree: Root, file: VFile) => {
    visit(tree, (node) => {
      if (
        (node.type === 'code' ||
          node.type === 'inlineCode' ||
          node.type === 'text') &&
        node.value.includes('%NINO_')
      ) {
        node.value = replace(node.value, file.path);
        // remarkStructure (the search index) reads the authored source.
        const start = node.position?.start.offset;
        const end = node.position?.end.offset;
        if (start !== undefined && end !== undefined)
          replaceSource(file, node, (s) =>
            replace(s.slice(start, end), file.path),
          );
      }
    });
  };
}

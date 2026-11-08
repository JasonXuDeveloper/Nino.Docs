/**
 * Syncs the version of Nino the install instructions name: the newest v4.*
 * GitHub release (prereleases included) into src/data/release.json, which
 * src/lib/release.ts reads. Pages write the placeholders `%NINO_VERSION%`
 * (NuGet, npm and crates.io) and `%NINO_OPENUPM_VERSION%` (Unity) instead of a
 * version, and the docs banner for a prerelease follows `prerelease`.
 *
 * OpenUPM does not order semantic prereleases, so Nino's release.yml publishes
 * the Unity package as X.Y.Z-preview.N: alpha.N -> preview.N,
 * beta.N -> preview.(100 + N), rc.N -> preview.(200 + N). The same rule is
 * here.
 *
 *   bun scripts/sync-release.ts                  # newest v4.* release
 *   bun scripts/sync-release.ts --tag v4.0.0     # write the file for a tag, offline
 *   bun scripts/sync-release.ts --tag v4.0.0-rc.10 --out <file.json>
 *
 * Runs before every build (Nino's report.yml rebuilds the site after each
 * release). It never fails the build: on any error it prints a warning and
 * keeps the committed src/data/release.json. Set GITHUB_TOKEN to raise the API
 * rate limit.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = 'JasonXuDeveloper/Nino';
const dataFile = fileURLToPath(
  new URL('../src/data/release.json', import.meta.url),
);

export type ReleaseFile = {
  /** The release's tag, e.g. "v4.0.0-rc.9". */
  tag: string;
  /** NuGet, npm and crates.io version, e.g. "4.0.0-rc.9". */
  version: string;
  /** The Unity package's version on OpenUPM, e.g. "4.0.0-preview.209". */
  openupm: string;
  /** Whether the version is a prerelease (install with --prerelease). */
  prerelease: boolean;
};

const offsets: Record<string, number> = { alpha: 0, beta: 100, rc: 200 };

export function releaseFromTag(tag: string): ReleaseFile {
  const match = tag.match(/^v(\d+\.\d+\.\d+)(?:-(alpha|beta|rc)\.(\d+))?$/);
  if (!match) throw new Error(`cannot read the version of tag ${tag}`);
  const [, base, label, number] = match;
  if (!label) return { tag, version: base, openupm: base, prerelease: false };
  return {
    tag,
    version: `${base}-${label}.${number}`,
    openupm: `${base}-preview.${offsets[label] + Number(number)}`,
    prerelease: true,
  };
}

type Release = {
  tag_name: string;
  draft: boolean;
  published_at: string | null;
  created_at: string;
};

async function latestTag(): Promise<string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'nino-docs-release-sync',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN)
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(
    `https://api.github.com/repos/${repo}/releases?per_page=30`,
    { headers, signal: AbortSignal.timeout(15_000) },
  );
  if (!response.ok)
    throw new Error(`GitHub API ${response.status} ${response.statusText}`);
  const releases = (await response.json()) as Release[];
  const match = releases
    .filter(
      (release) =>
        !release.draft &&
        /^v4\.\d+\.\d+(?:-(?:alpha|beta|rc)\.\d+)?$/.test(release.tag_name),
    )
    .sort((a, b) =>
      (b.published_at ?? b.created_at).localeCompare(
        a.published_at ?? a.created_at,
      ),
    )[0];
  if (!match) throw new Error('no v4.* release yet');
  return match.tag_name;
}

function argument(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const out = argument('--out') ?? dataFile;
  try {
    const file = releaseFromTag(argument('--tag') ?? (await latestTag()));
    writeFileSync(out, `${JSON.stringify(file, null, 2)}\n`);
    console.log(
      `[release] ${file.tag}: ${file.version}, OpenUPM ${file.openupm}`,
    );
  } catch (error) {
    const kept = JSON.parse(readFileSync(dataFile, 'utf8')) as ReleaseFile;
    console.warn(
      `[release] warning: ${error instanceof Error ? error.message : String(error)}; keeping src/data/release.json (${kept.tag})`,
    );
  }
}

const isMain =
  process.argv[1] !== undefined &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isMain) main();

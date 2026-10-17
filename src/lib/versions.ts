// Documentation versions, newest first. Each one is a folder in content/docs/.
export const versions = ['v4', 'v3', 'v2'] as const;
export type Version = (typeof versions)[number];
export const latestVersion: Version = 'v4';

export function isVersion(value: string | undefined): value is Version {
  return versions.includes(value as Version);
}

export function getVersionFromPath(pathname: string): Version | undefined {
  const match = pathname.match(/^\/(?:en|zh)\/docs\/([^/]+)/);
  return match && isVersion(match[1]) ? match[1] : undefined;
}

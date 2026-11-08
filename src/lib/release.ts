import data from '../data/release.json';

/**
 * The newest Nino v4 release (tag, version, OpenUPM version, prerelease),
 * synced before every build by scripts/sync-release.ts. Pages never type the
 * current version: they write a placeholder that src/lib/remark-release.ts
 * replaces, and components read it from here.
 */
export const release = data;

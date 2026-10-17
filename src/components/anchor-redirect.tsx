import { useEffect } from 'react';

/**
 * Sends old deep links to the page their section moved to, e.g.
 * /en/docs/v4/advanced#former-name -> /en/docs/v4/defining-types#former-name
 * (the old site had all advanced topics on one page).
 */
export function AnchorRedirect({ map }: { map: Record<string, string> }) {
  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    const target = map[hash];
    if (target) window.location.replace(target);
  }, [map]);

  return null;
}

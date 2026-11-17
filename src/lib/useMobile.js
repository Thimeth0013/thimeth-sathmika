import { useSyncExternalStore } from 'react';

// Phone layouts: below Tailwind's `md` (768px) the scenes use their own positions and sizes. Desktop
// (and tablets in landscape) never see them. Use the hook in components; `isMobile()` in code that runs
// outside React (scroll handlers, module helpers).
export const MOBILE_QUERY = '(max-width: 767px)';
export const isMobile = () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches;
const subscribe = (onChange) => {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};
export const useMobile = () => useSyncExternalStore(subscribe, isMobile, () => false);

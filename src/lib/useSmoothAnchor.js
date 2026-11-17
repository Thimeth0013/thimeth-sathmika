import { useCallback } from 'react';
import { useLenis } from 'lenis/react';

// In-page links (#about, #work, ...) scroll there smoothly through the scenes instead of jumping:
// Lenis animates the scroll, so every scene plays on the way. Longer trips take a little longer
// (DURATION: seconds at least, plus PER_SCREEN for each screen of distance, at most). With reduced motion
// it jumps. Returns an onClick handler for an <a href="#...">; modified clicks (new tab etc.) are left to
// the browser.
const DURATION = [0.9, 2.6];
const PER_SCREEN = 0.12;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export const useSmoothAnchor = () => {
  const lenis = useLenis();
  return useCallback(
    (e) => {
      const href = e.currentTarget.getAttribute('href') ?? '';
      if (!lenis || !href.startsWith('#') || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = document.getElementById(href.slice(1));
      if (!target) return;
      e.preventDefault();
      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const screens = Math.abs(target.getBoundingClientRect().top) / window.innerHeight;
      const duration = Math.min(Math.max(DURATION[0] + screens * PER_SCREEN, DURATION[0]), DURATION[1]);
      lenis.scrollTo(target, { duration, easing: easeInOut, immediate: still, force: true });
      window.history.replaceState(null, '', href);
    },
    [lenis]
  );
};

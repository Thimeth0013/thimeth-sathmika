import { useSyncExternalStore } from 'react';

// Time of day. src/lib/skyBoot.js (inlined in each page's <head>) blends the four phases by the
// visitor's clock before the first paint and exposes window.__sky; this module keeps it going:
// - startSkyClock() re-blends every minute, so a long visit slowly drifts with the day (the theme is
//   left as it opened: the white sections never flip while someone is reading);
// - the Enderman on the footer's meadow (Enderman.jsx) picks phases: each click jumps to the next
//   (nextSky), easing there over PICK_MS (the change crosses the sky as a soft front); night is also
//   the dark theme. A pick stops the
//   clock and lasts for the visit (sessionStorage `sky`, so it carries to the other pages); the next
//   visit starts from the clock again.
// <html data-sky> is the main phase showing ("Time of day" in index.css).

export const PHASES = ['morning', 'noon', 'evening', 'night'];
const KEY = 'sky';
const PICK_MS = 1200; // a pick eases there (the front crossing the sky) over this long
let picked = false;

export const getSky = () => {
  const sky = typeof document !== 'undefined' ? document.documentElement.dataset.sky : null;
  return PHASES.includes(sky) ? sky : 'noon';
};

export const setSky = (sky) => {
  const root = document.documentElement;
  picked = true;
  window.__sky?.apply(window.__sky.oneHot(sky), PICK_MS);
  root.dataset.sky = sky;
  root.dataset.theme = sky === 'night' ? 'dark' : 'light';
  try {
    sessionStorage.setItem(KEY, sky);
  } catch {
    /* storage unavailable: it just won't carry to the next page */
  }
  // Pages without a sky in their bar colour (data-sky-bar) use their light / dark colour.
  const bar = document.querySelector('meta[name="theme-color"]');
  if (bar && !bar.hasAttribute('data-sky-bar')) bar.setAttribute('content', bar.dataset[root.dataset.theme]);
};

export const nextSky = () => setSky(PHASES[(PHASES.indexOf(getSky()) + 1) % PHASES.length]);

// Re-blend by the clock every minute (unless a phase is fixed by ?time= or a pick).
let clock = 0;
export const startSkyClock = () => {
  const sky = window.__sky;
  if (!sky || sky.fixed || clock) return;
  clock = window.setInterval(() => {
    if (picked) {
      window.clearInterval(clock);
      return;
    }
    sky.apply(sky.blend(sky.now()), 4000);
  }, 60000);
};

// The main phase showing, re-rendering when it changes.
const subscribe = (onChange) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-sky'] });
  return () => observer.disconnect();
};
export const useSky = () => useSyncExternalStore(subscribe, getSky, () => 'noon');

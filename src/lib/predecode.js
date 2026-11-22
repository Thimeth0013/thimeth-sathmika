import { useEffect } from 'react';

// Decode images ahead of time, at a quiet moment, so the frame that first draws them doesn't have to
// (decoding a big image mid-scroll is a visible hitch). After the page has loaded, AFTER ms later and
// then once the browser is idle, each image is loaded and `decode()`d (off the main thread); the decoded
// pixels stay in the browser's image cache, so the real <img> with the same URL draws at once. A hint,
// not a guarantee: the browser may drop decoded images under memory pressure.

const done = new Set();
const keep = []; // hold the Image objects so they aren't collected before they're used

const run = (srcs) => {
  for (const src of srcs) {
    if (done.has(src)) continue;
    done.add(src);
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
    keep.push(img);
    img.decode().catch(() => {});
  }
};

export const usePredecode = (srcs, after = 3000) => {
  const key = srcs.join('|');
  useEffect(() => {
    const list = key.split('|');
    let timer = 0;
    let idle = 0;
    const go = () => {
      timer = window.setTimeout(() => {
        if ('requestIdleCallback' in window) idle = window.requestIdleCallback(() => run(list), { timeout: 4000 });
        else run(list);
      }, after);
    };
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
    return () => {
      window.removeEventListener('load', go);
      window.clearTimeout(timer);
      if (idle) window.cancelIdleCallback(idle);
    };
  }, [key, after]);
};

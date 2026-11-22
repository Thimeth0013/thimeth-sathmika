import { useEffect, useRef } from 'react';
import enderman from '../assets/footer/enderman.webp';
import { toggleTheme, useTheme } from '../lib/theme';
import { usePredecode } from '../lib/predecode';

// An Enderman on the footer's meadow (an easter egg; the owner's image, cut out of its checkerboard:
// footer/enderman.webp), and the site's light/dark switch: clicking him toggles the theme
// (src/lib/theme.js) and he teleports away at once.
// Once the footer has been settled in view for FIRST ms (`active`), he appears on the meadow's farther
// grass and teleports about it for a few stops, then away. Every visit is different (`visit()`): how
// many stops, which of the three farther rows (ROWS) and where along each, how long he holds, and how
// long until he comes back (AGAIN), so it is hard to predict.
// Each teleport is a quick flicker out and a pop in, with a burst of small purple square particles
// drifting up and fading, at the spot he leaves and the spot he arrives at. Never with reduced motion.
// He sits in the meadow (FooterGround), in front of the grass and the fog, behind the socials and the
// note card.

// The three farther rows (he never comes right up to the front): feet is where he stands, % down the
// meadow; h his height, % of the meadow's height; x the range his middle may land in, % of the meadow's
// width, kept in the open between the text (left) and the note card (right) so his head never goes
// behind either (the nearer the row, the taller he stands into the sky, so the narrower the gap).
const ROWS = [
  { feet: 14, h: 24, x: [10, 62] },
  { feet: 36, h: 46, x: [22, 60] },
  { feet: 62, h: 82, x: [30, 44] },
];
const FIRST = 10000;
const AGAIN = [12000, 24000]; // ms before he comes back, picked at random each time
const HOLD = [900, 1900]; // ms he stays at a stop
const GAP = 160; // ms between vanishing and appearing
const PURPLE = ['#E879F9', '#C026D3', '#A21CAF', '#F0ABFC', '#7E22CE'];

const between = ([a, b]) => a + Math.random() * (b - a);
const pick = (list) => list[Math.floor(Math.random() * list.length)];

// One visit, never the same twice: 2 to 4 stops, each in a different row from the one before, at a
// random spot along it (well away from where he just was), with a little jitter nearer or farther
// within the row. He mostly works his way nearer, but may start in the middle or step back a row.
const visit = () => {
  const stops = [];
  const count = 2 + Math.floor(Math.random() * 3);
  let row = Math.random() < 0.7 ? 0 : 1;
  let x = null;
  for (let i = 0; i < count; i++) {
    const r = ROWS[row];
    let nx = between(r.x);
    for (let k = 0; k < 8 && x !== null && Math.abs(nx - x) < 12; k++) nx = between(r.x);
    x = nx;
    const jitter = (Math.random() - 0.5) * 6;
    stops.push({ x, feet: r.feet + jitter, h: r.h * (1 + jitter / 100), hold: between(HOLD) });
    row = row < 2 && Math.random() < 0.65 ? row + 1 : pick([0, 1, 2].filter((n) => n !== row));
  }
  return stops;
};

const wait = (ms, signal) =>
  new Promise((resolve) => {
    const t = setTimeout(resolve, ms);
    signal.addEventListener('abort', () => clearTimeout(t), { once: true });
  });

export const Enderman = ({ active }) => {
  const theme = useTheme();
  usePredecode([enderman], 5000); // so his first pop-in doesn't hitch
  const boxRef = useRef(null);
  const bodyRef = useRef(null);
  const shadowRef = useRef(null);
  const clickRef = useRef(null); // set by the effect: what a click does while he is out

  useEffect(() => {
    const box = boxRef.current;
    const body = bodyRef.current;
    const shadow = shadowRef.current;
    if (!active || !box || !body || !shadow || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let run = null;
    let here = null; // the stop he is at, while he is out

    // Purple portal particles: small squares scattered over where he stands, drifting up and out.
    const burst = ({ x, feet, h }) => {
      const W = box.clientWidth;
      const H = box.clientHeight;
      const tall = (h / 100) * H;
      const wide = tall * (161 / 420);
      const cx = (x / 100) * W;
      const bottom = (feet / 100) * H;
      for (let i = 0; i < 18; i++) {
        const p = document.createElement('span');
        const size = Math.max(2, Math.round(tall * (0.018 + Math.random() * 0.022)));
        p.style.cssText = `position:absolute;left:${cx + (Math.random() - 0.5) * wide * 1.4}px;top:${bottom - Math.random() * tall}px;width:${size}px;height:${size}px;background:${
          PURPLE[i % PURPLE.length]
        };pointer-events:none;`;
        box.appendChild(p);
        const dx = (Math.random() - 0.5) * wide * 0.8;
        const dy = -(0.15 + Math.random() * 0.35) * tall;
        p.animate([{ opacity: 1, transform: 'translate(0, 0)' }, { opacity: 0, transform: `translate(${dx}px, ${dy}px)` }], {
          duration: 600 + Math.random() * 500,
          easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)',
          fill: 'forwards',
        }).finished.then(() => p.remove(), () => p.remove());
      }
    };
    const place = ({ x, feet, h }) => {
      body.style.left = shadow.style.left = `${x}%`;
      body.style.bottom = `${100 - feet}%`;
      body.style.height = `${h}%`;
      shadow.style.top = `${feet}%`;
      shadow.style.width = `${h * 0.28}%`;
    };
    const appear = (stop) => {
      here = stop;
      place(stop);
      body.style.visibility = shadow.style.visibility = 'visible';
      body.animate([{ opacity: 0, scale: '0.9 1.12' }, { opacity: 1, scale: '1 1' }], { duration: 170, easing: 'ease-out', fill: 'forwards' });
      shadow.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 170, fill: 'forwards' });
      burst(stop);
    };
    const vanish = () => {
      if (!here) return;
      body.animate([{ opacity: 1 }, { opacity: 0.25 }, { opacity: 0.9 }, { opacity: 0 }], { duration: 220, fill: 'forwards' });
      shadow.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: 'forwards' });
      burst(here);
      here = null;
    };
    const hide = () => {
      body.style.visibility = shadow.style.visibility = 'hidden';
    };
    const play = async (signal) => {
      for (const stop of visit()) {
        if (signal.aborted) return;
        appear(stop);
        await wait(stop.hold, signal);
        if (signal.aborted) return;
        vanish();
        await wait(GAP + 220, signal);
      }
      hide();
    };
    // Visits, for as long as the footer stays in view: the first after `delay`, then each a random while
    // after the last.
    const start = (delay) => {
      run?.abort();
      run = new AbortController();
      const { signal } = run;
      (async () => {
        await wait(delay, signal);
        while (!signal.aborted) {
          await play(signal);
          await wait(between(AGAIN), signal);
        }
      })();
    };
    // Clicked: switch the theme and teleport away now; the visits start over from the wait.
    clickRef.current = () => {
      if (!here) return;
      toggleTheme();
      vanish();
      start(between(AGAIN));
      window.setTimeout(() => !here && hide(), 240);
    };
    start(FIRST);
    return () => {
      run?.abort();
      clickRef.current = null;
      here = null;
      hide();
      box.querySelectorAll('span').forEach((p) => p.remove());
    };
  }, [active]);

  return (
    <div ref={boxRef} className="pointer-events-none absolute inset-0">
      {/* A soft shadow on the grass under his feet. */}
      <div
        ref={shadowRef}
        aria-hidden="true"
        style={{ visibility: 'hidden', background: 'radial-gradient(closest-side, rgb(8 20 10 / 0.45), transparent)' }}
        className="absolute aspect-[4/1] -translate-x-1/2 -translate-y-1/2"
      />
      <img
        ref={bodyRef}
        src={enderman}
        alt=""
        role="button"
        tabIndex={0}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        draggable={false}
        onClick={() => clickRef.current?.()}
        onKeyDown={(e) => {
          if (e.key !== 'Enter' && e.key !== ' ') return;
          e.preventDefault();
          clickRef.current?.();
        }}
        // Zero height until place() sizes it: at its natural 420px it hung below a phone's 130px meadow
        // and, though hidden, made the page ~290px longer (an empty band under the footer).
        style={{ visibility: 'hidden', bottom: 0, height: 0 }}
        className="pointer-events-auto absolute w-auto max-w-none -translate-x-1/2 cursor-pointer select-none outline-none focus-visible:drop-shadow-[0_0_6px_#E879F9]"
      />
    </div>
  );
};

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { NoteCard } from '../NoteCard';
import { Enderman } from '../Enderman';
import { Clouds } from '../Clouds';
import { FOOTER_CLOUDS, FOOTER_CLOUDS_M } from '../pixelClouds';
import { STARS } from '../stars';
import { SOCIAL } from '../../data/socials';
import { useMobile } from '../../lib/useMobile';
import { usePredecode } from '../../lib/predecode';
import ground from '../../assets/footer/ground-mc.webp';

// The footer: a sky over a wide meadow. It comes in two forms built from the same parts:
// - FooterScene (+ FooterSky): on desktop, the last scene of the home page's pinned scroll (Home.jsx):
//   as the last certificates fly out past the edges the meadow rises from the bottom, the sky fades in
//   over the whole screen as the final card leaves (one full-screen layer fading in, so there is no
//   edge anywhere), and the headline, the note card and the socials come in; the scroll ends on it.
// - Footer: an ordinary section after the page, on phones (a stacked footer is taller than a screen),
//   with reduced motion (no pinned scenes) and on the All work page. Its sky fades in as it comes up,
//   with a white feather along its top edge that blends it into the white page above (solid white at
//   the edge, so there is never a seam) and shrinks away (scaleY) as it settles.
//
// The sky: the hero's blue at the top, lightening down to a white haze at the horizon. Blocky,
// Minecraft-style clouds drift across all of it (pixelClouds.js, through the hero's Clouds layer, in a
// box the size of the whole footer), the layer as a whole a little see-through (75%, one
// group, so where clouds overlap they still merge into one shape), so the white text reads over them. The ground is a
// wide strip of voxel meadow (cut from the owner's "Dreamy Voxel Meadow" image, only the grass, cooled a
// little to sit under a blue sky): footer/ground-mc.webp, GROUND tall (its own 7.85:1 shape at most
// widths, cropped at the sides on narrow screens), with the socials and the credit on it.

const column = 'mx-auto w-[min(calc(100%-32px),1176px)] md:w-[min(calc(100%-64px),1176px)]';
// Blue most of the way down, so the white text reads on it; it whitens only in the last strip before
// the horizon.
const SKY =
  'linear-gradient(to bottom, #2F78CC 0%, #3E86DC 24%, #5594E3 48%, #6EA8EB 70%, #8EBDF2 86%, #C8E0FB 96%, #EEF6FF 100%)';
const FEATHER = 'linear-gradient(to bottom, rgb(var(--paper)), rgb(var(--paper) / 0.75) 30%, rgb(var(--paper) / 0))';
// The top padding leaves a band of open sky above the headline for the clouds.
const TOP = 'clamp(110px, 10vw, 170px)';
const GROUND = 'clamp(130px, calc(100vw / 7.85), 280px)';
const VARS = { '--ground': GROUND, '--top': TOP };
const SKY_IN = 0.7; // Footer: the sky is in once its top is this fraction of the screen up it

const clamp = (x) => Math.min(Math.max(x, 0), 1);
const smooth = (x) => x * x * (3 - 2 * x);

// The sky and its clouds, over the whole footer's box (the gradient ends at the horizon, the meadow's
// top; the haze colour carries on under the meadow). Children go over the gradient.
const HAZE = '#EEF6FF';
// At night (data-theme="dark"; .night-only in index.css fades it in over the day sky): a deep navy sky
// lifting to a dusky blue at the horizon, stars over its upper part and a blocky, Minecraft-style square
// moon. The clouds go grey and the meadow dark (.night-clouds, .night-ground).
const NIGHT_SKY =
  'linear-gradient(to bottom, #060C1D 0%, #0A1530 30%, #112048 58%, #1D2F62 80%, #33477C 93%, #4A5C8C 100%)';
const NIGHT_HAZE = '#4A5C8C';
const Moon = () => (
  <svg viewBox="0 0 8 8" shapeRendering="crispEdges" className="absolute right-[10%] top-[3%] w-[clamp(34px,3.4vw,58px)] lg:left-[50%] lg:right-auto lg:top-[10%] drop-shadow-[0_0_18px_rgb(220_230_255/0.45)]">
    <rect width="8" height="8" fill="#E9EEF8" />
    <rect x="1" y="1" width="2" height="2" fill="#C9D2E6" />
    <rect x="5" y="2" width="1" height="1" fill="#C9D2E6" />
    <rect x="4" y="5" width="2" height="2" fill="#C9D2E6" />
    <rect x="1" y="5" width="1" height="1" fill="#D7DEEE" />
  </svg>
);
export const FooterSky = ({ skyRef, className = '', style, children }) => {
  const mobile = useMobile();
  return (
    <div ref={skyRef} aria-hidden="true" style={{ ...VARS, ...style }} className={`pointer-events-none overflow-hidden ${className}`}>
      <div className="absolute inset-0" style={{ background: HAZE }} />
      <div className="absolute inset-x-0 top-0 bottom-[calc(var(--ground)-12px)]" style={{ background: SKY }} />
      <div className="night-only absolute inset-0" style={{ background: NIGHT_HAZE }}>
        <div className="absolute inset-x-0 top-0 bottom-[calc(var(--ground)-12px)]" style={{ background: NIGHT_SKY }} />
        <div style={STARS} className="stars absolute inset-x-0 top-0 h-[70%] [mask-image:linear-gradient(to_bottom,#000_40%,transparent)]" />
        <Moon />
      </div>
      {children}
      <Clouds clouds={mobile ? FOOTER_CLOUDS_M : FOOTER_CLOUDS} className="night-clouds opacity-75" />
    </div>
  );
};

// The headline and the line under it, white, with soft shadows.
const FooterText = ({ textRef }) => (
  <div ref={textRef}>
    <h2 className="text-[length:clamp(2.6rem,7vw,6rem)] font-medium leading-[0.94] tracking-[-0.04em] text-white [text-shadow:0_2px_22px_rgb(20_60_120/0.28)]">
      Let’s make something
      <span className="block">memorable.</span>
    </h2>
    <p className="mt-4 max-w-[34ch] text-lg font-medium leading-snug text-white [text-shadow:0_1px_3px_rgb(20_60_120/0.35),0_1px_14px_rgb(20_60_120/0.4)]">
      Got an idea? Leave a note and I’ll write back.
    </p>
  </div>
);

// The note card. On desktop it is out of the flow (so it never makes the footer taller than a screen),
// pinned to both sides of its column so it keeps its full width, and it stays in the sky, so the
// horizon is always clear: centred on the text beside it where it can be, moved up if that would bring
// it within NOTE_BOTTOM of the horizon (the sky is the grid's height, down to the meadow), never closer
// than NOTE_TOP to the top (room for the paper clip), and scaled down only if the sky is shorter than
// it plus those margins (`scale`, which leaves `transform` to the scene's slide-in). Measured with
// offsets, not boxes, so the scene's own motion does not throw it off.
const NOTE_TOP = 34;
const NOTE_BOTTOM = 22;
const FooterNote = ({ noteRef }) => {
  const cellRef = useRef(null);
  const fitRef = useRef(null);
  useLayoutEffect(() => {
    const cell = cellRef.current;
    const fit = fitRef.current;
    const grid = cell?.parentElement;
    const text = grid?.firstElementChild;
    if (!cell || !fit || !grid || !text) return undefined;
    const wide = window.matchMedia('(min-width: 1024px)'); // Tailwind's lg, where it sits beside the text
    const place = () => {
      if (!wide.matches) {
        fit.style.top = '';
        fit.style.scale = '';
        return;
      }
      const sky = grid.clientHeight;
      const h = fit.offsetHeight; // its own height, unscaled
      const s = Math.min(1, (sky - NOTE_TOP - NOTE_BOTTOM) / h);
      const mid = text.offsetTop + text.offsetHeight / 2;
      const top = Math.min(Math.max(mid - (h * s) / 2, NOTE_TOP), sky - NOTE_BOTTOM - h * s);
      fit.style.top = `${(top - cell.offsetTop).toFixed(1)}px`;
      fit.style.scale = s < 1 ? s.toFixed(3) : '';
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(grid);
    observer.observe(fit);
    wide.addEventListener('change', place);
    return () => {
      observer.disconnect();
      wide.removeEventListener('change', place);
    };
  }, []);
  return (
    <div ref={cellRef} className="flex justify-center lg:relative lg:self-stretch">
      <div ref={fitRef} className="w-full lg:absolute lg:left-0 lg:right-2 lg:w-auto lg:origin-top">
        <div ref={noteRef} className="pointer-events-auto">
          <NoteCard className="rotate-[-2.5deg]" />
        </div>
      </div>
    </div>
  );
};

// The meadow, with the end of the page on it: socials on the left, the credit on the right (they stack
// on phones), in white over a soft darkening of the near grass. Fog drifts slowly across it: the
// field is four rows from the horizon down, each with two wide, soft patches of pale mist (FOG), half a
// crossing apart, so there is always some. Each patch fades out gradually all the way to its rim (and
// fits inside its box), so it has no edge anywhere. Thicker and smaller far away, thinner and wider up
// close, and slower the farther its row. .grass-fog in index.css.
const FOG = [
  // top / height: the row, in % of the meadow (the rows overlap); w: a patch's width, % of the screen;
  // dur: one crossing, in seconds; alpha: its density at the middle.
  { top: -4, height: 30, w: 30, dur: 150, alpha: 0.3 },
  { top: 6, height: 44, w: 42, dur: 120, alpha: 0.24 },
  { top: 22, height: 60, w: 58, dur: 95, alpha: 0.18 },
  { top: 40, height: 80, w: 80, dur: 75, alpha: 0.13 },
];
// Pale mist, fading out smoothly over its whole radius (no visible rim); two overlapping ovals so a
// patch is not a perfect ellipse. `shift` moves the second oval, so the two patches of a row differ.
const MIST = '236 246 238';
const fade = (a) =>
  `rgb(${MIST} / ${a}) 0%, rgb(${MIST} / ${(a * 0.66).toFixed(3)}) 28%, rgb(${MIST} / ${(a * 0.34).toFixed(3)}) 52%, rgb(${MIST} / ${(a * 0.12).toFixed(3)}) 76%, rgb(${MIST} / 0) 100%`;
const fogPatch = (a, shift) =>
  `radial-gradient(closest-side at ${42 + shift}% 52%, ${fade(a)}), radial-gradient(closest-side at ${64 - shift}% ${44 + shift / 2}%, ${fade(a * 0.7)})`;
// `settled`: the footer is all in view (the Enderman's cue, see Enderman.jsx).
const FooterGround = ({ groundRef, endRef, settled }) => {
  // Decode the meadow early (lib/predecode.js), so the frame it first appears in doesn't hitch.
  usePredecode([ground]);
  return (
    <div ref={groundRef} className="relative z-10 h-[var(--ground)] shrink-0">
      <img src={ground} alt="" draggable={false} className="night-ground pointer-events-none absolute inset-0 size-full select-none object-cover object-top" />
      <div
        aria-hidden="true"
        className="night-fog pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_8%,#000_80%,transparent)]"
      >
        {FOG.flatMap(({ top, height, w, dur, alpha }, row) =>
          [0, 1].map((k) => (
            <div
              key={`${row}-${k}`}
              style={{
                top: `${top}%`,
                height: `${height}%`,
                width: `${w}%`,
                '--fog-dur': `${dur}s`,
                // Half a crossing apart, and each row at its own point.
                '--fog-delay': `${-((k * 0.5 + row * 0.17) % 1) * dur}s`,
                '--fog-to': `${Math.round((100 / w) * 100 + 4)}%`,
                background: fogPatch(alpha, k ? 10 : -6),
              }}
              className="grass-fog absolute left-0"
            />
          ))
        )}
      </div>
      <Enderman active={settled} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_25%,rgb(8_28_14/0.5))]" />
      <div ref={endRef} className={`${column} pointer-events-none relative flex h-full flex-wrap content-end items-end justify-between gap-x-10 gap-y-1 pb-[clamp(10px,1.6vw,24px)]`}>
        {/* Icon-only links (the name is the accessible label and the tooltip). The first icon's left
            edge lines up with the column. */}
        <ul aria-label="Socials" className="pointer-events-auto -ml-[11px] flex flex-wrap gap-1 sm:gap-2">
          {SOCIAL.map(({ name, href, icon }) => (
            <li key={name}>
              <a
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={name === 'Email' ? 'Email sathmikakb@gmail.com' : name}
                title={name}
                className="grid size-12 place-items-center rounded-full text-white drop-shadow-[0_1px_6px_rgb(0_0_0/0.35)] transition-[color,translate] duration-200 hover:-translate-y-0.5 hover:text-beige focus-visible:outline-2 focus-visible:outline-white"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[28px] fill-current">
                  <path d={icon} />
                </svg>
              </a>
            </li>
          ))}
        </ul>
        <p className="pb-2 text-sm text-white/90 [text-shadow:0_1px_8px_rgb(0_0_0/0.45)] lg:pb-3 lg:pr-2">
          © {new Date().getFullYear()} Thimeth Sathmika · Ambitiously crafted
        </p>
      </div>
    </div>
  );
};

// The headline, the note and the meadow, laid out down a screen (or more).
const Layout = ({ textRef, noteRef, groundRef, endRef, settled }) => (
  <>
    <div className={`${column} pointer-events-none relative z-20 grid flex-1 content-start items-start gap-14 pb-6 pt-[var(--top)] lg:grid-cols-[1fr_420px] lg:gap-x-10`}>
      <FooterText textRef={textRef} />
      <FooterNote noteRef={noteRef} />
    </div>
    <FooterGround groundRef={groundRef} endRef={endRef} settled={settled} />
  </>
);

// The ordinary footer (phones, reduced motion, the All work page).
export const Footer = () => {
  const footerRef = useRef(null);
  const skyRef = useRef(null);
  const featherRef = useRef(null);
  const [settled, setSettled] = useState(false);

  // All in view (most of it, on phones where it is taller than the screen): the Enderman's cue.
  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return undefined;
    const io = new IntersectionObserver(([e]) => setSettled(e.intersectionRatio >= 0.85 || e.intersectionRect.height >= window.innerHeight * 0.85), {
      threshold: [0, 0.5, 0.85, 1],
    });
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  // The sky fades in as the footer comes up, and the feather at its top edge shrinks away as it settles
  // (both at once with reduced motion).
  useEffect(() => {
    const footer = footerRef.current;
    const sky = skyRef.current;
    const feather = featherRef.current;
    if (!footer || !sky || !feather) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sky.style.opacity = '1';
      feather.style.transform = 'scaleY(0)';
      return undefined;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const top = footer.getBoundingClientRect().top;
      sky.style.opacity = smooth(clamp((vh - top) / (vh * SKY_IN))).toFixed(3);
      // 0 as the footer's top enters at the bottom, 1 once it reaches the top of the screen.
      feather.style.transform = `scaleY(${(1 - smooth(clamp((vh - top) / vh))).toFixed(3)})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      id="contact"
      data-nav-tone="dark"
      style={VARS}
      className="relative isolate z-[45] flex flex-col bg-[rgb(var(--paper))] font-grotezk text-forest lg:min-h-[min(100svh,56.25vw)]"
    >
      {/* The sky (the whole footer's box, under the meadow). */}
      <FooterSky skyRef={skyRef} style={{ opacity: 0 }} className="absolute inset-0">
        <div ref={featherRef} className="absolute inset-x-0 top-0 h-[45vh] origin-top" style={{ background: FEATHER }} />
      </FooterSky>
      <Layout settled={settled} />
    </footer>
  );
};

// The footer as the pinned scroll's last scene, over the whole stage (the sky is FooterSky, a layer of
// its own further back, so the last certificate cards pass in front of it). Home sets the progress
// (0 → 1) through `control`: the meadow dissolves in first, from the closest grass to the farthest
// (RISE); then, together, the socials come on (END), the headline rises in (TEXT) and the note card
// slides in from the right edge (NOTE), while the sky (its fade is Home's, FOOTER_SKY in Home.jsx) is
// already coming in behind them, so the white text never sits on white.
const RISE = [0, 0.5];
const REVEAL_SOFT = 80; // % of the meadow's height: how soft the front of its dissolve is
// The socials, the headline and the note card come in together.
const END = [0.32, 0.62];
const TEXT = [0.32, 0.62];
const NOTE = [0.32, 0.66];
const span = ([a, b], f) => smooth(clamp((f - a) / (b - a)));
export const FooterScene = ({ control }) => {
  const [settled, setSettled] = useState(false);
  const rootRef = useRef(null);
  const textRef = useRef(null);
  const noteRef = useRef(null);
  const groundRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    const set = (f) => {
      const root = rootRef.current;
      if (!root) return;
      root.style.visibility = f > 0 ? 'visible' : 'hidden';
      setSettled(f >= 0.98); // React skips the render when it has not changed
      // The meadow dissolves in where it is, from the closest grass to the farthest: a fade sweeping up
      // from its bottom edge to the horizon, very soft (REVEAL_SOFT of its height) and eased through
      // smoothstep stops, so its front never reads as a line.
      const rise = smooth(clamp((f - RISE[0]) / (RISE[1] - RISE[0])));
      const g = groundRef.current.style;
      if (rise >= 1) g.maskImage = g.webkitMaskImage = '';
      else {
        const solid = rise * (100 + REVEAL_SOFT) - REVEAL_SOFT; // % up the meadow that is fully in
        const stops = Array.from({ length: 9 }, (_, i) => {
          const t = i / 8;
          return `rgb(0 0 0 / ${(1 - t * t * (3 - 2 * t)).toFixed(3)}) ${(solid + t * REVEAL_SOFT).toFixed(2)}%`;
        });
        g.maskImage = g.webkitMaskImage = `linear-gradient(to top, ${stops.join(', ')})`;
      }
      const end = span(END, f);
      endRef.current.style.opacity = end.toFixed(3);
      const text = span(TEXT, f);
      textRef.current.style.opacity = text.toFixed(3);
      textRef.current.style.transform = `translate3d(0, ${((1 - text) * 28).toFixed(1)}px, 0)`;
      // From the right edge, eased out (it settles); it fades in over the first part, so it never pops.
      const t = clamp((f - NOTE[0]) / (NOTE[1] - NOTE[0]));
      const note = 1 - (1 - t) ** 3;
      noteRef.current.style.opacity = smooth(clamp(t / 0.35)).toFixed(3);
      noteRef.current.style.transform = `translate3d(${((1 - note) * 55).toFixed(2)}vw, 0, 0)`;
    };
    if (control) control.current = { set };
    set(0);
    return () => {
      if (control) control.current = null;
    };
  }, [control]);

  return (
    <div ref={rootRef} style={{ ...VARS, visibility: 'hidden' }} className="pointer-events-none absolute inset-0 flex flex-col overflow-hidden font-grotezk text-forest">
      <Layout textRef={textRef} noteRef={noteRef} groundRef={groundRef} endRef={endRef} settled={settled} />
    </div>
  );
};

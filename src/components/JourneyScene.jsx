import { Fragment, useEffect, useRef, useState } from 'react';
import { GraduationCap, LaptopMinimal, Rocket } from 'lucide-react';
import { CertRing } from './CertRing';
import { isMobile, useMobile } from '../lib/useMobile';
import { CERTS, CERTS_SHOW, HEAD, LINE, STOPS } from './journey';

// The Journey, after Tools in the hero's pinned scroll (after johnbolster.design's "The Journey"):
// Education and Experience as stops along a road, then the certificates. All of it is scroll-driven: the
// hero's scroll hook (useFlyThrough in Home.jsx) calls control.current.set(s) with s = screen heights into
// the scene, and this writes the styles straight to the elements (timing in journey.js).
//
// - "My journey" comes towards you; its letters fill from outline to solid, left to right; "so far"
//   comes in word by word; then both dissolve in place, like the stops.
// - One blue line (after the reference's thread) runs from the bottom of the screen up to a dot: it
//   comes in from the bottom left and hooks up to the dot under the heading, straightens as the heading
//   goes, travels from stop to stop (the dot moves across to the next stop and the line follows it late,
//   bending as it goes), and at "Now" bends away to the right and sweeps off the screen.
// - The stops are flat text in one fixed place, above the dot: the mark (the start year; the latest is
//   "Now") on one side of the middle, the caption on the other (alternating). Each fades in as a blur
//   clears and dissolves the same way in reverse (STOP_IN, STOP_OUT).
// - The road done, the certificates and badges come up on a turning ring with a search bar at the top
//   (CertRing.jsx); scrolling turns the ring until the page moves on.

const ICON = { Education: GraduationCap, Experience: LaptopMinimal };

const clamp = (x) => Math.min(Math.max(x, 0), 1);
const smooth = ([a, b], x) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
// For scroll-scrubbed entrances: starts at once and settles (a smoothstep starts slowly, so the first part
// of the window showed almost nothing and the scene lagged behind the scroll).
const easeOut = ([a, b], x) => 1 - (1 - clamp((x - a) / (b - a))) ** 3;
// A soft-edged mask that shows the text left of p (0 → 1).
const fillMask = (p) => {
  const at = -8 + p * 116;
  return `linear-gradient(90deg, #000 ${at - 8}%, transparent ${at}%)`;
};
// Words reveal one after another: opacity, a small rise, unblur.
const reveal = (words, from, to, x) => {
  const n = words.length;
  words.forEach((el, j) => {
    const span = (to - from) / (n + 4);
    const t = smooth([from + j * span, from + (j + 5) * span], x);
    el.style.opacity = String(t);
    el.style.transform = `translateY(${(1 - t) * 0.45}em)`;
    el.style.filter = t < 1 ? `blur(${(1 - t) * 6}px)` : '';
  });
};
// The spaces stay plain text between the word boxes, so wrapped lines start flush.
const words = (text) =>
  text.split(' ').map((word, i) => (
    <Fragment key={i}>
      {i ? ' ' : ''}
      <span data-w className="inline-block will-change-[transform,opacity]">
        {word}
      </span>
    </Fragment>
  ));

// The line, after johnbolster.design's journey thread: a single curve (one cubic Bezier: its foot, two
// control points and the dot) from the bottom of the screen up to a dot under the text.
// - Under the heading it comes in from the bottom left and hooks up to the dot beside "so far." (the `in`
//   shape); as the heading goes it straightens, its foot sliding in under the dot (LINE.straighten).
// - Through the stops it travels: each stop has its own place across the screen (CENTRES: the first and
//   last in the middle, the ones between a little right and left in turn, SWAY), and between two stops
//   the dot moves across to the next place (`dotX`, eased between KEYS; where the chapter changes it
//   swings out wide the other way first, WIDE). The rest of the line follows the dot late: each point
//   below is where the dot was a little earlier in the scroll (TRAIL), so the line bends as it goes, like
//   a thread being pulled, and hangs straight again once the dot has settled under a stop.
// - As "Now" goes, the dot swings up to the right and the line bends after it (`turn`), then the whole
//   line sweeps off the right edge (`out`) as the certificates come in.
// Shapes are fractions of the screen (x, y); between shapes the four points are blended, so the curve
// morphs smoothly and never kinks.
// (Earlier versions scrolled a winding road down the screen in various ways, and one kept this line
// perfectly still through the stops; the owner found the roads off and the still line dead.)
const DOT_Y = 0.63; // the dot's height through the heading and the stops
const READ_Y = 0.43; // where the stops' text sits (its middle): above the dot, like the heading
const THREAD = 2.4;
const SWAY = 0.09; // how far left / right of the middle the stops in between sit
const WIDE = 0.13; // how far past a stop the dot swings out before crossing at a chapter change
// Phones: a smaller sway (the text is stacked and centred on each stop's place, so it needs the room).
const SWAY_M = 0.05;
const WIDE_M = 0.12;
const TRAIL = [0.39, 0.26, 0.13]; // how far back in the scroll the foot and the two controls follow the dot
const TRAIL_Y = [1.06, 0.92, 0.78];
const SHAPES = {
  in: [[-0.06, 0.96], [0.3, 0.9], [0.6, 0.8], [0.5, DOT_Y]],
  turn: [[0.5, 1.06], [0.5, 0.82], [0.58, 0.66], [0.86, 0.52]],
  out: [[1.1, 1.06], [1.12, 0.84], [1.18, 0.64], [1.3, 0.42]],
};
// Where each stop sits across the screen (the middle of its text, and the dot under it).
const centresFor = (sway) => STOPS.map((_, i) => 0.5 + (i === 0 || i === STOPS.length - 1 ? 0 : (i % 2 ? 1 : -1) * sway));
const CENTRES = centresFor(SWAY);
const CENTRES_M = centresFor(SWAY_M);
// The dot's path across the screen: it rests under a stop while it is read (ARRIVE before its `at`
// until DEPART after), and moves in between.
const ARRIVE = 0.3;
const DEPART = 0.4;
const keysFor = (centres, wide) =>
  STOPS.flatMap((stop, i) => {
    const keys = [
      [stop.at - ARRIVE, centres[i]],
      [stop.at + DEPART, centres[i]],
    ];
    const next = STOPS[i + 1];
    if (next && next.kind !== stop.kind) {
      // A chapter change: out wide, away from where it is going, then across.
      const away = Math.sign(centres[i] - centres[i + 1]) || 1;
      keys.push([(stop.at + DEPART + next.at - ARRIVE) / 2, centres[i] + away * wide]);
    }
    return keys;
  });
const KEYS = keysFor(CENTRES, WIDE);
const KEYS_M = keysFor(CENTRES_M, WIDE_M);
const dotX = (s, keys) => {
  if (s <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (s < keys[i][0]) return keys[i - 1][1] + (keys[i][1] - keys[i - 1][1]) * smooth([keys[i - 1][0], keys[i][0]], s);
  }
  return keys[keys.length - 1][1];
};
const blend = (a, b, t) => a.map((p, i) => [p[0] + (b[i][0] - p[0]) * t, p[1] + (b[i][1] - p[1]) * t]);
// The line's four points at scroll s.
const lineAt = (s, keys) => {
  // The dot, and behind it the trail: where the dot was TRAIL earlier.
  const thread = [...TRAIL.map((lag, i) => [dotX(s - lag, keys), TRAIL_Y[i]]), [dotX(s, keys), DOT_Y]];
  if (s < LINE.turn[0]) return blend(SHAPES.in, thread, smooth(LINE.straighten, s));
  // The turn finishes while the line starts to leave: blend the two motions over their overlap.
  return blend(blend(thread, SHAPES.turn, smooth(LINE.turn, s)), SHAPES.out, smooth(LINE.leave, s));
};

// The stops: flat text, each in its own place (READ_Y of the screen down, the middle of the text, above
// the dot, so the line stays under it and never behind it; CENTRES across), the mark GAP px to one side
// of its middle and the caption GAP px to the other. Each comes in over STOP_IN (eased out, so it answers the scroll at once)
// and goes over STOP_OUT (in screen heights from its `at`): opacity, and a blur that clears / builds
// (STOP_BLUR px at most: blur on text this big is costly); the caption a beat (CAPTION_LAG) after the mark.
const GAP = 84;
const STOP_IN = [-0.5, -0.15];
const STOP_OUT = [0.35, 0.65];
const CAPTION_LAG = 0.06;
const STOP_BLUR = 4;
// How far in (0 → 1 → 0) a stop is at scroll s.
const shownAt = (s, at) => easeOut([at + STOP_IN[0], at + STOP_IN[1]], s) * (1 - smooth([at + STOP_OUT[0], at + STOP_OUT[1]], s));
const showStop = (el, t) => {
  const moving = t > 0.001 && t < 0.999;
  el.style.visibility = t > 0.001 ? 'visible' : 'hidden';
  el.style.opacity = String(t);
  el.style.filter = moving ? `blur(${((1 - t) * STOP_BLUR).toFixed(2)}px)` : '';
  el.style.willChange = moving ? 'opacity, filter' : ''; // only while it is coming or going
};

// Text drawn twice: an outline, and the solid version on top, shown left of the fill point. Both
// layers are padded (and pulled back by the same amount) so the mask covers the descenders and the
// glyphs that overhang their box (the tail of a "y").
const FillText = ({ fillRef, outline, fill, className = '', children, solid }) => (
  <span className={`relative -mx-[0.12em] -my-[0.2em] inline-block ${className}`}>
    <span className="block px-[0.12em] py-[0.2em]" style={{ color: 'transparent', WebkitTextStroke: outline }}>
      {children}
    </span>
    <span ref={fillRef} aria-hidden="true" className={`absolute inset-0 block px-[0.12em] py-[0.2em] ${fill}`} style={{ maskImage: fillMask(0) }}>
      {solid ?? children}
    </span>
  </span>
);

// Desktop: the mark GAP px to one side of the stop's middle and the caption to the other, both centred
// on READ_Y. Phones: stacked and centred on the stop's middle, the mark at MARK_Y_M and the caption from
// CAPTION_Y_M down, both above the dot.
const MARK_Y_M = 0.2;
const CAPTION_Y_M = 0.3;
const Stop = ({ stop, i, stopRef, mobile }) => {
  const Icon = stop.mark === 'Now' ? Rocket : ICON[stop.kind];
  const left = i % 2 === 0; // the mark left of the middle, the caption right; then the other way round
  const c = (mobile ? CENTRES_M : CENTRES)[i] * 100; // the stop's own middle
  const side = (onLeft) => (onLeft ? { right: `calc(${100 - c}% + ${GAP}px)` } : { left: `calc(${c}% + ${GAP}px)` });
  const markPlace = mobile ? { top: `${MARK_Y_M * 100}%`, left: `${c}%`, translate: '-50% -50%' } : { top: `${READ_Y * 100}%`, translate: '0 -50%', ...side(left) };
  const captionPlace = mobile
    ? { top: `${CAPTION_Y_M * 100}%`, left: `${c}%`, translate: '-50% 0' }
    : { top: `${READ_Y * 100}%`, translate: '0 -50%', ...side(!left) };
  return (
    <div ref={stopRef} className="absolute inset-0">
      <span
        data-mark
        aria-hidden="true"
        style={{ visibility: 'hidden', ...markPlace }}
        className={`absolute font-grotezk text-[length:clamp(6.5rem,12.5vw,12.5rem)] font-normal leading-none tracking-[-0.045em] whitespace-nowrap ${
          stop.mark === 'Now' ? 'text-sky' : 'text-forest'
        }`}
      >
        {stop.mark}
      </span>
      <div
        data-caption
        style={{ visibility: 'hidden', ...captionPlace }}
        className={`absolute w-max max-w-[min(84vw,400px)] text-forest md:max-w-[min(30vw,400px)] ${mobile ? 'text-center' : left ? '' : 'text-right'}`}
      >
        <Icon aria-hidden="true" strokeWidth={1.25} className={`mb-4 size-11 ${mobile ? 'mx-auto' : left ? '' : 'ml-auto'}`} />
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-forest/60">
          {stop.kind} · {stop.period}
        </p>
        <h3 className="mt-2 font-grotezk text-[26px] font-medium leading-[1.1] tracking-[-0.02em]">{stop.title}</h3>
        <p className="mt-2 text-[16px] text-forest/70">{stop.organization}</p>
      </div>
    </div>
  );
};

export const JourneyScene = ({ control }) => {
  const mobile = useMobile();
  const rootRef = useRef(null);
  const headRef = useRef(null);
  const headFillRef = useRef(null);
  const soFarRef = useRef(null);
  const stopRefs = useRef([]);
  const barRef = useRef(null);
  const titleRef = useRef(null);
  const bodyRef = useRef(null);
  const spinRef = useRef(null);
  // The ring is mounted only around the time it is on screen (it animates every frame while mounted);
  // its own intro (the cards assembling) plays once it has mostly come in (ringPlay).
  const [ringLive, setRingLive] = useState(false);
  const [ringPlay, setRingPlay] = useState(false);
  const threadRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const soFarWords = [...soFarRef.current.querySelectorAll('[data-w]')];
    const stops = stopRefs.current.map((el) => ({ mark: el.querySelector('[data-mark]'), caption: el.querySelector('[data-caption]') }));

    let liveNow = false;
    let playNow = false;

    // The line: draws in from its foot to the dot with the heading (a dash that grows along the path),
    // then the dot shows; it changes shape only at the transitions (lineAt), and fades as it leaves.
    const drawLine = (s) => {
      const w = root.clientWidth;
      const h = root.clientHeight;
      const [a, c1, c2, dot] = lineAt(s, isMobile() ? KEYS_M : KEYS).map(([x, y]) => [(x * w).toFixed(1), (y * h).toFixed(1)]);
      const line = threadRef.current;
      line.setAttribute('d', `M${a[0]} ${a[1]} C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${dot[0]} ${dot[1]}`);
      const drawn = smooth(LINE.draw, s);
      line.style.strokeDasharray = drawn < 1 ? `${drawn} 1` : '';
      const gone = smooth([LINE.leave[0] + 0.3, LINE.leave[1]], s);
      line.style.opacity = String(drawn > 0 ? 1 - gone : 0);
      dotRef.current.style.opacity = String(smooth([LINE.draw[1] - 0.1, LINE.draw[1] + 0.1], s) * (1 - gone));
      dotRef.current.setAttribute('transform', `translate(${dot[0]} ${dot[1]})`);
    };

    const set = (s) => {
      const h = root.clientHeight;
      root.style.visibility = s > 0 ? 'visible' : 'hidden';

      // The heading.
      const head = headRef.current;
      const come = easeOut(HEAD.come, s);
      const leave = smooth(HEAD.leave, s);
      head.style.visibility = come > 0 && leave < 1 ? 'visible' : 'hidden';
      // It grows in, and leaves the way the stops do: dissolving in place (fading out as a blur builds).
      head.style.opacity = String(come * (1 - leave));
      head.style.transform = `scale(${0.55 + 0.45 * come})`;
      head.style.filter = leave > 0.001 ? `blur(${(leave * 5).toFixed(2)}px)` : '';
      headFillRef.current.style.maskImage = fillMask(smooth(HEAD.fill, s));
      reveal(soFarWords, HEAD.soFar[0], HEAD.soFar[1], s);

      // The line.
      drawLine(s);

      // The stops come and go in place.
      stops.forEach(({ mark, caption }, i) => {
        const at = STOPS[i].at;
        const m = shownAt(s, at);
        const c = shownAt(s - CAPTION_LAG, at);
        showStop(mark, m);
        showStop(caption, c);
      });

      // The certificates: the search bar and the title come down from the top, the ring and its caption
      // up from the bottom; scrolling turns the ring until the page moves on.
      const cIn = easeOut(CERTS_SHOW.in, s);
      const shown = cIn > 0;
      const bar = barRef.current;
      const title = titleRef.current;
      const body = bodyRef.current;
      for (const el of [bar, title, body]) {
        el.style.visibility = shown ? 'visible' : 'hidden';
        el.style.opacity = String(cIn);
      }
      // Short, matched travel (the ring's own entrance is its assemble intro, not a long slide and scale).
      bar.style.transform = `translate3d(0, ${(cIn - 1) * 0.06 * h}px, 0)`;
      title.style.transform = `translate3d(0, ${(cIn - 1) * 0.08 * h}px, 0)`;
      body.style.transform = `translate3d(0, ${(1 - cIn) * 0.12 * h}px, 0)`;
      const live = s > CERTS_SHOW.in[0] - 0.4;
      if (live !== liveNow) {
        liveNow = live;
        setRingLive(live);
      }
      const play = live && cIn > 0.35;
      if (play !== playNow) {
        playNow = play;
        setRingPlay(play);
      }
    };
    if (control) control.current = { set };
    set(0);
    return () => {
      if (control) control.current = null;
    };
  }, [control]);

  return (
    <div ref={rootRef} style={{ visibility: 'hidden' }} className="relative size-full">
      {/* The line, under everything else in the scene. */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full overflow-visible">
        <path ref={threadRef} pathLength="1" fill="none" stroke="#3B82F6" strokeWidth={THREAD} strokeLinecap="round" />
        <g ref={dotRef} style={{ opacity: 0 }}>
          <circle r="8" fill="rgb(59 130 246 / 0.2)" />
          <circle r="3.5" fill="#3B82F6" />
        </g>
      </svg>
      {/* The heading */}
      <div
        ref={headRef}
        style={{ visibility: 'hidden' }}
        className="pointer-events-none absolute inset-0 grid place-items-center will-change-[transform,opacity,filter]"
      >
        <div className="text-center">
          <h2 className="font-grotezk text-[length:clamp(4.5rem,11vw,11rem)] font-medium leading-[0.9] tracking-[-0.045em]">
            <FillText fillRef={headFillRef} outline="1.5px #3B82F6" fill="text-sky">
              My journey
            </FillText>
          </h2>
          {/* Starts just right of the middle, beside the line's dot under it. */}
          <p ref={soFarRef} className="mt-4 pl-[54%] text-left font-grotezk text-[length:clamp(1.25rem,1.8vw,1.6rem)] font-medium tracking-[-0.02em] text-forest">
            {words('so far.')}
          </p>
        </div>
      </div>

      {/* The stops */}
      <ol aria-label="Experience and education">
        {STOPS.map((stop, i) => (
          <li key={stop.key}>
            <Stop
              stop={stop}
              i={i}
              mobile={mobile}
              stopRef={(el) => {
                stopRefs.current[i] = el;
              }}
            />
          </li>
        ))}
      </ol>

      {/* Certificates and badges */}
      <CertRing barRef={barRef} titleRef={titleRef} bodyRef={bodyRef} spin={spinRef} live={ringLive} play={ringPlay} />
    </div>
  );
};

// With reduced motion the pinned scenes are off; this plain list keeps Experience and Education readable.
export const JourneyList = () => (
  <div className="bg-white px-6 py-20 text-forest">
    <div className="mx-auto max-w-3xl">
      <h2 className="font-grotezk text-5xl font-medium tracking-[-0.04em] text-sky">My journey so far.</h2>
      <ol className="mt-10 space-y-8">
        {[...STOPS].reverse().map((stop) => (
          <li key={stop.key}>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-forest/60">
              {stop.kind} · {stop.period}
            </p>
            <h3 className="mt-1 font-grotezk text-2xl font-medium tracking-[-0.02em]">{stop.title}</h3>
            <p className="text-forest/70">{stop.organization}</p>
          </li>
        ))}
      </ol>
      <h2 className="mt-16 font-grotezk text-4xl font-medium tracking-[-0.04em] text-sky">Certificates & badges</h2>
      <ul className="mt-6 space-y-4">
        {CERTS.map((cert) => (
          <li key={cert.key}>
            <a href={cert.url} target="_blank" rel="noopener noreferrer" className="font-grotezk text-xl font-medium hover:text-sky">
              {cert.title}
            </a>
            <p className="text-sm text-forest/70">
              {cert.kind} · {cert.issuer} · {cert.date}
            </p>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

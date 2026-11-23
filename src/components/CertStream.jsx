import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLenis } from 'lenis/react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { CERTS } from './journey';
import { isMobile } from '../lib/useMobile';
import { FACE, faces } from './certFaces';

// The certificates and badges as a field of cards you drift through (after React Bits' Infinite
// Gallery: images in a deep 3D field coming towards you), like the Tools icons (IconStream).
// Scroll-driven and finite: the Journey sets the progress (0 → 1) through `control`; each card leaves
// the far distance at its own point (staggered across the run) and comes towards you over FLIGHT of it,
// from depth FAR (small, near the middle) towards NEAR, moving outward and growing as it nears (offset
// and size ∝ 1 / depth, the offset a share of the screen's half width and height, so tall screens fill
// too), each at its own angle (spread evenly) and slight tilt. It fades in out of the distance (FOG of
// its flight; on phones only briefly, FOG_M) and stays solid until it has left the screen (it is hidden once it is wholly off it; the
// spread is wide enough that every card is off before NEAR). By progress 1 every card has gone.
//
// Click a card to bring it forward: it glides from where it is to the middle of the screen, bigger,
// over a soft white veil, with its details and a View button under it (FocusCard); the page holds still
// meanwhile. Escape, the close button or a click on the veil sends it back into the stream. The title
// in the middle (CertTitle) has a search button for its "&"; picking a match brings that card forward
// the same way (control.current.focus).

const FAR = 4; // depth a card sets off from
const NEAR = 0.4; // depth at the end of its flight (by then it is off the screen)
const FLIGHT = 0.5; // how much of the progress one card's flight takes (about half the cards are out at once)
const SPREAD = 1.1; // how far out a card is at depth 1, as a fraction of the screen's half width / height
const CARD = 0.34; // a card's width at depth 1, as a fraction of the screen's width (at most CARD_MAX px)
const CARD_MAX = 300;
const FOG = 0.3; // fades in out of the distance over this much of its flight
// Phones: solid almost at once (only a quick fade, so it does not pop in): a card crosses so little of a
// narrow screen that a long fade-in left it washed out for much of the time it could be seen.
const FOG_M = 0.05;

const rng = (seed) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};
const smooth = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

export const CertStream = ({ control }) => {
  const rootRef = useRef(null);
  const cardRefs = useRef([]);
  const poses = useRef([]); // where each card is: { x, y, scale, tilt } in the stream's box
  const [urls, setUrls] = useState(null);
  const [focus, setFocus] = useState(null); // { i, from: { cx, cy, width, tilt } } (viewport px)

  useEffect(() => {
    let on = true;
    faces().then((f) => on && setUrls(f));
    return () => {
      on = false;
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const rand = rng(23);
    const golden = Math.PI * (3 - Math.sqrt(5));
    const n = CERTS.length;
    const paths = CERTS.map((_, i) => ({
      angle: i * golden + rand() * 0.4, // spread evenly round the middle, card after card
      wobble: 0.8 + rand() * 0.35,
      tilt: (rand() - 0.5) * 10,
      start: n > 1 ? (i / (n - 1)) * (1 - FLIGHT) : 0,
    }));

    const set = (progress) => {
      const w = root.clientWidth;
      const h = root.clientHeight;
      const card = Math.min(CARD * w, CARD_MAX) / FACE.w; // scale of a face at depth 1
      const fog = isMobile() ? FOG_M : FOG;
      paths.forEach((path, i) => {
        const el = cardRefs.current[i];
        if (!el) return;
        const t = (progress - path.start) / FLIGHT;
        const depth = FAR - t * (FAR - NEAR);
        const k = 1 / depth;
        const scale = card * k;
        const x = (w / 2) * (1 + Math.cos(path.angle) * SPREAD * k * path.wobble);
        const y = (h / 2) * (1 + Math.sin(path.angle) * SPREAD * k * path.wobble);
        // Half its size, a little generous for the tilt.
        const hw = (FACE.w * scale) / 2 + 8;
        const hh = (FACE.h * scale) / 2 + 8;
        const off = x + hw < 0 || x - hw > w || y + hh < 0 || y - hh > h;
        if (t <= 0 || t >= 1 || off) {
          el.style.visibility = 'hidden';
          return;
        }
        poses.current[i] = { x, y, scale, tilt: path.tilt };
        // Sized, not scaled: a scale transform enlarges a picture of the card drawn at one size, which
        // went soft as it grew; setting its size has the browser draw it sharp at every size.
        const cw = FACE.w * scale;
        const ch = FACE.h * scale;
        el.style.visibility = 'visible';
        el.style.width = `${cw.toFixed(1)}px`;
        el.style.height = `${ch.toFixed(1)}px`;
        el.style.transform = `translate(${(x - cw / 2).toFixed(1)}px, ${(y - ch / 2).toFixed(1)}px) rotate(${path.tilt}deg)`;
        el.style.opacity = String(smooth(0, fog, t));
        el.style.zIndex = String(Math.round(k * 100));
      });
    };
    // focus(i, from): bring card i forward from `from` (its centre, width and tilt on the screen).
    if (control) control.current = { set, focus: (i, from) => setFocus({ i, from }) };
    set(0);
    return () => {
      if (control) control.current = null;
    };
  }, [control]);

  const open = (i) => {
    const pose = poses.current[i];
    const box = rootRef.current?.getBoundingClientRect();
    if (!pose || !box) return;
    setFocus({ i, from: { cx: box.left + pose.x, cy: box.top + pose.y, width: FACE.w * pose.scale, tilt: pose.tilt } });
  };
  const close = useCallback(() => {
    setFocus((f) => {
      const card = f && cardRefs.current[f.i];
      if (card?.style.visibility === 'visible') card.querySelector('button')?.focus({ preventScroll: true });
      return null;
    });
  }, []);

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      <ul aria-label="Certificates and badges" className="contents">
        {CERTS.map((cert, i) => (
          <li
            key={cert.key}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            style={{ visibility: 'hidden' }}
            className="absolute left-0 top-0"
          >
            <button
              type="button"
              onClick={() => open(i)}
              aria-label={`${cert.kind}: ${cert.title}. Show details`}
              className={`pointer-events-auto block size-full cursor-pointer overflow-hidden bg-[#FBF6EC] shadow-[0_1px_2px_rgb(20_83_45/0.08),0_24px_50px_-24px_rgb(10_40_22/0.45)] ${
                focus?.i === i ? 'invisible' : ''
              }`}
            >
              {urls && <img src={urls[cert.key]} alt="" draggable={false} className="block size-full select-none" />}
            </button>
          </li>
        ))}
      </ul>
      {focus && createPortal(<FocusCard cert={CERTS[focus.i]} url={urls?.[CERTS[focus.i].key]} from={focus.from} onClose={close} />, document.body)}
    </div>
  );
};

// The card brought forward: a copy of it glides (WAAPI, GLIDE ms, a drawer-like curve) from where it
// was in the stream (`from`: its centre, width and tilt) to the middle of the screen, over a soft white
// veil; its details and the View button rise in under it. Closing runs the glide back, then unmounts.
// While it is open the page does not scroll (Lenis stopped, <html> overflow hidden) and focus is on the
// close button. Reduced motion: a plain fade.
const GLIDE = 520;
const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';
const FocusCard = ({ cert, url, from, onClose }) => {
  const lenis = useLenis();
  const veilRef = useRef(null);
  const cardRef = useRef(null);
  const textRef = useRef(null);
  const closeRef = useRef(null);
  const leaving = useRef(false);
  const still = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Where the card was, as a transform from where it is now.
  const fromTransform = () => {
    const r = cardRef.current.getBoundingClientRect();
    const dx = from.cx - (r.left + r.width / 2);
    const dy = from.cy - (r.top + r.height / 2);
    return `translate(${dx}px, ${dy}px) rotate(${from.tilt}deg) scale(${from.width / r.width})`;
  };

  useLayoutEffect(() => {
    const timing = { duration: still ? 200 : GLIDE, easing: EASE, fill: 'both' };
    veilRef.current.animate([{ opacity: 0 }, { opacity: 1 }], { ...timing, duration: 300 });
    if (still) cardRef.current.animate([{ opacity: 0 }, { opacity: 1 }], timing);
    else cardRef.current.animate([{ transform: fromTransform() }, { transform: 'none' }], timing);
    textRef.current.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], {
      duration: 360,
      delay: still ? 0 : 200,
      easing: EASE,
      fill: 'both',
    });
    closeRef.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const leave = useCallback(() => {
    if (leaving.current) return;
    leaving.current = true;
    const timing = { duration: still ? 160 : 420, easing: EASE, fill: 'forwards' };
    veilRef.current.animate([{ opacity: 1 }, { opacity: 0 }], timing);
    textRef.current.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: 'forwards' });
    const back = still
      ? cardRef.current.animate([{ opacity: 1 }, { opacity: 0 }], timing)
      : cardRef.current.animate([{ transform: 'none' }, { transform: fromTransform() }], timing);
    const done = () => onClose();
    back.finished.then(done).catch(done);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, still]);

  // The page holds still while it is open; Escape closes it.
  useEffect(() => {
    lenis?.stop();
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && leave();
    window.addEventListener('keydown', onKey);
    return () => {
      lenis?.start();
      root.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [lenis, leave]);

  const linked = cert.url && cert.url !== '#';
  return (
    <div role="dialog" aria-modal="true" aria-label={`${cert.kind}: ${cert.title}`} className="theme-flip fixed inset-0 z-[65] grid place-items-center px-6">
      <div ref={veilRef} onClick={leave} className="absolute inset-0 bg-white/75 backdrop-blur-[6px]" />
      <div className="pointer-events-none relative flex w-full max-w-[460px] flex-col items-center">
        <div
          ref={cardRef}
          className="w-full overflow-hidden bg-[#FBF6EC] shadow-[0_2px_4px_rgb(20_83_45/0.08),0_40px_80px_-30px_rgb(10_40_22/0.5)]"
          style={{ aspectRatio: `${FACE.w} / ${FACE.h}` }}
        >
          {url && <img src={url} alt="" draggable={false} className="block size-full select-none" />}
        </div>
        <div ref={textRef} className="pointer-events-auto mt-6 flex flex-col items-center text-center text-forest">
          {/* The face already shows the title, issuer and date: just the description and the buttons. */}
          {cert.description && (
            <p className="w-[min(680px,90vw)] text-pretty text-[15px] leading-relaxed text-forest/80">{cert.description}</p>
          )}
          <div className="mt-5 flex items-center gap-2">
            {linked && (
              <a
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="theme-keep group inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-[13.5px] font-medium text-cream transition-[scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
              >
                View {cert.kind.toLowerCase()}
                <ArrowUpRight
                  aria-hidden="true"
                  strokeWidth={1.75}
                  className="size-4 transition-transform duration-200 ease-out-expo [@media(hover:hover)_and_(pointer:fine)]:group-hover:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5"
                />
              </a>
            )}
            <button
              ref={closeRef}
              type="button"
              onClick={leave}
              className="inline-flex items-center gap-1.5 rounded-full border border-forest/15 bg-white px-4 py-2 text-[13.5px] font-medium text-forest transition-[border-color,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-forest/40 active:scale-[0.97]"
            >
              <X aria-hidden="true" strokeWidth={1.75} className="size-4" />
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// The title in the middle of the stream, "Certificates & badges", whose "&" is the search button: a
// small round button (a soft sky disc with a magnifier badge on its corner). Clicking it turns the title
// into a search bar: the words blur away and an underlined search field fades in in their place (both
// layers share one grid cell, a 300 ms transition, so nothing jumps), focused. Typing lists the matches
// under it (title, issuer, kind, date; at most RESULTS); ↓ / ↑ move through them, Enter or a click brings
// that card forward (it grows out of the search bar). The close button, Escape, leaving the field empty,
// or the title leaving the screen (JourneyScene: `control.current.shown(on)`) turns it back into the
// words. JourneyScene moves and fades the whole thing with the scroll.
const RESULTS = 6;
const matches = (cert, q) => `${cert.title} ${cert.issuer} ${cert.kind} ${cert.date}`.toLowerCase().includes(q);
export const CertTitle = ({ stream, control }) => {
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [pick, setPick] = useState(0);
  const inputRef = useRef(null);
  const ampRef = useRef(null);
  const q = query.trim().toLowerCase();
  const found = q ? CERTS.flatMap((c, i) => (matches(c, q) ? [i] : [])).slice(0, RESULTS) : [];

  const close = useCallback((refocus = false) => {
    setQuery('');
    setPick(0);
    setSearching(false);
    if (refocus) ampRef.current?.focus({ preventScroll: true });
    else inputRef.current?.blur();
  }, []);
  // Back to the words once the title has left the screen, unless something is typed.
  useEffect(() => {
    control.current = {
      shown: (on) => {
        if (!on && !inputRef.current?.value) close();
      },
    };
    return () => {
      control.current = null;
    };
  }, [control, close]);
  const open = () => {
    setSearching(true);
    // Once it is shown (it is not focusable while hidden).
    requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
  };
  const show = (i) => {
    const r = inputRef.current?.getBoundingClientRect();
    if (!r) return;
    stream.current?.focus(i, { cx: r.left + r.width / 2, cy: r.top + r.height / 2, width: Math.min(r.width * 0.5, 160), tilt: 0 });
    close();
  };
  const onKey = (e) => {
    if (e.key === 'Escape') close(true);
    else if (e.key === 'ArrowDown') setPick((p) => Math.min(p + 1, found.length - 1));
    else if (e.key === 'ArrowUp') setPick((p) => Math.max(p - 1, 0));
    else if (e.key === 'Enter' && found.length) show(found[Math.min(pick, found.length - 1)]);
    else return;
    e.preventDefault();
  };
  const layer = 'col-start-1 row-start-1 transition-[opacity,filter,translate,scale] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]';

  return (
    <div className="relative grid place-items-center bg-[radial-gradient(closest-side,rgb(var(--paper))_55%,rgb(var(--paper)/0))] px-6 py-10 md:px-24 md:py-14">
      {/* The words, with the "&" as the search button. */}
      <h2
        className={`${layer} text-center font-grotezk text-[length:clamp(2.2rem,4.2vw,4rem)] font-medium leading-none tracking-[-0.035em] text-sky ${
          searching ? 'scale-[0.97] opacity-0 blur-[6px]' : ''
        }`}
      >
        Certificates{' '}
        <button
          ref={ampRef}
          type="button"
          onClick={open}
          tabIndex={searching ? -1 : 0}
          aria-label="Search certificates and badges"
          title="Search"
          className={`relative inline-grid size-[1.08em] cursor-pointer place-items-center rounded-full bg-sky/10 align-baseline transition-[background-color,scale] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-sky/20 active:scale-[0.94] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky ${
            searching ? 'pointer-events-none' : 'pointer-events-auto'
          }`}
        >
          <span aria-hidden="true" className="translate-y-[0.03em] text-[0.7em] leading-none">
            &amp;
          </span>
          <span aria-hidden="true" className="absolute -bottom-[0.04em] -right-[0.04em] grid size-[0.4em] place-items-center rounded-full bg-sky text-[#fff] ring-[0.05em] ring-white">
            <Search strokeWidth={3} className="size-[62%]" />
          </span>
        </button>{' '}
        badges
      </h2>
      {/* The search bar, in the same place. */}
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className={`${layer} relative w-[min(460px,80vw)] ${searching ? 'pointer-events-auto' : 'pointer-events-none translate-y-1 opacity-0'}`}
      >
        <label htmlFor="cert-search" className="sr-only">
          Search certificates and badges
        </label>
        <Search aria-hidden="true" strokeWidth={1.75} className="pointer-events-none absolute left-0 top-1/2 size-5 -translate-y-1/2 text-sky/70" />
        <input
          ref={inputRef}
          id="cert-search"
          type="search"
          value={query}
          tabIndex={searching ? 0 : -1}
          onChange={(e) => {
            setQuery(e.target.value);
            setPick(0);
          }}
          onBlur={(e) => !e.target.value && close()}
          onKeyDown={onKey}
          placeholder="Search certificates & badges"
          autoComplete="off"
          role="combobox"
          aria-expanded={found.length > 0}
          aria-controls="cert-results"
          className="h-12 w-full appearance-none rounded-none border-0 border-b-2 border-sky/30 bg-transparent pl-8 pr-9 font-grotezk text-[20px] font-medium tracking-[-0.01em] text-forest outline-none transition-colors duration-150 placeholder:text-forest/35 focus:border-sky md:text-[22px] [&::-webkit-search-cancel-button]:hidden"
        />
        <button
          type="button"
          tabIndex={searching ? 0 : -1}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => close(true)}
          aria-label="Close search"
          className="absolute right-0 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-forest/50 transition-colors duration-150 hover:text-forest"
        >
          <X aria-hidden="true" strokeWidth={2} className="size-4" />
        </button>
        {/* The matches. */}
        {searching && q && (
          <ul
            id="cert-results"
            role="listbox"
            className="absolute inset-x-0 top-full mt-3 overflow-hidden rounded-[14px] bg-white text-left shadow-[0_1px_2px_rgb(20_83_45/0.06),0_20px_44px_-20px_rgb(10_40_22/0.4)] ring-1 ring-forest/5"
          >
            {found.length ? (
              found.map((i, n) => (
                <li key={CERTS[i].key} role="option" aria-selected={n === pick}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => show(i)}
                    onPointerEnter={() => setPick(n)}
                    className={`block w-full px-4 py-2.5 text-left transition-colors duration-100 ${n === pick ? 'bg-sky/8' : ''}`}
                  >
                    <span className="block truncate font-grotezk text-[15px] font-medium text-forest">{CERTS[i].title}</span>
                    <span className="block truncate text-[12.5px] text-forest/60">
                      {CERTS[i].kind} · {CERTS[i].issuer} · {CERTS[i].date}
                    </span>
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-[14px] text-forest/55">No match</li>
            )}
          </ul>
        )}
      </form>
    </div>
  );
};

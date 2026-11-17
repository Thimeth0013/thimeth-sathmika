import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import CircularCarousel from './CircularCarousel/CircularCarousel';
import { HCarousel } from './HCarousel';
import { useMobile } from '../lib/useMobile';
import { CERTS } from './journey';

// The Certificates part of the Journey scene: every certificate and badge on a turning ring (React Bits'
// CircularCarousel). The ring is the same size however many cards there are: it has RING_SLOTS slots
// and the cards take turns through them (`slots`), changing over at the back, which is lost in fog (cards
// fade out as they turn away, `fog`, depthFade 1), so only the front arc reads; its sides run off into a
// soft edge. A search bar at the top centre of
// the screen turns the ring to the first match (Enter / ↓ the next, ↑ the previous) rather than
// filtering it. JourneyScene moves the parts in and out (the bar and the title from the top, barRef and
// titleRef; the ring and its caption from the bottom, bodyRef) and turns the ring with the scroll (spin).
//
// The data has no images (the links are the certificates), so each card face is drawn onto a canvas
// from its data, in the site's palette, once the fonts are in (faces()). Click the front card to open it;
// a card at the side turns to the front first.

const FACE = { w: 300, h: 231, scale: 2 };
// The ring always has this many slots, so it is the same size however many certificates there are:
// the cards take turns through the slots as they pass the hidden back.
const RING_SLOTS = 13;
const TYPE_PAUSE = 180; // ms without typing before the ring turns to the match
const CAPTION_REST = 140; // ms the ring rests on a card before the caption changes to it
const INK = '#14532D';
const SKY = '#3B82F6';
const PAPER = '#FBF6EC';

// Wraps text to `width`, at most `max` lines (the last one cut with an ellipsis).
const wrapLines = (ctx, text, width, max) => {
  const lines = [];
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width <= width || !line) line = next;
    else {
      lines.push(line);
      line = word;
    }
  }
  lines.push(line);
  if (lines.length <= max) return lines;
  const kept = lines.slice(0, max);
  let last = kept[max - 1];
  while (last && ctx.measureText(`${last}…`).width > width) last = last.slice(0, -1).trimEnd();
  kept[max - 1] = `${last}…`;
  return kept;
};

// A certificate's seal: a blue rosette.
const seal = (ctx, x, y) => {
  ctx.beginPath();
  for (let i = 0; i <= 40; i++) {
    const a = (i / 40) * Math.PI * 2;
    const r = i % 2 ? 15.5 : 18;
    ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
  }
  ctx.fillStyle = SKY;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y, 11, 0, Math.PI * 2);
  ctx.strokeStyle = PAPER;
  ctx.lineWidth = 1.5;
  ctx.stroke();
};
// A badge: a blue hexagon with a tick.
const badge = (ctx, x, y) => {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    ctx.lineTo(x + Math.cos(a) * 18, y + Math.sin(a) * 18);
  }
  ctx.closePath();
  ctx.fillStyle = SKY;
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 7, y + 0.5);
  ctx.lineTo(x - 2, y + 5.5);
  ctx.lineTo(x + 7.5, y - 5);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2.6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
};

const drawFace = (cert) => {
  const { w, h, scale } = FACE;
  const canvas = document.createElement('canvas');
  canvas.width = w * scale;
  canvas.height = h * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, w, h);
  // The frame: a double rule for certificates, a single one for badges.
  ctx.strokeStyle = 'rgb(20 83 45 / 0.2)';
  ctx.lineWidth = 1;
  ctx.strokeRect(12.5, 12.5, w - 25, h - 25);
  if (cert.kind === 'Certificate') ctx.strokeRect(16.5, 16.5, w - 33, h - 33);

  ctx.fillStyle = 'rgb(20 83 45 / 0.6)';
  ctx.font = '400 10.5px "Azeret Mono", ui-monospace, monospace';
  ctx.letterSpacing = '0.9px';
  ctx.fillText(cert.kind.toUpperCase(), 30, 44);
  ctx.letterSpacing = '0px';
  (cert.kind === 'Badge' ? badge : seal)(ctx, w - 50, 44);

  ctx.fillStyle = INK;
  ctx.font = '500 23px "Apfel Grotezk", system-ui, sans-serif';
  ctx.letterSpacing = '-0.35px';
  wrapLines(ctx, cert.title, w - 60, 3).forEach((line, i) => ctx.fillText(line, 30, 96 + i * 25));
  ctx.letterSpacing = '0px';

  ctx.fillStyle = 'rgb(20 83 45 / 0.12)';
  ctx.fillRect(30, h - 74, w - 60, 1);
  ctx.fillStyle = 'rgb(20 83 45 / 0.78)';
  ctx.font = '400 15px "Apfel Grotezk", system-ui, sans-serif';
  ctx.fillText(wrapLines(ctx, cert.issuer, w - 60, 1)[0], 30, h - 48);
  ctx.fillStyle = 'rgb(20 83 45 / 0.55)';
  ctx.font = '400 10.5px "Azeret Mono", ui-monospace, monospace';
  ctx.fillText(cert.date, 30, h - 28);

  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob ? URL.createObjectURL(blob) : canvas.toDataURL())));
};

// Drawn once per page, after the fonts load.
let facesPromise;
const faces = () => {
  facesPromise ??= (async () => {
    const fonts = ['500 23px "Apfel Grotezk"', '400 15px "Apfel Grotezk"', '400 10.5px "Azeret Mono"'];
    await Promise.all(fonts.map((f) => document.fonts?.load(f).catch(() => null)));
    const urls = await Promise.all(CERTS.map(drawFace));
    return Object.fromEntries(CERTS.map((c, i) => [c.key, urls[i]]));
  })();
  return facesPromise;
};

const matches = (cert, query) => {
  const q = query.trim().toLowerCase();
  return Boolean(q) && `${cert.title} ${cert.issuer} ${cert.kind} ${cert.date}`.toLowerCase().includes(q);
};

export const CertRing = ({ barRef, titleRef, bodyRef, spin, live, play }) => {
  const mobile = useMobile();
  const [query, setQuery] = useState('');
  // Phones: the row's own control, and `spin` (which the search uses to bring a card to the front of the
  // ring) passed on to it: focus scrolls the row to the card.
  const row = useRef(null);
  useEffect(() => {
    if (!mobile) return undefined;
    spin.current = { focus: (index) => row.current?.to(index) };
    return () => {
      spin.current = null;
    };
  }, [mobile, spin]);
  const [urls, setUrls] = useState(null);
  const [active, setActive] = useState(0);
  const [hit, setHit] = useState(0); // which match is at the front (Enter / arrow keys step through them)

  useEffect(() => {
    let on = true;
    faces().then((f) => on && setUrls(f));
    return () => {
      on = false;
    };
  }, []);

  const items = useMemo(
    () => (urls ? CERTS.map((c) => ({ src: urls[c.key], alt: `${c.kind}: ${c.title}, ${c.issuer}, ${c.date}`, title: c.title })) : []),
    [urls]
  );
  // Searching keeps every card on the ring and turns the match to the front.
  const found = useMemo(() => CERTS.flatMap((c, i) => (matches(c, query) ? [i] : [])), [query]);
  const turnTo = (k) => {
    if (!found.length) return;
    const n = ((k % found.length) + found.length) % found.length;
    clearTimeout(turnTimer.current);
    setHit(n);
    turnedTo.current = found[n];
    spin.current?.focus(found[n]);
  };
  // Typing turns the ring to the first match, but only once the typing pauses (TYPE_PAUSE), and only if
  // the first match has changed: turning on every keystroke swung the ring about mid-word.
  const turnTimer = useRef(0);
  const turnedTo = useRef(-1);
  useEffect(() => () => clearTimeout(turnTimer.current), []);
  const search = (value) => {
    setQuery(value);
    setHit(0);
    clearTimeout(turnTimer.current);
    const first = CERTS.findIndex((c) => matches(c, value));
    if (first < 0) {
      turnedTo.current = -1;
      return;
    }
    turnTimer.current = setTimeout(() => {
      if (first === turnedTo.current) return;
      turnedTo.current = first;
      spin.current?.focus(first);
    }, TYPE_PAUSE);
  };
  // The caption follows the front card, but only once the ring has rested on it a moment (CAPTION_REST):
  // while the ring turns it stays put, dimmed, rather than restarting an animation for every card that
  // passes. The change itself is a transition, so it retargets if the ring moves on.
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setShown(active), CAPTION_REST);
    return () => clearTimeout(timer);
  }, [active]);
  const settled = shown === active;
  const onKey = (e) => {
    if (e.key === 'Escape') search('');
    else if (e.key === 'Enter' || e.key === 'ArrowDown') turnTo(hit + (e.shiftKey ? -1 : 1));
    else if (e.key === 'ArrowUp') turnTo(hit - 1);
    else return;
    e.preventDefault();
  };
  const current = CERTS[shown];
  const searching = query.trim() !== '';

  return (
    <>
      {/* The search bar, at the top centre while the ring is on screen; it comes down from the top with
          the title. */}
      <div ref={barRef} style={{ visibility: 'hidden' }} className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center px-4 pt-6 will-change-[transform,opacity]">
        <form role="search" onSubmit={(e) => e.preventDefault()} className="pointer-events-auto relative w-[min(340px,100%)]">
          <label htmlFor="cert-search" className="sr-only">
            Search certificates and badges
          </label>
          <Search aria-hidden="true" strokeWidth={1.75} className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-forest/45" />
          <input
            id="cert-search"
            type="search"
            value={query}
            onChange={(e) => search(e.target.value)}
            onKeyDown={onKey}
            placeholder="Search certificates & badges"
            autoComplete="off"
            className="h-10 w-full appearance-none rounded-none border-0 border-b border-forest/20 bg-transparent pl-7 pr-20 text-[15px] text-forest outline-none transition-colors duration-150 placeholder:text-forest/40 focus:border-forest/60 [&::-webkit-search-cancel-button]:hidden"
          />
          <span className="pointer-events-none absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
            <span aria-live="polite" className="font-mono text-[11px] tabular-nums text-forest/45">
              {!searching ? CERTS.length : found.length ? `${hit + 1}/${found.length}` : 'No match'}
            </span>
            {searching && (
              <button
                type="button"
                onClick={() => search('')}
                aria-label="Clear search"
                className="pointer-events-auto grid size-5 place-items-center text-forest/50 transition-colors hover:text-forest"
              >
                <X aria-hidden="true" strokeWidth={2} className="size-3.5" />
              </button>
            )}
          </span>
        </form>
      </div>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-14">
        {/* The title comes down from the top with the search bar ... */}
        <h2
          ref={titleRef}
          style={{ visibility: 'hidden' }}
          className="font-grotezk text-[length:clamp(2.2rem,3.8vw,3.6rem)] font-medium leading-none tracking-[-0.035em] text-sky will-change-[transform,opacity]"
        >
          Certificates &amp; badges
        </h2>
        {/* ... and the ring and the front card's caption come up from the bottom. */}
        <div ref={bodyRef} style={{ visibility: 'hidden' }} className="w-full will-change-[transform,opacity]">
          <div className="relative mt-4 h-[min(44svh,390px)] w-full [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
            {/* Phones: a swipeable row of the same card faces (HCarousel) instead of the ring. */}
            {mobile && items.length > 0 && (
              <HCarousel control={row} onChange={setActive} label="Certificates and badges" className="absolute inset-0 items-center">
                {items.map((item, index) => (
                  <button
                    key={CERTS[index].key}
                    type="button"
                    onClick={() => {
                      const url = CERTS[index].url;
                      if (url && url !== '#') window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                    aria-label={item.alt}
                    className="block w-[74vw] overflow-hidden rounded-[14px] shadow-[0_14px_34px_-18px_rgb(10_40_22/0.45)] transition-[scale] duration-150 ease-out active:scale-[0.98]"
                  >
                    <img src={item.src} alt="" draggable={false} className="block w-full" style={{ aspectRatio: `${FACE.w} / ${FACE.h}` }} />
                  </button>
                ))}
              </HCarousel>
            )}
            {!mobile && live && items.length > 0 && (
              <CircularCarousel
                items={items}
                control={spin}
                play={play}
                preset="cylinder"
                intro="assemble"
                cardWidth={FACE.w}
                aspectRatio={FACE.w / FACE.h}
                gap={28}
                tilt={-8}
                fixedSize
                fog
                slots={RING_SLOTS}
                speed={5}
                direction="right"
                depthFade={1}
                innerShade={1}
                cornerRadius={14}
                parallax={0.2}
                ariaLabel="Certificates and badges"
                onChange={setActive}
                onItemClick={(item, index, front) => {
                  const url = CERTS[index]?.url;
                  if (front && url && url !== '#') window.open(url, '_blank', 'noopener,noreferrer');
                }}
                className="pointer-events-auto"
              />
            )}
          </div>
          <div className="mt-1 flex min-h-[104px] flex-col items-center px-6 text-center text-forest">
            {current && (
              <div
                className={`transition-[opacity,translate] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${settled ? '' : 'translate-y-1 opacity-40'}`}
              >
                <p className="max-w-[min(560px,90vw)] font-grotezk text-[20px] font-medium leading-tight tracking-[-0.02em]">{current.title}</p>
                <p className="mt-1 text-[14px] text-forest/70">
                  {current.issuer} · {current.date}
                </p>
                <a
                  href={current.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group pointer-events-auto mt-3 inline-flex items-center gap-1.5 rounded-full border border-forest/15 bg-white px-4 py-2 text-[13.5px] font-medium text-forest transition-[border-color,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-forest/40 active:scale-[0.97]"
                >
                  View {current.kind.toLowerCase()}
                  <ArrowUpRight
                    aria-hidden="true"
                    strokeWidth={1.75}
                    className="size-4 transition-transform duration-200 ease-out-expo [@media(hover:hover)_and_(pointer:fine)]:group-hover:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5"
                  />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

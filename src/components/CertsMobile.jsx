import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { HCarousel } from './HCarousel';
import { CERTS } from './journey';
import { FACE, faces } from './certFaces';

// The certificates on phones: the design that was live before the desktop stream (CertStream), kept
// for phones on purpose. "Certificates & badges" and, under it, a search bar come down from the top; a swipeable
// row of the card faces (HCarousel; tap a card to open it) and the front card's caption (title, issuer
// · date, a View link) come up from the bottom. The search does not filter: it scrolls the row to the
// first match once typing pauses (TYPE_PAUSE), Enter / ↓ to the next, ↑ to the previous, with "n/m" or
// "No match" in the bar. JourneyScene moves the parts in and out (barRef and titleRef from the top,
// bodyRef from the bottom). The faces are drawn from the data (certFaces.js).

const TYPE_PAUSE = 180; // ms without typing before the row scrolls to the match
const CAPTION_REST = 140; // ms the row rests on a card before the caption changes to it

const matches = (cert, query) => {
  const q = query.trim().toLowerCase();
  return Boolean(q) && `${cert.title} ${cert.issuer} ${cert.kind} ${cert.date}`.toLowerCase().includes(q);
};

export const CertsMobile = ({ barRef, titleRef, bodyRef }) => {
  const row = useRef(null);
  const [query, setQuery] = useState('');
  const [urls, setUrls] = useState(null);
  const [active, setActive] = useState(0);
  const [hit, setHit] = useState(0); // which match is in front (Enter / arrow keys step through them)

  useEffect(() => {
    let on = true;
    faces().then((f) => on && setUrls(f));
    return () => {
      on = false;
    };
  }, []);

  const items = useMemo(
    () => (urls ? CERTS.map((c) => ({ src: urls[c.key], alt: `${c.kind}: ${c.title}, ${c.issuer}, ${c.date}` })) : []),
    [urls]
  );
  const found = useMemo(() => CERTS.flatMap((c, i) => (matches(c, query) ? [i] : [])), [query]);
  const turnTimer = useRef(0);
  const turnedTo = useRef(-1);
  useEffect(() => () => clearTimeout(turnTimer.current), []);
  const turnTo = (k) => {
    if (!found.length) return;
    const n = ((k % found.length) + found.length) % found.length;
    clearTimeout(turnTimer.current);
    setHit(n);
    turnedTo.current = found[n];
    row.current?.to(found[n]);
  };
  // Typing scrolls the row to the first match, but only once the typing pauses, and only if the first
  // match has changed.
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
      row.current?.to(first);
    }, TYPE_PAUSE);
  };
  // The caption follows the front card once the row has rested on it a moment (CAPTION_REST).
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
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        {/* The title and, under it, the search bar come down from the top ... */}
        <h2
          ref={titleRef}
          style={{ visibility: 'hidden' }}
          className="font-grotezk text-[length:clamp(2.2rem,3.8vw,3.6rem)] font-medium leading-none tracking-[-0.035em] text-sky will-change-[transform,opacity]"
        >
          Certificates &amp; badges
        </h2>
        <div ref={barRef} style={{ visibility: 'hidden' }} className="mt-5 flex w-full justify-center px-6 will-change-[transform,opacity]">
          <form role="search" onSubmit={(e) => e.preventDefault()} className="pointer-events-auto relative w-[min(340px,100%)]">
            <label htmlFor="cert-search-m" className="sr-only">
              Search certificates and badges
            </label>
            <Search aria-hidden="true" strokeWidth={1.75} className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-forest/45" />
            <input
              id="cert-search-m"
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
        {/* ... and the row and the front card's caption come up from the bottom. */}
        <div ref={bodyRef} style={{ visibility: 'hidden' }} className="w-full will-change-[transform,opacity]">
          <div className="relative mt-4 h-[min(44svh,390px)] w-full [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
            {items.length > 0 && (
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
                    className="block w-[74vw] overflow-hidden shadow-[0_14px_34px_-18px_rgb(10_40_22/0.45)] transition-[scale] duration-150 ease-out active:scale-[0.98]"
                  >
                    <img src={item.src} alt="" draggable={false} className="block w-full" style={{ aspectRatio: `${FACE.w} / ${FACE.h}` }} />
                  </button>
                ))}
              </HCarousel>
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
                {current.description && (
                  <p className="mx-auto mt-2 line-clamp-2 max-w-[min(520px,88vw)] text-pretty text-[13px] leading-snug text-forest/75">{current.description}</p>
                )}
                <a
                  href={current.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group pointer-events-auto mt-3 inline-flex items-center gap-1.5 rounded-full border border-forest/15 bg-white px-4 py-2 text-[13.5px] font-medium text-forest transition-[border-color,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-forest/40 active:scale-[0.97]"
                >
                  View {current.kind.toLowerCase()}
                  <ArrowUpRight aria-hidden="true" strokeWidth={1.75} className="size-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

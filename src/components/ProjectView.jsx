import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLenis } from 'lenis/react';
import { ArrowRight, ArrowUpRight, LayoutGrid, X } from 'lucide-react';
import { projectsData } from '../data/projects';
import { ALL_WORK, LINKS, ProjectViewContext } from './projectView';

// The project details view, opened from a project card (ProjectCard.jsx) on the home page's Featured
// Work and on the All work page. It is a full-screen white sheet, minimal and in one column (after
// portavia.framer.website's project pages): tags, a big title, one large image (straight under the title,
// so the card that opened it lands in view), the summary, a row of facts, the links, then Problem / Key
// features / Impact as label-and-text rows, and at the end the next project (with a Next button) and an
// All work button.
//
// It opens by expanding the card: a copy of the card's image (the "ghost") grows from where the card is
// to where the sheet's large image sits, while the sheet fades in around it; closing runs it back to the
// card. The card itself is hidden meanwhile, so the image reads as one object. With reduced motion, or
// when the card or the image is off screen, the sheet just fades.
//
// <ProjectViewProvider> goes inside <ReactLenis> (the sheet stops the page's smooth scroll while open);
// useProjectView() (projectView.js) returns open(project, cardElement, focusElement).

const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)'; // a drawer-like curve: quick off the mark, long settle
const GROW = 560; // ms: the image growing out of the card
const BACK = 420; // ms: and going back
const RADIUS = '18px';

const box = (r) => ({ top: `${r.top}px`, left: `${r.left}px`, width: `${r.width}px`, height: `${r.height}px` });
const onScreen = (r) => r && r.width > 0 && r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Row = ({ label, children }) => (
  <section className="grid gap-3 border-t border-forest/10 py-10 md:grid-cols-[200px_1fr] md:gap-10">
    <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-forest/55 md:pt-1.5">{label}</h3>
    <div className="text-[17px] leading-[1.65] text-forest/85">{children}</div>
  </section>
);

const Sheet = ({ view, onClosed, onSwap }) => {
  const { project, origin, from, focus, swapped } = view;
  const lenis = useLenis();
  const sheetRef = useRef(null);
  const bodyRef = useRef(null);
  const heroRef = useRef(null);
  const ghostRef = useRef(null);
  const closeRef = useRef(null);
  const closing = useRef(false);
  const [settled, setSettled] = useState(!from); // the ghost has handed over to the real image

  // Opening.
  useLayoutEffect(() => {
    const sheet = sheetRef.current;
    const body = bodyRef.current;
    const still = reduced();
    // (Not when it replaces another project's sheet: the white stays, only the content changes.)
    if (!swapped) sheet.animate([{ opacity: 0 }, { opacity: 1 }], { duration: still ? 150 : 320, easing: 'ease-out' });
    if (from && !still) {
      if (origin) origin.style.visibility = 'hidden';
      const to = heroRef.current.getBoundingClientRect();
      const ghost = ghostRef.current;
      const grow = ghost.animate([box(from), box(to)], { duration: GROW, easing: EASE, fill: 'forwards' });
      body.animate(
        [
          { opacity: 0, transform: 'translateY(28px)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 520, delay: 90, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'backwards' }
      );
      grow.finished.then(() => setSettled(true)).catch(() => {});
    } else if (!still) {
      body.animate(
        [
          { opacity: 0, transform: 'translateY(16px)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 420, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The page behind stays put while the sheet is open.
  useEffect(() => {
    lenis?.stop();
    const root = document.documentElement;
    const was = root.style.overflow;
    root.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      root.style.overflow = was;
      lenis?.start();
    };
  }, [lenis]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const sheet = sheetRef.current;
    const done = () => {
      if (origin) origin.style.visibility = '';
      focus?.focus?.({ preventScroll: true });
      onClosed();
    };
    const hero = heroRef.current?.getBoundingClientRect();
    const card = origin?.isConnected ? origin.getBoundingClientRect() : null;
    if (reduced() || !onScreen(hero) || !onScreen(card)) {
      sheet.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'ease-out', fill: 'forwards' }).finished.then(done, done);
      return;
    }
    // Back into the card: the ghost takes over from the image and shrinks to where the card is.
    const ghost = ghostRef.current;
    ghost.style.display = 'block';
    heroRef.current.style.visibility = 'hidden';
    ghost.getAnimations().forEach((a) => a.cancel());
    sheet.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: 'ease-out', fill: 'forwards' });
    ghost.animate([box(hero), box(card)], { duration: BACK, easing: EASE, fill: 'forwards' }).finished.then(done, done);
  }, [origin, focus, onClosed]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  const links = LINKS.filter(({ key }) => project[key]);
  const facts = (project.architecture ?? []).slice(0, 4);
  // The next project: the one before this in the data (the lists show newest first), wrapping round.
  const index = projectsData.findIndex((p) => p.id === project.id);
  const next = projectsData[(index - 1 + projectsData.length) % projectsData.length];
  const nextRef = useRef(null);
  // On to the next project: its image here grows up into the new sheet's large image.
  const goNext = () => onSwap(next, reduced() ? null : nextRef.current?.getBoundingClientRect());
  // All work: on the All work page that is the page behind the sheet, so just close; from the home page,
  // fade the content out and go there (the pages cross-fade where the browser supports it).
  const goAll = (e) => {
    if (document.getElementById('project')) {
      e.preventDefault();
      close();
    } else if (!reduced()) {
      e.preventDefault();
      const leave = () => window.location.assign(ALL_WORK);
      bodyRef.current.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: 'ease-out', fill: 'forwards' }).finished.then(leave, leave);
    }
  };

  return createPortal(
    <>
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title}: project details`}
        data-lenis-prevent
        className="fixed inset-0 z-[60] overflow-y-auto overflow-x-clip overscroll-contain bg-white text-forest theme-flip"
      >
        {/* Close: pinned to the top of the sheet, on the right edge of the content column. */}
        <div className="pointer-events-none sticky top-0 z-10 h-0">
          <div className="mx-auto flex w-[min(calc(100%-32px),920px)] justify-end pt-5 md:pt-7">
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close"
              className="pointer-events-auto inline-flex size-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-forest/15 bg-white/90 text-[14px] font-medium text-forest shadow-[0_6px_18px_-12px_rgb(10_40_22/0.5)] backdrop-blur-sm transition-[border-color,scale] duration-150 ease-out hover:border-forest/40 active:scale-[0.97] md:w-auto md:pl-4 md:pr-3"
            >
              {/* Phones: just the ✕ (a compact round button covers less of the text under it). */}
              <span aria-hidden="true" className="max-md:hidden">Close</span>
              <X aria-hidden="true" strokeWidth={1.75} className="size-5 md:size-4" />
            </button>
          </div>
        </div>

        <article ref={bodyRef} className="mx-auto w-[min(calc(100%-32px),920px)] pb-28 pt-24 md:pt-28">
          <ul className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-forest/20 px-3 py-1 text-[12.5px] text-forest/75">
                {tag}
              </li>
            ))}
            {project.status === 'ongoing' && <li className="rounded-full bg-beige px-3 py-1 text-[12.5px] text-forest">Ongoing</li>}
          </ul>
          <h2 className="mt-6 font-grotezk text-[length:clamp(2.1rem,6vw,4.75rem)] font-medium leading-[0.98] tracking-[-0.04em] [overflow-wrap:anywhere] [hyphens:auto]">{project.title}</h2>
          {/* The large image: where the card's image lands. */}
          <div ref={heroRef} style={{ visibility: settled ? 'visible' : 'hidden', borderRadius: RADIUS }} className="mt-10 aspect-[16/9] overflow-hidden bg-forest/10">
            <img src={project.image} alt={`${project.title} preview`} className="size-full object-cover" />
          </div>

          <p className="mt-10 max-w-[62ch] text-[18px] leading-[1.6] text-forest/75">{project.description}</p>

          {facts.length > 0 && (
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4">
              {facts.map(({ label, value }) => (
                <div key={label}>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-forest/55">{label}</dt>
                  <dd className="mt-1.5 text-[15px] font-medium leading-snug [overflow-wrap:anywhere]">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {links.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2.5">
              {links.map((link, i) => {
                const { key, label } = link;
                const Icon = link.Icon;
                return (
                <a
                  key={key}
                  href={project[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group inline-flex h-11 items-center gap-2 rounded-full border pl-5 pr-[18px] text-[14.5px] font-medium transition-[background-color,border-color,scale] duration-150 ease-out active:scale-[0.97] ${
                    i === 0 ? 'theme-keep border-forest bg-forest text-beige hover:border-[#1B6A3B] hover:bg-[#1B6A3B]' : 'border-forest/20 text-forest hover:border-forest/50'
                  }`}
                >
                  <Icon aria-hidden="true" strokeWidth={1.75} className="size-4" />
                  {/* Apfel Grotezk draws its capitals ~1px above the line box's middle; nudge the label onto the icons' centre.
                      pr is 2px under pl because the arrow icon carries ~3px of empty space on its right. */}
                  <span className="translate-y-px">{label}</span>
                  <ArrowUpRight aria-hidden="true" strokeWidth={1.75} className="size-4 opacity-60" />
                </a>
                );
              })}
            </div>
          )}

          <div className="mt-14">
            {project.problem && <Row label="Problem">{project.problem}</Row>}
            {project.keyFeatures?.length > 0 && (
              <Row label="Key features">
                <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
                  {project.keyFeatures.map((feature) => (
                    <li key={feature} className="flex gap-3 text-[16px] leading-snug">
                      <span aria-hidden="true" className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-sky" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Row>
            )}
            {project.impact && <Row label="Impact">{project.impact}</Row>}
          </div>

          {/* The end: on to the next project, or back to all of them. */}
          <section className="mt-6 border-t border-forest/10 pt-10">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-forest/55">Next project</h3>
              <a
                href={ALL_WORK}
                onClick={goAll}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-forest/20 px-5 text-[14.5px] font-medium text-forest transition-[border-color,scale] duration-150 ease-out hover:border-forest/50 active:scale-[0.97]"
              >
                <LayoutGrid aria-hidden="true" strokeWidth={1.75} className="size-4" />
                All work
              </a>
            </div>
            <button type="button" onClick={goNext} aria-label={`Next project: ${next.title}`} className="group mt-6 block w-full cursor-pointer text-left">
              <span ref={nextRef} style={{ borderRadius: RADIUS }} className="block aspect-[16/9] overflow-hidden bg-forest/10">
                <img src={next.image} alt="" loading="lazy" className="size-full object-cover" />
              </span>
              <span className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                <span className="font-grotezk text-[length:clamp(1.6rem,3.2vw,2.4rem)] font-medium leading-tight tracking-[-0.03em]">{next.title}</span>
                <span className="theme-keep inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-forest bg-forest px-5 text-[14.5px] font-medium text-beige transition-[background-color,border-color,scale] duration-150 ease-out group-hover:border-[#1B6A3B] group-hover:bg-[#1B6A3B] group-active:scale-[0.97]">
                  Next
                  <ArrowRight
                    aria-hidden="true"
                    strokeWidth={1.75}
                    className="size-4 transition-transform duration-200 ease-out-expo [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5"
                  />
                </span>
              </span>
            </button>
          </section>
        </article>
      </div>

      {/* The ghost: the card's image, growing into the sheet's (and back). */}
      {from && (
        <div
          ref={ghostRef}
          aria-hidden="true"
          style={{
            ...box(from),
            display: settled ? 'none' : 'block',
            borderRadius: RADIUS,
            backgroundImage: `url(${project.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          className="pointer-events-none fixed z-[61] will-change-[top,left,width,height]"
        />
      )}
    </>,
    document.body
  );
};

export const ProjectViewProvider = ({ children }) => {
  const [view, setView] = useState(null);
  // open(project, card, focus): `card` is the element the sheet's image grows out of (and goes back to),
  // `focus` the element that gets the focus back on close.
  const open = useCallback((project, card, focus) => setView({ project, origin: card ?? null, from: card?.getBoundingClientRect() ?? null, focus }), []);
  const closed = useCallback(() => setView(null), []);
  // On to the next project: the sheet stays and its content changes; the next project's image (at
  // `rect`, where it sat at the end of the sheet) grows up into the new large image. The card the first
  // sheet came out of stays hidden until then, so show it again.
  const swap = useCallback(
    (project, rect) =>
      setView((v) => {
        if (v?.origin) v.origin.style.visibility = '';
        return { project, origin: null, from: rect ?? null, focus: v?.focus, swapped: true };
      }),
    []
  );
  return (
    <ProjectViewContext.Provider value={open}>
      {children}
      {view && <Sheet key={view.project.id} view={view} onClosed={closed} onSwap={swap} />}
    </ProjectViewContext.Provider>
  );
};

import { useEffect, useRef, useState } from 'react';
import { useLenis } from 'lenis/react';
import { Menu, X } from 'lucide-react';
import { SOCIAL } from '../data/socials';
import { useSmoothAnchor } from '../lib/useSmoothAnchor';

// Phones only (below md; desktop has HeroNav and the SideNav dots). A fixed top bar: TS on the left, a
// menu button on the right. It slides away as you scroll down and comes back as soon as you scroll up
// (or reach the top). Over the hero's sky at the very top it is see-through with cream text; anywhere
// else it is a frosted white bar with forest text, so it reads over every scene.
//
// The menu button opens a side bar from the right: the sections as big links (the current one marked),
// and the social links at the bottom. It closes on a link (which then scrolls there smoothly), on the
// backdrop, on the close button and on Escape; the page behind does not scroll while it is open.

const LINKS = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#work' },
  { name: 'Journey', href: '#journey' },
  { name: 'Contact', href: '#contact' },
];
const SECTIONS = LINKS.map((link) => link.href.slice(1));
const TOP = 40; // px: within this of the top, the bar is see-through and always shown
const DELTA = 6; // px of scroll in one direction before the bar hides or shows

export const MobileNav = () => {
  const lenis = useLenis();
  const smooth = useSmoothAnchor();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [active, setActive] = useState(0);
  const buttonRef = useRef(null);
  const closeRef = useRef(null);

  // Hide on the way down, show on the way up; and which section is current (for the side bar).
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setAtTop(y < TOP);
      if (y < TOP) setHidden(false);
      else if (y > last + DELTA) setHidden(true);
      else if (y < last - DELTA) setHidden(false);
      if (Math.abs(y - last) > DELTA || y < TOP) last = y;
      const line = window.innerHeight * 0.4;
      const passed = SECTIONS.filter((id) => document.getElementById(id)?.getBoundingClientRect().top <= line);
      setActive(Math.max(SECTIONS.indexOf(passed.pop()), 0));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // While the side bar is open: the page stays put, Escape closes it, focus goes in and comes back.
  useEffect(() => {
    if (!open) return undefined;
    lenis?.stop();
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus({ preventScroll: true });
    const button = buttonRef.current;
    return () => {
      lenis?.start();
      window.removeEventListener('keydown', onKey);
      button?.focus({ preventScroll: true });
    };
  }, [open, lenis]);

  const go = (e) => {
    setOpen(false);
    lenis?.start();
    smooth(e);
  };

  const plain = atTop && !open;
  return (
    <div className="md:hidden">
      <header
        className={`theme-flip fixed inset-x-0 top-0 z-50 transition-[translate,background-color,color,box-shadow] duration-300 ease-out-expo ${
          hidden && !open ? '-translate-y-full' : ''
        } ${plain ? 'text-cream' : 'bg-white/85 text-forest shadow-[0_8px_24px_-18px_rgb(10_40_22/0.5)] backdrop-blur-md'}`}
      >
        <div className="mx-auto flex h-14 w-[calc(100%-32px)] items-center justify-between">
          <a href="#home" onClick={smooth} aria-label="Thimeth Sathmika, home" className="font-display text-xl font-semibold tracking-[-0.03em]">
            TS
          </a>
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="-mr-2 grid size-11 place-items-center rounded-full transition-[scale] duration-150 active:scale-[0.94]"
          >
            <Menu aria-hidden="true" strokeWidth={1.75} className="size-6" />
          </button>
        </div>
      </header>

      {/* The side bar and its backdrop. */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[55] bg-forest/30 backdrop-blur-[2px] transition-opacity duration-300 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />
      <nav
        id="mobile-menu"
        aria-label="Menu"
        inert={!open}
        data-lenis-prevent
        className={`fixed inset-y-0 right-0 z-[56] flex w-[min(80vw,320px)] flex-col bg-white text-forest theme-flip transition-[translate,box-shadow] duration-[420ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? 'shadow-[-24px_0_60px_-30px_rgb(10_40_22/0.5)]' : 'translate-x-full'
        }`}
      >
        <div className="flex h-14 items-center justify-between px-6">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-forest/55">Menu</span>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="-mr-2 grid size-11 place-items-center rounded-full transition-[scale] duration-150 active:scale-[0.94]"
          >
            <X aria-hidden="true" strokeWidth={1.75} className="size-6" />
          </button>
        </div>
        <ul className="mt-4 flex flex-col gap-1 px-6">
          {LINKS.map(({ name, href }, i) => (
            <li key={href}>
              <a
                href={href}
                onClick={go}
                aria-current={i === active ? 'location' : undefined}
                className={`flex items-center gap-3 py-2.5 font-grotezk text-[30px] font-medium leading-tight tracking-[-0.03em] transition-colors ${
                  i === active ? 'text-sky' : 'text-forest'
                }`}
              >
                {name}
                {i === active && <span aria-hidden="true" className="size-2 rounded-full bg-sky" />}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-auto px-6 pb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-forest/55">Socials</p>
          <ul className="mt-3 flex gap-1">
            {SOCIAL.map(({ name, href, icon }) => (
              <li key={name}>
                <a
                  href={href}
                  target={href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="grid size-11 place-items-center rounded-full text-forest transition-[scale] duration-150 active:scale-[0.94]"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 fill-current">
                    <path d={icon} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};

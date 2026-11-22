import { useEffect, useRef, useState } from 'react';
import { useSmoothAnchor } from '../lib/useSmoothAnchor';

// Section nav between the hero and the footer (the hero has its own top bar, HeroNav, and the footer
// has its own socials). At rest it is a column of dots on the right edge, vertically centred: one dot
// per section, the current section's a bit bigger and at full strength. Hover a dot and its name (only
// that one) slides out beside it, and the dot grows. Each dot and its name are one link, so clicking
// either one navigates. On
// touch, the first tap opens the menu and the next tap on an item goes there. Layout and motion:
// .side-dial-* in index.css.

const ITEMS = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#work' },
  { name: 'Journey', href: '#journey' },
  { name: 'Contact', href: '#contact' },
];
const items = ITEMS;
const SECTIONS = ITEMS.map((item) => item.href.slice(1));
const ROW = 28; // px between items (the link rows are this tall, so the dot column is one hover area)
const CLOSE_AFTER = 260; // ms after the pointer leaves, so a slip off the edge doesn't snap it shut

export const SideNav = () => {
  const navRef = useRef(null);
  const closeTimer = useRef(0);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [hidden, setHidden] = useState(true);
  const [covered, setCovered] = useState(false);
  const [pointed, setPointed] = useState(null);
  const [tone, setTone] = useState('dark');
  const pointerType = useRef('mouse');

  // Scroll-spy (the last section whose top has passed 40% of the screen). Hidden (it slides away) until
  // About, since the hero has HeroNav. On desktop the footer is the pinned scroll's last scene (#contact
  // is a marker there): the dots stay, white over its blue sky (the stage's data-nav-tone). The ordinary
  // footer (reduced motion) is a section after the page that scrolls up over the dots: once it is over
  // the middle of the screen they fade out where they are and take no clicks or focus (covered).
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      const passed = SECTIONS.filter((id) => document.getElementById(id)?.getBoundingClientRect().top <= line);
      setActive(Math.max(SECTIONS.indexOf(passed.pop()), 0));
      const mid = window.innerHeight / 2;
      // Until About (a marker inside the pinned hero track) is reached; and covered once the footer is
      // over the middle of the screen, where the dots are.
      const about = document.getElementById('about')?.getBoundingClientRect();
      const footer = document.getElementById('contact')?.getBoundingClientRect();
      const hide = Boolean(about && about.top > mid);
      const under = Boolean(footer && document.getElementById('contact').tagName === 'FOOTER' && footer.top < mid);
      setHidden(hide);
      setCovered(under);
      if (hide || under) setOpen(false);
      // Colour: whatever is behind the nav says whether it is dark (white nav) or light (forest nav)
      // through data-nav-tone (the hero track changes its own as the sky fades to white).
      const behind = document
        .elementsFromPoint(window.innerWidth - 80, mid)
        .map((el) => el.closest('[data-nav-tone]'))
        .find(Boolean);
      setTone(behind?.dataset.navTone === 'light' ? 'light' : 'dark');
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

  // While open: Escape closes it, and so does a tap or click anywhere else.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onDown = (e) => !navRef.current?.contains(e.target) && setOpen(false);
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Hover opens it only for a real mouse; touch opens it with a first tap (see go below).
  const onEnter = (e) => {
    if (e.pointerType !== 'mouse') return;
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const onLeave = (e) => {
    if (e.pointerType !== 'mouse') return;
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setPointed(null);
    }, CLOSE_AFTER);
  };

  const offset = (i) => (i - (items.length - 1) / 2) * ROW;

  // A tap on a closed menu (touch or pen) only opens it, so you can see where you're going.
  // Mouse clicks and keyboard (detail 0) navigate straight away.
  const smooth = useSmoothAnchor(); // scroll there through the scenes, not a jump
  const go = (e) => {
    if (!open && pointerType.current !== 'mouse' && e.detail !== 0) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    setOpen(false);
    smooth(e);
  };

  return (
    <nav
      ref={navRef}
      aria-label="Sections"
      inert={hidden || covered}
      data-open={open || undefined}
      // Desktop only: phones have the top bar's menu (MobileNav).
      className={`side-dial theme-flip pointer-events-none fixed right-0 top-1/2 z-40 size-0 max-md:hidden transition-[translate,opacity,color] duration-500 ease-out-expo ${
        tone === 'light' ? 'text-[#fff]' : 'text-forest'
      } ${
        hidden ? 'translate-x-8 opacity-0' : covered ? 'opacity-0' : ''
      }`}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onPointerDown={(e) => (pointerType.current = e.pointerType)}
      // Keyboard focus opens it (not the focus that comes with a tap or click).
      onFocus={(e) => e.target.matches(':focus-visible') && setOpen(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
    >
      {/* Everything is positioned around the nav's origin: the middle of the right edge. */}

      {/* One link per item: a 56px-wide row on the edge holding its dot, with the name hanging off
          its left side. The rows touch, so the dot column is one continuous hover area. */}
      <ul onPointerLeave={() => setPointed(null)}>
        {items.map(({ name, href }, i) => {
          const current = i === active;
          const lit = i === (pointed ?? active);
          return (
            <li key={name} style={{ top: offset(i) }} className="absolute right-0 -translate-y-1/2">
              <a
                href={href}
                aria-current={current ? 'location' : undefined}
                onClick={go}
                onPointerEnter={(e) => {
                  setPointed(i);
                  onEnter(e); // reopens after a click, when the pointer never left the nav
                }}
                onFocus={() => setPointed(i)}
                className="group pointer-events-auto relative flex h-7 w-14 cursor-pointer items-center justify-end pr-[18px] focus-visible:outline-none"
              >
                {/* The dot: one size, scaled down unless it is the current (or pointed-at) section. */}
                <span
                  aria-hidden="true"
                  className={`size-2.5 rounded-full bg-current transition-[scale,opacity] duration-300 ease-out-expo ${
                    lit ? 'opacity-100' : 'scale-[0.56] opacity-40'
                  }`}
                />
                {/* Its name: shown only while its dot is the one hovered or focused, centred in a slot of
                    the same width for every item, so the names share a centre line; the slot overlaps
                    the row by 25px, so the name sits close to its dot. */}
                <span
                  data-shown={i === pointed || undefined}
                  className="side-dial-name absolute right-[calc(100%-25px)] top-1/2 w-24 whitespace-nowrap rounded-full py-0.5 text-center font-grotezk text-[17px] font-medium leading-6 tracking-[-0.01em] group-focus-visible:outline-2 group-focus-visible:outline-current"
                >
                  {name}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

import { useEffect, useRef, useState } from 'react';

// Skill icons streaming out of the middle of the screen towards you as you scroll, like flying through
// a starfield. Scroll-driven and finite: the parent sets the progress (0 → 1) through `control`; each
// icon launches at its own point (staggered across the run) and flies over FLIGHT of it, from depth
// FAR (small, near the empty middle) to NEAR (big, past the edges), moving outward and growing (screen
// offset and size ∝ 1 / depth). By progress 1 every icon has gone, so the page can move on. Hover an
// icon to see the technology's name.

const FAR = 4.2; // depth an icon launches at
const NEAR = 0.6; // depth it leaves at (past the edges)
const FLIGHT = 0.32; // how much of the progress one icon's flight takes
const SPREAD = 0.5; // how far out (fraction of the screen's half-diagonal) an icon is at depth 1
const TILE = 64; // px: an icon's size at depth 1 (scaled with 1 / depth, from about 0.4 to 1.7)
const BLANK = 0.18; // the empty middle: an icon fades in over this much of its flight

// Seeded, so the directions look random but are the same on every load.
const rng = (seed) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

export const IconStream = ({ items, control, className = '' }) => {
  const rootRef = useRef(null);
  const tileRefs = useRef([]);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const rand = rng(11);
    const golden = Math.PI * (3 - Math.sqrt(5));
    const n = items.length;
    const paths = items.map((_, i) => ({
      angle: i * golden * 3.1 + rand() * 0.6,
      wobble: 0.85 + rand() * 0.3,
      start: n > 1 ? (i / (n - 1)) * (1 - FLIGHT) : 0,
    }));

    const set = (progress) => {
      const w = root.clientWidth;
      const h = root.clientHeight;
      const reach = Math.hypot(w, h) / 2;
      paths.forEach((path, i) => {
        const el = tileRefs.current[i];
        if (!el) return;
        const t = (progress - path.start) / FLIGHT;
        if (t <= 0 || t >= 1) {
          el.style.visibility = 'hidden';
          return;
        }
        const depth = FAR - t * (FAR - NEAR);
        const k = 1 / depth;
        const x = w / 2 + Math.cos(path.angle) * SPREAD * reach * k * path.wobble;
        const y = h / 2 + Math.sin(path.angle) * SPREAD * reach * k * path.wobble * 0.82;
        const size = Math.min(0.25 + 0.75 * k, 1.7);
        el.style.visibility = 'visible';
        el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${size})`;
        el.style.opacity = String(Math.min(t / BLANK, 1));
        el.style.zIndex = String(Math.round(k * 100));
      });
    };
    if (control) control.current = { set };
    set(0);
    return () => {
      if (control) control.current = null;
    };
  }, [items, control]);

  return (
    <div ref={rootRef} className={`relative h-full w-full overflow-hidden ${className}`}>
      <ul aria-label="Tools I work with" className="contents">
        {items.map(({ name, src }, i) => (
          <li
            key={name}
            ref={(el) => {
              tileRefs.current[i] = el;
            }}
            onPointerEnter={() => setHovered(i)}
            onPointerLeave={() => setHovered((c) => (c === i ? null : c))}
            className="pointer-events-auto absolute left-0 top-0 will-change-transform"
            style={{ visibility: 'hidden' }}
          >
            <span
              className="grid place-items-center rounded-[16px] bg-white shadow-[0_1px_2px_rgb(20_83_45/0.06),0_10px_24px_-10px_rgb(10_40_22/0.35)] ring-1 ring-forest/5"
              style={{ width: TILE, height: TILE }}
            >
              <img src={src} alt="" draggable={false} className="size-[58%] select-none object-contain" />
            </span>
            <span
              className={`pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-sky px-2.5 py-1 font-grotezk text-[13px] font-medium text-white transition-opacity duration-150 ${
                hovered === i ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {name}
            </span>
            <span className="sr-only">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

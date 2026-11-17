// Icon Folder (from 21st.dev, "icon-folder"), converted to JSX: a glass folder with app-icon tiles fanned
// out of it. It pops in when it scrolls into view; hovering (or tapping, or keyboard focus on one of its
// icons) spreads the icons wider, and hovering an icon lifts it and shows its label. The folder tab shape
// is drawn to the real card width.
// Local changes: one light theme tuned to the site's palette (THEME) instead of the dark / light pair and
// no sample icons; the text inherits the page font; and a tile with an `href` is a real link (so the
// folder itself is a group that spreads on hover / tap / focus, not a button wrapping links).
import { useEffect, useId, useRef, useState } from 'react';

const THEME = {
  ink: '#14532D',
  chipBg: 'rgba(255,255,255,.72)',
  chipBorder: 'rgba(20,83,45,.14)',
  chipInk: 'rgba(20,83,45,.7)',
  back: 'linear-gradient(180deg,rgba(255,255,255,.55),rgba(255,255,255,.3) 60%)',
  backEdge: 'rgba(255,255,255,.75)',
  front: 'linear-gradient(160deg,rgba(255,255,255,.96),rgba(251,246,236,.72) 55%),rgba(251,246,236,.7)',
  frontEdge: ['rgba(255,255,255,1)', 'rgba(20,83,45,.08)', 'rgba(20,83,45,.05)'],
  glow: 'rgba(255,255,255,.5)',
  pillBg: 'rgba(255,255,255,.85)',
  pillBorder: 'rgba(20,83,45,.1)',
  tileRing: 'rgba(0,0,0,.08)',
  tileShadow: 'rgba(10,40,22,.28)',
  focus: 'rgba(20,83,45,.5)',
};

/* folder outlines: front pocket has its tab on the left, back plate on the right */
const pathL = (w, h, r, d, tw, s) =>
  `M0 ${r}A${r} ${r} 0 0 1 ${r} 0L${tw} 0C${tw + s * 0.55} 0 ${tw + s * 0.45} ${d} ${tw + s} ${d}L${w - r} ${d}A${r} ${r} 0 0 1 ${w} ${d + r}L${w} ${h - r}A${r} ${r} 0 0 1 ${w - r} ${h}L${r} ${h}A${r} ${r} 0 0 1 0 ${h - r}Z`;
const pathR = (w, h, r, d, tw, s) => {
  const x = w - tw;
  return `M0 ${d + r}A${r} ${r} 0 0 1 ${r} ${d}L${x - s} ${d}C${x - s * 0.45} ${d} ${x - s * 0.55} 0 ${x} 0L${w - r} 0A${r} ${r} 0 0 1 ${w} ${r}L${w} ${h - r}A${r} ${r} 0 0 1 ${w - r} ${h}L${r} ${h}A${r} ${r} 0 0 1 0 ${h - r}Z`;
};

const useShape = (ref, make) => {
  const [d, setD] = useState('');
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => setD(make(el.offsetWidth, el.offsetHeight)));
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return d;
};

const Tile = ({ icon, ring, shadow }) => (
  <div
    className="grid h-full w-full place-items-center overflow-hidden rounded-[inherit]"
    style={{ background: icon.src ? undefined : (icon.background ?? '#2a2a2a'), boxShadow: `0 18px 40px ${shadow}, 0 0 0 1px ${ring}` }}
  >
    {icon.src ? <img src={icon.src} alt="" draggable={false} className="h-full w-full object-cover" /> : icon.node}
  </div>
);

// icons: [{ label, node | src, background, href }]. showLabels: the name tooltip over a hovered icon;
// showPill: the row of small copies of the icons in the pocket's corner.
export const IconFolder = ({ title = '', tags = [], icons = [], defaultOpen = false, spread = 70, showPill = true, showLabels = true, className = '' }) => {
  const t = THEME;
  const gid = useId().replace(/:/g, '');

  const rootRef = useRef(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(defaultOpen);
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hi, setHi] = useState(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => setOpen(defaultOpen), [defaultOpen]);
  useEffect(() => setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches), []);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShown(true), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const frontD = useShape(frontRef, (w, h) => pathL(w, h, 24, 24, Math.round(w * 0.42), 46));
  const backD = useShape(backRef, (w, h) => pathR(w, h, 24, 24, Math.round(w * 0.4), 46));

  const n = icons.length;
  const rs = n > 1 ? 25 / (n - 1) : 0; // degrees of tilt per step
  const wide = open || hover || focused;
  const lift = wide;
  const ease = 'cubic-bezier(.2,.8,.2,1)';

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label={`${title}: ${tags.join(', ')}`}
      // A tap on the folder (not on an icon) spreads it or closes it again.
      onClick={() => setOpen((o) => !o)}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
      onPointerLeave={() => {
        setHover(false);
        setHi(null);
      }}
      onFocus={(e) => setFocused(e.target.matches(':focus-visible'))}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
      className={`relative isolate h-[286px] w-full max-w-[420px] cursor-pointer select-none tracking-[-0.03em] [-webkit-tap-highlight-color:transparent] ${className}`}
      style={{
        color: t.ink,
        zIndex: lift ? 2 : undefined,
        opacity: shown || reduced ? 1 : 0,
        transform: shown || reduced ? (lift ? 'translateY(-6px) scale(1.02)' : 'none') : 'translateY(34px) scale(.92)',
        transition: reduced ? 'none' : `transform .9s ${ease}, opacity .6s ease`,
      }}
    >
      {/* soft glow behind the folder */}
      <div
        className="pointer-events-none absolute left-[8%] right-[8%] top-10 -z-10 h-[200px] rounded-full opacity-80 blur-[18px]"
        style={{ background: `radial-gradient(closest-side, ${t.glow}, transparent)` }}
      />

      {/* back plate */}
      <div ref={backRef} className="absolute inset-x-0 bottom-0 top-[14px]" style={{ background: t.back, clipPath: backD ? `path('${backD}')` : undefined }}>
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <path d={backD} fill="none" stroke={t.backEdge} strokeWidth="2" />
        </svg>
      </div>

      {/* fanned icons */}
      <ul className="pointer-events-none absolute inset-0">
        {icons.map((icon, i) => {
          const k = i - (n - 1) / 2;
          const gap = wide ? spread * 1.15 : spread;
          const y = k * k * 9 - (wide ? 4 : 0);
          const rot = k * rs * (wide ? 1.2 : 1);
          const Box = icon.href ? 'a' : 'div';
          return (
            <li
              key={i}
              className="absolute left-1/2 top-[42px] -ml-[50.5px] h-[101px] w-[101px] rounded-[26px] [backface-visibility:hidden]"
              style={{
                zIndex: hi === i ? 5 : undefined,
                opacity: shown || reduced ? 1 : 0,
                transform: shown || reduced ? `translate3d(${k * gap}px, ${y}px, 0) rotate(${rot}deg)` : `translate3d(${k * spread * 0.6}px, 80px, 0)`,
                transition: reduced ? 'none' : `transform ${wide ? 0.6 : 0.9}s ${ease}, opacity .5s`,
                transitionDelay: reduced ? '0s' : wide ? `${i * 0.04}s` : `${0.35 + i * 0.08}s`,
              }}
            >
              <Box
                {...(icon.href
                  ? { href: icon.href, target: '_blank', rel: 'noopener noreferrer', 'aria-label': icon.label, onClick: (e) => e.stopPropagation(), onFocus: () => setHi(i), onBlur: () => setHi((h) => (h === i ? null : h)) }
                  : {})}
                className="pointer-events-auto relative block h-full w-full rounded-[inherit] focus-visible:outline-2 focus-visible:outline-offset-4"
                onPointerEnter={(e) => e.pointerType === 'mouse' && setHi(i)}
                onPointerLeave={() => setHi((h) => (h === i ? null : h))}
                style={{
                  outlineColor: t.focus,
                  transform: hi === i ? `translateY(-26px) rotate(${-rot}deg) scale(1.1)` : hi !== null ? 'scale(.96)' : 'none',
                  filter: hi !== null && hi !== i ? 'saturate(.75) brightness(.85)' : 'none',
                  transition: reduced ? 'none' : `transform .45s ${ease}, filter .3s ease`,
                }}
              >
                <Tile icon={icon} ring={t.tileRing} shadow={t.tileShadow} />
                {showLabels && icon.label && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-full left-1/2 mb-2.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium leading-4 tracking-normal backdrop-blur-[8px]"
                    style={{
                      background: t.pillBg,
                      borderColor: t.pillBorder,
                      color: t.ink,
                      opacity: hi === i ? 1 : 0,
                      transform: `translateX(-50%) translateY(${hi === i ? 0 : 6}px)`,
                      transition: reduced ? 'none' : `opacity .25s ease, transform .35s ${ease}`,
                    }}
                  >
                    {icon.label}
                  </span>
                )}
              </Box>
            </li>
          );
        })}
      </ul>

      {/* glass front pocket */}
      <div
        ref={frontRef}
        className="absolute inset-x-0 bottom-0 h-[180px] overflow-hidden backdrop-blur-[18px] backdrop-saturate-150"
        style={{
          background: t.front,
          clipPath: frontD ? `path('${frontD}')` : undefined,
          transform: lift ? 'translateY(6px)' : 'none',
          transition: reduced ? 'none' : `transform .6s ${ease}`,
        }}
      >
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id={`edge-${gid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={t.frontEdge[0]} />
              <stop offset=".35" stopColor={t.frontEdge[1]} />
              <stop offset="1" stopColor={t.frontEdge[2]} />
            </linearGradient>
          </defs>
          <path d={frontD} fill="none" stroke={`url(#edge-${gid})`} strokeWidth="2" />
        </svg>

        <h3 className="m-0 px-[18px] pt-[34px] font-grotezk text-xl font-medium leading-[26px]">{title}</h3>
        <div className="mx-[18px] mt-3.5 flex flex-wrap gap-1.5" aria-hidden="true">
          {tags.map((tag) => (
            <span
              key={tag}
              className="h-6 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs leading-5 tracking-normal backdrop-blur-[7px]"
              style={{
                background: t.chipBg,
                borderColor: hi !== null && icons[hi]?.label === tag ? t.focus : t.chipBorder,
                color: hi !== null && icons[hi]?.label === tag ? t.ink : t.chipInk,
                transition: 'border-color .25s ease, color .25s ease',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {showPill && (
          <span className="absolute bottom-3.5 right-3.5 flex h-[34px] items-center gap-1.5 rounded-full border px-1.5" style={{ background: t.pillBg, borderColor: t.pillBorder }} aria-hidden="true">
            {icons.map((icon, i) => (
              <span key={i} className="block h-[22px] w-[22px] overflow-hidden rounded-[7px]">
                <span className="grid h-full w-full place-items-center [&_svg]:h-[60%] [&_svg]:w-[60%]" style={{ background: icon.src ? undefined : icon.background }}>
                  {icon.src ? <img src={icon.src} alt="" className="h-full w-full object-cover" /> : icon.node}
                </span>
              </span>
            ))}
          </span>
        )}
      </div>
    </div>
  );
};

import { useLayoutEffect, useRef } from 'react';
import { NoteCard } from '../NoteCard';
import GradientASCII from '../GradientASCII';
import { SOCIAL } from '../../data/socials';

// Brand marks from Simple Icons (CC0), 24×24.
const column = 'mx-auto w-[min(calc(100%-32px),1176px)] md:w-[min(calc(100%-64px),1176px)]';
const heading = 'mb-4 font-mono text-[11px] uppercase tracking-[0.08em] text-forest/55';

// The ASCII effect (horizon shape, light mode) in the palette's blues: deep blue band, sky blue on top,
// no pale "sun" halo, so the footer's top edge reads as a clear blue edge.
const ASCII_COLORS = ['#1D4ED8', '#F6F8FF', '#BFD6FB', '#3B82F6'];
// At the headline, the effect's blue fades into its white arc between about 47% and 70% of its box.
// The box is sized so that fade lands on the break between "something" (white text, on blue) and
// "that matters." (blue text, on the white under the arc). The arc itself is left as it is.
const BREAK_AT = 0.57;

export const Footer = () => {
  const footerRef = useRef(null);
  const headlineRef = useRef(null);
  const glowRef = useRef(null);

  // Fit the glow's box to the headline (its size and line count change with the screen).
  useLayoutEffect(() => {
    const footer = footerRef.current;
    const headline = headlineRef.current;
    const glow = glowRef.current;
    if (!footer || !headline || !glow) return undefined;
    const fit = () => {
      const brk = headline.querySelector('span').getBoundingClientRect().top - footer.getBoundingClientRect().top;
      glow.style.height = `${Math.round(brk / BREAK_AT)}px`;
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(headline);
    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} id="contact" data-nav-tone="dark" className="relative isolate z-[45] bg-white font-grotezk text-forest">
      {/* ASCII background: React Bits' GradientASCII (horizon shape, light mode) in the palette's blues,
          without the top halo or the intro reveal (which left the top centre white for the first seconds). Its box is fitted to the headline (see fit above). The content sits above
          it (z-10). */}
      <div ref={glowRef} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[400px] overflow-hidden">
        <GradientASCII lightMode colors={ASCII_COLORS} sun={false} intro={false} />
      </div>
      {/* Phones stack headline, note, then the end row. On desktop the note sits in the right column,
          lifted so its top rides above the footer's top edge (over the section before) while the glow
          passes behind it. The headline may sit over the glow. */}
      <div className={`${column} relative z-10 grid items-start gap-14 pb-12 pt-[clamp(56px,6vw,100px)] md:pb-16 lg:grid-cols-[1fr_420px] lg:gap-x-10`}>
        <div>
          <h2
            ref={headlineRef}
            className="text-[length:clamp(2.6rem,7vw,6rem)] font-medium leading-[0.94] tracking-[-0.04em] text-white"
          >
            Let’s make something
            <span className="block text-sky">memorable.</span>
          </h2>
          <p className="mt-4 max-w-[34ch] text-lg leading-snug text-forest/70">
            Got an idea? Leave a note and I’ll write back.
          </p>
        </div>

        <div className="flex justify-center lg:-mt-[calc(clamp(56px,6vw,100px)+80px)] lg:justify-end">
          <NoteCard className="rotate-[-2.5deg] lg:mr-2" />
        </div>

        {/* The end of the page: socials on the left, the credit on the right, on one line. */}
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 lg:col-span-2">
          <div>
            <p className={heading}>Socials</p>
            {/* Icon-only links (the name is the accessible label and the tooltip). The first icon's
                left edge lines up with the column. */}
            <ul className="-ml-[11px] flex flex-wrap gap-2">
              {SOCIAL.map(({ name, href, icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    target={href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    aria-label={name === 'Email' ? 'Email sathmikakb@gmail.com' : name}
                    title={name}
                    className="grid size-13 place-items-center rounded-full text-forest transition-[color,translate] duration-200 hover:-translate-y-0.5 hover:text-sky focus-visible:outline-2 focus-visible:outline-forest"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[30px] fill-current">
                      <path d={icon} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-forest/60 sm:pb-7 lg:pr-2">
            © {new Date().getFullYear()} Thimeth Sathmika · Ambitiously crafted
          </p>
        </div>
      </div>
    </footer>
  );
};

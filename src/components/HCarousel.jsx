import { Children, useEffect, useRef } from 'react';

// A simple horizontal carousel for phones (Featured Work and the certificates): a native, swipeable row
// with each slide snapping to the middle. The page scroll can move it too, through `control`:
// control.current.by(fraction) moves it by that fraction of its whole length (the scenes call this as
// you scroll through their hold, so scrolling never feels dead), and control.current.to(index) brings a
// slide to the middle smoothly (search). onChange(index) reports the slide in the middle.
//
// Snapping is held off while the page scroll is moving it (it would fight the small steps) and comes
// back a moment after.

const SNAP_BACK = 220; // ms after the last page-scroll step before snapping returns

export const HCarousel = ({ control, onChange, label, className = '', children }) => {
  const ref = useRef(null);
  const timer = useRef(0);
  const current = useRef(-1);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const row = ref.current;
    if (!row) return undefined;
    const middle = () => {
      const centre = row.scrollLeft + row.clientWidth / 2;
      let best = 0;
      let gap = Infinity;
      [...row.children].forEach((slide, i) => {
        const d = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - centre);
        if (d < gap) {
          gap = d;
          best = i;
        }
      });
      if (best !== current.current) {
        current.current = best;
        onChangeRef.current?.(best);
      }
    };
    let frame = 0;
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(() => ((frame = 0), middle()));
    };
    row.addEventListener('scroll', onScroll, { passive: true });
    middle();
    if (control) {
      control.current = {
        by: (fraction) => {
          if (!fraction) return;
          row.style.scrollSnapType = 'none';
          row.scrollLeft += fraction * (row.scrollWidth - row.clientWidth);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => (row.style.scrollSnapType = ''), SNAP_BACK);
        },
        to: (index) => {
          const slide = row.children[index];
          if (!slide) return;
          row.scrollTo({ left: slide.offsetLeft + slide.offsetWidth / 2 - row.clientWidth / 2, behavior: 'smooth' });
        },
      };
    }
    return () => {
      row.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
      clearTimeout(timer.current);
      if (control) control.current = null;
    };
  }, [control]);

  return (
    <div
      ref={ref}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className={`pointer-events-auto flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[10vw] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {Children.map(children, (child) => (
        <div className="shrink-0 snap-center">{child}</div>
      ))}
    </div>
  );
};

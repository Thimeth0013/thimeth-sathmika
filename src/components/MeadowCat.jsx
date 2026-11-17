import { useEffect, useRef, useState } from 'react';
import sprite from '../assets/hero/cat-sprite.webp';
import meowUrl from '../assets/hero/meow.mp3';

// A cat that now and then peeks over the meadow ridge. Click it while it's up and it meows.
// It renders between the ground and the front slope (`ground-front.webp`), so the flat bottom of
// the sprite stays hidden behind the grass. Positions are in % of the hero stage (the photo).
// Meow: "Maullido de gata hembra joven" from Wikimedia Commons, CC0 (high-passed, trimmed, MP3).

// Spots along the ridge: x = cat's left edge, y = ridge height under the middle of the cat.
// Measured from the photo; the left ones show on desktop, the right ones on phones (which crop
// to the right side of the photo, and stop short of the computer's desk).
const SPOTS = [
  { x: 3, y: 81.9 }, { x: 6, y: 81.1 }, { x: 9, y: 80.2 }, { x: 12, y: 79.5 }, { x: 15, y: 78.5 },
  { x: 18, y: 77.6 }, { x: 21, y: 76.6 }, { x: 24, y: 75.5 }, { x: 27, y: 74.5 }, { x: 30, y: 73.3 },
  { x: 64, y: 64.0 }, { x: 66, y: 63.5 },
];

const CAT_W = 5; // % of stage width
const CAT_H = CAT_W * (207 / 240) * (1672 / 941); // same, as % of stage height
const HIDE = 0.78; // the ridge cuts the sprite at 78% of its height
const PEAK_TOP = 0.43; // at its highest frame the cat's ears reach 43% of the sprite height
const PEEK_MS = 4800; // rise 1.6 s, stay up 1.6 s, sink 1.6 s (see .cat-peek in index.css)
const FIRST_PEEK = [300000, 300000]; // ms after load or reload: 5 minutes
const NEXT_PEEK = [60000, 120000]; // ms between peeks

const rand = ([min, max]) => min + Math.random() * (max - min);

export const MeadowCat = () => {
  const boxRef = useRef(null);
  const audioRef = useRef(null);
  const [peek, setPeek] = useState(null);
  const hopRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let timer;

    // Only spots that are fully on screen right now (the stage is wider than phones) and where the
    // visible part of the cat (from its ears at the peak down to the ridge) stays clear of anything
    // marked data-cat-avoid (the headline and the buttons).
    const pickSpot = () => {
      if (window.scrollY > 40) return null; // only on the resting hero, not during the fly-through
      const box = boxRef.current?.getBoundingClientRect();
      if (!box || box.bottom < 0 || box.top > window.innerHeight) return null;
      const avoid = [...document.querySelectorAll('[data-cat-avoid]')].map((el) => el.getBoundingClientRect());
      const onScreen = SPOTS.filter(({ x, y }) => {
        const left = box.left + (box.width * x) / 100;
        const right = left + (box.width * CAT_W) / 100;
        const bottom = box.top + (box.height * y) / 100;
        const top = bottom - (box.height * CAT_H * (HIDE - PEAK_TOP)) / 100;
        const clear = avoid.every((r) => right < r.left - 12 || left > r.right + 12 || bottom < r.top - 12 || top > r.bottom + 12);
        return clear && left >= 8 && right <= window.innerWidth - 8;
      });
      return onScreen.length ? onScreen[Math.floor(Math.random() * onScreen.length)] : null;
    };

    const wait = (ms) => {
      timer = setTimeout(() => {
        const spot = !document.hidden && pickSpot();
        if (!spot) return wait(5000); // hero scrolled away or tab hidden: try again shortly
        // Load the meow once, the first time the cat shows up, so a click plays it instantly.
        if (!audioRef.current) {
          audioRef.current = new Audio(meowUrl);
          audioRef.current.volume = 0.6;
        }
        setPeek({ ...spot, id: Date.now() });
        timer = setTimeout(() => {
          setPeek(null);
          wait(rand(NEXT_PEEK));
        }, PEEK_MS);
      }, ms);
    };

    wait(rand(FIRST_PEEK));
    return () => clearTimeout(timer);
  }, []);

  const meow = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
    // Little hop. Web Animations, so the sprite underneath keeps playing; small enough that the
    // cut-off bottom of the sprite never clears the ridge.
    hopRef.current?.animate(
      [{ transform: 'none' }, { transform: 'translateY(-9%)' }, { transform: 'none' }],
      { duration: 320, easing: 'cubic-bezier(.3, 0, .3, 1)' },
    );
  };

  return (
    <div ref={boxRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
      {peek && (
        <div
          key={peek.id}
          className="absolute"
          style={{
            left: `${peek.x}%`,
            top: `${peek.y - HIDE * CAT_H}%`,
            width: `${CAT_W}%`,
            height: `${CAT_H}%`,
          }}
        >
          <div ref={hopRef} className="size-full">
            <div className="cat-peek size-full" style={{ backgroundImage: `url(${sprite})` }} />
          </div>
          {/* Click target covers only the part of the cat above the grass. */}
          <button
            type="button"
            tabIndex={-1}
            onClick={meow}
            className="pointer-events-auto absolute inset-x-[10%] top-[40%] bottom-[22%] cursor-pointer rounded-full"
          />
        </div>
      )}
    </div>
  );
};

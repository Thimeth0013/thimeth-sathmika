import cloud1 from '../assets/hero/cloud-1.webp';
import cloud2 from '../assets/hero/cloud-2.webp';
import cloud3 from '../assets/hero/cloud-3.webp';

// Clouds in % of their box (in the hero: the stage, i.e. the photo). The first three are cut from
// the original photo and start where they were; the rest are extra copies so the right side, which
// phones show, has sky life too. dur = seconds for one full pass across the box; smaller (farther)
// clouds move slower. Drift styles: .animate-drift in index.css. Rendered by Clouds.jsx.
export const HERO_CLOUDS = [
  { src: cloud1, x: 26.85, y: 9.35, w: 23.03, dur: 260 },
  { src: cloud2, x: 46.77, y: 31.35, w: 7.83, dur: 340 },
  { src: cloud3, x: 12.74, y: 53.98, w: 7.06, dur: 380 },
  { src: cloud1, x: 72, y: 12, w: 13, dur: 300, flip: true },
  { src: cloud2, x: 90, y: 27, w: 5.5, dur: 360, flip: true },
  // Small, far clouds inside the slice phones see (≈64–84% across), so the fly-through's sky isn't
  // empty there.
  { src: cloud3, x: 66, y: 30, w: 8, dur: 420, flip: true },
  { src: cloud2, x: 77, y: 17, w: 7, dur: 440 },
];

// Phones: the same clouds over the portrait photo (sky-m), bigger (a % of a narrow box) and kept above
// the headline and the hill. Seven, like HERO_CLOUDS, so each gets the same depth in the fly-through.
export const HERO_CLOUDS_M = [
  { src: cloud1, x: 4, y: 9, w: 62, dur: 220 },
  { src: cloud1, x: 60, y: 30, w: 30, dur: 300, flip: true },
  { src: cloud3, x: 16, y: 44, w: 9, dur: 330 },
  { src: cloud1, x: 58, y: 2, w: 38, dur: 260, flip: true },
  { src: cloud1, x: 0, y: 34, w: 24, dur: 320 },
  { src: cloud2, x: 74, y: 49, w: 8, dur: 360, flip: true },
  { src: cloud2, x: 40, y: 23, w: 7, dur: 380 },
];

// Clouds drifting behind the About scene, in % of the screen. Faster than the hero's (they are the
// backdrop while you read, so they visibly move).
export const ABOUT_CLOUDS = [
  { src: cloud1, x: 8, y: 6, w: 22, dur: 110 },
  { src: cloud2, x: 52, y: 22, w: 7, dur: 150, flip: true },
  { src: cloud1, x: 70, y: 58, w: 15, dur: 95, flip: true },
  { src: cloud3, x: 30, y: 72, w: 8, dur: 130 },
  { src: cloud3, x: 88, y: 12, w: 6, dur: 170, flip: true },
];

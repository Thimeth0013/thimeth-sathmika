// The night starfield (the hero's sky and the footer's, `.stars` in index.css): one big tile of stars
// scattered at random (seeded, so the same every load), as an SVG data URL. The tile is TILE px, large
// enough that its repeat never reads as a pattern; most stars are faint pinpricks, a few brighter and
// bigger, a very few with a soft glow.

const rng = (seed) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

export const TILE = { w: 1600, h: 1000 };
const COUNT = 320;

const field = (seed) => {
  const rand = rng(seed);
  let dots = '';
  for (let i = 0; i < COUNT; i++) {
    const x = (rand() * TILE.w).toFixed(1);
    const y = (rand() * TILE.h).toFixed(1);
    const roll = rand();
    // 80% faint, 17% medium, 3% bright with a halo.
    const r = roll < 0.8 ? 0.45 + rand() * 0.35 : roll < 0.97 ? 0.8 + rand() * 0.4 : 1.2 + rand() * 0.4;
    const a = roll < 0.8 ? 0.35 + rand() * 0.35 : roll < 0.97 ? 0.65 + rand() * 0.25 : 1;
    if (roll >= 0.97) dots += `<circle cx="${x}" cy="${y}" r="${(r * 3.2).toFixed(2)}" fill="#fff" fill-opacity="0.12"/>`;
    dots += `<circle cx="${x}" cy="${y}" r="${r.toFixed(2)}" fill="#fff" fill-opacity="${a.toFixed(2)}"/>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE.w}" height="${TILE.h}" viewBox="0 0 ${TILE.w} ${TILE.h}">${dots}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

export const STARS = { backgroundImage: field(20261122), backgroundSize: `${TILE.w}px ${TILE.h}px` };

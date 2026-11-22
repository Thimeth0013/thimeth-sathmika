// Blocky, Minecraft-style clouds for the footer's sky, drawn rather than shipped as images: each cloud
// is a union of a few rectangles on a grid of cells (seeded, so the same every load), filled white,
// with a pale strip under each column for its underside, as a little SVG with crisp edges (it stays
// sharp at any size). They are fed to Clouds.jsx (the hero's drifting layer) as data URLs, in the same
// shape as heroClouds.js: x/y/w in % of the footer's box, dur in seconds for one crossing.

const rng = (seed) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

// One cloud, cols × rows cells: a main slab, a narrower block on top and one or two bulges, all snapped
// to the grid.
const cloud = (seed, cols, rows) => {
  const rand = rng(seed);
  const cells = Array.from({ length: rows }, () => Array(cols).fill(false));
  const fill = (x0, y0, x1, y1) => {
    for (let y = Math.max(y0, 0); y < Math.min(y1, rows); y++) for (let x = Math.max(x0, 0); x < Math.min(x1, cols); x++) cells[y][x] = true;
  };
  const r = (a, b) => a + Math.floor(rand() * (b - a + 1));
  fill(r(0, 2), rows - 2, cols - r(0, 2), rows); // the main slab, two cells deep
  const topW = r(Math.round(cols * 0.35), Math.round(cols * 0.6));
  const topX = r(1, cols - topW - 1);
  fill(topX, rows - 3, topX + topW, rows - 1); // a block on top
  if (rows > 3) {
    const capW = r(2, Math.max(2, Math.round(topW * 0.6)));
    const capX = r(topX, topX + topW - capW);
    fill(capX, rows - 4, capX + capW, rows - 3); // and a smaller one on that
  }
  const bulgeX = r(0, cols - 4);
  fill(bulgeX, rows - 3, bulgeX + r(2, 4), rows - 1); // a bulge
  // The SVG: one cell is 10 units; the underside strip is 4 units deep under each column's lowest cell.
  const U = 10;
  const SHADE = 4;
  let body = '';
  let under = '';
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) if (cells[y][x]) body += `M${x * U} ${y * U}h${U}v${U}h-${U}z`;
  for (let x = 0; x < cols; x++) {
    let low = -1;
    for (let y = 0; y < rows; y++) if (cells[y][x]) low = y;
    if (low >= 0) under += `M${x * U} ${(low + 1) * U}h${U}v${SHADE}h-${U}z`;
  }
  const w = cols * U;
  const h = rows * U + SHADE;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges"><path d="${under}" fill="#D6E6F8"/><path d="${body}" fill="#FFFFFF"/></svg>`;
  return { src: `data:image/svg+xml,${encodeURIComponent(svg)}` };
};

// Across the whole sky: a band above the headline, some through the middle (behind the text and the
// note card; the footer's cloud layer is a little see-through, so the text reads over them) and some low,
// near the horizon. y is a % of the whole footer (the meadow covers its bottom). They drift at
// different speeds, so now and then one passes another: listed top to bottom, so the lower (nearer) one
// is drawn in front, and the lower ones drift a little faster, so a pass reads as one cloud going by in
// front of a farther one (their bodies are solid, so nothing shows through).
// Not in rows: each at its own height and size, scattered (a few, not a sheet of them).
export const FOOTER_CLOUDS = [
  { ...cloud(43, 16, 4), x: 66, y: 3, w: 12, dur: 380 },
  { ...cloud(7, 24, 5), x: 8, y: 11, w: 22, dur: 340 },
  { ...cloud(57, 18, 4), x: 42, y: 26, w: 15, dur: 310 },
  { ...cloud(71, 14, 4), x: 82, y: 43, w: 10, dur: 290 },
  { ...cloud(83, 26, 5), x: 24, y: 61, w: 19, dur: 255 },
];
// Phones: bigger (a share of a narrow screen), over a taller footer; same order and speeds rule.
export const FOOTER_CLOUDS_M = [
  { ...cloud(43, 16, 4), x: 54, y: 2, w: 34, dur: 265 },
  { ...cloud(7, 24, 5), x: -8, y: 10, w: 54, dur: 250 },
  { ...cloud(57, 18, 4), x: 40, y: 41, w: 38, dur: 225 },
  { ...cloud(83, 26, 5), x: 2, y: 70, w: 46, dur: 205 },
];

import { CERTS } from './journey';

// The certificate and badge card faces. The data has no images (the links are the certificates), so
// each face is drawn onto a canvas from its data, in the site's palette, once the fonts are in: paper,
// a double frame and a blue seal for certificates, a single frame and a blue hexagon badge for badges.
// faces() draws them all once per page and resolves to { [cert.key]: image URL }. FACE is a face's size
// (px, drawn at `scale` for sharpness).

export const FACE = { w: 300, h: 231, scale: 2 };
const INK = '#14532D';
const SKY = '#3B82F6';
const PAPER = '#FBF6EC';

// Wraps text to `width`, at most `max` lines (the last one cut with an ellipsis).
const wrapLines = (ctx, text, width, max) => {
  const lines = [];
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width <= width || !line) line = next;
    else {
      lines.push(line);
      line = word;
    }
  }
  lines.push(line);
  if (lines.length <= max) return lines;
  const kept = lines.slice(0, max);
  let last = kept[max - 1];
  while (last && ctx.measureText(`${last}…`).width > width) last = last.slice(0, -1).trimEnd();
  kept[max - 1] = `${last}…`;
  return kept;
};

// A certificate's seal: a blue rosette.
const seal = (ctx, x, y) => {
  ctx.beginPath();
  for (let i = 0; i <= 40; i++) {
    const a = (i / 40) * Math.PI * 2;
    const r = i % 2 ? 15.5 : 18;
    ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
  }
  ctx.fillStyle = SKY;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y, 11, 0, Math.PI * 2);
  ctx.strokeStyle = PAPER;
  ctx.lineWidth = 1.5;
  ctx.stroke();
};
// A badge: a blue hexagon with a tick.
const badge = (ctx, x, y) => {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    ctx.lineTo(x + Math.cos(a) * 18, y + Math.sin(a) * 18);
  }
  ctx.closePath();
  ctx.fillStyle = SKY;
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 7, y + 0.5);
  ctx.lineTo(x - 2, y + 5.5);
  ctx.lineTo(x + 7.5, y - 5);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2.6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
};

const drawFace = (cert) => {
  const { w, h, scale } = FACE;
  const canvas = document.createElement('canvas');
  canvas.width = w * scale;
  canvas.height = h * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, w, h);
  // The frame: a double rule for certificates, a single one for badges.
  ctx.strokeStyle = 'rgb(20 83 45 / 0.2)';
  ctx.lineWidth = 1;
  ctx.strokeRect(12.5, 12.5, w - 25, h - 25);
  if (cert.kind === 'Certificate') ctx.strokeRect(16.5, 16.5, w - 33, h - 33);

  ctx.fillStyle = 'rgb(20 83 45 / 0.6)';
  ctx.font = '400 10.5px "Azeret Mono", ui-monospace, monospace';
  ctx.letterSpacing = '0.9px';
  ctx.fillText(cert.kind.toUpperCase(), 30, 44);
  ctx.letterSpacing = '0px';
  (cert.kind === 'Badge' ? badge : seal)(ctx, w - 50, 44);

  ctx.fillStyle = INK;
  ctx.font = '500 23px "Apfel Grotezk", system-ui, sans-serif';
  ctx.letterSpacing = '-0.35px';
  wrapLines(ctx, cert.title, w - 60, 3).forEach((line, i) => ctx.fillText(line, 30, 96 + i * 25));
  ctx.letterSpacing = '0px';

  ctx.fillStyle = 'rgb(20 83 45 / 0.12)';
  ctx.fillRect(30, h - 74, w - 60, 1);
  ctx.fillStyle = 'rgb(20 83 45 / 0.78)';
  ctx.font = '400 15px "Apfel Grotezk", system-ui, sans-serif';
  ctx.fillText(wrapLines(ctx, cert.issuer, w - 60, 1)[0], 30, h - 48);
  ctx.fillStyle = 'rgb(20 83 45 / 0.55)';
  ctx.font = '400 10.5px "Azeret Mono", ui-monospace, monospace';
  ctx.fillText(cert.date, 30, h - 28);

  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob ? URL.createObjectURL(blob) : canvas.toDataURL())));
};

// Drawn once per page, after the fonts load, one face per idle moment (drawing them all in one go was
// a ~200 ms block right as the scenes mount after the loader).
const idle = () =>
  new Promise((done) => ('requestIdleCallback' in window ? window.requestIdleCallback(done, { timeout: 1000 }) : setTimeout(done, 0)));
let facesPromise;
export const faces = () => {
  facesPromise ??= (async () => {
    const fonts = ['500 23px "Apfel Grotezk"', '400 15px "Apfel Grotezk"', '400 10.5px "Azeret Mono"'];
    await Promise.all(fonts.map((f) => document.fonts?.load(f).catch(() => null)));
    const urls = [];
    for (const cert of CERTS) {
      await idle();
      urls.push(await drawFace(cert));
    }
    return Object.fromEntries(CERTS.map((c, i) => [c.key, urls[i]]));
  })();
  return facesPromise;
};


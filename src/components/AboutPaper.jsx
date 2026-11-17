import { useEffect, useState } from 'react';
import PaperCrumple from './PaperCrumple/PaperCrumple';

// The About description on a sheet of paper you can crumple (React Bits PaperCrumple). PaperCrumple
// crumples an image, so the text is drawn onto a paper-coloured canvas (2x, after the fonts load) and
// passed in as a data URL. The same text is in the DOM for screen readers.

const W = 440; // the texture's layout size in CSS px (drawn at 2x); the sheet is shown larger
const H = 500;
const SHEET = 1.05; // the sheet's size on screen relative to W x H
const INK = '#14532D';
const SKY = '#3B82F6';
const PAPER = '#F8F4EA';
const RULE = 'rgba(20, 83, 45, 0.16)';

const BIO = [
  { t: 'Software Engineering undergrad from Colombo, Sri Lanka, specializing in full-stack development with a strong focus on frontend engineering. Over 4 years of experience working with modern web technologies, creating ' },
  { t: 'interactive', c: SKY },
  { t: ' and ' },
  { t: 'detail-oriented', c: SKY },
  { t: ' UIs, while bridging design and code to deliver seamless user experiences.' },
];
const BIO_TEXT = BIO.map((s) => s.t).join('');

const drawPaper = async () => {
  const fonts = ['500 120px "Apfel Grotezk"', '400 68px "Apfel Grotezk"', '400 44px "Azeret Mono"'];
  await Promise.all(fonts.map((f) => document.fonts?.load(f).catch(() => null)));

  const s = 2;
  const canvas = document.createElement('canvas');
  canvas.width = W * s;
  canvas.height = H * s;
  const ctx = canvas.getContext('2d');
  ctx.scale(s, s);
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);

  const x0 = 34;
  const maxW = W - x0 * 2;
  const line = 25; // ruling and bio line height

  // Ruled lines under the bio, like the contact note.
  const bioTop = 150;
  ctx.strokeStyle = RULE;
  ctx.lineWidth = 1;
  for (let y = bioTop + 6; y < H - 30; y += line) {
    ctx.beginPath();
    ctx.moveTo(x0, y + 0.5);
    ctx.lineTo(W - x0, y + 0.5);
    ctx.stroke();
  }

  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = 'rgba(20, 83, 45, 0.55)';
  ctx.font = '400 11px "Azeret Mono", ui-monospace, monospace';
  ctx.fillText('ABOUT ME', x0, 48);

  ctx.fillStyle = INK;
  ctx.font = '500 34px "Apfel Grotezk", sans-serif';
  ctx.fillText('Hello, I’m Thimeth.', x0, 100);

  // The bio, word-wrapped, keeping each word's colour.
  ctx.font = '400 17px "Apfel Grotezk", sans-serif';
  const words = BIO.flatMap(({ t, c }) => t.split(/(\s+)/).filter(Boolean).map((w) => ({ w, c: c ?? INK })));
  let x = x0;
  let y = bioTop;
  for (const { w, c } of words) {
    const width = ctx.measureText(w).width;
    if (/^\s+$/.test(w)) {
      if (x > x0) x += width;
      continue;
    }
    if (x + width > x0 + maxW) {
      x = x0;
      y += line;
    }
    ctx.fillStyle = c;
    ctx.fillText(w, x, y);
    x += width;
  }

  return canvas.toDataURL('image/png');
};

/**
 * The paper, in a box that fills its (positioned) parent: the whole screen in the About scene, so the
 * crumpled sheet can be dragged anywhere. homeX / homeY place the flat sheet (fractions of the box from
 * its centre), rotation tilts it, size scales the sheet (phones show it smaller), onFrame reports where it
 * is (see PaperCrumple).
 */
export const AboutPaper = ({ homeX = 0, homeY = 0, rotation = 0, size = 1, onFrame, className = '' }) => {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    let live = true;
    drawPaper().then((url) => live && setSrc(url));
    return () => {
      live = false;
    };
  }, []);

  return (
    <div className={`absolute inset-0 ${className}`}>
      <p className="sr-only">Hello, I’m Thimeth. {BIO_TEXT}</p>
      {src && (
        <PaperCrumple
          src={src}
          alt="About me, written on a sheet of paper"
          width={W * SHEET * size}
          height={H * SHEET * size}
          sceneHeight="100%"
          paperColor={PAPER}
          imageFit="contain"
          rotation={rotation}
          homeX={homeX}
          homeY={homeY}
          onFrame={onFrame}
          className="pointer-events-none"
        />
      )}
    </div>
  );
};

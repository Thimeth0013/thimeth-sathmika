import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import profileImage from '../assets/profile2.webp';
import falcon from '../assets/creative/sticker-falcon.webp';
import deathstar from '../assets/creative/sticker-deathstar.webp';
import dustbunny from '../assets/creative/sticker-dustbunny.webp';
import { SOCIAL } from '../data/socials';
import { IconFolder } from './IconFolder';
import { MovieCard, MusicCard, POSTER } from './MediaCards';
import { useMobile } from '../lib/useMobile';
import { useOpenTerminal } from '../lib/terminal';
import { MiniTerminal } from './MiniTerminal';

// The paper pulls in three.js, so it loads in its own chunk, after the page.
const AboutPaper = lazy(() => import('./AboutPaper').then((m) => ({ default: m.AboutPaper })));
// The stickers are WebGL too (the same chunk as the Journey's).
const StickerPeel = lazy(() => import('./StickerPeel/StickerPeel'));

// The About scene: the pieces that fly in from the screen edges once the hero's cloud has cleared the
// headline, and come to rest scattered across the sky. Each card sits at its resting place (left/top
// in % of the screen, a tilt); data-from (the edge it comes from) and data-rot (its resting tilt) are
// read by the hero's scroll hook (useFlyThrough in Home.jsx), which moves it in, in data-order (the
// paper first).
//
// The paper is different: its box fills the screen (so the crumpled sheet can be dragged anywhere and
// over the cards) and the flat sheet rests at PAPER (centre, as fractions of the screen from its
// middle; tilt in degrees). It has no data-rot, so the fly-in only slides it. While it moves, the cards
// it runs into are shoved out of its way and drift back once it has passed.
const CARDS = [
  { key: 'photo', from: 'top', left: '57%', top: '7%', rot: 5 },
  // The film poster (with its year and rating) and the music square (MediaCards), drawn bigger than on
  // phones (zoom): the music small, top right; the poster bigger, at the bottom right.
  { key: 'movie', from: 'right', left: '79%', top: '53%', rot: -6, zoom: 1.85 },
  { key: 'music', from: 'right', left: '80%', top: '12%', rot: 4, zoom: 1.2 },
  { key: 'socials', from: 'bottom', left: '47%', top: '66%', rot: -2 },
  // A small terminal window (MiniTerminal, desktop only) between the paper and the photo: opens the terminal.
  { key: 'terminal', from: 'top', left: '44%', top: '27%', rot: -4 },
];
const PAPER = { x: -0.25, y: -0.03, rot: -2.5 };
// Phones (useMobile), after the owner's sketch, laid out from the screen's size (layoutM): the paper
// across the top, as wide as PaperCrumple allows (the screen less 48px), so the bio is readable; the
// photo overlapping its bottom right corner; the folder below on the left; the film and the music as two
// cards side by side at the bottom (MovieCard / MusicCard: a narrow poster and a square).
// Each piece flies in from, and back out by, the screen edge nearest to where it rests (`from`). Sizes are fractions of the
// screen's width; when a shorter screen has no room for them all, the folder and the squares slide up
// over the paper's empty ruled lines (up to OVERLAP of it) and then shrink a little. On phones the cards
// sit above the paper (z-[1]); the stickers go on its top right corner. Desktop never uses these.
const STICKER_WARM = 2500; // ms after the scene mounts before the first sticker is set up
const STICKER_GAP = 400; // ms between setting up one sticker and the next
const SHEET_PX = { w: 462, h: 525 }; // the paper's size at size 1 (AboutPaper: 440 x 500 x 1.05)
const NATURAL = { photo: [250, 330], socials: [311, 212], square: 150, poster: POSTER }; // at zoom 1 (px)
const PHONE = { photo: 0.4, socials: 0.54, square: 0.36 }; // widths, as fractions of the screen's width
const OVERLAP = 0.26;
const ROW_MAX = 0.8;
const MUSIC_M = 0.8; // the music square's size, as a fraction of the poster's height
// viewH is the screen's height with the browser's bars showing (the small viewport), so everything fits
// in what is visible then; H is the stage's (100lvh, at least 600px), which the % places are made of.
const layoutM = (W, viewH, H) => {
  const size = Math.min((W - 48) / SHEET_PX.w, 0.95);
  const paperH = SHEET_PX.h * size;
  const top = Math.max(0.04 * viewH, 18);
  const paperBottom = top + paperH;
  // Room under the paper for the folder and the squares (with their gaps), and how to fit them.
  const gaps = 0.05 * viewH + 0.03 * viewH + 0.03 * viewH;
  const folderH = (NATURAL.socials[1] * PHONE.socials * W) / NATURAL.socials[0];
  const squareH = PHONE.square * W;
  const room = viewH - paperBottom - gaps;
  let k = room / (folderH + squareH);
  let overlap = 0;
  if (k < 1) {
    overlap = Math.min(OVERLAP * paperH, (folderH + squareH) * (1 - k));
    k = Math.max((room + overlap) / (folderH + squareH), 0.6);
  }
  k = Math.min(k, 1.12);
  const photoZoom = (PHONE.photo * W) / NATURAL.photo[0];
  const folderZoom = (PHONE.socials * W * k) / NATURAL.socials[0];
  const square = PHONE.square * W * k;
  const folderTop = paperBottom - overlap + 0.05 * viewH;
  const squaresTop = folderTop + folderH * k + 0.03 * viewH;
  const pctY = (y) => `${((y / H) * 100).toFixed(2)}%`;
  const pctX = (x) => `${((x / W) * 100).toFixed(2)}%`;
  // The film poster and the music square, side by side and centred as a pair, shrunk to fit within
  // ROW_MAX of the screen's width (they are tilted, so they need the margin). The music square is
  // MUSIC_M of the poster's height, level with the poster's middle.
  const gap = 0.06 * W;
  const rowW = (NATURAL.poster / NATURAL.square) * square + square; // (the poster keeps the size it had beside a full square)
  const fit = Math.min(1, (ROW_MAX * W - gap) / rowW);
  const zoomSq = (square * fit) / NATURAL.square;
  const posterW = NATURAL.poster * zoomSq;
  const sq = square * fit;
  const musicSq = sq * MUSIC_M;
  const pairLeft = (W - (posterW + gap + musicSq)) / 2;
  // Each piece comes in from, and leaves by, the screen edge nearest to where it rests.
  const nearest = (x, y, w, h) => {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const gaps = { left: cx, right: W - cx, top: cy, bottom: viewH - cy };
    return Object.keys(gaps).reduce((a, b) => (gaps[a] <= gaps[b] ? a : b));
  };
  const photo = [W * (0.96 - PHONE.photo), paperBottom - 0.33 * paperH, PHONE.photo * W, NATURAL.photo[1] * photoZoom];
  const folder = [0.06 * W, folderTop, PHONE.socials * W * k, folderH * k];
  const movie = [pairLeft, squaresTop, posterW, sq];
  const music = [pairLeft + posterW + gap, squaresTop + (sq - musicSq) / 2, musicSq, musicSq];
  const place = ([x, y, w, h], rot, zoom) => ({ left: pctX(x), top: pctY(y), rot, zoom, from: nearest(x, y, w, h) });
  return {
    paper: { x: 0, y: (top + paperH / 2) / H - 0.5, rot: 2, size, from: nearest(24, top, W - 48, paperH) },
    cards: {
      photo: place(photo, -5, photoZoom),
      socials: place(folder, -1, folderZoom),
      movie: place(movie, 4, zoomSq),
      music: place(music, -3, zoomSq * MUSIC_M),
    },
  };
};
const STICKER_CORNER_M = { corner: 'tr', dx: -6, dy: 2, scale: 0.72 }; // smaller, on the very corner
const PUSH_MAX = 160; // px: how far a card can be shoved
// Peelable stickers stuck over the paper's corners, half on the sheet and half off: on the bottom-left
// corner the Millennium Falcon, with the Death Star right under it and smaller, so it is hidden until
// you peel the Falcon away; on the top-right corner the dust bunny (a soot sprite). corner ('tl', 'tr',
// 'bl', 'br') and dx/dy: px from that corner of the sheet to the sticker's middle (the sheet is SHEET
// px, centred at PAPER, tilted with it). Phones (`m`): the Falcon pair goes on the top-right corner
// (STICKER_CORNER_M) and the dust bunny on the bottom-left, smaller. They are set up early, on hold, and start once the paper has landed, so their own peel-in is their
// entrance, and when About scrolls away each leaves by the screen edge nearest to it (wherever it has
// been dragged).
const SHEET = { w: 484, h: 545 };
const CORNER_STICKERS = [
  { key: 'deathstar', src: deathstar, corner: 'bl', dx: -12, dy: -52, rot: 10, width: 92, m: STICKER_CORNER_M },
  { key: 'falcon', src: falcon, corner: 'bl', dx: -12, dy: -52, rot: -12, width: 140, m: STICKER_CORNER_M },
  { key: 'dustbunny', src: dustbunny, corner: 'tr', dx: -40, dy: 36, rot: 7, width: 80, m: { corner: 'bl', dx: -50, dy: 90 } },
];
const cornerOf = (w, h, paper = PAPER, size = 1, corner = 'bl') => {
  const a = (paper.rot * Math.PI) / 180;
  const [x, y] = [((corner[1] === 'r' ? 1 : -1) * SHEET.w * size) / 2, ((corner[0] === 't' ? -1 : 1) * SHEET.h * size) / 2];
  return [paper.x * w + x * Math.cos(a) - y * Math.sin(a), paper.y * h + x * Math.sin(a) + y * Math.cos(a)];
};

const Photo = () => (
  <figure className="w-[250px] bg-white p-3 pb-4 shadow-[0_1px_2px_rgb(20_83_45/0.08),0_22px_44px_-20px_rgb(10_40_22/0.5)]">
    <img
      src={profileImage}
      alt="Thimeth Sathmika"
      loading="lazy"
      className="aspect-[4/5] w-full object-cover object-[center_18%]"
    />
    <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.06em] text-forest/60">
      Thimeth · Colombo, LK
    </figcaption>
  </figure>
);

// The socials folder, titled "View my work" (IconFolder.jsx): GitHub, LinkedIn, Behance and Medium as app-icon tiles fanned out
// of a glass folder, each a link; hover spreads them (no name tooltip over them and no small copies in
// the corner: the name chips on the pocket already say which is which). Drawn at FOLDER_SCALE of the component's own size
// (420 × 286) to fit under the photo, between the paper and the film card.
const FOLDER_SCALE = 0.74;
const SOCIAL_ICONS = SOCIAL.filter(({ name }) => name !== 'Email').map(({ name, href, icon, brand }) => ({
  label: name,
  href,
  background: brand,
  node: (
    <svg viewBox="0 0 24 24" width="50%" height="50%" fill="#fff" aria-hidden="true">
      <path d={icon} />
    </svg>
  ),
}));
const Socials = () => (
  <div style={{ width: 420 * FOLDER_SCALE, height: 286 * FOLDER_SCALE }}>
    <div style={{ width: 420, transform: `scale(${FOLDER_SCALE})`, transformOrigin: '0 0' }}>
      <IconFolder title="View my work" tags={SOCIAL_ICONS.map((icon) => icon.label)} icons={SOCIAL_ICONS} showLabels={false} showPill={false} />
    </div>
  </div>
);

const CONTENT = { photo: <Photo />, movie: <MovieCard details />, music: <MusicCard />, socials: <Socials /> };
// Phones: the poster without its year and rating.
const CONTENT_M = { ...CONTENT, movie: <MovieCard /> };

export const AboutScene = ({ itemRef }) => {
  const sceneRef = useRef(null);
  const pushRefs = useRef([]);
  const paperRef = useRef(null);
  const [landed, setLanded] = useState(false);
  const openTerminal = useOpenTerminal();
  const mobile = useMobile();
  // The screen's size, for the phone layout (re-laid out when it changes): its width, its height with
  // the browser's bars showing (the root's clientHeight, the small viewport: it does not change as the
  // address bar slides away, so nothing jumps while scrolling) and the stage's height (100lvh).
  const [screen, setScreen] = useState(() => [window.innerWidth, document.documentElement.clientHeight, Math.max(window.innerHeight, 600)]);
  useEffect(() => {
    if (!mobile) return undefined;
    const onResize = () => {
      const next = [window.innerWidth, document.documentElement.clientHeight, sceneRef.current?.offsetHeight || Math.max(window.innerHeight, 600)];
      setScreen((last) => (last.every((v, i) => v === next[i]) ? last : next));
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [mobile]);
  const phone = mobile ? layoutM(screen[0], screen[1], screen[2]) : null;
  const paper = phone ? phone.paper : PAPER;
  const stickerSize = phone ? phone.paper.size * STICKER_CORNER_M.scale : 1;

  // The paper has landed once the scroll hook has slid it all the way in (its transform is back to 0).
  useEffect(() => {
    if (landed) return undefined;
    const check = () => {
      const el = paperRef.current;
      const x = Number(/translate3d\((-?[\d.]+)px/.exec(el?.style.transform ?? '')?.[1] ?? NaN);
      if (el?.style.visibility === 'visible' && Math.abs(x) < 4) setLanded(true);
    };
    window.addEventListener('scroll', check, { passive: true });
    check();
    return () => window.removeEventListener('scroll', check);
  }, [landed]);

  // The stickers are set up ahead of time, one at a time at quiet moments after the page has loaded
  // (STICKER_WARM after this mounts, then each in an idle callback), on hold (StickerPeel's `hold`: image,
  // texture and a first draw done, invisible, nothing moving); the paper landing releases them and their
  // peel-in plays. Setting one up costs a long frame (a WebGL context, shaders, the texture), which used
  // to land mid-scroll when they mounted on landing. If the paper lands first, the rest mount then.
  const [mounted, setMounted] = useState(0);
  useEffect(() => {
    if (mounted >= CORNER_STICKERS.length) return undefined;
    if (landed) {
      setMounted(CORNER_STICKERS.length);
      return undefined;
    }
    let idle = 0;
    const timer = setTimeout(
      () => {
        const next = () => setMounted((n) => n + 1);
        if ('requestIdleCallback' in window) idle = window.requestIdleCallback(next, { timeout: 3000 });
        else next();
      },
      mounted ? STICKER_GAP : STICKER_WARM
    );
    return () => {
      clearTimeout(timer);
      if (idle) window.cancelIdleCallback(idle);
    };
  }, [mounted, landed]);
  // Each loads in late (its chunk), possibly after the page has scrolled on; it starts hidden, and a
  // scroll event makes the scroll hook place (or hide) it straight away.
  useEffect(() => {
    if (!mounted) return undefined;
    const frame = requestAnimationFrame(() => window.dispatchEvent(new Event('scroll')));
    return () => cancelAnimationFrame(frame);
  }, [mounted]);

  // The crumpled sheet (x, y, r: px in the scene) pushes overlapping cards straight away from it.
  const onFrame = useCallback(({ x, y, r, crumple }) => {
    const scene = sceneRef.current?.getBoundingClientRect();
    if (!scene) return;
    const ball = crumple > 0.25; // only once it is a ball, not the flat sheet settling back home
    pushRefs.current.forEach((inner) => {
      if (!inner) return;
      const card = inner.parentElement.getBoundingClientRect();
      const dx = card.left - scene.left + card.width / 2 - x;
      const dy = card.top - scene.top + card.height / 2 - y;
      const dist = Math.hypot(dx, dy) || 1;
      const overlap = ball ? r + Math.min(card.width, card.height) / 2 - dist : 0;
      const push = Math.min(Math.max(overlap, 0), PUSH_MAX);
      inner.style.transform = push
        ? `translate(${(dx / dist) * push}px, ${(dy / dist) * push}px) rotate(${(dx / dist) * push * 0.06}deg)`
        : '';
    });
  }, []);

  return (
    <div ref={sceneRef} aria-label="About me" role="group" className="pointer-events-none absolute inset-0">
      {CARDS.map((card, i) => {
        const { key } = card;
        if (key === 'terminal' && phone) return null; // no terminal window on phones
        const { left, top, rot, zoom, from: edge } = phone ? { ...card, ...phone.cards[key] } : card;
        return (
        <div
          key={key}
          ref={itemRef(i)}
          data-order={i + 1}
          data-from={edge}
          data-rot={rot}
          style={{ left, top, transform: `rotate(${rot}deg)`, visibility: 'hidden' }}
          className="pointer-events-auto absolute will-change-transform max-md:z-[1]"
        >
          <div
            ref={(el) => {
              pushRefs.current[i] = el;
            }}
            className="transition-transform duration-300 ease-out-expo"
          >
            <div style={zoom ? { zoom } : undefined}>
              {key === 'terminal' ? <MiniTerminal onOpen={openTerminal} /> : (phone ? CONTENT_M : CONTENT)[key]}
            </div>
          </div>
        </div>
        );
      })}

      {/* The paper: a full-screen layer on top of the cards (the box itself lets clicks through). */}
      <div
        ref={(el) => {
          itemRef(CARDS.length)(el);
          paperRef.current = el;
        }}
        data-order={0}
        data-from={phone ? phone.paper.from : 'left'}
        style={{ visibility: 'hidden' }}
        className="absolute inset-0 will-change-transform"
      >
        <Suspense fallback={null}>
          <AboutPaper key={phone ? `m${Math.round(paper.size * 100)}` : 'd'} homeX={paper.x} homeY={paper.y} rotation={paper.rot} size={paper.size ?? 1} onFrame={onFrame} />
        </Suspense>
      </div>

      {/* The corner stickers, each in its own full-screen box (StickerPeel's drag area, and a piece of
          its own for the scroll hook: it leaves by the nearest screen edge). The Death Star before the
          Falcon, so the Falcon sits over it. */}
      {mounted > 0 && (
        <Suspense fallback={null}>
          {CORNER_STICKERS.slice(0, mounted).map((st, i) => {
            const at = mobile ? st.m : st;
            const [cx, cy] = cornerOf(mobile ? screen[0] : window.innerWidth, mobile ? screen[2] : window.innerHeight, paper, stickerSize, at.corner);
            return (
              <div
                key={st.key}
                ref={itemRef(CARDS.length + 1 + i)}
                data-order={0}
                data-from="nearest"
                style={{ visibility: 'hidden' }}
                className="absolute inset-0 will-change-transform"
              >
                <StickerPeel
                  imageSrc={st.src}
                  width={st.width * stickerSize}
                  rotate={st.rot}
                  initialPosition={{ x: cx + at.dx * stickerSize, y: cy + at.dy * stickerSize }}
                  peelBackHoverPct={20}
                  peelBackActivePct={35}
                  shadowIntensity={0.45}
                  lightingIntensity={0.35}
                  backColor="#f3f1ea"
                  hold={!landed}
                />
              </div>
            );
          })}
        </Suspense>
      )}
    </div>
  );
};

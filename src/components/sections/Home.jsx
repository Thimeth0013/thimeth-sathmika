import { useEffect, useRef, useState } from 'react';
import { useLenis } from 'lenis/react';
import CV from '../../assets/Thimeth_Sathmika_CV.pdf';
import sky from '../../assets/hero/sky.webp';
import ground from '../../assets/hero/ground.webp';
import groundFront from '../../assets/hero/ground-front.webp';
import skyM from '../../assets/hero/sky-m.webp';
import groundM from '../../assets/hero/ground-m.webp';
import { isMobile, useMobile } from '../../lib/useMobile';
import { MOBILE_TOOLS_AT } from '../workLayout';
import { useSmoothAnchor } from '../../lib/useSmoothAnchor';
import { MeadowCat } from '../MeadowCat';
import { Clouds } from '../Clouds';
import { ABOUT_CLOUDS, HERO_CLOUDS, HERO_CLOUDS_M } from '../heroClouds';
import { STARS } from '../stars';
import cloud1 from '../../assets/hero/cloud-1.webp';
import { Button } from '../ui/Button';
import { ArrowSwap } from '../ui/ArrowSwap';
import { AboutScene } from '../AboutScene';
import { SkillsScene } from '../SkillsScene';
import { WorkScene } from '../WorkScene';
import { JourneyList, JourneyScene } from '../JourneyScene';
import { FOOTER_IN_SCENE, FOOTER_SHOW, JOURNEY_RUN } from '../journey';
import { FooterScene, FooterSky } from './Footer';

// Staggered entrance for the copy (see .animate-rise in index.css).
const rise = (ms) => ({ animationDelay: `${ms}ms` });

// Scroll fly-through (after johnbolster.design). The hero is pinned (a sticky stage inside a taller
// scroll track) and scrolling moves a camera straight forward into the scene, toward a point just above
// the horizon (HORIZON). Each layer is a flat plate at depth Z, scaled by Z / (Z - d) about that point,
// where d is how far the camera has come: near plates grow faster than far ones, which gives the depth.
// The meadow sits below the point, so the zoom carries it down out of the frame as a solid. The
// headline never zooms: it holds still while the meadow drops away (revealing all of "stand out."),
// then a bank of cloud sweeps across it from left to right (SWEEP) and the text is wiped away behind
// the bank's dense middle (a soft-edged mask that follows it). The clouds fade just before the camera reaches them (FADE). It stops on
// the sky, which only grows a little.
const DEPTH = { sky: 20, ground: 1.35 };
const SWEEP = [0.37, 0.7]; // the sweep runs over this part of the hero's scroll
// The pinned scroll continues past the hero: About (AboutScene.jsx), Featured Work (WorkScene.jsx),
// Tools (SkillsScene.jsx), then the Journey (JourneyScene.jsx: Education, Experience, then the certificates ring). Everything is in screen heights of scroll; SCHEDULE turns the constants
// into where each part starts and ends, and the track's height and the #about / #work / #skills
// markers are set from it.
const HERO_RUN = 1.4;
const ABOUT_FROM = 0.51; // the paper (which starts well off the left edge) comes into view as the clearing
// cloud's middle passes the right edge
const ABOUT_RUN = 1.6;
const ABOUT_LANDED = 0.55; // by here every About piece has landed
// Each About piece flies in over PIECE_RUN of the About run, one after another. Near the end of the run
// they fly back out the way they came (ABOUT_EXIT) while the sky turns white from the bottom up, as a
// soft gradient sweeping up the screen (same window; never a hard edge, the flow must not break).
// As the white comes up (WORK_FROM of the About run) the Featured Work column starts scrolling up, one screen height of scroll per
// screen height it moves: "Featured Work" and its button (which sit at HEADING_Y in the column, just
// below the screen) rise with the white and the first cards, stop in the middle, and the rest of the
// cards pass over them; as the last one passes and leaves, the heading dissolves in place (WorkScene.jsx).
// As the last card nears the top (TOOLS_AT: column position), "Tools I work with." comes towards you in
// the middle (over TOOLS_COME) and the skill icons start streaming out around it (over TOOLS_RUN); the
// line fades as the last icons launch (TOOLS_OUT, stream progress), and by STREAM_END every icon has
// flown past. JOURNEY_AT after Tools starts (once the line has faded, while the last icons are still
// flying past) "My journey" comes in; the Journey runs JOURNEY_RUN (its timing is in journey.js).
const PIECE_RUN = 0.3;
const PIECE_GAP = 0.05; // six pieces after the paper: the last lands by ABOUT_LANDED
const ABOUT_EXIT = [0.72, 0.96];
const WHITE_EDGE = 110; // % of the screen: how soft the edge of the white sweeping up is
// A soft sky-blue wash left at the top of the white (so it is not plain white): strongest at the top
// centre, gone by about the middle of the screen. Fades in with the white.
const WHITE_HUE =
  'radial-gradient(140% 70% at 50% 0%, rgb(59 130 246 / 0.2), rgb(59 130 246 / 0.11) 32%, rgb(59 130 246 / 0.04) 58%, rgb(59 130 246 / 0) 80%)';
const WORK_FROM = 0.8; // About run: once the bottom of the screen has mostly turned white
const HEADING_Y = 1.05; // the heading's middle, in the column (screen heights): just below the screen
const TOOLS_AT = 3.15; // column position (screen heights): the last card is near the top, rising out
// Phones have shorter 16:9 cards (workLayout.js), so Tools starts earlier there. The schedule is set
// once, for the screen the page loads on.
const TOOLS_AT_NOW = isMobile() ? MOBILE_TOOLS_AT : TOOLS_AT;
const TOOLS_COME = 0.25;
const TOOLS_RUN = 2.4;
const TOOLS_OUT = [0.6, 0.72];
const STREAM_END = 0.96;
const JOURNEY_AT = 1.7;
const SCHEDULE = (() => {
  const about = HERO_RUN * ABOUT_FROM;
  const work = about + ABOUT_RUN * WORK_FROM; // the column starts moving, once the white is coming up
  const tools = work + TOOLS_AT_NOW; // the line starts coming in; the icons start
  const journey = tools + JOURNEY_AT; // "My journey" starts coming in
  const end = journey + JOURNEY_RUN;
  return { about, work, tools, journey, end };
})();
const SWEEP_SOFT = 70; // px: half the width of the wipe's soft edge
const FOOTER_SKY = [0.15, 0.6]; // the footer scene's sky fades in over this part of the scene (in by the time its text is)
// One plate per cloud (same order as HERO_CLOUDS): the big ones nearer, the small ones farther.
const CLOUD_DEPTH = [2.3, 3.4, 4.2, 2.9, 5.2, 6, 6.8];
const HORIZON = 0.53; // the vanishing point: centred, at this fraction of the photo's height
// Phones use their own portrait photo (sky-m / ground-m, cut from mobile-hero.png: the same meadow and
// computer, upright), whose ridge is lower; the frame's phone values are .hero-frame[data-portrait] in
// index.css. No cat there.
const HORIZON_M = 0.72;
const TRAVEL = 2.75; // forward travel over the whole track; the near clouds are gone by ≈87% of the scroll
const FADE = [0.7, 0.88]; // a fading plate fades between these fractions of the way to it (d / Z)

const smooth = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

const useFlyThrough = (trackRef, stageRef, layersRef, copyRef, sweepRef, aboutRef, sceneRefs) => {
  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const phone = isMobile();
      const screen = stage.offsetHeight;
      const scrolled = Math.max(-track.getBoundingClientRect().top, 0);
      const p = Math.min(scrolled / (HERO_RUN * screen), 1);

      // About: each piece flies in from its edge (data-from), in data-order, spinning down to its tilt
      // (data-rot).
      const pa = (scrolled - HERO_RUN * ABOUT_FROM * screen) / (ABOUT_RUN * screen);
      aboutRef.current.forEach((piece, i) => {
        if (!piece) return;
        const order = Number(piece.dataset.order ?? i);
        const t = Math.min(Math.max((pa - order * PIECE_GAP) / PIECE_RUN, 0), 1);
        const e = 1 - Math.pow(1 - t, 3); // ease out
        const away = 1 - e + smooth(ABOUT_EXIT[0], ABOUT_EXIT[1], pa); // back out the way it came
        // data-from="nearest" (the stickers): out by the screen edge nearest to where it sits (it may
        // have been dragged), picked while it is at rest.
        let from = piece.dataset.from;
        if (from === 'nearest') {
          if (away < 0.001 || !piece.dataset.edge) {
            const r = (piece.querySelector('canvas') ?? piece).getBoundingClientRect();
            const box = stage.getBoundingClientRect();
            const x = r.left + r.width / 2 - box.left;
            const y = r.top + r.height / 2 - box.top;
            const gaps = { left: x, right: box.width - x, top: y, bottom: box.height - y };
            piece.dataset.edge = Object.keys(gaps).reduce((a, b) => (gaps[a] <= gaps[b] ? a : b));
          }
          from = piece.dataset.edge;
        }
        const off = {
          left: [-1.15 * stage.offsetWidth, 0],
          right: [1.15 * stage.offsetWidth, 0],
          top: [0, -1.15 * screen],
          bottom: [0, 1.15 * screen],
        }[from] ?? [0, 0];
        // A piece without data-rot (the full-screen paper) only slides.
        const spin = piece.dataset.rot === undefined ? '' : ` rotate(${Number(piece.dataset.rot) + (order % 2 ? 18 : -18) * away}deg)`;
        piece.style.visibility = t > 0 && away < 1 ? 'visible' : 'hidden';
        piece.style.transform = `translate3d(${off[0] * away}px, ${off[1] * away}px, 0)${spin}`;
      });
      const d = TRAVEL * Math.pow(p, 1.15);
      for (const { el, z, solid } of layersRef.current) {
        if (!el) continue;
        const k = d / z;
        // Past FADE[1] a plate is behind the camera (the solid meadow is long out of frame by then).
        if (k >= FADE[1]) {
          el.style.visibility = 'hidden';
          continue;
        }
        el.style.visibility = '';
        el.style.transform = k > 0 ? `scale(${1 / (1 - k)})` : '';
        el.style.opacity = solid ? '' : String(1 - smooth(FADE[0], FADE[1], k));
      }

      // The sky turns white from the bottom up as the About pieces leave: a gradient with a soft edge
      // (WHITE_EDGE of the screen tall) sweeps up until the whole screen is white; the About clouds go
      // with the sky. The side nav reads data-nav-tone to stay visible: white on the sky, forest on white.
      const { white, whiteHue, aboutClouds, skills, tools, workHeading } = sceneRefs.current;
      const rise = smooth(ABOUT_EXIT[0], ABOUT_EXIT[1], pa);
      if (white) {
        // % up the screen that is fully white; above it the white thins out over WHITE_EDGE along a
        // smoothstep curve (several stops), so there is no visible line where it turns solid.
        const solid = -WHITE_EDGE + rise * (100 + WHITE_EDGE);
        const stops = Array.from({ length: 9 }, (_, i) => {
          const f = i / 8;
          const alpha = 1 - f * f * (3 - 2 * f);
          return `rgb(var(--paper) / ${alpha.toFixed(3)}) ${(solid + f * WHITE_EDGE).toFixed(2)}%`;
        });
        white.style.background = `linear-gradient(to top, ${stops.join(', ')})`;
      }
      if (whiteHue) whiteHue.style.opacity = String(rise);
      track.dataset.navTone = rise > 0.5 ? 'dark' : 'light';
      // Once the sky has turned white, the stage itself is white too: its hero blue could otherwise show
      // as a hairline at its bottom edge on phones (sub-pixel rounding against the white layer).
      stage.style.backgroundColor = rise > 0.98 ? 'rgb(var(--paper))' : '';
      if (aboutClouds) aboutClouds.style.opacity = String(smooth(0, 0.15, pa) * (1 - rise));

      // Featured Work: the heading rises into the middle, then the column of cards scrolls up past it;
      // once the last card's middle reaches the heading, the heading moves up with it (hidden under it).
      const at = scrolled / screen; // where we are, in screen heights
      const column = (at - SCHEDULE.work) * screen; // how far the column has moved up (px)
      const cards = sceneRefs.current.workCards?.current ?? [];
      const last = cards[cards.length - 1];
      cards.forEach((card) => {
        if (!card) return;
        const y = Number(phone ? card.dataset.my : card.dataset.y) * screen - column;
        const h = Number(card.dataset.h) * screen;
        card.style.visibility = y < screen && y + h > 0 ? 'visible' : 'hidden';
        card.style.transform = `translate3d(0, ${y}px, 0)`;
      });
      if (workHeading) {
        // Rises with the column until it is in the middle and holds there. Once the last card's middle
        // reaches it, it dissolves in place (fades out as a blur builds, like the Journey's text) while
        // that card leaves the screen, and is gone as the Tools line starts to come in (TOOLS_AT).
        // Phones: it just scrolls up with the column, above the cards, like a plain page.
        const reached = last ? (Number(last.dataset.y) + Number(last.dataset.h) / 2 - 0.5) * screen : Infinity;
        const gone = phone ? 0 : smooth(reached, TOOLS_AT * screen, column);
        const y = phone ? (HEADING_Y - 0.5) * screen - column : Math.max((HEADING_Y - 0.5) * screen - column, 0);
        workHeading.style.visibility = y < screen && gone < 1 ? 'visible' : 'hidden';
        workHeading.style.transform = `translate3d(0, ${y}px, 0)`;
        workHeading.style.opacity = String(1 - gone);
        workHeading.style.filter = gone > 0.001 ? `blur(${(gone * 5).toFixed(2)}px)` : '';
      }

      // Tools: as the last card leaves, the line comes towards you in the middle and the icons stream out
      // around it.
      const sp = Math.min(Math.max((at - SCHEDULE.tools) / (TOOLS_RUN * STREAM_END), 0), 1);
      if (tools) {
        const comeIn = smooth(SCHEDULE.tools, SCHEDULE.tools + TOOLS_COME, at);
        const fadeOut = smooth(TOOLS_OUT[0], TOOLS_OUT[1], sp);
        tools.style.opacity = String(comeIn * (1 - fadeOut));
        tools.style.transform = `scale(${0.55 + 0.45 * comeIn})`;
        tools.style.visibility = comeIn > 0 && fadeOut < 1 ? 'visible' : 'hidden';
      }
      sceneRefs.current.stream?.current?.set(sp);
      if (skills) skills.style.visibility = sp > 0 && sp < 1 ? 'visible' : 'hidden';

      // The Journey (JourneyScene.jsx) takes it from here, in screen heights into the scene.
      sceneRefs.current.journey?.current?.set(at - SCHEDULE.journey);

      // Desktop: the footer, as the last scene (FooterScene and FooterSky, Footer.jsx). It starts while
      // the last certificates fly out past the edges: the meadow rises, the sky fades in over the whole
      // screen as the last card leaves (FOOTER_SKY of the scene; one full-screen layer, so it has no edge
      // anywhere), then the text and the note card come in.
      if (FOOTER_IN_SCENE) {
        const f = Math.min(Math.max((at - SCHEDULE.journey - FOOTER_SHOW.from) / FOOTER_SHOW.run, 0), 1);
        const footerSky = sceneRefs.current.footerSky;
        if (footerSky) {
          const shown = smooth(FOOTER_SKY[0], FOOTER_SKY[1], f);
          footerSky.style.opacity = shown.toFixed(3);
          footerSky.style.visibility = shown > 0 ? 'visible' : 'hidden';
          // The side nav's dots turn white over the footer's blue sky, as they are over About's.
          if (shown > 0.5) track.dataset.navTone = 'light';
        }
        sceneRefs.current.footer?.current?.set(f);
      }

      // The sweep: the bank crosses from just off the left edge to just off the right, level with the
      // headline, and the headline is masked away left of the bank's middle.
      const copy = copyRef.current;
      const bank = sweepRef.current;
      if (!copy || !bank) return;
      const t = (p - SWEEP[0]) / (SWEEP[1] - SWEEP[0]);
      if (t <= 0) {
        bank.style.visibility = 'hidden';
        copy.style.maskImage = copy.style.webkitMaskImage = '';
        copy.style.visibility = '';
        return;
      }
      const w = stage.offsetWidth;
      const h1 = copy.querySelector('h1').getBoundingClientRect();
      const top = stage.getBoundingClientRect().top;
      const x = -bank.offsetWidth + (w + bank.offsetWidth) * Math.min(t, 1);
      bank.style.visibility = t >= 1 ? 'hidden' : 'visible';
      bank.style.transform = `translate3d(${x}px, ${h1.top - top + h1.height / 2 - bank.offsetHeight / 2}px, 0)`;
      const edge = x + bank.offsetWidth * 0.5; // the bank's dense middle
      const mask = `linear-gradient(to right, transparent ${edge - SWEEP_SOFT}px, #000 ${edge + SWEEP_SOFT}px)`;
      copy.style.maskImage = copy.style.webkitMaskImage = mask;
      copy.style.visibility = t >= 1 ? 'hidden' : '';
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [trackRef, stageRef, layersRef, copyRef, sweepRef, aboutRef, sceneRefs]);
};

// The hero's loader. #boot (in index.html: the hero's sky with a small spinner, plain HTML and CSS)
// covers the page from the first paint. This waits for the hero's own images (the sky and the ground:
// the phone's or the desktop's) and the fonts, then fades it into the hero (.boot-done) and removes it. Until then the page does not scroll,
// the hero's entrance animations wait (data-loading on the stage, .hero-frame rules in index.css) and the
// later scenes are not mounted, so nothing else competes with the ground for the connection. It gives up
// waiting after BOOT_MAX ms, so a slow or failed image never leaves the page covered.
const BOOT_MAX = 12000;
const useHeroReady = () => {
  const lenis = useLenis();
  const [ready, setReady] = useState(() => !document.getElementById('boot'));
  useEffect(() => {
    if (ready) return undefined;
    const root = document.documentElement;
    root.style.overflow = 'hidden';
    const images = isMobile() ? [skyM, groundM] : [sky, ground, groundFront];
    const waits = [
      ...images.map((src) => {
        const img = new Image();
        img.fetchPriority = 'high';
        img.src = src;
        return img.decode();
      }),
      document.fonts.ready,
    ];
    let over = false;
    const finish = () => {
      if (over) return;
      over = true;
      setReady(true);
    };
    // A beat after everything is in, so a fast load doesn't just flash the loader.
    Promise.allSettled(waits).then(() => setTimeout(finish, 250));
    const cap = setTimeout(finish, BOOT_MAX);
    return () => clearTimeout(cap);
  }, [ready]);
  useEffect(() => {
    if (ready) return undefined;
    lenis?.stop();
    return () => lenis?.start();
  }, [ready, lenis]);
  // Once ready: let the page scroll, place the newly mounted scenes for where the page is (the scroll
  // hook runs on scroll), and fade the loader out, then remove it.
  useEffect(() => {
    if (!ready) return undefined;
    document.documentElement.style.overflow = '';
    window.dispatchEvent(new Event('scroll'));
    const boot = document.getElementById('boot');
    if (!boot) return undefined;
    boot.classList.add('boot-done');
    const t = setTimeout(() => boot.remove(), 550);
    return () => clearTimeout(t);
  }, [ready]);
  return ready;
};

// A full-screen layer of the fly-through.
// The origin is the vanishing point just above the horizon (HORIZON of the photo's height).
const layerClass =
  'absolute inset-0 origin-[50%_calc(var(--sy)_+_var(--sh)_*_var(--horizon))] will-change-[transform,opacity]';
const stageBox = 'absolute left-[var(--sx)] top-[var(--sy)] h-[var(--sh)] w-[var(--sw)]';

// The later scenes mount one after another once the hero is in: About at once (it is next), then
// Featured Work, Tools, the Journey and the footer, each in an idle moment (STEPS in all). Mounting
// them all together was one long block (~0.3 s on a slow phone) right as the hero appeared. Each mount
// fires a scroll event, so the scroll hook places the new scene at once (a reload mid-page shows it).
const STEPS = 5;
const useStagedMount = (ready) => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!ready || step >= STEPS) return undefined;
    if (step === 0) {
      setStep(1);
      return undefined;
    }
    const next = () => setStep((n) => n + 1);
    if (!('requestIdleCallback' in window)) {
      const timer = setTimeout(next, 30);
      return () => clearTimeout(timer);
    }
    const id = window.requestIdleCallback(next, { timeout: 400 });
    return () => window.cancelIdleCallback(id);
  }, [ready, step]);
  useEffect(() => {
    if (!step) return undefined;
    const frame = requestAnimationFrame(() => window.dispatchEvent(new Event('scroll')));
    return () => cancelAnimationFrame(frame);
  }, [step]);
  return step;
};

export const Home = () => {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const layersRef = useRef([]);
  const copyRef = useRef(null);
  const sweepRef = useRef(null);
  const aboutRef = useRef([]);
  const sceneRefs = useRef({});
  const streamControl = useRef(null);
  const journeyControl = useRef(null);
  const footerControl = useRef(null);
  const workCards = useRef([]);
  const workCard = (i) => (el) => {
    workCards.current[i] = el;
  };
  sceneRefs.current.stream = streamControl;
  sceneRefs.current.journey = journeyControl;
  sceneRefs.current.footer = footerControl;
  sceneRefs.current.workCards = workCards;
  const scene = (name) => (el) => {
    sceneRefs.current[name] = el;
  };
  const aboutPiece = (i) => (el) => {
    aboutRef.current[i] = el;
  };
  // A plate at depth z; solid plates never fade (they leave the frame instead).
  const layer = (i, z, solid = false) => (el) => {
    layersRef.current[i] = { el, z, solid };
  };
  useFlyThrough(trackRef, stageRef, layersRef, copyRef, sweepRef, aboutRef, sceneRefs);
  const mobile = useMobile();
  const ready = useHeroReady();
  const step = useStagedMount(ready);
  const clouds = mobile ? HERO_CLOUDS_M : HERO_CLOUDS;
  const smoothAnchor = useSmoothAnchor();

  return (
    // The track is the scroll distance of the fly-through; the stage inside it stays pinned. With
    // reduced motion it is just the one screen, unpinned.
    <section ref={trackRef} id="home" data-nav-tone="light" style={{ height: `${(1 + SCHEDULE.end) * 100}lvh` }}
      className="relative motion-reduce:h-auto!">
      <div
        ref={stageRef}
        data-loading={ready ? undefined : ''}
        className="sticky top-0 isolate h-lvh min-h-[600px] overflow-hidden bg-[#1D6EB0] [container-type:size] dark:bg-[#0B1530]"
      >
        <div className="hero-frame absolute inset-0" data-portrait={mobile || undefined} style={{ '--horizon': mobile ? HORIZON_M : HORIZON }}>
          {/* Layers, back to front: sky, clouds, headline (z-2), the sweeping bank (z-3), ground,
              buttons (under the computer).
              The ground hides the bottom of the headline where the hill rises. Each layer is a
              full-screen wrapper the fly-through scales; the photo layers sit in the stage box (the
              photo's own size and offset) inside it. Entrance animations are on the inner elements,
              so the two transforms don't clash. */}
          <div ref={layer(0, DEPTH.sky, true)} className={`${layerClass} z-0`}>
            <div className={stageBox}>
              <img src={mobile ? skyM : sky} alt="" fetchPriority="high" className="night-sky animate-settle absolute inset-0 size-full select-none" />
              <div aria-hidden="true" style={STARS} className="stars absolute inset-x-0 top-0 h-[55%] [mask-image:linear-gradient(to_bottom,#000_50%,transparent)]" />
            </div>
          </div>

          {clouds.map((cloud, i) => (
            <div key={i} ref={layer(1 + i, CLOUD_DEPTH[i])} className={`${layerClass} z-[1]`}>
              <div className={stageBox}>
                <Clouds clouds={[cloud]} className="night-clouds animate-settle" />
              </div>
            </div>
          ))}

          {/* Copy column. Its bottom is pinned to a height on the photo (--hy) so the last line always
              meets the hill in the same place: readable on the left, sinking into the grass. */}
          <div ref={copyRef} className={`${layerClass} pointer-events-none z-[2]`}>
            <div className="absolute inset-x-0 top-[calc(var(--sy)_+_var(--sh)_*_var(--hy))] mx-auto w-[min(calc(100%-32px),1176px)] -translate-y-full md:w-[min(calc(100%-64px),1176px)]">
              {/* Two short lines, set big so the words carry the hero. Size follows the stage, so the
                  overlap with the hill holds at any desktop size, but never wider than the column (the
                  longer line, "stand out.", is ≈4.6 em, plus some slack). */}
              <h1
                data-cat-avoid
                style={rise(150)}
                className="animate-rise font-grotezk text-[length:min(19cqw,7rem)] font-medium leading-[0.8] tracking-[-0.045em] text-cream md:text-[length:min(var(--sw)_*_0.125,min(100cqw_-_64px,1176px)_/_5,15rem)]"
              >
                Made to
                <br /> stand out.
              </h1>
            </div>
          </div>

          {/* The bank that sweeps across the headline once the meadow has gone (moved by the fly-through). */}
          <div
            ref={sweepRef}
            aria-hidden="true"
            className="night-clouds pointer-events-none invisible absolute left-0 top-0 z-[3] w-[125%] will-change-transform"
          >
            {/* Three copies of the big cloud, overlapped, so the bank is dense enough to read as a wall
                of cloud over the text. */}
            <img src={cloud1} alt="" className="block w-full select-none" />
            <img src={cloud1} alt="" className="absolute left-[18%] top-[14%] w-[85%] -scale-x-100 select-none" />
            <img src={cloud1} alt="" className="absolute left-[6%] top-[-6%] w-[75%] select-none" />
          </div>

          {/* Ground group: back meadow, the peeking cat, then the front slope copied from the same photo,
              so the cat's flat bottom is hidden behind the ridge. One solid plate, so they never drift
              apart. */}
          <div ref={layer(8, DEPTH.ground, true)} className={`${layerClass} pointer-events-none z-[4]`}>
            <div className={`${stageBox} night-ground animate-settle`}>
              <img
                src={mobile ? groundM : ground}
                alt="A beige retro computer on a small wooden desk in a grassy meadow"
                fetchPriority="high"
                className="absolute inset-0 size-full select-none"
              />
              {!mobile && (
                <>
                  <MeadowCat />
                  <img src={groundFront} alt="" className="absolute inset-0 size-full select-none" />
                </>
              )}
            </div>
          </div>

          {/* Buttons stand in the grass below the computer's desk, at the ground's depth. Right-aligned
              to the content column; vertically at --pc-y of the stage, but kept above the bottom edge. */}
          <div ref={layer(9, DEPTH.ground, true)} style={{ '--pc-y': mobile ? 0.83 : 0.765 }} className={`${layerClass} pointer-events-none z-[5]`}>
            <div
              data-cat-avoid
              className="pointer-events-auto absolute inset-x-0 top-[min(var(--sy)_+_var(--sh)_*_var(--pc-y),100svh_-_96px)] mx-auto flex w-[min(calc(100%-32px),1176px)] justify-end md:w-[min(calc(100%-64px),1176px)]"
            >
              <div style={rise(300)} className="animate-rise flex flex-wrap justify-end gap-3">
                <Button variant="forest" href="#about" onClick={smoothAnchor}>
                  Know Me Better
                  <ArrowSwap className="-mr-0.5" />
                </Button>
                <Button variant="beige" href={CV} target="_blank" rel="noopener noreferrer">
                  View Resume
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* After the hero, on the sky it ends on (above every hero layer): clouds drifting behind About,
            the white the sky turns into (from the bottom up), About, Featured Work, then Tools. Hidden with reduced
            motion, where the hero is not pinned. */}
        {/* Every full-screen layer from here on lets clicks through (only its own pieces take them),
            or it would sit over the hero's buttons and the scenes under it. */}
        <div ref={scene('aboutClouds')} style={{ opacity: 0 }} className="pointer-events-none absolute inset-0 z-[7] motion-reduce:hidden">
          <Clouds clouds={ABOUT_CLOUDS} className="night-clouds" />
        </div>
        <div
          ref={scene('white')}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[8] motion-reduce:hidden"
        />
        <div
          ref={scene('whiteHue')}
          aria-hidden="true"
          style={{ opacity: 0, background: WHITE_HUE }}
          className="pointer-events-none absolute inset-0 z-[8] motion-reduce:hidden"
        />
        {/* The later scenes mount once the hero is in (useHeroReady, then one by one: useStagedMount), so their images, the paper’s
            three.js and the icons don't share the connection with the hero's ground. */}
        <div className="pointer-events-none absolute inset-0 z-10 motion-reduce:hidden">
          {step >= 1 && <AboutScene itemRef={aboutPiece} />}
        </div>
        <div className="theme-flip pointer-events-none absolute inset-0 z-[11] motion-reduce:hidden">
          {step >= 2 && <WorkScene headingRef={scene('workHeading')} cardRef={workCard} />}
        </div>
        <div
          ref={scene('tools')}
          style={{ visibility: 'hidden', opacity: 0 }}
          className="pointer-events-none absolute inset-0 z-[13] grid origin-center place-items-center will-change-transform motion-reduce:hidden"
        >
          {/* A soft white halo keeps the line clear of the icons streaming past behind it. */}
          <p className="bg-[radial-gradient(closest-side,rgb(var(--paper))_55%,rgb(var(--paper)/0))] px-6 py-10 font-grotezk text-[length:2.35rem] font-medium leading-none tracking-[-0.035em] text-sky md:px-24 md:py-14 md:text-[length:clamp(2.6rem,5.2vw,5rem)]">
            Tools I work with.
          </p>
        </div>
        <div ref={scene('skills')} style={{ visibility: 'hidden' }} className="theme-flip pointer-events-none absolute inset-0 z-[12] motion-reduce:hidden">
          {step >= 3 && <SkillsScene control={streamControl} />}
        </div>
        {/* Under the icons, so the last of them fly past in front of "My journey". */}
        {/* Lets clicks through (to About and Work under it); only the stickers take them. */}
        <div className="theme-flip pointer-events-none absolute inset-0 z-[11] motion-reduce:hidden">
          {step >= 4 && <JourneyScene control={journeyControl} />}
        </div>
        {/* Desktop: the footer as the last scene: its sky behind the certificate cards (above the white,
            under the scenes), and its meadow, text and note card in front of everything. */}
        {step >= 5 && FOOTER_IN_SCENE && (
          <>
            <FooterSky skyRef={scene('footerSky')} style={{ opacity: 0, visibility: 'hidden' }} className="absolute inset-0 z-[9] motion-reduce:hidden" />
            <div className="pointer-events-none absolute inset-0 z-[14] motion-reduce:hidden">
              <FooterScene control={footerControl} />
            </div>
          </>
        )}
      </div>

      {/* Reduced motion: no pinned scenes, so Experience and Education as a plain list. */}
      <div className="hidden motion-reduce:block">
        <JourneyList />
      </div>

      {/* Where each part is in the scroll (for the nav and links): About once its pieces have landed,
          Work once the heading has reached the middle, Skills once the icons are streaming, Journey once
          its heading is in. */}
      {[
        ['about', SCHEDULE.about + ABOUT_RUN * ABOUT_LANDED],
        ['work', SCHEDULE.work + HEADING_Y - 0.5],
        ['skills', SCHEDULE.tools + 0.8],
        ['journey', SCHEDULE.journey + 0.45],
        // Desktop: the footer scene, once it is all in (the end of the track).
        ...(FOOTER_IN_SCENE ? [['contact', SCHEDULE.end - 0.02]] : []),
      ].map(([id, at]) => (
        <div
          key={id}
          id={id}
          aria-hidden="true"
          style={{ top: `${at * 100}lvh` }}
          className="pointer-events-none absolute inset-x-0 h-px"
        />
      ))}
    </section>
  );
};

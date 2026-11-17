import { projectsData } from '../data/projects';
import { ProjectThumb } from './ProjectCard';
import { ALL_WORK } from './projectView';
import { MOBILE_Y } from './workLayout';
import { Button } from './ui/Button';
import { ArrowSwap } from './ui/ArrowSwap';

// Featured Work, after About in the hero's pinned scroll, as the sky turns white. "Featured Work" and
// the View all button rise into the middle; then the five newest projects scroll up past them like a
// column of prints (left, right, left, right, left); once the last one reaches the heading, the heading
// dissolves in place as that card leaves the screen.
// All of it is moved by the hero's scroll hook
// (useFlyThrough in Home.jsx): the heading through `headingRef`, each card through `cardRef(i)`; a
// card's data-y is where it sits in the column and data-h its height, both in screen heights.
// Phones: a plain page: the heading and its button, then the five cards one under another, nearly the
// screen's width, all scrolling up together with the page (no hold, no dissolve); each card's place is
// data-my (MOBILE_Y) and the heading moves with the column (Home's scroll hook reads isMobile()).


// The five newest projects (the list is oldest first).
const FEATURED = [...projectsData].reverse().slice(0, 5);

// Where each card sits in the column: left (x, % of the screen), top (y) in screen heights below the top
// of the column, height (all min(34vw, 520px) wide on desktop): left, right, left, right, left. The heading sits
// at HEADING_Y (1.05, in Home.jsx), so the first card starts just below it and they rise together.
const WORK_LAYOUT = [
  { x: '8%', y: 1.2, h: 0.4 },
  { x: '56%', y: 1.62, h: 0.4 },
  { x: '11%', y: 2.15, h: 0.4 },
  { x: '53%', y: 2.58, h: 0.4 },
  { x: '8%', y: 3.05, h: 0.4 },
];

// A card: the project's image with its title on a soft gradient. Pressing it opens the project's
// details, which grow out of the card; its links show as icons in the corner on hover (ProjectCard.jsx).
const Card = ({ project }) => (
  <ProjectThumb project={project} className="size-full shadow-[0_24px_60px_-28px_rgb(10_40_22/0.55)]">
    <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(10_30_18/0.78),rgb(10_30_18/0.15)_45%,transparent_70%)]" />
    <span className="pointer-events-none absolute bottom-0 left-0 p-4 text-white md:p-6">
      <span className="block font-grotezk text-[17px] font-medium leading-tight tracking-[-0.02em] md:text-[24px]">{project.title}</span>
      <span className="mt-1 block text-[12px] text-white/75 md:mt-1.5 md:text-[14px]">{project.tags.slice(0, 3).join(' · ')}</span>
    </span>
  </ProjectThumb>
);

export const WorkScene = ({ headingRef, cardRef }) => (
  <div className="absolute inset-0">
    {/* The heading, under the cards. */}
    <div
      ref={headingRef}
      style={{ visibility: 'hidden' }}
      className="absolute inset-0 z-0 grid place-items-center will-change-transform"
    >
      <div className="flex w-full min-w-0 flex-col items-center gap-6 justify-self-stretch">
        <h2 className="font-grotezk text-[length:clamp(2.6rem,5.2vw,5rem)] font-medium leading-none tracking-[-0.035em] text-sky">
          Featured Work
        </h2>
        <Button variant="forest" href={ALL_WORK} className="pointer-events-auto">
          View all work
          <ArrowSwap className="-mr-0.5" />
        </Button>
      </div>
    </div>

    {/* The cards, in a column that the scroll moves up past the heading. */}
    {FEATURED.map((project, i) => {
      const { x, y, h } = WORK_LAYOUT[i];
      // Phones: the cards nearly the width of the screen, one under another (data-my); the desktop
      // values apply from md up.
      return (
        <div
          key={project.id}
          ref={cardRef(i)}
          data-y={y}
          data-my={MOBILE_Y[i]}
          data-h={h}
          style={{ '--x': x, '--h': `${h * 100}lvh`, visibility: 'hidden' }}
          className={`pointer-events-auto absolute top-0 z-10 aspect-video h-[23lvh] max-w-[94vw] left-1/2 -translate-x-1/2 md:aspect-auto md:max-w-none md:translate-x-0 md:h-[var(--h)] md:left-[var(--x)] md:w-[min(34vw,520px)] will-change-transform`}
        >
          <Card project={project} />
        </div>
      );
    })}
  </div>
);

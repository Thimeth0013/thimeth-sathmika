import { useEffect, useMemo, useRef, useState } from 'react';
import { projectsData } from '../../data/projects';
import { ProjectThumb } from '../ProjectCard';

// The All work page's grid (WorkPage.jsx): every project, newest first, two to a row, in the same
// column as the nav and the footer (so the same gaps at the sides). A row of filter pills narrows it
// (Design / Code / Live: projects that have that link). Each card is the shared ProjectThumb (press it
// for the details, which grow out of the card; its links show as icons on hover), with the title and
// tags under it.
//
// Motion: each card fades up once, when it scrolls into view (Reveal: an IntersectionObserver and a CSS
// transition, the second card in a row a beat after the first); changing the filter replays it for the
// new set. Nothing moves on hover, and nothing re-animates when scrolling back.

const column = 'mx-auto w-[min(calc(100%-32px),1176px)] md:w-[min(calc(100%-64px),1176px)]';

const FILTERS = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'design', label: 'Design', test: (p) => Boolean(p.designLink) },
  { id: 'code', label: 'Code', test: (p) => Boolean(p.githubLink) },
  { id: 'live', label: 'Live', test: (p) => Boolean(p.liveLink) },
];

// Fades its children up the first time they scroll into view.
const Reveal = ({ delay = 0, className = '', children }) => {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setSeen(true);
        io.disconnect();
      },
      { rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: seen ? `${delay}ms` : '0ms' }}
      className={`transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        seen ? '' : 'translate-y-4 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const Project = () => {
  const [filter, setFilter] = useState('all');
  const all = useMemo(() => [...projectsData].reverse(), []);
  const shown = all.filter(FILTERS.find((f) => f.id === filter).test);

  return (
    <section id="project" data-nav-tone="dark" className="theme-flip bg-white pb-28 pt-10 text-forest md:pb-36 md:pt-16">
      <div className={column}>
        <Reveal>
          <h1 className="font-grotezk text-[length:clamp(3rem,8vw,6.5rem)] font-medium leading-none tracking-[-0.04em] text-sky">All work</h1>
          <p className="mt-5 max-w-[46ch] text-[18px] leading-[1.55] text-forest/75">
            {all.length} projects across design, code and live builds.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div role="group" aria-label="Filter projects" className="mt-10 flex flex-wrap gap-2">
            {FILTERS.map(({ id, label, test }) => {
              const on = id === filter;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(id)}
                  className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border px-4 text-[14px] font-medium transition-[background-color,border-color,color,scale] duration-150 ease-out active:scale-[0.97] ${
                    on ? 'theme-keep border-forest bg-forest text-beige' : 'border-forest/15 text-forest/80 hover:border-forest/45'
                  }`}
                >
                  {label}
                  <span className={`font-mono text-[11px] tabular-nums ${on ? 'text-beige/70' : 'text-forest/50'}`}>{all.filter(test).length}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Re-keyed on the filter, so the new set fades up again. */}
        <ul key={filter} className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2 md:gap-x-10 md:gap-y-16">
          {shown.map((project, i) => (
            <li key={project.id}>
              <Reveal delay={(i % 2) * 70}>
                <ProjectThumb project={project} className="aspect-[16/10]" />
                <h2 className="mt-5 font-grotezk text-[24px] font-medium leading-tight tracking-[-0.02em]">{project.title}</h2>
                <p className="mt-1.5 text-[14.5px] text-forest/65">{project.tags.slice(0, 4).join(' · ')}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

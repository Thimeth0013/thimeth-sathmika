import { ReactLenis } from 'lenis/react';
import { ArrowLeft } from 'lucide-react';
import { ProjectViewProvider } from './components/ProjectView';
import { Project } from './components/sections/Project';
import { Footer } from './components/sections/Footer';

// The "All work" page (work/index.html): every project (sections/Project.jsx: the grid, its filters, and
// the details view that grows out of a card, ProjectView.jsx), then the footer. A plain top bar leads
// back home.
const HOME = import.meta.env.BASE_URL.replace(/\/?$/, '/'); // the base may lack its trailing slash

export const WorkPage = () => (
  <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
    <ProjectViewProvider>
    <div className="theme-flip min-h-screen bg-white text-forest">
      <header className="relative z-20 bg-white">
        <div className="mx-auto flex h-16 w-[min(calc(100%-32px),1176px)] items-center justify-between md:h-20 md:w-[min(calc(100%-64px),1176px)]">
          <a href={HOME} aria-label="Thimeth Sathmika, home" className="font-display text-xl font-semibold tracking-[-0.03em]">
            TS
          </a>
          {/* Styled as the project view's Next button (ProjectView.jsx), arrow pointing back. */}
          <a
            href={HOME}
            className="theme-keep group inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-forest bg-forest px-5 text-[14.5px] font-medium text-beige transition-[background-color,border-color,scale] duration-150 ease-out hover:border-[#1B6A3B] hover:bg-[#1B6A3B] active:scale-[0.97]"
          >
            <ArrowLeft
              aria-hidden="true"
              strokeWidth={1.75}
              className="size-4 transition-transform duration-200 ease-out-expo [@media(hover:hover)_and_(pointer:fine)]:group-hover:-translate-x-0.5"
            />
            Back to home
          </a>
        </div>
      </header>
      <main>
        <Project />
      </main>
      <Footer />
    </div>
    </ProjectViewProvider>
  </ReactLenis>
);

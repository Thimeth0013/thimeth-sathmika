import { ReactLenis } from 'lenis/react';
import { HeroNav } from './components/HeroNav';
import { ProjectViewProvider } from './components/ProjectView';
import { SideNav } from './components/SideNav';
import { Home } from './components/sections/Home';
import { Footer } from './components/sections/Footer';
import "./index.css";

const App = () => {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
      {/* The project details view (opened from the Featured Work cards). */}
      <ProjectViewProvider>
      <div className="min-h-screen bg-paper text-ink">
        {/* Top bar on the hero only (scrolls away with it); the right-edge SideNav from About on. */}
        <HeroNav />
        <main>
          <Home />
          {/* Breathing room between the certificates (the end of the pinned scenes, on white) and the
              footer; plain white, so the two join without an edge. */}
          <div aria-hidden="true" className="h-[4svh] bg-white md:h-[34svh]" />
        </main>
        {/* After main in the DOM, so keyboard users reach it after the scenes, where it is visible. */}
        <SideNav />
        <Footer />
      </div>
      </ProjectViewProvider>
    </ReactLenis>
  )
}

export default App

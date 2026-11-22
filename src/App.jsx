import { ReactLenis, useLenis } from 'lenis/react';
import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { HeroNav } from './components/HeroNav';
import { MobileNav } from './components/MobileNav';
import { ProjectViewProvider } from './components/ProjectView';
import { SideNav } from './components/SideNav';
import { Home } from './components/sections/Home';
import { Footer } from './components/sections/Footer';
import { FOOTER_IN_SCENE } from './components/journey';
import { TerminalContext } from './lib/terminal';
import "./index.css";

// The terminal (an interactive fake shell over the projects, certificates and badges) loads only when
// it is first opened, from the About scene's terminal icon.
const TerminalModal = lazy(() => import('./components/TerminalModal'));

// While the terminal is open the page behind it stays put.
const HoldScroll = ({ active }) => {
  const lenis = useLenis();
  useEffect(() => {
    if (!active) return undefined;
    lenis?.stop();
    return () => lenis?.start();
  }, [active, lenis]);
  return null;
};

const App = () => {
  const [terminal, setTerminal] = useState(false);
  const openTerminal = useCallback(() => setTerminal(true), []);

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
      <TerminalContext.Provider value={openTerminal}>
      {/* The project details view (opened from the Featured Work cards). */}
      <ProjectViewProvider>
      <div className="min-h-screen bg-paper text-ink">
        {/* Desktop: a top bar on the hero only (scrolls away with it), the right-edge SideNav from About
            on. Phones: MobileNav, a top bar with a menu, all the way down. */}
        <HeroNav />
        <MobileNav />
        <main>
          {/* Desktop: the footer is the pinned scroll's last scene (inside Home). Phones and reduced motion
              have it as a section after the page, after a little white. */}
          <Home />
          {!FOOTER_IN_SCENE && <div aria-hidden="true" className="h-[4svh] bg-[rgb(var(--paper))] md:hidden" />}
        </main>
        {/* After main in the DOM, so keyboard users reach it after the scenes, where it is visible. */}
        <SideNav />
        {!FOOTER_IN_SCENE && <Footer />}
        {terminal && (
          <Suspense fallback={null}>
            <TerminalModal isOpen onClose={() => setTerminal(false)} />
          </Suspense>
        )}
        <HoldScroll active={terminal} />
      </div>
      </ProjectViewProvider>
      </TerminalContext.Provider>
    </ReactLenis>
  )
}

export default App

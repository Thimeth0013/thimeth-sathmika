import { ReactLenis } from 'lenis/react';
import { useState } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { NavBar } from './components/NavBar';
import { MobileMenu } from './components/MobileMenu';
import { Home } from './components/sections/Home';
import { About } from './components/sections/About';
import { Project } from './components/sections/Project';
import { Contact } from './components/sections/Contact';
import Terminal from './components/TerminalModal';
import "./index.css";

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
      {!isLoaded && <LoadingScreen onComplete={() => setIsLoaded(true)}/>}
      <div
        className={`min-h-screen transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } bg-black text-gray-100`}>
          <NavBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} onOpenTerminal={() => setIsTerminalOpen(true)}/>
          <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
          <Home/>
          <About/>
          <Project/>
          <Contact/>
          <Terminal 
            isOpen={isTerminalOpen} 
            onClose={() => setIsTerminalOpen(false)} 
          />
      </div> 
    </ReactLenis>
  )
}

export default App

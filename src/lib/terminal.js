import { createContext, useContext } from 'react';

// The terminal (TerminalModal) lives in App; anything inside it can open it with useOpenTerminal()()
// (the About scene's terminal icon does).
export const TerminalContext = createContext(() => {});
export const useOpenTerminal = () => useContext(TerminalContext);

import { Terminal } from 'lucide-react';
import matrix from '../assets/creative/matrix.mp4';

// A small square terminal window in the About scene: the title bar of the real one (TerminalModal: the
// same .terminal-glass window and .terminal-theme colours, the same title) over the matrix
// (creative/matrix.mp4, a looping muted video made from the owner's GIF). Clicking it opens the
// terminal (onOpen). Its glass is more opaque than the big window's (GLASS), so it reads as forest,
// not teal, over the blue sky.
const GLASS = 'linear-gradient(180deg, rgb(255 255 255 / 0.07), rgb(255 255 255 / 0.015) 40%), rgb(9 34 20 / 0.9)';
export const MiniTerminal = ({ onOpen }) => (
  <button
    type="button"
    onClick={onOpen}
    aria-label="Open the terminal"
    title="Open the terminal"
    style={{ background: GLASS }}
    className="terminal-theme terminal-glass block w-[95px] cursor-pointer overflow-hidden rounded-lg text-left font-mono transition-[scale] duration-150 ease-out active:scale-[0.97]"
  >
    <span className="flex items-center gap-1 border-b border-gray-300/15 bg-white/[0.04] px-2 py-1 text-[9px] text-gray-400">
      <Terminal aria-hidden="true" size={9} className="shrink-0 text-green-400" />
      <span className="truncate">terminal</span>
    </span>
    <video src={matrix} autoPlay muted loop playsInline preload="metadata" className="pointer-events-none block aspect-square w-full bg-black object-cover" />
  </button>
);

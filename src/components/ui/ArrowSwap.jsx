// Diagonal arrow that swaps on hover: the visible one flies out to the top-right and an
// identical one springs in from the bottom-left (styles: .arrow-swap in index.css).
// Needs a parent with the `group` class (Button has it). Sized so the arrow's ink roughly matches
// the cap height of 14.5px button text; nudged up 1px because the arrow optically sits low.
const Arrow = () => (
  <svg
    viewBox="0 0 16 16"
    width={16}
    height={16}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.9}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4.5 11.5L11.5 4.5M5.5 4.5H11.5V10.5" />
  </svg>
);

export const ArrowSwap = ({ className = '' }) => (
  <span aria-hidden="true" className={`arrow-swap grid size-[18px] shrink-0 -translate-y-px place-items-center overflow-hidden ${className}`}>
    <Arrow />
    <Arrow />
  </span>
);

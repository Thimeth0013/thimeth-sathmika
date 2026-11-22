// Rounded link-button used across the rebrand.
// Variants: dark (primary), outline (secondary), soft (tertiary, on white panels).
const base =
  // pt-[2px]: Archivo's tall ascent sits text ~1px above centre; this centres the caps optically.
  'theme-keep group inline-flex h-[46px] items-center justify-center gap-2 rounded-full border px-[22px] pt-[2px] ' +
  'text-[14.5px] font-medium tracking-[-0.005em] no-underline ' +
  'transition-[background-color,color,border-color,box-shadow,translate,scale] duration-250 ease-out-expo active:scale-[.97]';

const variants = {
  dark: 'border-ink bg-ink text-paper shadow-[0_10px_24px_-10px_rgba(10,10,10,0.55)] hover:-translate-y-px hover:border-[#262626] hover:bg-[#262626]',
  outline: 'border-ink/20 bg-surface text-ink hover:border-ink',
  soft: 'border-transparent bg-[#EAEAE6] text-ink hover:bg-[#DFDFDA]',
  // Natural palette (hero first)
  forest: 'border-forest bg-forest text-beige shadow-[0_10px_24px_-12px_rgba(20,83,45,0.7)] hover:-translate-y-px hover:border-[#1B6A3B] hover:bg-[#1B6A3B]',
  beige: 'border-beige bg-beige text-forest hover:-translate-y-px hover:border-cream hover:bg-cream',
};

export const Button = ({ variant = 'dark', className = '', children, ...props }) => (
  <a className={`${base} ${variants[variant]} ${className}`} {...props}>
    {children}
  </a>
);

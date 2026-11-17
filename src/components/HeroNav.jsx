import { useSmoothAnchor } from '../lib/useSmoothAnchor';

const LINKS = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#work' },
  { name: 'Journey', href: '#journey' },
  { name: 'Contact', href: '#contact' },
];

/**
 * The hero's top bar: the logo on the left, the links on the right, in cream over the photo. Not
 * fixed: it sits at the top of the page and scrolls away with it. From About on, the right-edge
 * SideNav takes over.
 */
export const HeroNav = () => {
  const smooth = useSmoothAnchor(); // in-page links scroll there through the scenes
  return (
  // Desktop only: phones have MobileNav (a top bar with a menu), as these links don't fit a phone.
  <header className="absolute inset-x-0 top-3 z-50 max-md:hidden md:top-4">
    <div className="mx-auto flex h-14 w-[min(calc(100%-32px),1176px)] items-center justify-between gap-x-5 text-cream md:w-[min(calc(100%-64px),1176px)]">
      <a href="#home" onClick={smooth} aria-label="Thimeth Sathmika, home" className="font-display text-xl font-semibold tracking-[-0.03em]">
        TS
      </a>

      <nav aria-label="Main">
        {/* The last link's padding hangs past the column, so its text ends on the column edge. */}
        <ul className="-mr-2 flex list-none gap-1.5 whitespace-nowrap md:-mr-3 md:gap-5">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={smooth}
                className="block rounded-full px-2 py-1.5 text-[14.5px] opacity-80 transition-opacity hover:opacity-100 md:px-3"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  </header>
  );
};

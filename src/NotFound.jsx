import { ArrowLeft, LayoutGrid } from 'lucide-react';
import { Button } from './components/ui/Button';
import { FooterGround, FooterSky } from './components/sections/Footer';

// The 404 page (404.html → src/notfound.jsx): GitHub Pages serves it for any path under the site that
// does not exist. One screen built from the footer's parts: the sky for the time of day (FooterSky, with
// its pixel clouds, and stars and the moon at night), a big white 404 and a way back, over the meadow
// (FooterGround, with the socials and the credit). The Enderman gets the blame: he turns up on the
// meadow after a few seconds (ENDERMAN_FIRST), and clicking him changes the time of day, as on the site.
const HOME = import.meta.env.BASE_URL.replace(/\/?$/, '/'); // the base may lack its trailing slash
const ENDERMAN_FIRST = 3000;
const column = 'mx-auto w-[min(calc(100%-32px),1176px)] md:w-[min(calc(100%-64px),1176px)]';

export const NotFound = () => (
  <div className="relative isolate flex min-h-svh flex-col overflow-hidden font-grotezk text-white">
    <FooterSky className="absolute inset-0" />
    <header className={`${column} relative z-20 flex h-16 items-center md:h-20`}>
      <a href={HOME} aria-label="Thimeth Sathmika, home" className="font-display text-xl font-semibold tracking-[-0.03em]">
        TS
      </a>
    </header>
    <main className={`${column} relative z-20 flex flex-1 flex-col justify-center pb-10`}>
      <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-white/80 [text-shadow:0_1px_8px_rgb(20_60_120/0.35)]">
        Page not found
      </p>
      <h1 className="mt-2 text-[length:clamp(6rem,22vw,15rem)] font-medium leading-[0.85] tracking-[-0.05em] [text-shadow:0_2px_26px_rgb(20_60_120/0.28)]">
        404
      </h1>
      <p className="mt-5 max-w-[38ch] text-lg font-medium leading-snug [text-shadow:0_1px_3px_rgb(20_60_120/0.35),0_1px_14px_rgb(20_60_120/0.4)] md:text-xl">
        This page wandered off into the meadow. The Enderman may have taken it.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button variant="beige" href={HOME}>
          <ArrowLeft aria-hidden="true" strokeWidth={1.75} className="-ml-0.5 size-4" />
          Back to home
        </Button>
        <Button variant="forest" href={`${HOME}work/`}>
          <LayoutGrid aria-hidden="true" strokeWidth={1.75} className="-ml-0.5 size-4" />
          All work
        </Button>
      </div>
    </main>
    <FooterGround settled first={ENDERMAN_FIRST} />
  </div>
);

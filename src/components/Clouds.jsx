import { HERO_CLOUDS } from './heroClouds';

const cloudStyle = ({ x, w, dur }) => ({
  // The wrapper spans the whole box, so translateX(%) is a % of the box width.
  '--from': `${-(x + w)}%`,
  '--to': `${100 - x}%`,
  '--dur': `${dur}s`,
  '--delay': `${(-(x + w) / (100 + w)) * dur}s`,
});

/** A layer of clouds drifting left to right and wrapping around. Fills its positioned parent. */
export const Clouds = ({ clouds = HERO_CLOUDS, className = '' }) => (
  <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
    {clouds.map((c, i) => (
      <div key={i} style={cloudStyle(c)} className="animate-drift absolute inset-0">
        <img
          src={c.src}
          alt=""
          style={{ left: `${c.x}%`, top: `${c.y}%`, width: `${c.w}%` }}
          className={`absolute h-auto max-w-none select-none ${c.flip ? '-scale-x-100' : ''}`}
        />
      </div>
    ))}
  </div>
);

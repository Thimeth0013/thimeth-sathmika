import { useEffect, useState } from 'react';

// Same proxy as the previous LetterboxdSpotifyCard (separate repo on Vercel).
const API = 'https://spotify-letterboxd-api.vercel.app/api';
const FETCH_TIMEOUT_MS = 8000;
const SPOTIFY_POLL_MS = 30000;

async function getJSON(url, signal) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener('abort', abort);
  const timer = setTimeout(abort, FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', abort);
  }
}


const stars = (rating) => '★'.repeat(Math.floor(rating)) + (rating % 1 ? '½' : '');

const daysAgo = (dateString) => {
  if (!dateString) return '';
  const days = Math.floor((Date.now() - new Date(dateString)) / 86_400_000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days} days ago`;
};

// Live data hooks: the last film logged on Letterboxd and the last/current track on Spotify.
const useFilm = () => {
  const [film, setFilm] = useState(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    const load = async (attempt = 0) => {
      try {
        const movie = await getJSON(`${API}/letterboxd`, controller.signal);
        if (!movie?.title) throw new Error('No film entry');
        setFilm(movie);
      } catch {
        if (controller.signal.aborted) return;
        if (attempt === 0) load(1);
        else setFailed(true);
      }
    };
    load();
    return () => controller.abort();
  }, []);
  return { film, failed };
};

// Spotify rate limits the proxy at times (RATE_LIMITED; the proxy then serves its last good track,
// flagged `stale`, when it has one). The card also keeps the last good track in localStorage and shows
// it as "Played …" when there is no answer, polls less often after a rate limit, and doesn't poll
// while the tab is hidden. "… ago" is worked out here from times (playedAt from Spotify, seenAt when
// it was last seen), not taken from the proxy's own text, which goes stale once stored.
const TRACK_CACHE = 'spotify:last-track';
const RATE_LIMIT_BACKOFF_MS = 60000;

const readCachedTrack = () => {
  try {
    const cached = JSON.parse(localStorage.getItem(TRACK_CACHE));
    // Not "paused" any more, nor the proxy's "… ago" text from back then: seenAt says when.
    return cached?.title ? { ...cached, isPlaying: false, lastPlayed: undefined } : null;
  } catch {
    return null;
  }
};

const useTrack = () => {
  const [track, setTrack] = useState(readCachedTrack);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    let timer = 0;
    const load = async () => {
      let next = SPOTIFY_POLL_MS;
      if (!document.hidden) {
        try {
          const data = await getJSON(`${API}/spotify`, controller.signal);
          if (data?.error === 'RATE_LIMITED') next = RATE_LIMIT_BACKOFF_MS;
          if (!data?.title) throw new Error(data?.error ?? 'No track');
          setTrack(data);
          setFailed(false);
          try {
            localStorage.setItem(TRACK_CACHE, JSON.stringify({ seenAt: Date.now(), ...data })); // a stale answer keeps the proxy's seenAt
          } catch {
            /* storage unavailable: just no fallback next time */
          }
        } catch {
          if (controller.signal.aborted) return;
          setFailed(true);
          setTrack((current) => (current ? { ...current, isPlaying: false } : readCachedTrack()));
        }
      }
      timer = setTimeout(load, next);
    };
    load();
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, []);
  return { track, failed };
};

// "2h ago" from a date string or ms timestamp; anything else is shown as it is.
const ago = (when) => {
  const t = typeof when === 'number' ? when : Date.parse(when);
  if (Number.isNaN(t)) return typeof when === 'string' ? when : '';
  const minutes = Math.max(0, Math.round((Date.now() - t) / 60000));
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  return hours < 24 ? `${hours}h ago` : daysAgo(new Date(t).toISOString());
};

// The cards (desktop and phones): the image fills a small card SQUARE px tall (square for the music, a
// narrower poster for the film, POSTER wide), with the label and title over a soft dark gradient at the
// bottom. The About scene scales them with `zoom`.
const SQUARE = 150;
export const POSTER = 104; // ≈ 2:3, like a film poster
const squareCard =
  'relative block overflow-hidden bg-forest bg-cover bg-center text-white shadow-[0_1px_2px_rgb(20_83_45/0.08),0_18px_40px_-18px_rgb(10_40_22/0.55)]';
const Square = ({ href, image, imageLabel, label: top, title, sub, className, width = SQUARE, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`${squareCard} ${className}`}
    style={{ width, height: SQUARE, ...(image ? { backgroundImage: `url("${image}")` } : {}) }}
  >
    <span role="img" aria-label={imageLabel} className="absolute inset-0" />
    <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,rgb(10_30_18/0.9),rgb(10_30_18/0.55)_40%,rgb(10_30_18/0.15)_62%,transparent_80%)]" />
    <span className="absolute inset-x-0 bottom-0 p-2.5">
      {/* With a sub line (the desktop poster, drawn bigger) the label and title are set smaller. */}
      <span className={`flex items-center gap-1.5 font-mono uppercase tracking-[0.06em] text-white/75 ${sub ? 'text-[6.5px]' : 'text-[9px]'}`}>
        {children}
        {top}
      </span>
      <span className={`mt-0.5 block truncate font-grotezk font-medium leading-tight ${sub ? 'text-[11px]' : 'text-[14px]'}`}>{title}</span>
      {sub && <span className="mt-0.5 block truncate text-[8px] text-white/70">{sub}</span>}
    </span>
  </a>
);

/** The last film logged on Letterboxd, as a poster with its title; `details` adds its year and rating
 * (desktop, where the poster is drawn bigger). */
export const MovieCard = ({ className = '', details = false }) => {
  const { film, failed } = useFilm();
  const sub = details && film && (
    <>
      {film.year}
      {film.rating ? <span className="text-sky"> · {stars(film.rating)}</span> : null}
    </>
  );
  return (
    <Square
      href={film?.link ?? 'https://letterboxd.com/thimeth/'}
      image={film?.posterUrl}
      imageLabel={film ? `Poster of ${film.title}` : 'Film poster'}
      label={film ? `Watched ${daysAgo(film.watchedDate)}`.trim() : 'Watched'}
      title={film?.title ?? (failed ? 'Letterboxd' : 'Loading…')}
      sub={sub}
      className={className}
      width={POSTER}
    />
  );
};

/** The track playing now (or last played) on Spotify, as its cover with the title. */
export const MusicCard = ({ className = '' }) => {
  const { track, failed } = useTrack();
  const paused = track?.lastPlayed === 'paused';
  const when = track && !track.isPlaying && !paused ? ago(track.playedAt ?? track.seenAt ?? track.lastPlayed) : '';
  return (
    <Square
      href={track?.spotifyUrl ?? 'https://open.spotify.com/'}
      image={track?.albumArt}
      imageLabel={track ? `Cover of ${track.title}` : 'Album cover'}
      label={track?.isPlaying ? 'Now playing' : paused ? 'Paused' : `Played${when ? ` ${when}` : ''}`}
      title={track?.title ?? (failed ? 'Spotify' : 'Loading…')}
      className={className}
    >
      {track?.isPlaying && (
        <span aria-hidden="true" className="eq-bars flex h-2 items-end gap-[2px]">
          <span className="h-full w-[2px] bg-sky" />
          <span className="h-full w-[2px] bg-sky" />
          <span className="h-full w-[2px] bg-sky" />
        </span>
      )}
    </Square>
  );
};

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

// The proxy passes every request straight to Spotify (no caching), so Spotify often answers
// RATE_LIMITED. The card keeps the last good track in localStorage and shows it as "Played …" when
// that happens, polls less often after a rate limit, and doesn't poll while the tab is hidden.
const TRACK_CACHE = 'spotify:last-track';
const RATE_LIMIT_BACKOFF_MS = 180000;

const readCachedTrack = () => {
  try {
    const cached = JSON.parse(localStorage.getItem(TRACK_CACHE));
    return cached?.title ? { ...cached, isPlaying: false } : null;
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
            localStorage.setItem(TRACK_CACHE, JSON.stringify({ ...data, seenAt: Date.now() }));
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

const card =
  'block bg-cream p-3 text-forest shadow-[0_1px_2px_rgb(20_83_45/0.08),0_18px_40px_-18px_rgb(10_40_22/0.45)] transition-transform duration-300 hover:-translate-y-1';
const label = 'font-mono text-[10.5px] uppercase tracking-[0.06em] text-forest/55';

// The phone versions: the image fills a small card SQUARE px tall (square for the music, a narrower
// poster for the film, POSTER wide), with the label and title over a soft dark gradient at the bottom.
// The About scene scales them with `zoom`.
const SQUARE = 150;
export const POSTER = 104; // ≈ 2:3, like a film poster
const squareCard =
  'relative block overflow-hidden bg-forest bg-cover bg-center text-white shadow-[0_1px_2px_rgb(20_83_45/0.08),0_18px_40px_-18px_rgb(10_40_22/0.55)]';
const Square = ({ href, image, imageLabel, label: top, title, className, width = SQUARE, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`${squareCard} ${className}`}
    style={{ width, height: SQUARE, ...(image ? { backgroundImage: `url("${image}")` } : {}) }}
  >
    <span role="img" aria-label={imageLabel} className="absolute inset-0" />
    <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,rgb(10_30_18/0.85),rgb(10_30_18/0.2)_55%,transparent_75%)]" />
    <span className="absolute inset-x-0 bottom-0 p-2.5">
      <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.06em] text-white/75">
        {children}
        {top}
      </span>
      <span className="mt-0.5 block truncate font-grotezk text-[14px] font-medium leading-tight">{title}</span>
    </span>
  </a>
);

/** The last film logged on Letterboxd: poster, title, year and rating. `square`: the phone version. */
export const MovieCard = ({ className = '', square = false }) => {
  const { film, failed } = useFilm();
  if (square)
    return (
      <Square
        href={film?.link ?? 'https://letterboxd.com/thimeth/'}
        image={film?.posterUrl}
        imageLabel={film ? `Poster of ${film.title}` : 'Film poster'}
        label={film ? `Watched ${daysAgo(film.watchedDate)}`.trim() : 'Watched'}
        title={film?.title ?? (failed ? 'Letterboxd' : 'Loading…')}
        className={className}
        width={POSTER}
      />
    );
  return (
    <a
      href={film?.link ?? 'https://letterboxd.com/thimeth/'}
      target="_blank"
      rel="noopener noreferrer"
      className={`${card} w-[210px] ${className}`}
    >
      <span
        className="block aspect-[4/5] w-full bg-forest/10 bg-cover bg-center"
        style={film?.posterUrl ? { backgroundImage: `url("${film.posterUrl}")` } : undefined}
        role="img"
        aria-label={film ? `Poster of ${film.title}` : 'Film poster'}
      />
      <span className={`${label} mt-3 block`}>{film ? `Watched ${daysAgo(film.watchedDate)}`.trim() : 'Watched'}</span>
      <span className="mt-1 block truncate font-grotezk text-[17px] font-medium leading-tight">
        {film?.title ?? (failed ? 'Letterboxd' : 'Loading…')}
      </span>
      {film && (
        <span className="mt-0.5 block text-[13px] text-forest/60">
          {film.year}
          {film.rating ? <span className="text-sky"> · {stars(film.rating)}</span> : null}
        </span>
      )}
    </a>
  );
};

/** The track playing now (or last played) on Spotify. `square`: the phone version. */
export const MusicCard = ({ className = '', square = false }) => {
  const { track, failed } = useTrack();
  const when = track && !track.isPlaying ? ago(track.lastPlayed ?? track.playedAt ?? track.seenAt) : '';
  if (square)
    return (
      <Square
        href={track?.spotifyUrl ?? 'https://open.spotify.com/'}
        image={track?.albumArt}
        imageLabel={track ? `Cover of ${track.title}` : 'Album cover'}
        label={track?.isPlaying ? 'Now playing' : `Played${when ? ` ${when}` : ''}`}
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
  return (
    <a
      href={track?.spotifyUrl ?? 'https://open.spotify.com/'}
      target="_blank"
      rel="noopener noreferrer"
      className={`${card} flex w-[290px] items-center gap-3.5 ${className}`}
    >
      <span
        className="block size-16 shrink-0 bg-forest/10 bg-cover bg-center"
        style={track?.albumArt ? { backgroundImage: `url("${track.albumArt}")` } : undefined}
        role="img"
        aria-label={track ? `Cover of ${track.title}` : 'Album cover'}
      />
      <span className="min-w-0">
        <span className={`${label} flex items-center gap-1.5`}>
          {track?.isPlaying && (
            <span aria-hidden="true" className="eq-bars flex h-2.5 items-end gap-[2px]">
              <span className="h-full w-[2px] bg-sky" />
              <span className="h-full w-[2px] bg-sky" />
              <span className="h-full w-[2px] bg-sky" />
            </span>
          )}
          {track?.isPlaying ? 'Now playing' : `Played${when ? ` ${when}` : ''}`}
        </span>
        <span className="mt-1 block truncate font-grotezk text-[17px] font-medium leading-tight">
          {track?.title ?? (failed ? 'Spotify' : 'Loading…')}
        </span>
        {(track?.artist || (failed && !track)) && (
          <span className="mt-0.5 block truncate text-[13px] text-forest/60">
            {track?.artist ?? 'Can’t reach Spotify right now'}
          </span>
        )}
      </span>
    </a>
  );
};

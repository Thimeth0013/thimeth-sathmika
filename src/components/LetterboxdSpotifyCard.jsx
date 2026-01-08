import React, { useState, useEffect } from 'react';
import { Play, Star, StarHalf, Music2, ExternalLink, Dot, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const LetterboxdSpotifyCard = () => {
  // Flip default to true so Movie shows first
  const [showLetterboxd, setShowLetterboxd] = useState(true);
  const [dragStartX, setDragStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMovie, setLastMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [letterboxdError, setLetterboxdError] = useState(false);
  const [spotifyData, setSpotifyData] = useState(null);
  const [spotifyLoading, setSpotifyLoading] = useState(true);

  useEffect(() => {
    const fetchLastMovie = async (retryCount = 0) => {
      const maxRetries = 3;
      setLoading(true);
      setLetterboxdError(false);
      
      try {
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const rssUrl = encodeURIComponent('https://letterboxd.com/thimeth/rss/');
        const response = await fetch(proxyUrl + rssUrl);
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');
        const firstItem = xml.querySelector('item');
        
        if (firstItem) {
          const title = firstItem.querySelector('letterboxd\\:filmTitle, filmTitle')?.textContent || 'Unknown';
          const year = firstItem.querySelector('letterboxd\\:filmYear, filmYear')?.textContent || '';
          const rating = firstItem.querySelector('letterboxd\\:memberRating, memberRating')?.textContent || null;
          const watchedDate = firstItem.querySelector('letterboxd\\:watchedDate, watchedDate')?.textContent || '';
          const rewatch = firstItem.querySelector('letterboxd\\:rewatch, rewatch')?.textContent || 'No';
          const description = firstItem.querySelector('description')?.textContent || '';
          const posterMatch = description.match(/src="([^"]+)"/);
          
          setLastMovie({
            title, year, rating: rating ? parseFloat(rating) : null,
            watchedDate, rewatch, posterUrl: posterMatch ? posterMatch[1] : null
          });
          setLoading(false);
        } else {
          throw new Error('No items found');
        }
      } catch (error) {
        if (retryCount < maxRetries) {
          setTimeout(() => fetchLastMovie(retryCount + 1), (retryCount + 1) * 1000);
        } else {
          setLetterboxdError(true);
          setLoading(false);
        }
      }
    };
    fetchLastMovie();
  }, []);

  useEffect(() => {
    const fetchSpotify = async () => {
      try {
        const res = await fetch('https://spotify-api-lyart-iota.vercel.app/api/spotify');
        const data = await res.json();
        setSpotifyData(data);
      } catch (error) {
        console.error('Error fetching Spotify:', error);
      } finally {
        setSpotifyLoading(false);
      }
    };
    fetchSpotify();
    const interval = setInterval(fetchSpotify, 30000);
    return () => clearInterval(interval);
  }, []);

  // Drag Logic
  const handleMouseDown = (e) => { setIsDragging(true); setDragStartX(e.clientX); setCurrentX(e.clientX); };
  const handleTouchStart = (e) => { setIsDragging(true); setDragStartX(e.touches[0].clientX); setCurrentX(e.touches[0].clientX); };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setCurrentX(e.clientX);
    const diff = e.clientX - dragStartX;
    if (Math.abs(diff) > 80) {
      // If showing Movie (true) and drag left (negative), switch to Music (false)
      // If showing Music (false) and drag right (positive), switch to Movie (true)
      setShowLetterboxd(diff > 0);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
    const diff = e.touches[0].clientX - dragStartX;
    if (Math.abs(diff) > 80) {
      setShowLetterboxd(diff > 0);
    }
  };

  const handleDragEnd = () => { setIsDragging(false); setDragStartX(0); setCurrentX(0); };

  const getDaysAgo = (dateString) => {
    if (!dateString) return 'Last Watched';
    const diffDays = Math.floor(Math.abs(new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 'Watched today' : diffDays === 1 ? 'Watched yesterday' : `Watched ${diffDays} days ago`;
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < Math.floor(rating); i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400/20 text-yellow-400" />);
    }
    if (rating % 1 !== 0) stars.push(<StarHalf key="half" className="w-4 h-4 fill-yellow-400/20 text-yellow-400" />);
    return stars;
  };

  const dragOffset = isDragging ? currentX - dragStartX : 0;
  const clampedOffset = Math.max(-100, Math.min(100, dragOffset));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="my-3">
      <div className="relative bg-gradient-to-br from-black/80 to-blue-800/20 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden max-w-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
        
        <div 
          className="relative cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleDragEnd} onMouseLeave={handleDragEnd}
          onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleDragEnd}
        >
          <div className="relative transition-transform duration-300 ease-out p-2.5" style={{ transform: `translateX(${clampedOffset}px)` }}>
            
            {/* Movie Section (Initial View) */}
            <div className={`transition-opacity duration-300 ${showLetterboxd ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                 style={{ position: showLetterboxd ? 'relative' : 'absolute', inset: showLetterboxd ? 'auto' : '0' }}>
              {loading ? (
                <div className="flex items-center justify-center py-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-800"></div></div>
              ) : lastMovie ? (
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-md overflow-hidden shadow-md ring-1 ring-white/10">
                    <img src={lastMovie.posterUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex items-center justify-between min-w-0 gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white truncate">{lastMovie.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-gray-400">{lastMovie.year}</span>
                        {lastMovie.rating && <div className="flex items-center gap-0.5">{renderStars(lastMovie.rating)}</div>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1">
                        <Play className="w-3 h-3 text-blue-600" />
                        <span className="text-[10px] text-blue-600 font-medium">{getDaysAgo(lastMovie.watchedDate)}</span>
                      </div>
                      <a href="https://letterboxd.com/thimeth/" target="_blank" rel="noreferrer" className="text-[10px] text-gray-400 hover:text-orange-400 flex items-center gap-1">
                        View on Letterboxd <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Music Section (Revealed on Swipe) */}
            <div className={`transition-opacity duration-300 ${!showLetterboxd ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                 style={{ position: !showLetterboxd ? 'relative' : 'absolute', inset: !showLetterboxd ? 'auto' : '0' }}>
              {spotifyData && (
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-md overflow-hidden shadow-md ring-1 ring-white/10">
                    <img src={spotifyData.albumArt} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex items-center justify-between min-w-0 gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white truncate">{spotifyData.title}</h3>
                      <p className="text-[11px] text-gray-400 truncate">{spotifyData.artist}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1">
                        <Music2 className="w-3 h-3 text-blue-600" />
                        <span className="text-[10px] text-blue-600 font-medium">{spotifyData.isPlaying ? "Now Playing" : "Recently Played"}</span>
                      </div>
                      <a href={spotifyData.spotifyUrl} target="_blank" rel="noreferrer" className="text-[10px] text-gray-400 hover:text-emerald-400 flex items-center gap-1">
                        Listen on Spotify <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-1 left-0 right-0 flex justify-center md:justify-end md:pr-3 items-center gap-1">
          <Dot className={`transition-all duration-300 ${showLetterboxd ? 'w-3 h-3 text-blue-600' : 'w-2 h-2 text-gray-500'}`} />
          <Dot className={`transition-all duration-300 ${!showLetterboxd ? 'w-3 h-3 text-blue-600' : 'w-2 h-2 text-gray-500'}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default LetterboxdSpotifyCard;
import React, { useState, useEffect } from 'react';
import { Play, Star, StarHalf, Calendar, Music2, ExternalLink, Dot, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const LetterboxdSpotifyCard = () => {
  const [showLetterboxd, setShowLetterboxd] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMovie, setLastMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [letterboxdError, setLetterboxdError] = useState(false);
  const [spotifyData, setSpotifyData] = useState(null);
  const [spotifyLoading, setSpotifyLoading] = useState(true);

  useEffect(() => {
    const fetchLastMovie = async () => {
      setLoading(true);
      setLetterboxdError(false);
      try {
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const rssUrl = encodeURIComponent('https://letterboxd.com/thimeth/rss/');
        
        const response = await fetch(proxyUrl + rssUrl);
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
          const posterUrl = posterMatch ? posterMatch[1] : null;
          
          setLastMovie({
            title,
            year,
            rating: rating ? parseFloat(rating) : null,
            watchedDate,
            rewatch,
            posterUrl
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Letterboxd data:', error);
        setLetterboxdError(true);
        setLoading(false);
      }
    };

    // Fetch immediately on mount
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

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setCurrentX(e.clientX);
    
    const diff = e.clientX - dragStartX;
    if (Math.abs(diff) > 80) {
      setShowLetterboxd(diff < 0);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
    
    const diff = e.touches[0].clientX - dragStartX;
    if (Math.abs(diff) > 80) {
      setShowLetterboxd(diff < 0);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragStartX(0);
    setCurrentX(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getDaysAgo = (dateString) => {
    if (!dateString) return 'Last Watched';
    const watchedDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - watchedDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Watched today';
    if (diffDays === 1) return 'Watched yesterday';
    return `Watched ${diffDays} days ago`;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400/20 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-4 h-4 fill-yellow-400/20 text-yellow-400" />);
    }
    return stars;
  };

  const dragOffset = isDragging ? currentX - dragStartX : 0;
  const clampedOffset = Math.max(-100, Math.min(100, dragOffset));

  if (spotifyLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-3"
      >
        <div className="bg-gray-900/50 rounded-xl p-2.5 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gray-800 rounded-md"></div>
            <div className="flex-1">
              <div className="h-3.5 bg-gray-800 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-800 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-3"
    >
      <div className="relative bg-gradient-to-br from-black/80 to-blue-800/20 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden max-w-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
        
        {/* Draggable Content Container */}
        <div 
          className="relative cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
        >
          <div 
            className="relative transition-transform duration-300 ease-out p-2.5"
            style={{
              transform: `translateX(${clampedOffset}px)`,
            }}
          >
            {/* Spotify Content */}
            <div
              className={`transition-opacity duration-300 ${
                showLetterboxd ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
              style={{
                position: showLetterboxd ? 'absolute' : 'relative',
                inset: showLetterboxd ? '0' : 'auto',
              }}
            >
              {spotifyData && spotifyData.title ? (
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="relative flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-14 h-14 rounded-md overflow-hidden shadow-md ring-1 ring-white/10">
                      <img
                        src={spotifyData.albumArt}
                        alt={spotifyData.album}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {spotifyData.isPlaying && (
                      <div className="absolute -bottom-0.5 -right-0.5 bg-blue-600 rounded-full p-0.75 shadow-md">
                        <div className="flex gap-0.5 items-end h-2 w-2">
                          <motion.div
                            className="w-0.5 bg-white rounded-full"
                            animate={{ height: ["40%", "100%", "60%", "100%"] }}
                            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                          />
                          <motion.div
                            className="w-0.5 bg-white rounded-full"
                            animate={{ height: ["100%", "40%", "100%", "60%"] }}
                            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                          />
                          <motion.div
                            className="w-0.5 bg-white rounded-full"
                            animate={{ height: ["60%", "100%", "40%", "100%"] }}
                            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>

                  <div className="flex-1 flex items-center justify-between min-w-0 gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white truncate">
                        {spotifyData.title}
                      </h3>
                      <p className="text-[11px] font-medium text-gray-400 truncate">
                        {spotifyData.artist}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Music2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        <span className="text-[10px] text-blue-600 font-medium">
                          {spotifyData.isPlaying ? "Now Playing" : `Last played ${spotifyData.lastPlayed}`}
                        </span>
                      </div>
                      
                      <motion.a
                        href={spotifyData.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-gray-200 hover:text-emerald-400 transition-colors duration-200 group/link"
                        whileHover={{ x: 1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="font-medium">Listen on Spotify</span>
                        <ExternalLink className="w-2.5 h-2.5 group-hover/link:translate-x-0.5 transition-transform" />
                      </motion.a>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Letterboxd Content */}
            <div
              className={`transition-opacity duration-300 ${
                showLetterboxd ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              style={{
                position: showLetterboxd ? 'relative' : 'absolute',
                inset: showLetterboxd ? 'auto' : '0',
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-800"></div>
                </div>
              ) : letterboxdError ? (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-sm">Failed to load movie data</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="text-xs text-blue-600 mt-2 hover:underline"
                  >
                    Retry
                  </button>
                </div>
              ) : lastMovie ? (
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="relative flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                  >
                    {lastMovie.posterUrl ? (
                      <div className="w-14 h-14 rounded-md overflow-hidden shadow-md ring-1 ring-white/10">
                        <img 
                          src={lastMovie.posterUrl} 
                          alt={lastMovie.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 bg-gray-800/50 rounded-md flex items-center justify-center ring-1 ring-white/10">
                        <Play className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                  </motion.div>
                  
                  <div className="flex-1 flex items-center justify-between min-w-0 gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white truncate">
                        {lastMovie.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <p className="text-[11px] font-medium text-gray-400">
                          {lastMovie.year}
                        </p>
                        {lastMovie.rating && (
                          <>
                            <span className="text-gray-600">•</span>
                            <div className="flex items-center gap-0.5">
                              {renderStars(lastMovie.rating)}
                            </div>
                          </>
                        )}
                        {lastMovie.rewatch === 'Yes' && (
                          <>
                            <span className="text-gray-600">•</span>
                            <div className="flex items-center gap-1">
                              <RefreshCw className="w-3 h-3 text-purple-400" />
                              <span className="text-[10px] text-purple-400 font-medium">Rewatched</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Play className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        <span className="text-[10px] text-blue-600 font-medium">
                          {getDaysAgo(lastMovie.watchedDate)}
                        </span>
                      </div>
                      
                      <motion.a
                        href="https://letterboxd.com/thimeth/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-gray-200 hover:text-orange-400 transition-colors duration-200 group/link"
                        whileHover={{ x: 1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="font-medium">View on Letterboxd</span>
                        <ExternalLink className="w-2.5 h-2.5 group-hover/link:translate-x-0.5 transition-transform" />
                      </motion.a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-sm">No movies watched yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Drag Indicator */}
        <div className="absolute bottom-0 left-130 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-800/30 to-transparent"></div>
        <div className="absolute bottom-1 left-130 right-0 flex justify-center items-center gap-1">
          <Dot 
            className={`transition-all duration-300 ${
              showLetterboxd ? 'w-2 h-2 text-gray-500' : 'w-3 h-3 text-blue-600'
            }`}
          />
          <Dot 
            className={`transition-all duration-300 ${
              showLetterboxd ? 'w-3 h-3 text-blue-600' : 'w-2 h-2 text-gray-500'
            }`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default LetterboxdSpotifyCard;
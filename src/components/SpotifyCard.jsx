import { motion } from 'framer-motion';
import { Music2, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SpotifyCard() {
  const [songData, setSongData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpotify = async () => {
      try {
        const res = await fetch('https://spotify-api-lyart-iota.vercel.app/api/spotify');
        const data = await res.json();
        setSongData(data);
      } catch (error) {
        console.error('Error fetching Spotify:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpotify();
    const interval = setInterval(fetchSpotify, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 mb-6 max-w-md"
      >
        <div className="bg-gray-900/50 rounded-2xl p-5 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-800 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-800 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!songData || !songData.title) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-3"
    >
      <motion.div
        className="relative bg-gradient-to-br from-black/80 to-blue-800/20 backdrop-blur-sm border border-white/10 rounded-xl p-2.5 overflow-hidden group hover:border-blue-800/30 transition-all duration-500 max-w-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative flex items-center gap-3">
          <motion.div 
            className="relative flex-shrink-0"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-14 h-14 rounded-md overflow-hidden shadow-md ring-1 ring-white/10 hover:ring-blue-600/20">
              <img
                src={songData.albumArt}
                alt={songData.album}
                className="w-full h-full object-cover"
              />
            </div>
            
            {songData.isPlaying && (
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
                {songData.title}
              </h3>
              <p className="text-[11px] font-medium text-gray-400 truncate">
                {songData.artist}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2 mb-1">
                <Music2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span className="text-[10px] text-blue-600 font-medium">
                  {songData.isPlaying ? "Now Playing" : `Last played ${songData.lastPlayed}`}
                </span>
              </div>
              
              <motion.a
                href={songData.spotifyUrl}
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
      </motion.div>
    </motion.div>
  );
}
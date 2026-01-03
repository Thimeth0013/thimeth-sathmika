import React, { useState, useMemo } from "react";
import { AwardIcon, Search, ExternalLink, ChevronDown } from "lucide-react";
import CertificateData from '../data/certificate';
import BadgesData from '../data/badges';

const CredentialCard = ({ item, type }) => {
  const isCert = type === 'certificate';
  const title = item.title;
  const image = isCert ? item.thumbnail : item.image;
  const rawDate = isCert ? item.date : item.dateEarned;
  const issuer = isCert ? item.company : item.issuer;
  const issuerUrl = isCert ? item.companyUrl : item.issuerUrl;
  const mainUrl = isCert ? item.certificateUrl : item.badgeUrl;

  return (
    <div className="relative flex flex-col h-full bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-start gap-4 mb-5">
          <div className="relative p-2 bg-white rounded-xl shadow-lg flex-shrink-0 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
            <img src={image} alt={title} className="max-w-full max-h-full object-contain" />
          </div>

          <div className="flex-grow min-w-0">
            <h3 className="text-sm md:text-base font-bold text-white leading-snug line-clamp-2">
              {title}
            </h3>
            <p className="text-[11px] font-medium text-blue-500/80 mt-1">
              {rawDate}
            </p>
          </div>
        </div>

        <p className="text-xs md:text-sm text-gray-400 leading-relaxed line-clamp-4 mb-2">
          {item.description}
        </p>

        <div className="mt-auto flex flex-col gap-4">
          <div className="flex items-center justify-between border-t border-white/5 pt-2 group">
              {issuer && (
                <a 
                  href={issuerUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[11px] font-semibold text-gray-500 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <span className="w-1 h-1 bg-blue-600 rounded-full" />
                  {issuer}
                  <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 inline-block" />
                </a>
              )}
            </div>
          
          <a href={mainUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs md:text-sm font-bold transition-colors">
            Verify Credential
          </a>
        </div>
      </div>
    </div>
  );
};

const CertificatesSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);

  const sortedAndFilteredData = useMemo(() => {
    const certs = CertificateData.map(c => ({ ...c, _type: 'certificate' }));
    const badges = BadgesData.map(b => ({ ...b, _type: 'badge' }));
    const combined = [...certs, ...badges];

    // Sorting logic: Parses "Month Year" strings into dates to compare them
    combined.sort((a, b) => {
      const dateA = new Date(a.date || a.dateEarned);
      const dateB = new Date(b.date || b.dateEarned);
      return dateB - dateA; // Sorts descending (Latest first)
    });

    if (!searchQuery.trim()) return combined;

    const query = searchQuery.toLowerCase();
    return combined.filter(item => {
      const searchableText = `${item.title} ${item.description} ${item.company || item.issuer || ''}`.toLowerCase();
      return searchableText.includes(query);
    });
  }, [searchQuery]);

  const currentItems = sortedAndFilteredData.slice(0, visibleCount);

  return (
    <div className="mt-20 mb-20 max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-3">
          <AwardIcon className="w-7 h-7 md:w-8 md:h-8 text-blue-800" />
          <h2 className="text-xl md:text-3xl font-bold text-blue-800">
            Certifications & Badges
          </h2>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search credentials..."
            value={searchQuery}
            onChange={(e) => { 
              setSearchQuery(e.target.value); 
              setVisibleCount(6); 
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((item) => (
          <CredentialCard 
            key={`${item._type}-${item.id || item.title}`} 
            item={item} 
            type={item._type} 
          />
        ))}
      </div>

      {visibleCount < sortedAndFilteredData.length && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setVisibleCount(prev => prev + 6)}
            className="flex items-center gap-2 px-8 py-3 bg-blue-500/10 hover:bg-blue-800 border border-blue-500/50 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Show More <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CertificatesSection;
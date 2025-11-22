import React, { useState, useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AwardIcon, Search, ExternalLink } from "lucide-react";
import CertificateData from '../data/certificate';
import BadgesData from '../data/badges';

// Badge Card Component
const BadgeCard = ({ badge }) => {
  return (
    <motion.div
      className="relative bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-lg hover:border-blue-800/50 transition-all duration-300 flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-start gap-3 p-4 pb-0">
        <img
          src={badge.image}
          alt={badge.title}
          className="w-16 h-16 md:w-18 md:h-18 object-contain bg-white rounded-lg p-1 flex-shrink-0"
        />
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="relative group flex-grow min-w-0">
              <h3 className="text-sm md:text-base font-semibold text-white cursor-help line-clamp-2">
                {badge.title}
              </h3>
              <div className="hidden md:block absolute top-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 max-w-xs whitespace-normal w-60 mt-1">
                {badge.title}
                <div className="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
              </div>
            </div>
            <span className="bg-blue-800/80 text-white text-xs px-2 py-1 rounded-full flex-shrink-0">
              {badge.dateEarned}
            </span>
          </div>

          {badge.issuer && (
            <div className="mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-800 rounded-full"></span>
              {badge.issuerUrl ? (
                <motion.a
                  href={badge.issuerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs md:text-sm text-blue-800 font-medium transition-colors duration-200 flex items-center gap-1 group focus:outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-1 py-0.5"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {badge.issuer}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </motion.a>
              ) : (
                <span className="text-xs md:text-sm text-blue-800 font-medium">{badge.issuer}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <p className="px-4 pb-3 text-xs md:text-sm text-gray-400 leading-relaxed flex-grow">
        {badge.description}
      </p>

      {badge.badgeUrl && (
        <div className="px-4 pb-4 mt-auto">
          <motion.a
            href={badge.badgeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full px-4 py-2 text-center bg-blue-800 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-300"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.95 }}
          >
            View Badge
          </motion.a>
        </div>
      )}
    </motion.div>
  );
};

// Certificate Card Component
const CertificateCard = ({ cert }) => {
  const handleCompanyClick = (e) => {
    e.stopPropagation();
    if (cert.companyUrl) {
      window.open(cert.companyUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      className="relative bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-lg hover:border-blue-800/50 transition-all duration-300 flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-start gap-3 p-4">
        <img
          src={cert.thumbnail}
          alt={cert.title}
          loading="lazy"
          className="w-22 h-16 md:w-24 md:h-18 object-cover bg-white rounded-lg flex-shrink-0"
        />
        
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="relative group flex-grow min-w-0">
              <h3 className="text-sm md:text-base font-semibold text-white cursor-help line-clamp-2">
                {cert.title}
              </h3>
              
              <div className="hidden md:block absolute top-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 max-w-xs whitespace-normal w-60 mt-1">
                {cert.title}
                <div className="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
              </div>
            </div>
            
            <span className="bg-blue-800/80 text-white text-xs px-2 py-1 rounded-full flex-shrink-0">
              {cert.date}
            </span>
          </div>

          {cert.company && (
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-800 rounded-full"></span>
              {cert.companyUrl ? (
                <motion.button
                  onClick={handleCompanyClick}
                  className="text-xs md:text-sm text-blue-800 font-medium transition-colors duration-200 flex items-center gap-1 group focus:outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-1 py-0.5"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {cert.company}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </motion.button>
              ) : (
                <span className="text-xs md:text-sm text-blue-800 font-medium">{cert.company}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <p className="px-4 pb-3 text-xs md:text-sm text-gray-400 leading-relaxed flex-grow">
        {cert.description}
      </p>

      {cert.certificateUrl && (
        <div className="px-4 pb-4 mt-auto">
          <motion.a
            href={cert.certificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full px-4 py-2 text-center bg-blue-800 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-300"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.95 }}
          >
            View Certificate
          </motion.a>
        </div>
      )}
    </motion.div>
  );
};

const CertificatesSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('certificates');
  const itemsPerPage = 6;
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });

  const filteredData = useMemo(() => {
    const data = activeTab === 'certificates' ? CertificateData : BadgesData;
    
    if (!searchQuery.trim()) {
      return data.sort((a, b) => b.id - a.id);
    }

    const query = searchQuery.toLowerCase();
    return data
      .filter(item => {
        const searchableText = `${item.title} ${item.description} ${item.company || item.issuer || ''}`.toLowerCase();
        return searchableText.includes(query);
      })
      .sort((a, b) => b.id - a.id);
  }, [activeTab, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchQuery('');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      ref={ref}
      className="mt-20 mb-20 mx-6 md:ml-10 md:mr-10"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
    >
      <motion.h2
        className="text-xl md:text-3xl font-bold mb-6 flex items-center gap-3 text-center sm:text-left justify-start"
        variants={staggerItem}
      >
        <AwardIcon className="w-7 h-7 md:w-8 md:h-8 text-blue-800" />
        <span className="text-blue-800">Certifications and Badges</span>
      </motion.h2>

      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-10 pt-4"
        variants={staggerItem}
      >
        <div className="flex gap-3 md:gap-4 pl-0 md:pl-2">
          <button
            onClick={() => handleTabChange('certificates')}
            className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 ${
              activeTab === 'certificates'
                ? 'bg-blue-800 text-white'
                : 'bg-gray-900/50 text-gray-400 hover:bg-gray-800/50'
            }`}
          >
            Certificates
          </button>
          <button
            onClick={() => handleTabChange('badges')}
            className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 ${
              activeTab === 'badges'
                ? 'bg-blue-800 text-white'
                : 'bg-gray-900/50 text-gray-400 hover:bg-gray-800/50'
            }`}
          >
            Badges
          </button>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-white/10 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-800/50 transition-all duration-300"
          />
        </div>
      </motion.div>

      {filteredData.length === 0 ? (
        <motion.div 
          className="text-center py-12"
          variants={staggerItem}
        >
          <p className="text-gray-400 text-lg">No results found for "{searchQuery}"</p>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {currentItems.map((item) =>
              activeTab === 'certificates' ? (
                <CertificateCard key={item.id} cert={item} />
              ) : (
                <BadgeCard key={item.id} badge={item} />
              )
            )}
          </div>

          {currentPage < totalPages && (
            <motion.div 
              className="flex justify-center mt-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                onClick={handleLoadMore}
                className="group relative px-6 py-3 bg-blue-800/40 hover:bg-blue-800 rounded-lg transition-all duration-300 flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-sm text-gray-200 group-hover:text-white font-medium">
                  Load More {activeTab === 'certificates' ? 'Certificates' : 'Badges'}
                </span>
                <span className="text-xs bg-blue-700/50 group-hover:bg-blue-700 px-2.5 py-1 rounded-full text-gray-200 group-hover:text-white transition-all duration-300">
                  {currentPage} / {totalPages}
                </span>
              </motion.button>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default CertificatesSection;
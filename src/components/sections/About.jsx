import React, { useRef, useState, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import CircularText from "../CircularText/CircularText";
import Stack from "../Stack/Stack";
import LetterboxdSpotifyCard from '../LetterboxdSpotifyCard';
import {IconCloud} from "../IconCloud";
import { 
  Sparkle, 
  BookOpenIcon,
  GraduationCapIcon,
  AwardIcon,
  Send,
  ExternalLink,
  Music4,
  Search
} from "lucide-react";
import profileImageHover from '../../assets/profile2.png';
import CertificateData from '../../data/certificate';
import BadgesData from '../../data/badges';

// Skill icons imports
import html from '../../assets/skills/html.svg';
import css from '../../assets/skills/css.svg';
import php from '../../assets/skills/php.svg';
import git from '../../assets/skills/git.svg';
import javascript from '../../assets/skills/javascript.svg';
import react from '../../assets/skills/react.svg';
import nodejs from '../../assets/skills/nodejs.svg';
import expressjs from '../../assets/skills/expressjs.svg';
import mongodb from '../../assets/skills/mongodb.svg';
import tailwindcss from '../../assets/skills/tailwindcss.svg';
import bootstrap from '../../assets/skills/bootstrap.svg';
import figma from '../../assets/skills/figma.svg';
import photoshop from '../../assets/skills/photoshop.svg';
import kotlin from '../../assets/skills/kotlin.svg';
import vite from '../../assets/skills/vite.svg';
import postman from '../../assets/skills/postman.svg';
import mysql from '../../assets/skills/mysql.svg';
import java from '../../assets/skills/java.svg';

// Badge Card Component
const BadgeCard = ({ badge, itemVariants }) => {
  return (
    <motion.div
      key={badge.id}
      className="relative bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-lg hover:border-blue-800/50 transition-all duration-300 flex flex-col h-full"
      variants={itemVariants}
    >
      <div className="flex items-start gap-3 p-4 pb-0">
        <motion.img
          src={badge.image}
          alt={badge.title}
          className="w-16 h-16 md:w-18 md:h-18 object-contain bg-white rounded-lg p-1 flex-shrink-0"
          variants={itemVariants}
        />
        
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <motion.div className="relative group flex-grow min-w-0" variants={itemVariants}>
              <motion.h3 className="text-sm md:text-base font-semibold text-white cursor-help line-clamp-2" variants={itemVariants}>
                {badge.title}
              </motion.h3>
              
              <div className="hidden md:block absolute top-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 max-w-xs whitespace-normal w-60 mt-1">
                {badge.title}
                <div className="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
              </div>
            </motion.div>
            
            <motion.span className="bg-blue-800/80 text-white text-xs px-2 py-1 rounded-full flex-shrink-0" variants={itemVariants}>
              {badge.dateEarned}
            </motion.span>
          </div>

          {badge.issuer && (
            <motion.div className="mb-2 flex items-center gap-2" variants={itemVariants}>
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
            </motion.div>
          )}
        </div>
      </div>

      <motion.p className="px-4 pb-3 text-xs md:text-sm text-gray-400 leading-relaxed flex-grow" variants={itemVariants}>
        {badge.description}
      </motion.p>

      {badge.badgeUrl && (
        <div className="px-4 pb-4 mt-auto">
          <motion.a
            href={badge.badgeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full px-4 py-2 text-center bg-blue-800 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-300"
            variants={itemVariants}
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
const CertificateCard = ({ cert, onOpenModal, itemVariants }) => {
  const handleCompanyClick = (e) => {
    e.stopPropagation();
    if (cert.companyUrl) {
      window.open(cert.companyUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      key={cert.id}
      className="relative bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-lg hover:border-blue-800/50 transition-all duration-300 flex flex-col h-full"
      variants={itemVariants}
    >
      <div className="flex items-start gap-3 p-4">
        <motion.img
          src={cert.thumbnail}
          alt={cert.title}
          loading="lazy"
          className="w-22 h-16 md:w-24 md:h-18 object-cover bg-white rounded-lg flex-shrink-0"
          variants={itemVariants}
        />
        
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <motion.div className="relative group flex-grow min-w-0" variants={itemVariants}>
              <motion.h3 className="text-sm md:text-base font-semibold text-white cursor-help line-clamp-2" variants={itemVariants}>
                {cert.title}
              </motion.h3>
              
              <div className="hidden md:block absolute top-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 max-w-xs whitespace-normal w-60 mt-1">
                {cert.title}
                <div className="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
              </div>
            </motion.div>
            
            <motion.span className="bg-blue-800/80 text-white text-xs px-2 py-1 rounded-full flex-shrink-0" variants={itemVariants}>
              {cert.date}
            </motion.span>
          </div>

          {cert.company && (
            <motion.div className="flex items-center gap-2" variants={itemVariants}>
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
            </motion.div>
          )}
        </div>
      </div>

      <motion.p className="px-4 pb-3 text-xs md:text-sm text-gray-400 leading-relaxed flex-grow" variants={itemVariants}>
        {cert.description}
      </motion.p>

      {cert.certificateUrl && (
        <div className="px-4 pb-4 mt-auto">
          <motion.a
            href={cert.certificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full px-4 py-2 text-center bg-blue-800 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-300"
            variants={itemVariants}
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

export const About = () => {
  const titleVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", type: "spring", stiffness: 100 },
    },
  };

  const images = [
    { id: 1, img: profileImageHover },
  ];

  const imageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, type: "spring", stiffness: 120, damping: 20 },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, type: "spring", stiffness: 100, damping: 15, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, type: "spring", stiffness: 100, damping: 15 },
    },
  };

  const ref = useRef(null);
  const skillsRef = useRef(null);
  const educationRef = useRef(null);
  const certificatesRef = useRef(null);

  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const skillsInView = useInView(skillsRef, { once: true, amount: 0.3 });
  const educationInView = useInView(educationRef, { once: true, amount: 0.3 });
  const certificatesInView = useInView(certificatesRef, { once: true, amount: 0.3 });

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const skillImages = [
    html, css, php, git, javascript, react, nodejs, expressjs,
    mongodb, tailwindcss, bootstrap, figma, photoshop, kotlin,
    vite, postman, mysql, java,
  ];

  const skillCategories = [
    {
      category: 'Frontend',
      items: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Tailwind CSS', 'Bootstrap'],
    },
    {
      category: 'Backend',
      items: ['Node.js', 'Express', 'PHP', 'Java', 'Kotlin'],
    },
    {
      category: 'Database',
      items: ['MongoDB', 'MySQL'],
    },
    {
      category: 'Tools & Workflow',
      items: ['Git', 'Vite', 'Postman', 'Expo'],
    },
    {
      category: 'Design',
      items: ['Figma', 'Photoshop'],
    },
  ];

  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [activeTab, setActiveTab] = useState('certificates');

  const openModal = (certificate) => setSelectedCertificate(certificate);
  const closeModal = () => setSelectedCertificate(null);

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

  return (
    <section id="about" className="min-h-screen bg-black text-white py-10 md:py-15 pl-0 md:pl-10">
      <div className="container mx-auto px-4 sm:px-6 z-10">
        <div className="flex flex-col sm:flex-row justify-between gap-4 pb-10">
          <motion.div
            className="w-full sm:w-3/5 text-left ml-4 sm:ml-6 flex flex-col justify-start"
            variants={titleVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <div className="flex gap-3 mt-10 sm:mt-15">
              <Sparkle className="text-blue-800" />
              <h1 className="text-xl sm:text-2xl font-medium text-left text-blue-800">About Me</h1>
            </div>

            <div className="pr-4 sm:pr-0">
              <h1 className="text-base sm:text-2xl font-bold mb-12 mt-6 leading-snug">
                Software Engineering undergrad from Colombo, Sri Lanka, specializing in full-stack development with a strong focus on frontend engineering. 
                <br />Over 3 years of experience working with modern web technologies, creating{" "}
                <span className="relative text-blue-800 font-bold hover-trigger cursor-help">
                  *interactive
                  <motion.div
                    className="hidden hover-display absolute text-sm bottom-[-60px] left-0 sm:bottom-[-180px] sm:left-[660px] w-56 sm:w-64 p-3 sm:p-4 bg-black/70 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 z-50"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>
                      <span className="font-semibold text-white/80">Interactive:</span> allowing users to actively engage and respond, not just consume.
                    </p>
                  </motion.div>
                </span>{" "}
                and<br/>
                <span className="relative text-blue-800 font-bold hover-trigger cursor-help">
                  *detail-oriented
                  <motion.div
                    className="hidden hover-display absolute text-sm bottom-[-80px] left-0 sm:bottom-[-40px] sm:left-[620px] w-56 sm:w-64 p-3 sm:p-4 bg-black/70 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 z-50"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>
                      <span className="font-semibold text-white/80">Detail-oriented:</span> marked by careful attention to accuracy and precision.
                    </p>
                  </motion.div>
                </span>{" "}
                UIs, while bridging design and code to deliver seamless user experiences.
              </h1>
              <h3 className="text-gray-200 sm:text-lg font-medium">Beyond code, I find inspiration in music and cinema.</h3>
              <LetterboxdSpotifyCard/>
            </div>
          </motion.div>

          <motion.div
            ref={ref}
            className="w-full sm:w-1/2 flex justify-center sm:justify-end mx-auto sm:mr-20 mt-5 relative px-4 sm:px-0"
            variants={imageVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            style={{ minHeight: "500px" }}
          >
            <Stack
              randomRotation={true}
              sensitivity={180}
              sendToBackOnClick={false}
              cardDimensions={{ width: 360, height: 500 }}
              cardsData={images}
            />
            <motion.div
              className="hidden sm:block absolute left-1/2 -translate-x-1/2 sm:left-[40px] sm:translate-x-0 top-[440px] transform -translate-y-1/2 z-20 w-32 h-32 sm:w-40 sm:h-40"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="relative w-full h-full">
                <CircularText
                  text="LETS TALK * LETS TALK * "
                  spinDuration={20}
                  onHover="speedUp"
                  className="text-white font-medium h-full w-full align-middle justify-center text-center bg-black/50 rounded-full"
                />
                <a href="#contact" className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-800/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-blue-800 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-6 h-6 mr-1 mt-1 sm:w-8 sm:h-8 text-white" />
                  </motion.div>
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div 
          ref={skillsRef}
          className="mb-6 md:mb-0 mt-0 md:mt-24 mx-6 md:ml-8 md:mr-10"
          variants={sectionVariants}
          initial="hidden"
          animate={skillsInView ? "visible" : "hidden"}
        >
          <motion.h2 
            className="text-xl md:text-3xl font-bold mb-8 md:mb-12 flex items-center gap-3 text-center sm:text-left justify-start sm:justify-start"
            variants={itemVariants}
          >
            <BookOpenIcon className="w-7 h-7 md:w-8 md:h-8 text-blue-800" />
            <span className="text-blue-800">Technical Skills</span>
          </motion.h2>
          
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-0">
            <div className="space-y-8 flex-1">
              {skillCategories.map((skillSet, index) => (
                <motion.div key={skillSet.category} className="group" variants={itemVariants}>
                  <h3 className="text-lg md:text-xl font-medium text-blue-800 mb-3">
                    {skillSet.category}
                  </h3>
                  
                  <div className="flex flex-wrap gap-4">
                    {skillSet.items.map((skill, skillIndex) => (
                      <motion.span
                        key={skill}
                        className="text-white/80 text-sm md:text-base font-regular tracking-wide cursor-default relative"
                        whileHover={{ scale: 1.05 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + skillIndex * 0.05 }}
                      >
                        {skill}
                        <motion.span
                          className="absolute -bottom-1 left-1/4 right-1/4 h-px bg-blue-800"
                          initial={{ scaleX: 0 }}
                          whileHover={{ scaleX: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.span>
                    ))}
                  </div>
                  
                  <div className="h-px bg-blue-800/40 mt-3" />
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="hidden lg:flex lg:w-[600px] lg:h-[600px] flex-shrink-0 items-center justify-center"
              variants={itemVariants}
            >
              <IconCloud images={skillImages} />
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          ref={educationRef}
          className="mt-12 md:mt-0 mb-12 mx-6"
          variants={sectionVariants}
          initial="hidden"
          animate={educationInView ? "visible" : "hidden"}
        >
          <motion.h2 
            className="text-xl md:text-3xl font-bold mb-6 md:mb-8 flex items-center gap-3 text-center sm:text-left justify-start"
            variants={itemVariants}
          >
            <GraduationCapIcon className="w-6 h-6 md:w-7 md:h-7 text-blue-800" />
            <span className="text-blue-800">Education</span>
          </motion.h2>
          
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-800/0 via-blue-600 to-transparent"></div>
            
            <motion.div className="relative pl-12 pb-8" variants={itemVariants}>
              <div className="absolute left-2.5 top-8 w-3 h-3 bg-blue-800 rounded-full border-2 border-gray-900 shadow-lg"></div>
              
              <div className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-lg p-3 md:p-4 hover:border-blue-800/50 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-0">
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-bold text-blue-800 mb-1">
                      BSc (Hons) in Information Technology Specialising in Software Engineering
                    </h3>
                    <p className="text-gray-400 text-xs md:text-sm">Sri Lanka Institute of Information Technology</p>
                  </div>
                  <div className="bg-blue-800/20 px-3 py-1 rounded-full border border-blue-800/30 self-start">
                    <span className="text-blue-300 text-xs font-medium whitespace-nowrap">2023 - Present</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="relative pl-12" variants={itemVariants}>
              <div className="absolute left-2.5 top-9 w-3 h-3 bg-blue-800 rounded-full border-2 border-gray-900 shadow-lg"></div>
              
              <div className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-lg p-3 md:p-4 hover:border-blue-800/50 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-0">
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-bold text-blue-800 mb-1">
                      GCE O/L & A/L (Engineering Technology)
                    </h3>
                    <p className="text-gray-400 text-xs md:text-sm">Swarna Jayanthi College, Kegalle</p>
                  </div>
                  <div className="bg-blue-600/20 px-3 py-1 rounded-full border border-blue-600/30 self-start">
                    <span className="text-blue-300 text-xs font-medium whitespace-nowrap">2015 - 2022</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          ref={certificatesRef}
          className="mt-20 mb-20 mx-6 md:ml-10 md:mr-10"
          variants={sectionVariants}
          initial="hidden"
          animate={certificatesInView ? "visible" : "hidden"}
        >
        <motion.h2
          className="text-xl md:text-3xl font-bold mb-6 flex items-center gap-3 text-center sm:text-left justify-start"
          variants={itemVariants}
        >
          <AwardIcon className="w-7 h-7 md:w-8 md:h-8 text-blue-800" />
          <span className="text-blue-800">Certifications and Badges</span>
        </motion.h2>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-10 pt-4">
          <motion.div className="flex gap-3 md:gap-4 pl-0 md:pl-2" variants={itemVariants}>
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
          </motion.div>

          <motion.div className="relative w-full md:w-64" variants={itemVariants}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-white/10 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-800/50 transition-all duration-300"
            />
          </motion.div>
        </div>

        {filteredData.length === 0 ? (
          <motion.div className="text-center py-12" variants={itemVariants}>
            <p className="text-gray-400 text-lg">No results found for "{searchQuery}"</p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {currentItems.map((item) =>
                activeTab === 'certificates' ? (
                  <CertificateCard
                    key={item.id}
                    cert={item}
                    onOpenModal={openModal}
                    itemVariants={itemVariants}
                  />
                ) : (
                  <BadgeCard
                    key={item.id}
                    badge={item}
                    itemVariants={itemVariants}
                  />
                )
              )}
            </div>

            {currentPage < totalPages && (
              <motion.div className="flex justify-center mt-10" variants={itemVariants}>
                <motion.button
                  onClick={handleLoadMore}
                  className="group relative px-6 py-3 bg-blue-800/40 hover:bg-blue-800 rounded-lg transition-all duration-300 flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
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
      </div>

      <style>
        {`
          .hover-trigger:hover .hover-display {
            display: block;
          }
        `}
      </style>
    </section>
  );
};
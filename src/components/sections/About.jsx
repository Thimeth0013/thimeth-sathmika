import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import CircularText from "../CircularText/CircularText";
import Stack from "../Stack/Stack";
import SpotifyCard from "../SpotifyCard";
import { 
  Sparkle, 
  BookOpenIcon,
  GraduationCapIcon,
  AwardIcon,
  Send,
  ExternalLink
} from "lucide-react";
import profileImage from '../../assets/profile1.png';
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

// Badge Card Component - Fixed Layout
const BadgeCard = ({ badge, itemVariants }) => {
  return (
    <motion.div
      key={badge.id}
      className="relative bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-lg hover:border-blue-800/50 transition-all duration-300 flex flex-col h-full"
      variants={itemVariants}
    >
      {/* Header with image and date */}
      <div className="flex items-start gap-3 p-4 pb-0">
        <motion.img
          src={badge.image}
          alt={badge.title}
          className="w-16 h-16 md:w-18 md:h-18 object-contain bg-white rounded-lg p-1 flex-shrink-0"
          variants={itemVariants}
        />
        
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <motion.div
              className="relative group flex-grow min-w-0"
              variants={itemVariants}
            >
              <motion.h3
                className="text-sm md:text-base font-semibold text-white cursor-help line-clamp-2"
                variants={itemVariants}
              >
                {badge.title}
              </motion.h3>
              
              {/* Tooltip - Desktop only */}
              <div className="hidden md:block absolute top-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 max-w-xs whitespace-normal w-60 mt-1">
                {badge.title}
                <div className="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
              </div>
            </motion.div>
            
            <motion.span
              className="bg-blue-800/80 text-white text-xs px-2 py-1 rounded-full flex-shrink-0"
              variants={itemVariants}
            >
              {badge.dateEarned}
            </motion.span>
          </div>

          {badge.issuer && (
            <motion.div
              className="mb-2 flex items-center gap-2"
              variants={itemVariants}
            >
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
                <span className="text-xs md:text-sm text-blue-800 font-medium">
                  {badge.issuer}
                </span>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Description - flex-grow to fill available space */}
      <motion.p
        className="px-4 pb-3 text-xs md:text-sm text-gray-400 leading-relaxed flex-grow"
        variants={itemVariants}
      >
        {badge.description}
      </motion.p>

      {/* Action button - always at bottom */}
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

// Certificate Card Component - Fixed Layout
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
      className="relative bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-lg hover:border-blue-800/50 transition-all duration-300 cursor-pointer flex flex-col h-full"
      variants={itemVariants}
      onClick={() => onOpenModal(cert)}
    >
      {/* Date badge positioned over image */}
      <motion.span
        className="absolute top-3 right-3 bg-blue-800/80 text-white text-xs px-3 py-1 rounded-full shadow-md z-10"
        variants={itemVariants}
      >
        {cert.date}
      </motion.span>

      <motion.img
        src={cert.thumbnail}
        alt={cert.title}
        className="w-full h-32 object-cover border-b border-white/10"
        variants={itemVariants}
      />

      {/* Content section - flex-grow to fill available space */}
      <div className="p-4 flex flex-col flex-grow">
        <motion.div
          className="relative group mb-2"
          variants={itemVariants}
        >
          <motion.h3
            className="text-sm md:text-base font-semibold text-white line-clamp-1 cursor-help"
            variants={itemVariants}
          >
            {cert.title}
          </motion.h3>
          
          {/* Tooltip - Desktop only */}
          <div className="hidden md:block absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 max-w-xs whitespace-normal">
            {cert.title}
            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </motion.div>

        {cert.company && (
          <motion.div
            className="mb-3 flex items-center gap-2"
            variants={itemVariants}
          >
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
              <span className="text-xs md:text-sm text-blue-800 font-medium">
                {cert.company}
              </span>
            )}
          </motion.div>
        )}

        {/* Description - flex-grow to fill available space */}
        <motion.p
          className="text-xs md:text-sm text-gray-400 leading-relaxed line-clamp-3 mb-4 flex-grow"
          variants={itemVariants}
        >
          {cert.description}
        </motion.p>

        {/* Action button - always at bottom */}
        {cert.certificateUrl && (
          <motion.a
            href={cert.certificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full px-4 py-2 text-center bg-blue-800 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-300 mt-auto"
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            View Certificate
          </motion.a>
        )}
      </div>
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
    { id: 2, img: profileImage },
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

  const skills = [
    { img: html, label: "HTML" },
    { img: css, label: "CSS" },
    { img: php, label: "Php" },
    { img: git, label: "Git" },
    { img: javascript, label: "JavaScript" },
    { img: react, label: "React" },
    { img: nodejs, label: "Node.js" },
    { img: expressjs, label: "Express" },
    { img: mongodb, label: "MongoDB" },
    { img: tailwindcss, label: "Tailwind" },
    { img: bootstrap, label: "Bootstrap" },
    { img: figma, label: "Figma" },
    { img: photoshop, label: "Photoshop" },
    { img: kotlin, label: "Kotlin" },
    { img: vite, label: "Vite" },
    { img: postman, label: "Postman" },
    { img: mysql, label: "MySQL" },
    { img: java, label: "Java" },
  ];

  const skillCategories = [
    {
      category: 'Frontend',
      items: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS', 'Bootstrap'],
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
      category: 'Tools & DevOps',
      items: ['Git', 'Vite', 'Postman'],
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

  return (
    <section id="about" className="min-h-screen bg-black text-white py-10 md:py-15 pl-0 md:pl-10">
      <div className="container mx-auto px-4 sm:px-6 z-10">
        <div className="flex flex-col sm:flex-row justify-between gap-4 pb-10">
          <motion.div
            className="w-full sm:w-2/3 text-left ml-4 sm:ml-6 flex flex-col justify-start"
            variants={titleVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <div className="flex gap-3 mt-10 sm:mt-15">
              <Sparkle className="text-blue-800" />
              <h1 className="text-xl sm:text-2xl font-medium text-left text-blue-800">About Me</h1>
            </div>

            <div className="pr-4 sm:pr-0">
              <h1 className="text-base sm:text-2xl font-bold mb-6 mt-6">
                I'm a 22 year old Software Engineering undergrad from Colombo, Sri Lanka - currently in my 3rd year. 
                <br/>With 5+ years of learning IT,&nbsp;I focus on full-stack development with a stronger passion for frontend. 
                <br/>I enjoy building{" "}
                <span className="relative text-blue-800 font-bold hover-trigger cursor-help">
                  *interactive
                  <motion.div
                    className="hidden hover-display absolute text-sm bottom-[-60px] left-0 sm:bottom-[-20px] sm:left-[500px] w-56 sm:w-64 p-3 sm:p-4 bg-white/40 dark:bg-black/70 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 z-50"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ duration: 0.3 }}
                  >
                    <p>
                      <span className="font-semibold text-white/80">Interactive:</span> allowing users to actively engage and respond, not just consume.
                    </p>
                  </motion.div>
                </span>{" "}
                and{" "}
                <span className="relative text-blue-800 font-bold hover-trigger cursor-help">
                  *detail-oriented
                  <motion.div
                    className="hidden hover-display absolute text-sm bottom-[-80px] left-0 sm:bottom-[20px] sm:left-[620px] w-56 sm:w-64 p-3 sm:p-4 bg-white/40 dark:bg-black/70 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 z-50"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>
                      <span className="font-semibold text-white/80">Detail-oriented:</span> marked by careful attention to accuracy and precision.
                    </p>
                  </motion.div>
                </span>{" "}
                UIs and exploring creative ways to enhance user experience.

                <div className="mt-4 text-base sm:text-lg">                
                  No professional work experience yet, but actively enhancing skills through projects and continuous learning.
                </div>
              </h1>
              <SpotifyCard />
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
              className="absolute left-1/2 -translate-x-1/2 sm:left-[40px] sm:translate-x-0 top-[440px] transform -translate-y-1/2 z-20 w-32 h-32 sm:w-40 sm:h-40"
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
                <a
                  href="#contact"
                  className="absolute inset-0 flex items-center justify-center"
                >
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
          className="w-full mt-20 overflow-hidden group border-white/20 border-t border-b pt-5 pb-5"
          variants={sectionVariants}
          initial="hidden"
          animate={skillsInView ? "visible" : "hidden"}
        >
          <div className="flex">
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "-100%" }}
              transition={{
                duration: 60,
                repeat: Infinity,
                ease: "linear",
              }}
              className="flex gap-12 md:gap-20 min-w-full shrink-0 group-hover:[animation-play-state:paused] pr-12 md:pr-20"
            >
              {skills.map((item, i) => (
                <motion.div 
                  key={`first-${i}`} 
                  className="flex items-center space-x-2 md:space-x-3 px-2 md:px-4 shrink-0"
                  variants={itemVariants}
                >
                  <img src={item.img} alt={item.label} className="w-8 h-8 md:w-10 md:h-10 object-contain" />
                  <span className="text-base md:text-lg font-medium text-white">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "-100%" }}
              transition={{
                duration: 60,
                repeat: Infinity,
                ease: "linear",
              }}
              className="flex gap-12 md:gap-20 min-w-full shrink-0 group-hover:[animation-play-state:paused] pr-12 md:pr-20"
            >
              {skills.map((item, i) => (
                <motion.div 
                  key={`second-${i}`} 
                  className="flex items-center space-x-2 md:space-x-3 px-2 md:px-4 shrink-0"
                  variants={itemVariants}
                >
                  <img src={item.img} alt={item.label} className="w-8 h-8 md:w-10 md:h-10 object-contain" />
                  <span className="text-base md:text-lg font-medium text-white">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          ref={skillsRef}
          className="mt-20 md:mt-32 mb-20 mx-6 md:ml-10 md:mr-10"
          variants={sectionVariants}
          initial="hidden"
          animate={skillsInView ? "visible" : "hidden"}
        >
          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 flex items-center gap-3 text-center sm:text-left justify-center sm:justify-start"
            variants={itemVariants}
          >
            <BookOpenIcon className="w-7 h-7 md:w-8 md:h-8 text-blue-800" />
            <span className="text-blue-800">Technical Skills</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {skillCategories.map((skillSet) => (
              <motion.div
                key={skillSet.category}
                className="p-5 md:p-6 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-white/10 hover:border-blue-800/50 transition-all duration-300"
                variants={itemVariants}
              >
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-blue-800">
                  {skillSet.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillSet.items.map((skill) => (
                    <motion.span
                      key={skill}
                      className="px-3 md:px-4 py-0.5 font-medium text-white/60 hover:text-white rounded-full bg-white/10 text-xs md:text-sm border border-white/20 hover:bg-blue-800/20 hover:border-blue-800/40 transition-all duration-200 cursor-default"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          ref={educationRef}
          className="mt-12 mb-12 mx-6"
          variants={sectionVariants}
          initial="hidden"
          animate={educationInView ? "visible" : "hidden"}
        >
          <motion.h2 
            className="text-xl md:text-2xl font-bold mb-6 md:mb-8 flex items-center gap-3 text-center sm:text-left justify-center sm:justify-start"
            variants={itemVariants}
          >
            <GraduationCapIcon className="w-6 h-6 md:w-7 md:h-7 text-blue-800" />
            <span className="text-blue-800">Education</span>
          </motion.h2>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-800/0 via-blue-600 to-transparent"></div>
            
            <motion.div 
              className="relative pl-12 pb-8"
              variants={itemVariants}
            >
              {/* Timeline Dot */}
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

            <motion.div 
              className="relative pl-12"
              variants={itemVariants}
            >
              {/* Timeline Dot */}
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
            className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3 text-center sm:text-left justify-center sm:justify-start"
            variants={itemVariants}
          >
            <AwardIcon className="w-7 h-7 md:w-8 md:h-8 text-blue-800" />
            <span className="text-blue-800">Certifications and Badges</span>
          </motion.h2>

          <motion.div
            className="flex gap-3 md:gap-4 mb-8 md:mb-10 pt-4 pl-0 md:pl-2 justify-center sm:justify-start"
            variants={itemVariants}
          >
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 ${
                activeTab === 'certificates'
                  ? 'bg-blue-800 text-white'
                  : 'bg-gray-900/50 text-gray-400 hover:bg-gray-800/50'
              }`}
            >
              Certificates
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 ${
                activeTab === 'badges'
                  ? 'bg-blue-800 text-white'
                  : 'bg-gray-900/50 text-gray-400 hover:bg-gray-800/50'
              }`}
            >
              Badges
            </button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {activeTab === 'certificates'
              ? CertificateData.map((cert) => (
                  <CertificateCard
                    key={cert.id}
                    cert={cert}
                    onOpenModal={openModal}
                    itemVariants={itemVariants}
                  />
                ))
              : BadgesData.map((badge) => (
                  <BadgeCard
                    key={badge.id}
                    badge={badge}
                    itemVariants={itemVariants}
                  />
                ))}
          </div>
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
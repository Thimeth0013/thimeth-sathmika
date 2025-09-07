import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import CircularText from "../CircularText/CircularText";
import Stack from "../Stack/Stack";
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

// Badge Card Component
const BadgeCard = ({ badge, itemVariants }) => {
  return (
    <motion.div
      key={badge.id}
      className="relative flex flex-col h-full bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-lg hover:border-blue-800/50 transition-all duration-300"
      variants={itemVariants}
    >
      <motion.span
        className="absolute top-3 right-3 bg-blue-800/80 text-white text-xs px-3 py-1 rounded-full shadow-md z-10"
        variants={itemVariants}
      >
        {badge.dateEarned}
      </motion.span>

      <motion.img
        src={badge.image}
        alt={badge.title}
        className="w-full h-40 object-contain bg-white p-4 border-b border-white/10"
        variants={itemVariants}
      />

      <div className="flex flex-col flex-grow p-4">
        <motion.h3
          className="text-lg font-semibold text-white line-clamp-2 mb-2"
          variants={itemVariants}
        >
          {badge.title}
        </motion.h3>

        {badge.issuer && (
          <motion.div
            className="mb-3 flex items-center gap-2"
            variants={itemVariants}
          >
            <span className="w-1.5 h-1.5 bg-blue-800 rounded-full"></span>
            {badge.issuerUrl ? (
              <motion.a
                href={badge.issuerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-800 font-medium transition-colors duration-200 flex items-center gap-1 group focus:outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-1 py-0.5"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {badge.issuer}
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </motion.a>
            ) : (
              <span className="text-sm text-blue-800 font-medium">
                {badge.issuer}
              </span>
            )}
          </motion.div>
        )}

        <motion.p
          className="pb-4 text-sm font-regular text-gray-400 leading-relaxed flex-grow"
          variants={itemVariants}
        >
          {badge.description}
        </motion.p>

        {badge.badgeUrl && (
          <motion.a
            href={badge.badgeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-block px-4 py-2 text-center bg-blue-800 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-300"
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.95 }}
          >
            View Badge
          </motion.a>
        )}
      </div>
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
      className="relative flex flex-col h-full bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-lg hover:border-blue-800/50 transition-all duration-300 cursor-pointer"
      variants={itemVariants}
      onClick={() => onOpenModal(cert)}
    >
      <motion.span
        className="absolute top-3 right-3 bg-blue-800/80 text-white text-xs px-3 py-1 rounded-full shadow-md z-10"
        variants={itemVariants}
      >
        {cert.date}
      </motion.span>

      <motion.img
        src={cert.thumbnail}
        alt={cert.title}
        className="w-full h-40 object-cover border-b border-white/10"
        variants={itemVariants}
      />

      <div className="flex flex-col flex-grow p-4">
        <motion.h3
          className="text-lg font-semibold text-white line-clamp-2 mb-2"
          variants={itemVariants}
        >
          {cert.title}
        </motion.h3>

        {cert.company && (
          <motion.div
            className="mb-3 flex items-center gap-2"
            variants={itemVariants}
          >
            <span className="w-1.5 h-1.5 bg-blue-800 rounded-full"></span>
            {cert.companyUrl ? (
              <motion.button
                onClick={handleCompanyClick}
                className="text-sm text-blue-800 font-medium transition-colors duration-200 flex items-center gap-1 group focus:outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-1 py-0.5"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {cert.company}
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </motion.button>
            ) : (
              <span className="text-sm text-blue-800 font-medium">
                {cert.company}
              </span>
            )}
          </motion.div>
        )}

        <motion.p
          className="pb-4 text-sm font-regular text-gray-400 leading-relaxed flex-grow"
          variants={itemVariants}
        >
          {cert.description}
        </motion.p>

        {cert.certificateUrl && (
          <motion.a
            href={cert.certificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-block px-4 py-2 text-center bg-blue-800 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-300"
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, type: "spring", stiffness: 100, damping: 15 },
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
    <section id="about" className="min-h-screen bg-black text-white py-15 pl-10">
      <div className="container mx-auto px-4 sm:px-6 z-10">
        <div className="flex flex-col sm:flex-row justify-between gap-12 pb-10">
          <motion.div
            className="w-full sm:w-1/2 text-left ml-6 flex flex-col justify-start"
            variants={titleVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <div className="flex gap-3 mt-20">
              <Sparkle className="text-blue-800" />
              <h1 className="text-xl sm:text-2xl font-medium text-left text-blue-800">About Me</h1>
            </div>

            <h1 className="text-2xl sm:text-5xl font-bold mb-4 mt-6 leading-snug">
              I'm a{" "}
              <span className="relative text-blue-800 font-bold hover-trigger cursor-help">
                *creative
                <motion.div
                  className="hidden hover-display absolute text-sm bottom-[-470px] sm:bottom-[-20px] left-[-20px] sm:left-[500px] w-64 p-4 bg-white/40 dark:bg-black/80 backdrop-blur-md text-base rounded-xl shadow-xl border border-white/20 z-50"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p>
                    <span className="font-semibold text-white/80">Creative:</span> using imagination or original ideas to create something meaningful.
                  </p>
                </motion.div>
              </span>{" "}
              soul with a developer's toolkit —{" "}
              <span className="relative text-blue-800 font-bold hover-trigger cursor-help">
                *passionate
                <motion.div
                  className="hidden hover-display absolute text-sm bottom-[-400px] sm:bottom-[110px] left-[40px] sm:left-[630px] w-64 p-4 bg-white/40 dark:bg-black/80 backdrop-blur-md text-base rounded-xl shadow-xl border border-white/20 z-50"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p>
                    <span className="font-semibold text-white/80">Passionate:</span> showing or caused by strong feelings or a strong belief.
                  </p>
                </motion.div>
              </span>{" "}
              about shaping engaging digital stories.
            </h1>
          </motion.div>

          <motion.div
            ref={ref}
            className="w-full sm:w-1/2 flex justify-center sm:justify-end mr-10 mt-5 relative pl-4 sm:pl-0 pr-4 sm:pr-0"
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
              className="absolute left-[100px] top-[440px] transform -translate-y-1/2 z-20 w-40 h-40"
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
              className="flex gap-20 min-w-full shrink-0 group-hover:[animation-play-state:paused] pr-20"
            >
              {skills.map((item, i) => (
                <motion.div 
                  key={`first-${i}`} 
                  className="flex items-center space-x-3 px-4 shrink-0"
                  variants={itemVariants}
                >
                  <img src={item.img} alt={item.label} className="w-10 h-10 object-contain" />
                  <span className="text-lg font-medium text-white">{item.label}</span>
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
              className="flex gap-20 min-w-full shrink-0 group-hover:[animation-play-state:paused] pr-20"
            >
              {skills.map((item, i) => (
                <motion.div 
                  key={`second-${i}`} 
                  className="flex items-center space-x-3 px-4 shrink-0"
                  variants={itemVariants}
                >
                  <img src={item.img} alt={item.label} className="w-10 h-10 object-contain" />
                  <span className="text-lg font-medium text-white">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          ref={skillsRef}
          className="mt-32 mb-20 ml-10 mr-10"
          variants={sectionVariants}
          initial="hidden"
          animate={skillsInView ? "visible" : "hidden"}
        >
          <motion.h2 
            className="text-3xl font-bold mb-12 flex items-center gap-3 text-center sm:text-left justify-center sm:justify-start"
            variants={itemVariants}
          >
            <BookOpenIcon className="w-8 h-8 text-blue-800" />
            <span className="text-blue-800">Technical Skills</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillCategories.map((skillSet) => (
              <motion.div
                key={skillSet.category}
                className="p-6 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-white/10 hover:border-blue-800/50 transition-all duration-300"
                variants={itemVariants}
              >
                <h3 className="text-xl font-semibold mb-4 text-blue-800">
                  {skillSet.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillSet.items.map((skill) => (
                    <motion.span
                      key={skill}
                      className="px-4 py-0.5 font-medium text-white/60 hover:text-white rounded-full bg-white/10 text-sm border border-white/20 hover:bg-blue-800/20 hover:border-blue-800/40 transition-all duration-200 cursor-default"
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
          className="mt-20 mb-20 ml-10 mr-10"
          variants={sectionVariants}
          initial="hidden"
          animate={educationInView ? "visible" : "hidden"}
        >
          <motion.h2 
            className="text-3xl font-bold mb-12 flex items-center gap-3 text-center sm:text-left justify-center sm:justify-start"
            variants={itemVariants}
          >
            <GraduationCapIcon className="w-8 h-8 text-blue-800" />
            <span className="text-blue-800">Education</span>
          </motion.h2>
          <motion.div 
            className="p-6 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-white/10 hover:border-blue-800/50 transition-all duration-300"
            variants={itemVariants}
          >
            <h3 className="text-xl font-semibold text-blue-800 mb-3">
              BSc (Hons) in Information Technology Specialising in Software Engineering
            </h3>
            <p className="text-gray-500 font-medium">
              Sri Lanka Institute of Information Technology (SLIIT) <br />
              (2023 - present)
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          ref={certificatesRef}
          className="mt-20 mb-20 ml-10 mr-10"
          variants={sectionVariants}
          initial="hidden"
          animate={certificatesInView ? "visible" : "hidden"}
        >
          <motion.h2
            className="text-3xl font-bold mb-6 flex items-center gap-3 text-center sm:text-left justify-center sm:justify-start"
            variants={itemVariants}
          >
            <AwardIcon className="w-8 h-8 text-blue-800" />
            <span className="text-blue-800">Certifications and Badges</span>
          </motion.h2>

          <motion.div
            className="flex gap-4 mb-10 pt-4 pl-2 justify-center sm:justify-start"
            variants={itemVariants}
          >
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'certificates'
                  ? 'bg-blue-800 text-white'
                  : 'bg-gray-900/50 text-gray-400 hover:bg-gray-800/50'
              }`}
            >
              Certificates
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'badges'
                  ? 'bg-blue-800 text-white'
                  : 'bg-gray-900/50 text-gray-400 hover:bg-gray-800/50'
              }`}
            >
              Badges
            </button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
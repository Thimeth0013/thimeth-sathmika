import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import CircularText from "../CircularText/CircularText";
import { 
  Sparkle, 
  BookOpenIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  AwardIcon,
  Send
} from "lucide-react";
import profileImage from '../../assets/profile.png';

// Skill icons
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

export const About = () => {
  const titleVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", type: "spring", stiffness: 100 },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 120,
        damping: 20,
      },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const ref = useRef(null);
  const skillsRef = useRef(null);
  const experienceRef = useRef(null);
  const educationRef = useRef(null);
  
  const isInView = useInView(ref, { once: true, amount: 0.2 }); // Changed to once: true
  const skillsInView = useInView(skillsRef, { once: false, amount: 0.2 });
  const experienceInView = useInView(experienceRef, { once: false, amount: 0.2 });
  const educationInView = useInView(educationRef, { once: false, amount: 0.2 });

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

  return (
    <section id="about" className="min-h-screen bg-black text-white py-15">
      <div className="container mx-auto px-4 sm:px-6 z-10">
        <div className="flex flex-col sm:flex-row justify-between gap-12 pb-10">
          {/* Left Text */}
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
                <div className="hidden hover-display absolute text-sm bottom-[-470px] sm:bottom-[-20px] left-[-20px] sm:left-[500px] w-64 p-4 bg-white/40 dark:bg-black/80 backdrop-blur-md text-base rounded-xl shadow-xl border border-white/20 z-50 transition-all">
                  <p>
                    <span className="font-semibold text-white/80">Creative:</span> using imagination or original ideas to create something meaningful.
                  </p>
                </div>
              </span>{" "}
              soul with a developer's toolkit —{" "}
              <span className="relative text-blue-800 font-bold hover-trigger cursor-help">
                *passionate
                <div className="hidden hover-display absolute text-sm bottom-[-400px] sm:bottom-[110px] left-[40px] sm:left-[630px] w-64 p-4 bg-white/40 dark:bg-black/80 backdrop-blur-md text-base rounded-xl shadow-xl border border-white/20 z-50 transition-all">
                  <p>
                    <span className="font-semibold text-white/80">Passionate:</span> showing or caused by strong feelings or a strong belief.
                  </p>
                </div>
              </span>{" "}
              about shaping engaging digital stories.
            </h1>
          </motion.div>

          {/* Right Image with Button */}
          <motion.div
            ref={ref}
            className="w-full sm:w-1/2 flex justify-center sm:justify-end mr-10 mt-5 relative pl-4 sm:pl-0 pr-4 sm:pr-0"
            variants={imageVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            style={{ minHeight: "500px" }} // Stabilize height to prevent flicker
          >
            <motion.img
              src={profileImage}
              alt="Portfolio Visual"
              className="w-full sm:w-auto h-[500px] will-change-transform" // Optimize with will-change
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
            <motion.div
              className="absolute left-[100px] top-[440px] transform -translate-y-1/2 z-20 w-40 h-40"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Outer circle with spinning text */}
              <div className="relative w-full h-full">
                {/* Spinning Circular Text */}
                <CircularText
                  text="LETS TALK * LETS TALK * "
                  spinDuration={20}
                  onHover="speedUp"
                  className="text-white font-medium h-full w-full align-middle justify-center text-center bg-black/50 rounded-full"
                />

                {/* Centered button with link */}
                <a
                  href="#contact"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <motion.div
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-800/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-blue-800 transition-all duration-300"
                  >
                    <Send className="w-6 h-6 mr-1 mt-1 sm:w-8 sm:h-8 text-white" />
                  </motion.div>
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Seamless Infinite Marquee */}
        <div className="w-full mt-20 overflow-hidden group border-white/20 border-t border-b pt-5 pb-5">
          <div className="flex">
            {/* First set of skills */}
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
                <div key={`first-${i}`} className="flex items-center space-x-3 px-4 shrink-0">
                  <img src={item.img} alt={item.label} className="w-10 h-10 object-contain" />
                  <span className="text-lg font-medium text-white">{item.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Second set of skills (starts where first set ends) */}
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
                <div key={`second-${i}`} className="flex items-center space-x-3 px-4 shrink-0">
                  <img src={item.img} alt={item.label} className="w-10 h-10 object-contain" />
                  <span className="text-lg font-medium text-white">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Skills Section */}
        <motion.div 
          ref={skillsRef}
          className="mt-32 mb-20 ml-10 mr-10"
          variants={sectionVariants}
          initial="hidden"
          animate={skillsInView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-3 text-center sm:text-left justify-center sm:justify-start">
            <BookOpenIcon className="w-8 h-8 text-blue-800" />
            <span className="text-blue-800">Technical Skills</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillCategories.map((skillSet) => (
              <motion.div
                key={skillSet.category}
                className="p-6 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-white/10 hover:border-blue-800/50 transition-all duration-300"
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-blue-800">
                  {skillSet.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillSet.items.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-0.5 font-medium text-white/60 hover:text-white rounded-full bg-white/10 text-sm border border-white/20 hover:bg-blue-800/20 hover:border-blue-800/40 transition-all duration-200 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Education & Certifications */}
        <motion.div 
          ref={educationRef}
          variants={sectionVariants}
          initial="hidden"
          animate={educationInView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl font-bold mb-12 ml-10 mr-10 flex items-center gap-3 text-center sm:text-left justify-center sm:justify-start">
            <GraduationCapIcon className="w-8 h-8 text-blue-800" />
            <span className="text-blue-800">Education & Certifications</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ml-10 mr-10">
            <motion.div 
              className="p-6 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-white/10 hover:border-blue-800/50 transition-all duration-300"
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-3">
                Education
              </h3>
              <p className="font-medium text-lg text-white mb-1">BSc (Hons) in Information Technology - Software Engineering</p>
              <p className="text-gray-500 font-medium">
                Sri Lanka Institute of Information Technology (SLIIT) <br />
                (2023 - present)
              </p>
            </motion.div>

            {/* <motion.div 
              className="p-6 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-white/10 hover:border-blue-800/50 transition-all duration-300"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-3">
                Certifications
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <AwardIcon className="w-4 h-4 text-emerald-400" />
                  React Developer Certification
                </li>
                <li className="flex items-center gap-2">
                  <AwardIcon className="w-4 h-4 text-emerald-400" />
                  Node.js Professional Certificate
                </li>
                <li className="flex items-center gap-2">
                  <AwardIcon className="w-4 h-4 text-emerald-400" />
                  MongoDB Associate Developer
                </li>
              </ul>
            </motion.div> */}
          </div>
        </motion.div>
      </div>

      {/* Tooltip Hover Display Logic */}
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
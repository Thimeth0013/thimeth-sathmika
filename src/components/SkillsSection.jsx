import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { BookOpenIcon } from "lucide-react";
import { IconCloud } from "./IconCloud";

// Asset Imports
import html from '../assets/skills/html.svg';
import css from '../assets/skills/css.svg';
import php from '../assets/skills/php.svg';
import git from '../assets/skills/git.svg';
import javascript from '../assets/skills/javascript.svg';
import react from '../assets/skills/react.svg';
import nodejs from '../assets/skills/nodejs.svg';
import expressjs from '../assets/skills/expressjs.svg';
import mongodb from '../assets/skills/mongodb.svg';
import tailwindcss from '../assets/skills/tailwindcss.svg';
import bootstrap from '../assets/skills/bootstrap.svg';
import figma from '../assets/skills/figma.svg';
import photoshop from '../assets/skills/photoshop.svg';
import kotlin from '../assets/skills/kotlin.svg';
import vite from '../assets/skills/vite.svg';
import postman from '../assets/skills/postman.svg';
import mysql from '../assets/skills/mysql.svg';
import java from '../assets/skills/java.svg';

const skillImages = [
  html, css, php, git, javascript, react, nodejs, expressjs,
  mongodb, tailwindcss, bootstrap, figma, photoshop, kotlin,
  vite, postman, mysql, java,
];

// Mapping skill names to their index in skillImages array
const skillToIconIndex = {
  'HTML': 0,
  'CSS': 1,
  'PHP': 2,
  'Git': 3,
  'JavaScript': 4,
  'React': 5,
  'Node.js': 6,
  'Express': 7,
  'MongoDB': 8,
  'Tailwind CSS': 9,
  'Bootstrap': 10,
  'Figma': 11,
  'Photoshop': 12,
  'Kotlin': 13,
  'Vite': 14,
  'Postman': 15,
  'MySQL': 16,
  'Java': 17,
};

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

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [rotateToIcon, setRotateToIcon] = useState(null);

  const handleSkillHover = (skillName) => {
    const iconIndex = skillToIconIndex[skillName];
    if (iconIndex !== undefined) {
      setRotateToIcon(iconIndex);
    }
  };

  const handleSkillLeave = () => {
    setRotateToIcon(null);
  };

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
      className="mb-6 md:mb-0 mt-0 md:mt-24 mx-6 md:ml-8 md:mr-10"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
    >
      <motion.h2 
        className="text-xl md:text-3xl font-bold mb-8 md:mb-12 flex items-center gap-3 text-center sm:text-left justify-start sm:justify-start"
        variants={staggerItem}
      >
        <BookOpenIcon className="w-7 h-7 md:w-8 md:h-8 text-blue-800" />
        <span className="text-blue-800">Technical Skills</span>
      </motion.h2>
      
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-0">
        <motion.div 
          className="space-y-8 flex-1"
          variants={staggerContainer}
        >
          {skillCategories.map((skillSet) => (
            <motion.div 
              key={skillSet.category} 
              className="group"
              variants={staggerItem}
            >
              <h3 className="text-lg md:text-xl font-medium text-blue-700 mb-3">
                {skillSet.category}
              </h3>
              
              <div className="flex flex-wrap gap-4">
                {skillSet.items.map((skill) => (
                  <motion.span
                    key={skill}
                    className="text-white/80 text-sm md:text-base font-regular tracking-wide cursor-pointer relative"
                    whileHover={{ scale: 1.05 }}
                    onMouseEnter={() => handleSkillHover(skill)}
                    onMouseLeave={handleSkillLeave}
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
        </motion.div>

        <motion.div 
          className="hidden lg:flex lg:w-[600px] lg:h-[600px] flex-shrink-0 items-center justify-center"
          variants={staggerItem}
        >
          <IconCloud images={skillImages} rotateToIconIndex={rotateToIcon} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SkillsSection;
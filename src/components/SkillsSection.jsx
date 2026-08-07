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
import typescript from '../assets/skills/typescript.svg';
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
import expo from '../assets/skills/expo.svg'
import docker from '../assets/skills/docker.svg';
import nginx from '../assets/skills/nginx.svg';
import gsap from '../assets/skills/gsap.svg';
import motions from '../assets/skills/motion.svg';
import swagger from '../assets/skills/swagger.svg';
import postgress from '../assets/skills/postgress.svg';
import rabbitmq from '../assets/skills/rabbitmq.svg';
import nest from '../assets/skills/nest.svg';


// Single source of truth for the IconCloud: skill name -> icon.
// Declaration order is the order icons appear in the cloud.
const skillIcons = {
  'HTML': html,
  'CSS': css,
  'PHP': php,
  'Git': git,
  'JavaScript': javascript,
  'React': react,
  'Node.js': nodejs,
  'Express': expressjs,
  'MongoDB': mongodb,
  'Tailwind CSS': tailwindcss,
  'Bootstrap': bootstrap,
  'Figma': figma,
  'Photoshop': photoshop,
  'TypeScript': typescript,
  'Vite': vite,
  'Postman': postman,
  'MySQL': mysql,
  'Java': java,
  'Kotlin': kotlin,
  'Expo': expo,
  'Docker': docker,
  'Nginx': nginx,
  'GSAP': gsap,
  'Motion': motions,
  'Swagger': swagger,
  'PostgreSQL': postgress,
  'RabbitMQ': rabbitmq,
  'Nest.js': nest,
};

const skillImages = Object.values(skillIcons);

// Skill name -> index in skillImages, derived so the two can never drift apart
const skillToIconIndex = Object.fromEntries(
  Object.keys(skillIcons).map((name, index) => [name, index])
);

const skillCategories = [
  {
    category: 'Frontend & Mobile',
    items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'React Native', 'Expo', 'Kotlin', 'Tailwind CSS', 'Bootstrap', 'Motion', 'GSAP'],
  },
  {
    category: 'Backend & APIs',
    items: ['Node.js', 'Express', 'Nest.js', 'PHP', 'Java'],
  },
  {
    category: 'Databases',
    items: ['MongoDB', 'MySQL', 'PostgreSQL'],
  },
  {
    category: 'DevOps & Tooling',
    items: ['Docker', 'Nginx', 'Git', 'Vite', 'RabbitMQ', 'Swagger', 'Postman'],
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
      className="mt-8 md:mt-12 mb-16 md:mb-20"
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
          className="hidden lg:flex lg:w-[600px] lg:h-auto flex-shrink-0 items-center justify-center"
          variants={staggerItem}
        >
          <IconCloud images={skillImages} rotateToIconIndex={rotateToIcon} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SkillsSection;
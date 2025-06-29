import React, { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Sparkle, GithubIcon, ExternalLinkIcon, Lightbulb } from 'lucide-react';

// All projects images
import vehicleService from '../../assets/projects/vehicleService.png';
import portfolio from '../../assets/projects/portfolio.png';
import homekeep from '../../assets/projects/homekeep.png'

export const Project = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState('all');

  // All Projects
  const allProjects = [
    {
      id: 1,
      title: 'Vehicle Service Center Management System',
      description:
        'A MERN-based platform to manage vehicle service bookings, track repair status, and streamline customer interactions.',
      image: vehicleService,
      tags: ['Node.js', 'React', 'MongoDB', 'Express'],
      designLink: 'https://www.behance.net/gallery/225208747/FixMate-Vehicle-Service-Center-Website',
      githubLink: 'https://github.com/Thimeth0013/IT-Project-2025',
      liveLink: '#',
    },
    {
      id: 2,
      title: 'My Website',
      description:
        'A fast and responsive developer portfolio built with React, Tailwind CSS, and Vite — designed to showcase projects, technical skills, and design philosophy with smooth animations and clean UI.',
      image: portfolio,
      tags: ['React', 'TailwindCSS', 'Vite'],
      designLink: 'https://www.behance.net/gallery/228890885/My-Portfolio',
      githubLink: 'https://github.com/Thimeth0013/thimeth-sathmika',
      liveLink: 'https://thimeth0013.github.io/thimeth-sathmika/',
    },
    {
      id: 3,
      title: 'Home Keep',
      description:
        'Home Keep is a professionally designed app built in Figma to simplify and streamline home maintenance, helping you keep your home in top shape with ease.',
      image: homekeep,
      tags: ['Figma'],
      designLink: 'https://www.behance.net/gallery/225180721/Home-Keep',
      githubLink: '',
      liveLink: '',
    },
  ];

  // Filter projects based on active tab
  const getFilteredProjects = () => {
    switch (activeTab) {
      case 'design':
        return allProjects.filter(project => 
          project.designLink && project.designLink !== '#'
        );
      case 'code':
        return allProjects.filter(project => 
          project.githubLink && project.githubLink !== '#'
        );
      case 'live':
        return allProjects.filter(project => 
          project.liveLink && project.liveLink !== '#'
        );
      case 'all':
      default:
        return allProjects;
    }
  };

  const filteredProjects = getFilteredProjects();

  // Tab configuration
  const tabs = [
    { id: 'all', label: 'All Projects', count: allProjects.length },
    { 
      id: 'design', 
      label: 'Design', 
      count: allProjects.filter(p => p.designLink && p.designLink !== '#').length 
    },
    { 
      id: 'code', 
      label: 'Code', 
      count: allProjects.filter(p => p.githubLink && p.githubLink !== '#').length 
    },
    { 
      id: 'live', 
      label: 'Live Demo', 
      count: allProjects.filter(p => p.liveLink && p.liveLink !== '#').length 
    },
  ];

  // Framer Motion Animation Variants
  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut', type: 'spring', stiffness: 100 },
    },
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const cardVariants = (index) => ({
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.15,
        duration: 0.6,
        type: 'spring',
        stiffness: 120,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3, ease: 'easeIn' },
    },
  });

  const hoverVariants = {
    hover: {
      scale: 1.05,
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  // useRef and useInView for animation trigger
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <div className="w-full" id="project">
      <section className="min-h-screen relative py-10 bg-black overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 z-0 transform scale-y-[-1]">
          <div className="relative h-full w-full bg-black">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:10px_20px] sm:bg-[size:14px_24px]"></div>
            <div className="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full"></div>
          </div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 z-10">
          <motion.div
            className="flex items-center pt-10 sm:pt-20 ml-4 sm:ml-8"
            variants={titleVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <Sparkle className="text-blue-800 mr-2 w-6 h-6" />
            <h1 className="text-lg sm:text-2xl font-medium text-left text-blue-800">My work</h1>
          </motion.div>
          <motion.h1
            className="text-2xl sm:text-5xl font-bold text-left mt-4 ml-4 mb-12 sm:ml-8"
            variants={titleVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            Crafting next level digital products
          </motion.h1>

          {/* Tab Navigation */}
          <motion.div
            className="flex justify-center mb-12"
            variants={tabVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <div className="flex flex-wrap justify-center bg-gray-900/50 backdrop-blur-lg rounded-full p-1 border border-gray-700/20 gap-1">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-2 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      className="absolute inset-0 bg-blue-800/80 rounded-full"
                      layoutId="activeTab"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                    {tab.label}
                    <span className={`text-xs px-1.5 sm:px-2 py-1 rounded-full ${
                      activeTab === tab.id 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-700/50 text-gray-400'
                    }`}>
                      {tab.count}
                    </span>
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <div className="mt-12" ref={ref}>
            <motion.div 
              className="flex flex-wrap justify-center gap-8 sm:gap-12"
              key={activeTab} // Force re-render when tab changes
            >
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project, index) => (
                  <motion.div
                    key={`${activeTab}-${project.id}`}
                    className="group w-full sm:w-[45%] lg:w-[30%] rounded-xl overflow-hidden shadow-lg border border-gray-200/20 dark:border-gray-700/20 backdrop-blur-lg bg-gray-900/50 hover:bg-gray-900/80 hover:border-blue-800/26 transition ease-linear"
                    style={{
                      transform: `translateX(${index % 2 === 0 ? '10%' : '-10%'})`,
                      y: parallaxY,
                    }}
                    variants={cardVariants(index)}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileHover="hover"
                    custom={index}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-4 flex gap-2 flex-wrap">
                        {project.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="text-xs font-medium px-2 py-1 rounded-full bg-gray-900/80 text-gray-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium text-sm">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-4">
                        {project.designLink && project.designLink !== '#' ? (
                          <a
                            href={project.designLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm font-medium text-blue-500 dark:text-blue-500 hover:underline"
                          >
                            <Lightbulb className="w-4 h-4" />
                            Design
                          </a>
                        ) : null}
                        {project.githubLink && project.githubLink !== '#' ? (
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:underline"
                          >
                            <GithubIcon className="w-4 h-4" />
                            Code
                          </a>
                        ) : null}
                        {project.liveLink && project.liveLink !== '#' ? (
                          <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm font-medium text-green-500 dark:text-green-500 hover:underline"
                          >
                            <ExternalLinkIcon className="w-4 h-4" />
                            Live Demo
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-gray-400 text-lg font-medium">
                    No projects found for this category
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
import React, { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Sparkle, GithubIcon, ExternalLinkIcon, Lightbulb } from 'lucide-react';
import { projectsData } from '../../data/projects';

export const Project = () => {
  const [activeTab, setActiveTab] = useState('all');
  const allProjects = projectsData;

  const getFilteredProjects = () => {
    switch (activeTab) {
      case 'design':
        return allProjects.filter(p => p.designLink && p.designLink.trim() !== '');
      case 'code':
        return allProjects.filter(p => p.githubLink && p.githubLink.trim() !== '');
      case 'live':
        return allProjects.filter(p => p.liveLink && p.liveLink.trim() !== '');
      default:
        return allProjects;
    }
  };

  const filteredProjects = getFilteredProjects();

  const tabs = [
    { id: 'all', label: 'All Projects', count: allProjects.length },
    { id: 'design', label: 'Design', count: allProjects.filter(p => p.designLink && p.designLink.trim() !== '').length },
    { id: 'code', label: 'Code', count: allProjects.filter(p => p.githubLink && p.githubLink.trim() !== '').length },
    { id: 'live', label: 'Live Demo', count: allProjects.filter(p => p.liveLink && p.liveLink.trim() !== '').length },
  ];

  const titleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut', delay: 0.3 },
    },
  };

  const cardVariants = (index = 0) => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut', delay: 0.6 + index * 0.1 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3, ease: 'easeIn' },
    },
  });

  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.01 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <div className="w-full" id="project">
      <section className="min-h-screen relative py-10 bg-black overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 transform scale-y-[-1]">
          <div className="relative h-full w-full bg-black">
            <div className="absolute top-0 bottom-0 left-0 right-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:10px_20px] sm:bg-[size:14px_24px]"></div>
          </div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 z-10">
          {/* Title */}
          <motion.div
            className="flex items-center pt-10 sm:pt-20 ml-4 sm:ml-8"
            variants={titleVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <Sparkle className="text-blue-800 mr-2 w-6 h-6" />
            <h1 className="text-lg sm:text-2xl font-medium text-blue-800">My work</h1>
          </motion.div>
          <motion.h1
            className="text-2xl sm:text-5xl font-bold mt-4 ml-4 mb-12 sm:ml-8"
            variants={titleVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            Crafting next level digital products
          </motion.h1>

          {/* Tabs */}
          <motion.div
            className="flex justify-center mb-14"
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
                    activeTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      className="absolute inset-0 bg-blue-800/80 rounded-full"
                      layoutId="activeTab"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                    {tab.label}
                    <span className={`text-xs px-1.5 sm:px-2 py-1 rounded-full ${
                      activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-700/50 text-gray-400'
                    }`}>
                      {tab.count}
                    </span>
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Projects Grid */}
          <div className="mt-12" ref={ref}>
            <motion.div className="flex flex-wrap justify-center gap-8 sm:gap-12" key={activeTab}>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project, index) => (
                  <motion.div
                    key={`${activeTab}-${project.id}`}
                    className="group relative w-full sm:w-[45%] lg:w-[30%] rounded-xl overflow-hidden shadow-lg border border-gray-200/20 dark:border-gray-700/20 backdrop-blur-lg bg-gray-900/50 hover:bg-gray-900/80 hover:border-blue-800/26 transition-all duration-500 ease-out cursor-pointer"
                    style={{
                      transform: `translateX(${index % 2 === 0 ? '10%' : '-10%'})`,
                      y: parallaxY,
                    }}
                    variants={cardVariants(index)}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    exit="exit"
                    whileHover={{
                      scale: 1.08,
                      transition: { duration: 0.2, ease: 'easeOut' },
                    }}
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Tags */}
                      <div className="absolute bottom-0 left-0 p-4 flex gap-2 flex-wrap">
                        {project.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="text-xs font-medium px-2 py-1 rounded-full bg-gray-900/60 backdrop-blur-sm text-gray-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Overlay for Desktop */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300 ease-in-out bg-black/80 backdrop-blur-sm flex flex-col justify-center items-center p-6">
                        <div className="text-center space-y-3">
                          <h3 className="text-md md:text-lg font-bold text-white mb-2">{project.title}</h3>
                          <p className="text-gray-300 text-xs md:text-sm leading-relaxed">{project.description}</p>
                          <div className="flex items-center justify-center gap-4 mt-4">
                            {project.designLink && (
                              <a href={project.designLink} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm font-medium text-blue-500 hover:underline">
                                <Lightbulb className="w-4 h-4" /> Design
                              </a>
                            )}
                            {project.githubLink && (
                              <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:underline">
                                <GithubIcon className="w-4 h-4" /> Code
                              </a>
                            )}
                            {project.liveLink && (
                              <a href={project.liveLink} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm font-medium text-green-500 hover:underline">
                                <ExternalLinkIcon className="w-4 h-4" /> Live Demo
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Detail Section */}
                    <div className="md:hidden p-4 bg-black/60 backdrop-blur-sm">
                      <h3 className="text-md font-bold text-white mb-2">{project.title}</h3>
                      <p className="text-gray-300 text-xs leading-relaxed">{project.description}</p>
                      <div className="flex items-center gap-4 mt-4">
                        {project.designLink && (
                          <a href={project.designLink} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm font-medium text-blue-500 hover:underline">
                            <Lightbulb className="w-4 h-4" /> Design
                          </a>
                        )}
                        {project.githubLink && (
                          <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:underline">
                            <GithubIcon className="w-4 h-4" /> Code
                          </a>
                        )}
                        {project.liveLink && (
                          <a href={project.liveLink} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm font-medium text-green-500 hover:underline">
                            <ExternalLinkIcon className="w-4 h-4" /> Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  <div className="text-gray-400 text-lg font-medium">No projects found for this category</div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

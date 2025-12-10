import React, { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Sparkle, Github, ExternalLink, Lightbulb, ChevronDown } from 'lucide-react';
import { projectsData } from '../../data/projects';
import { ProjectDetailModal } from '../ProjectDetails';

export const Project = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [displayCount, setDisplayCount] = useState(6);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const allProjects = [...projectsData].reverse();

  const getFilteredProjects = () => {
    switch (activeTab) {
      case 'design':
        return allProjects.filter(p => p.designLink && p.designLink.trim() !== '');
      case 'code':
        return allProjects.filter(p => p.githubLink && p.githubLink.trim() !== '');
      case 'live':
        return allProjects.filter(p => p.liveLink && p.liveLink.trim() !== '');
      case 'ongoing':
        return allProjects.filter(p => p.status === 'ongoing');
      default:
        return allProjects;
    }
  };

  const filteredProjects = getFilteredProjects();
  const displayedProjects = filteredProjects.slice(0, displayCount);
  const hasMore = displayCount < filteredProjects.length;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 6);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setDisplayCount(6);
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  const tabs = [
    { id: 'all', label: 'All Projects', count: allProjects.length },
    { id: 'design', label: 'Design', count: allProjects.filter(p => p.designLink && p.designLink.trim() !== '').length },
    { id: 'code', label: 'Code', count: allProjects.filter(p => p.githubLink && p.githubLink.trim() !== '').length },
    { id: 'live', label: 'Live Demo', count: allProjects.filter(p => p.liveLink && p.liveLink.trim() !== '').length },
    { id: 'ongoing', label: 'Ongoing', count: allProjects.filter(p => p.status === 'ongoing').length },
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

        <div className="relative container mx-auto px-4 sm:px-0 z-10">
          {/* Title */}
          <motion.div
            className="flex items-center px-2 md:px-0 pt-10 sm:pt-20 ml-2 md:ml-12"
            variants={titleVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <Sparkle className="text-blue-800  mr-2 w-5 h-5 md:w-6 md:h-6" />
            <h1 className="text-base md:text-2xl sm:text-xl font-medium text-blue-800">My work</h1>
          </motion.div>
          <motion.h1
            className="text-xl md:text-5xl sm:text-5xl font-bold mt-4 ml-2 md:ml-12 mb-8 md:mb-12 px-2  md:px-0"
            variants={titleVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            Crafting next level digital products
          </motion.h1>

          {/* Tabs */}
          <motion.div
            className="flex gap-2 md:gap-4 mb-10 md:mb-14 justify-center sm:justify-start ml-2 md:ml-12 flex-wrap"
            variants={tabVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  px-2 py-1 sm:px-4 sm:py-2
                  rounded-lg
                  text-xs sm:text-sm
                  font-medium
                  transition-all duration-300
                  flex items-center gap-1 sm:gap-2
                  ${activeTab === tab.id
                    ? 'bg-blue-800 text-white'
                    : 'bg-gray-900/50 text-gray-400 hover:bg-gray-800/50'}
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.label}
                <span
                  className={`
                    text-xs
                    px-1 sm:px-2 py-0.5 sm:py-1
                    rounded-full
                    ${activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-700/50 text-gray-400'}
                  `}
                >
                  {tab.count}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <div className="mt-12 mx-6 md:ml-6 md:mr-10" ref={ref}>
            <motion.div className="flex flex-wrap justify-center gap-6 md:gap-8 sm:gap-12" key={activeTab}>
              {displayedProjects.length > 0 ? (
                displayedProjects.map((project, index) => (
                  <motion.div
                    key={`${activeTab}-${project.id}`}
                    className="relative w-full sm:w-[45%] lg:w-[30%] rounded-xl overflow-hidden shadow-lg border hover:border-blue-800/30 border-gray-200/20 backdrop-blur-lg bg-gray-900/50 cursor-pointer group"
                    style={{
                      transform: window.innerWidth >= 640 ? `translateX(${index % 2 === 0 ? '10%' : '-10%'})` : 'none',
                      y: window.innerWidth >= 640 ? parallaxY : 0,
                    }}
                    variants={cardVariants(index)}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    exit="exit"
                    onClick={() => handleProjectClick(project)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Image */}
                    <div className="relative h-38 md:h-42 overflow-hidden rounded-xl">
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 rounded-xl p-1 transition-transform duration-500"
                      />

                      {/* Tags */}
                      <div className="absolute bottom-0 left-0 p-3 md:p-4 flex gap-2 flex-wrap">
                        {project.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="text-xs font-medium px-2 py-1 rounded-full bg-gray-900/60 backdrop-blur-sm text-gray-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Detail Section */}
                    <div className="p-4 bg-[#080b14]">
                      <h3 className="text-sm md:text-md font-bold text-white mb-2">{project.title}</h3>
                      <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-3 line-clamp-2">{project.description}</p>
                      <div className="flex items-center flex-wrap gap-3 md:gap-4 mt-4">
                        {project.designLink && (
                          <a 
                            href={project.designLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs md:text-sm font-medium text-blue-500 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Lightbulb className="w-3 h-3 md:w-4 md:h-4" /> Design
                          </a>
                        )}
                        {project.githubLink && (
                          <a 
                            href={project.githubLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group flex items-center gap-1 text-xs md:text-sm font-medium text-gray-300 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Github className="w-3 h-3 md:w-4 md:h-4" /> 
                            Code
                            {project.status === 'ongoing' && (
                              <span className="text-lime-400 text-xs md:text-sm"> (Ongoing)</span>
                            )}               
                          </a>
                        )}
                        {project.liveLink && (
                          <a 
                            href={project.liveLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs md:text-sm font-medium text-green-500 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3 h-3 md:w-4 md:h-4" /> Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  <div className="text-gray-400 text-base md:text-lg font-medium">No projects found for this category</div>
                </motion.div>
              )}
            </motion.div>

            {/* Load More Button */}
            {hasMore && (
              <motion.div
                className="flex justify-center mt-4 mb-4"
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.button
                  onClick={handleLoadMore}
                  className="group relative px-4 py-3 bg-blue-800/40 hover:bg-blue-800 rounded-lg transition-all duration-300 flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="text-sm text-gray-200 hover:text-white font-medium">Load More Projects</span>
                  <ChevronDown className="w-5 h-5 group-hover:animate-bounce" />
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      <ProjectDetailModal 
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};
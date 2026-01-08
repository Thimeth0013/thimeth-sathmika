import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, Github, ExternalLink, Zap, Target, TrendingUp, Layers } from 'lucide-react';

export const ProjectDetailModal = ({ project, isOpen, onClose }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!project) return null;

  // Check if the project has narrative elements
  const hasNarrative = Boolean(project.problem || project.impact);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: 'spring', damping: 30, stiffness: 300 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  // --- Reusable Content Blocks ---
  const renderHighlights = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-white/90">
        <Zap className="w-5 h-5 text-white/60" />
        <h3 className="text-lg font-medium">Highlights</h3>
      </div>
      <ul className="space-y-3 pl-2">
        {project.keyFeatures?.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-sm text-gray-400">
            <span className="w-1.5 h-1.5 bg-white/40 rounded-full mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderTechStack = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-white/90">
        <Layers className="w-5 h-5 text-white/60" />
        <h3 className="text-lg font-medium">Tech Stack</h3>
      </div>
      <div className="grid grid-cols-2 gap-3 pl-2">
        {project.architecture?.map((arch, index) => (
          <div key={index} className="bg-white/5 border border-white/5 rounded-xl p-3 hover:bg-gray-800/20 transition-colors">
            <h4 className="text-xs font-semibold text-gray-200 mb-0.5">
              {arch.label}
            </h4>
            <p className="text-gray-300 text-[12px] tracking-wider">
              {arch.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNarrative = () => (
    <>
      {project.problem && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white/90">
            <Target className="w-5 h-5 text-white/60" />
            <h3 className="text-lg font-medium">The Challenge</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed pl-7 border-l border-white/10">
            {project.problem}
          </p>
        </div>
      )}

      {project.impact && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white/90">
            <TrendingUp className="w-5 h-5 text-white/60" />
            <h3 className="text-lg font-medium">The Impact</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed pl-7 border-l border-white/10">
            {project.impact}
          </p>
        </div>
      )}
    </>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            // We keep onClick here as a fallback, but the div below covers it
            onClick={onClose} 
          />

          {/* Modal Scroll Container - ADDED onClick={onClose} HERE */}
          <div 
            className="fixed inset-0 z-50 overflow-y-auto"
            onClick={onClose}
          >
            <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
              <motion.div
                className="relative w-full max-w-4xl bg-gray-900/40 backdrop-blur-2xl border border-white/10 ring-1 ring-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-3xl overflow-hidden my-8"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                // Stop propagation so clicking the CARD itself doesn't close the modal
                onClick={(e) => e.stopPropagation()}
              >
                {/* Top Sheen */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-20 p-2 bg-black/30 hover:bg-black/50 backdrop-blur-md border border-white/5 rounded-full transition-all duration-300 group"
                >
                  <X className="w-5 h-5 text-gray-300 group-hover:text-white" />
                </button>

                {/* Header Image */}
                <div className="relative h-64 md:h-120 w-full">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover mask-image-gradient rounded-3xl p-2"
                  />
                </div>

                {/* Main Content */}
                <div className="p-8 md:p-10 -mt-12 relative z-10 space-y-10">
                  
                  {/* Header Info */}
                  <div className="space-y-4 mt-10">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <h2 className="text-3xl md:text-4xl font-medium text-white tracking-tight">
                        {project.title}
                      </h2>
                      {project.status === 'ongoing' && (
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lime-500/10 border border-lime-500/20 backdrop-blur-md text-xs font-medium text-lime-300 tracking-wide">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
                          </span>
                          Ongoing Development
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-300 text-lg leading-relaxed font-light">
                      {project.description}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      {[
                        { link: project.designLink, icon: Lightbulb, label: "Design" },
                        { link: project.githubLink, icon: Github, label: "Code" },
                        { link: project.liveLink, icon: ExternalLink, label: "Live Demo" }
                      ].map((item, idx) => (
                        item.link && (
                          <a
                            key={idx}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full transition-all duration-300 backdrop-blur-sm group"
                          >
                            <item.icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                              {item.label}
                            </span>
                          </a>
                        )
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-white/5 w-full" />

                  {/* Dynamic Content Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
                    
                    <div className="space-y-8">
                      {hasNarrative ? (
                        renderNarrative()
                      ) : (
                        project.keyFeatures && project.keyFeatures.length > 0 && renderHighlights()
                      )}
                    </div>

                    <div className="space-y-8">
                      {hasNarrative ? (
                        <>
                          {project.keyFeatures && project.keyFeatures.length > 0 && renderHighlights()}
                          {project.architecture && project.architecture.length > 0 && renderTechStack()}
                        </>
                      ) : (
                        project.architecture && project.architecture.length > 0 && renderTechStack()
                      )}
                    </div>

                  </div>

                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
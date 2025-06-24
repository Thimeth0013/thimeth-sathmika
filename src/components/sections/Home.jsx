import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ScrollVelocity from '../ScrollVelocity/ScrollVelocity';
import GlareHover from '../GlareHover/GlareHover';

// Featured projects images
import vehicleService from '../../assets/projects/vehicleService.png';
import portfolio from '../../assets/projects/portfolio.png'

import {
  ArrowDown,
  GithubIcon,
  ExternalLinkIcon,
  CodeIcon,
  BrainIcon,
  Sparkles,
  Hand,
  Lightbulb,
} from 'lucide-react';

export const Home = () => {
  const featuredProjects = [
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
      designLink: '#',
      githubLink: 'https://github.com/Thimeth0013/thimeth-sathmika',
      liveLink: 'https://thimeth0013.github.io/thimeth-sathmika/',
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: 'easeOut',
      },
    }),
  };

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const infoCards = [
    {
      icon: CodeIcon,
      title: 'Clean Architecture',
      text: 'Building scalable and maintainable systems with SOLID principles',
    },
    {
      icon: BrainIcon,
      title: 'AI Integration',
      text: 'Leveraging machine learning for intelligent solutions',
    },
    {
      icon: Sparkles,
      title: 'Modern UI',
      text: 'Designing sleek, responsive interfaces that enhance user experience across all devices.',
    },
  ];

  return (
    <div className="w-full" id="home">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center overflow-hidden dark:bg-black bg-gray-50">
        <div className="absolute -right-40 -top-20 w-96 h-96 bg-blue-500 rounded-full filter blur-[150px] opacity-20 dark:opacity-30 z-0"></div>
        <div className="absolute -left-20 -bottom-40 w-96 h-96 bg-blue-500 rounded-full filter blur-[150px] opacity-20 dark:opacity-30 z-0"></div>

        <div className="absolute inset-0 z-10 pointer-events-none transition-all duration-500 group-hover:backdrop-blur-[6px] group-hover:bg-white/10"></div>

        <div className="container mx-auto mt-22 px-6 z-20 mb-20 group relative">
          <div className="max-w-6xl mx-auto space-y-8 mb-20">
            <h1 className="text-md md:text-xl text-white mt-30 font-medium">
              <div className="flex">
                <Hand className="text-blue-800 animate-wave mr-4" />
                Hello I'm Thimeth Sathmika.
              </div>
            </h1>
            <h1 className="text-2xl md:text-7xl font-bold">
              <span className="block mb-20">
                Creating tech with{' '}
                <span className="relative text-blue-800 font-bold hover-trigger cursor-help">
                  *intention
                  <div className="hidden hover-display absolute bottom-[-180px] sm:bottom-[-220px] right-[40px] sm:right-[-180px] w-64 p-4 bg-white/40 dark:bg-black/40 backdrop-blur-md text-base rounded-xl shadow-xl border border-white/20 z-50 transition-all">
                    <p>
                      <span className="font-semibold text-white/80 text-sm sm:text-md">Intention:</span> a thing intended; an aim or plan.
                    </p>
                  </div>
                </span>{' '}
                — experiences that matter.
              </span>
            </h1>
            <div className="w-full h-0.5 bg-gradient-to-r from-blue-800/40 to-black mb-[-10px]" />
            <div className="flex justify-center md:justify-end">
              <a
                href="#about"
                className="text-sm md:text-lg px-6 py-2 pt-3 text-white font-medium bg-black backdrop-blur-md rounded-4xl border-s border-e border-blue-800/60 shadow-md hover:border-1 hover:text-blue-800 hover:shadow-[0_0_25px_rgba(59,130,246,0.2)] transition-all"
              >
                Know Me Better
              </a>
            </div>
          </div>
        </div>

        <style>
          {`
            .hover-trigger:hover .hover-display {
              display: block;
            }
          `}
        </style>
      </section>

      {/* Scroll Velocity Text */}
      <div className="mt-[-40px] z-70">
        <ScrollVelocity
          texts={['Design', 'Development']}
          velocity={60}
          className="text-white"
          damping={40}
          stiffness={350}
          numCopies={8}
          parallaxClassName="my-0"
          scrollerClassName="py-10"
          parallaxStyle={{ height: '130px' }}
          scrollerStyle={{ willChange: 'transform' }}
        />
      </div>

      {/* Info Cards with GlareHover */}
      <div
        ref={ref}
        className="relative mt-30 mb-20 text-left max-w-6xl mx-auto px-6"
      >
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 z-20">
          {infoCards.map((card, i) => (
            <GlareHover
              key={i}
              glareColor="#ffffff"
              glareOpacity={0.25}
              glareAngle={-35}
              glareSize={280}
              transitionDuration={800}
              playOnce={false}
              className="rounded-xl border border-white/20 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md shadow-lg hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300 ease-in-out"
              style={{ padding: '1.5rem', width: '100%', height: '100%' }}
            >
              <motion.div
                className="w-full h-full"
                variants={cardVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                custom={i}
              >
                <card.icon className="w-8 h-8 text-teal-600 dark:text-blue-800 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-white/60 font-medium text-sm">{card.text}</p>
              </motion.div>
            </GlareHover>
          ))}
        </div>
      </div>

      {/* Featured Projects Section */}
      <section className="relative py-20 bg-black overflow-hidden pb-10">
        <div className="absolute inset-0 z-0 transform scale-y-[-1]">
          <div className="relative h-full w-full bg-black">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            <div className="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,#000)]"></div>
          </div>
        </div>

        <div className="relative container mx-auto px-6 z-10">
          <div className="mb-14 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Featured Projects</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-gray-900/50 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-blue-800/26 transition-all duration-300 border border-gray-200/20 dark:border-gray-700/20 backdrop-blur-md"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 flex gap-2 flex-wrap">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs font-medium px-2 py-1 rounded-full bg-gray-900/80 text-gray-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium text-sm">{project.description}</p>
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
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="#project"
              className="inline-flex items-center gap-2 px-6 py-2 pt-3 rounded-4xl bg-blue-800 dark:bg-blue-800/12 border-s border-e border-blue-800 text-white font-medium transition-all shadow-lg shadow-blue-500/10 hover:bg-blue-800/18"
            >
              View All Projects
              <ArrowDown className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
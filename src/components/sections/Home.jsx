import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ScrollVelocity from '../ScrollVelocity/ScrollVelocity';
import GlareHover from '../GlareHover/GlareHover';
import LightRays from '../LightRays/LightRays';
import CV from '../../assets/Thimeth_Sathmika_CV.pdf';

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
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    }),
  };

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
      <section className="relative w-full min-h-[80vh] md:min-h-[90vh] flex items-center overflow-hidden bg-black">
        {/* Light Rays - Desktop only */}
        <div className="hidden md:block absolute inset-0 z-0">
          <LightRays
            raysOrigin="bottom-left"
            raysColor="#0059ffff"
            raysSpeed={1.4}
            lightSpread={1.0}
            rayLength={2.6}
            followMouse={true}
            mouseInfluence={0.6}
            noiseAmount={0.01}
            distortion={0.02}
            className="custom-rays"
          />
        </div>

        <div className="absolute inset-0 z-10 pointer-events-none transition-all duration-500 group-hover:backdrop-blur-[6px] group-hover:bg-white/10"></div>

        <div className="container mx-auto mt-0 md:mt-22 px-6 md:px-4 sm:px-6 z-20 mb-0 md:mb-20 group relative">
          {/* Desktop Layout */}
          <div className="hidden md:block max-w-6xl mx-auto space-y-8 mb-20">
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
                  <div className="hidden hover-display absolute bottom-[-180px] sm:bottom-[-180px] right-[40px] sm:right-[-160px] w-100 p-4 bg-black/40 backdrop-blur-md text-base rounded-xl shadow-xl border border-white/20 z-50 transition-all">
                    <p>
                      <span className="font-semibold text-white/80 text-sm sm:text-md delay-5000">Intention:</span> a thing intended; an aim or plan.
                    </p>
                  </div>
                </span>{' '}
                — experiences that matter.
              </span>
            </h1>
            <div className="w-3/5 h-0.5 bg-gradient-to-r from-blue-800/40 to-black mb-[-20px]" />
            <div className="flex justify-center md:justify-end">
              <a
                href="#about"
                className="text-sm md:text-lg px-6 py-2 pt-2 text-blue-700 font-medium bg-transparent backdrop-blur-md rounded-xl border-s border-e border-blue-800/60 shadow-md hover:border-1 hover:text-white transition-all"
              >
                Know Me Better
              </a>
           <a
                href={CV}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm md:text-lg px-6 py-2 pt-2 text-blue-700 font-medium bg-transparent backdrop-blur-md rounded-xl border-s border-e border-blue-800/60 shadow-md hover:border-1 hover:text-white transition-all ml-10"
              >
                View Resume
              </a>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden max-w-3xl mx-auto space-y-6">
            <h1 className="text-sm text-white font-medium flex items-center gap-2">
              <Hand className="text-blue-800 w-4 h-4 animate-wave" />
              Hello, I'm Thimeth Sathmika
            </h1>
            <h1 className="text-xl font-bold leading-snug">
              Creating tech with{' '}
              <span className="text-blue-800 font-bold">
                *intention
              </span>{' '}
              — experiences that matter.
            </h1>
            <div className="flex flex-col gap-3 mt-6">
              <a
                href="#about"
                className="text-sm px-4 py-2 text-center text-blue-700 font-medium bg-transparent backdrop-blur-md rounded-xl border border-blue-800 shadow-md hover:text-white transition-all"
              >
                Know Me Better
              </a>
              <a
                href=""
                target="_blank"
                className="text-sm px-4 py-2 text-center text-blue-700 font-medium bg-transparent backdrop-blur-md rounded-xl border border-blue-800 shadow-md hover:text-white transition-all"
              >
                View Resume
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

      {/* Scroll Velocity Text - Desktop only */}
      <div className="hidden md:block mt-[-40px] z-70">
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
        className="relative mt-0 md:mt-30 mb-2 md:mb-20 text-left max-w-6xl mx-auto px-6 md:px-4 sm:px-6"
      >
        <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 z-20">
          {infoCards.map((card, i) => (
            <GlareHover
              key={i}
              glareColor="#ffffff"
              glareOpacity={0.2}
              glareAngle={-35}
              glareSize={200}
              transitionDuration={600}
              playOnce={false}
              className="rounded-xl border border-white/20 md:bg-white/20 bg-gray-800/20 backdrop-blur-md shadow-lg hover:bg-white/20 md:hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300 ease-in-out"
              style={{ 
                padding: window.innerWidth >= 768 ? '1.5rem' : '1rem', 
                width: '100%', 
                height: '100%' 
              }}
            >
              <motion.div
                className="w-full h-full flex flex-col gap-2"
                variants={cardVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                custom={i}
              >
                <card.icon className="w-7 h-7 md:w-8 md:h-8 text-blue-800 dark:text-blue-800 mb-2 md:mb-4" />
                <h3 className="text-base md:text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-white/70 md:text-white/60 font-medium text-sm">{card.text}</p>
              </motion.div>
            </GlareHover>
          ))}
        </div>
      </div>
    </div>
  );
};
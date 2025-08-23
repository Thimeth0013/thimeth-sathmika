import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ScrollVelocity from '../ScrollVelocity/ScrollVelocity';
import GlareHover from '../GlareHover/GlareHover';
import LightRays from '../LightRays/LightRays';

// Featured projects images
import vehicleService from '../../assets/projects/vehicleService.png';
import portfolio from '../../assets/projects/portfolio.png'
import homekeep from '../../assets/projects/homekeep.png'

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
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
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
                className="text-sm md:text-lg px-6 py-2 pt-2 text-white font-medium bg-black backdrop-blur-md rounded-4xl border-s border-e border-blue-800/60 shadow-md hover:border-1 hover:text-blue-800 hover:shadow-[0_0_25px_rgba(59,130,246,0.2)] transition-all"
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
    </div>
  );
};
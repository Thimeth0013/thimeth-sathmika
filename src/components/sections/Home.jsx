import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import ScrollVelocity from '../ScrollVelocity/ScrollVelocity';
import GlareHover from '../GlareHover/GlareHover';
import LightRays from '../LightRays/LightRays';
import CV from '../../assets/Thimeth_Sathmika_CV.pdf';

import {
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

  // Tracks which card is centred in the mobile horizontal scroller
  const scrollerRef = useRef(null);
  const [activeCard, setActiveCard] = useState(0);

  const handleCardScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = el.scrollWidth / infoCards.length;
    setActiveCard(Math.round(el.scrollLeft / step));
  };

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
      <section className="relative w-full min-h-[100dvh] md:h-screen flex items-center overflow-hidden bg-black">
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

        {/* Mobile backdrop — CSS-only stand-in for the WebGL rays (no GPU cost) */}
        <div className="md:hidden absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-28 -left-24 w-72 h-72 rounded-full bg-blue-700/25 blur-[90px]" />
          <div className="absolute top-1/3 -right-24 w-64 h-64 rounded-full bg-blue-900/40 blur-[80px]" />
          <div className="absolute -bottom-20 left-1/4 w-72 h-72 rounded-full bg-blue-800/20 blur-[100px]" />
          <div className="absolute inset-0 hero-grid" />
        </div>

        <div className="absolute inset-0 z-10 pointer-events-none transition-all duration-500 group-hover:backdrop-blur-[6px] group-hover:bg-white/10"></div>

        <div className="max-w-[1600px] mx-auto mt-0 md:mt-22 px-4 sm:px-6 lg:px-10 z-20 mb-0 md:mb-20 group relative">
          {/* Desktop Layout */}
          <div className="hidden md:block space-y-8 mb-20">
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
                  <div className="hidden hover-display absolute bottom-[-180px] sm:bottom-[-180px] right-[180px] sm:right-[-423px] w-100 p-4 bg-black/40 backdrop-blur-md text-base rounded-xl shadow-xl border border-white/20 z-50 transition-all">
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
            <h1 className="text-base text-white font-medium flex items-center gap-2">
              <Hand className="text-blue-800 w-5 h-5 animate-wave" />
              Hello, I'm Thimeth Sathmika
            </h1>
            <h1 className="text-[2rem] sm:text-4xl font-bold leading-tight tracking-tight">
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
                href={CV}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm px-4 py-2 text-center text-blue-700 font-medium bg-transparent backdrop-blur-md rounded-xl border border-blue-800 shadow-md hover:text-white transition-all"
              >
                View Resume
              </a>
            </div>
          </div>
        </div>

        {/* Scroll cue — mobile only, anchors the bottom of the hero */}
        <a
          href="#about"
          className="md:hidden absolute bottom-7 left-0 right-0 z-20 flex flex-col items-center gap-1.5"
        >
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/35">Scroll</span>
          <span className="scroll-line" aria-hidden="true" />
        </a>

        <style>
          {`
            .hover-trigger:hover .hover-display {
              display: block;
            }
            /* Scroll cue: faint track with a blue segment sliding down it */
            .scroll-line {
              position: relative;
              display: block;
              width: 1px;
              height: 56px;
              overflow: hidden;
              background: rgba(255, 255, 255, 0.1);
              /* Both ends fade out to the background instead of stopping flat */
              -webkit-mask-image: linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent);
              mask-image: linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent);
              -webkit-mask-repeat: no-repeat;
              mask-repeat: no-repeat;
            }
            .scroll-line::after {
              content: "";
              position: absolute;
              left: 0;
              right: 0;
              top: 0;
              height: 40%;
              background: #2563eb;
              transform: translateY(-100%);
              animation: scroll-line-travel 2.4s ease-in-out infinite;
            }
            @keyframes scroll-line-travel {
              0%   { transform: translateY(-100%); }
              100% { transform: translateY(250%); }
            }
            @media (prefers-reduced-motion: reduce) {
              .scroll-line::after {
                animation: none;
                transform: translateY(75%);
              }
            }
            .hero-grid {
              background-image:
                linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px);
              background-size: 44px 44px;
              -webkit-mask-image: radial-gradient(ellipse at 50% 40%, #000 30%, transparent 72%);
              mask-image: radial-gradient(ellipse at 50% 40%, #000 30%, transparent 72%);
            }
            .no-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
      </section>

      {/* Scroll Velocity Text - Desktop only */}
      <div className="hidden md:block mt-0 z-70">
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
        className="relative mt-14 md:mt-16 mb-14 md:mb-20 text-left max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-16"
      >
        {/* Mobile: edge-to-edge horizontal snap-scroller. sm and up: normal grid. */}
        <div
          ref={scrollerRef}
          onScroll={handleCardScroll}
          className="
            relative z-20 flex snap-x snap-mandatory overflow-x-auto no-scrollbar items-stretch
            gap-4 -mx-4 px-4 pb-4
            sm:grid sm:grid-cols-2 sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0 sm:gap-6
            md:grid-cols-3 md:gap-8
          "
        >
          {infoCards.map((card, i) => (
            <div
              key={i}
              className="snap-center shrink-0 basis-[82%] sm:basis-auto sm:shrink"
            >
              <GlareHover
                glareColor="#ffffff"
                glareOpacity={0.2}
                glareAngle={-45}
                glareSize={250}
                transitionDuration={650}
                playOnce={false}
                className="p-5 md:p-6 rounded-xl border border-white/20 md:bg-white/20 bg-gray-800/20 backdrop-blur-md shadow-lg hover:bg-white/20 md:hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300 ease-in-out"
                style={{ width: '100%', height: '100%' }}
              >
                <motion.div
                  className="w-full h-full flex flex-col gap-2"
                  variants={cardVariants}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  custom={i}
                >
                  <card.icon className="w-7 h-7 md:w-8 md:h-8 text-blue-800 dark:text-blue-800 mb-2 md:mb-4" />
                  <h3 className="text-lg md:text-lg font-semibold mb-2">{card.title}</h3>
                  <p className="text-white/70 md:text-white/60 font-medium text-sm md:text-sm leading-relaxed">{card.text}</p>
                </motion.div>
              </GlareHover>
            </div>
          ))}
        </div>

        {/* Scroll position indicator — mobile only */}
        <div className="flex justify-center gap-1.5 mt-1 sm:hidden">
          {infoCards.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeCard ? 'w-5 bg-blue-700' : 'w-1.5 bg-white/25'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
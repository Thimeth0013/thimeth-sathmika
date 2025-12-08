import React, { useRef, Suspense } from "react";
import { motion, useInView } from "framer-motion";
import CircularText from "../CircularText/CircularText";
import Stack from "../Stack/Stack";
import LetterboxdSpotifyCard from '../LetterboxdSpotifyCard';
import { 
  Sparkle, 
  GraduationCapIcon,
  Send
} from "lucide-react";
import profileImageHover from '../../assets/profile2.webp';

// Lazy Loading heavy components
const SkillsSection = React.lazy(() => import('../SkillsSection'));
const CertificatesSection = React.lazy(() => import('../CertificatesSection'));

export const About = () => {
  // Refs for sections
  const heroRef = useRef(null);
  const educationRef = useRef(null);

  // In-view detection
  const heroInView = useInView(heroRef, { once: true, amount: 0.1 });
  const educationInView = useInView(educationRef, { once: true, amount: 0.1 });

  const images = [
    { id: 1, img: profileImageHover },
  ];

  // Animation variants
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
    <section id="about" className="min-h-screen bg-black text-white py-10 md:py-15 pl-0 md:pl-10">
      <div className="container mx-auto px-4 sm:px-6 z-10">
        {/* Hero Section */}
        <motion.div 
          ref={heroRef}
          className="flex flex-col sm:flex-row justify-between gap-4 pb-10"
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.div
            className="w-full sm:w-3/5 text-left ml-4 sm:ml-6 flex flex-col justify-start"
            variants={staggerItem}
          >
            <div className="flex gap-3 mt-10 sm:mt-15">
              <Sparkle className="text-blue-800" />
              <h1 className="text-xl sm:text-2xl font-medium text-left text-blue-800">About Me</h1>
            </div>

            <div className="pr-4 sm:pr-0">
              <motion.h1 
                className="text-base sm:text-2xl font-bold mb-12 mt-6 leading-snug"
                variants={staggerItem}
              >
                Software Engineering undergrad from Colombo, Sri Lanka, specializing in full-stack development with a strong focus on frontend engineering. 
                <br />Over 3 years of experience working with modern web technologies, creating{" "}
                <span className="relative text-blue-800 font-bold hover-trigger cursor-help">
                  *interactive
                  <motion.div
                    className="hidden hover-display absolute text-sm bottom-[-60px] left-0 sm:bottom-[-180px] sm:left-[660px] w-56 sm:w-64 p-3 sm:p-4 bg-black/70 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 z-50"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>
                      <span className="font-semibold text-white/80">Interactive:</span> allowing users to actively engage and respond, not just consume.
                    </p>
                  </motion.div>
                </span>{" "}
                and<br/>
                <span className="relative text-blue-800 font-bold hover-trigger cursor-help">
                  *detail-oriented
                  <motion.div
                    className="hidden hover-display absolute text-sm bottom-[-80px] left-0 sm:bottom-[-40px] sm:left-[620px] w-56 sm:w-64 p-3 sm:p-4 bg-black/70 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 z-50"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>
                      <span className="font-semibold text-white/80">Detail-oriented:</span> marked by careful attention to accuracy and precision.
                    </p>
                  </motion.div>
                </span>{" "}
                UIs, while bridging design and code to deliver seamless user experiences.
              </motion.h1>
              
              <motion.h3 
                className="text-gray-200 sm:text-lg font-medium"
                variants={staggerItem}
              >
                Beyond code, I find inspiration in music and cinema.
              </motion.h3>
              
              <motion.div variants={staggerItem}>
                <LetterboxdSpotifyCard/>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="w-full sm:w-1/2 flex justify-center sm:justify-end mx-auto sm:mr-20 mt-5 px-0"
            variants={staggerItem}
          >
            <div className="relative inline-block">
              <Stack
                randomRotation={true}
                sensitivity={180}
                sendToBackOnClick={false}
                cardDimensions={{ width: 360, height: 500 }}
                cardsData={images}
              />
              <motion.div
                className="hidden sm:block absolute bottom-8 -left-8 md:bottom-12 md:-left-12 lg:bottom-0 lg:-left-16 z-20 w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="relative w-full h-full">
                  <CircularText
                    text="LETS TALK * LETS TALK * "
                    spinDuration={20}
                    onHover="speedUp"
                    className="text-white font-medium h-full w-full align-middle justify-center text-center bg-black/50 rounded-full"
                  />
                  <a href="#contact" className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-blue-800/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-blue-800 transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Send className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 mr-1 mt-1 text-white" />
                    </motion.div>
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Skills Section - Lazy Loaded */}
        <Suspense fallback={<div className="h-96 flex items-center justify-center text-blue-800">Loading Skills...</div>}>
          <SkillsSection />
        </Suspense>

        {/* Education Section (Kept lightweight) */}
        <motion.div 
          ref={educationRef}
          className="mt-24 mb-12 mx-6"
          initial="hidden"
          animate={educationInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-xl md:text-3xl font-bold mb-6 md:mb-8 flex items-center gap-3 text-center sm:text-left justify-start"
            variants={staggerItem}
          >
            <GraduationCapIcon className="w-6 h-6 md:w-7 md:h-7 text-blue-800" />
            <span className="text-blue-800">Education</span>
          </motion.h2>
          
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-800/0 via-blue-600 to-transparent"></div>
            
            <motion.div 
              className="relative pl-12 pb-8"
              variants={staggerItem}
            >
              <div className="absolute left-2.5 top-8 w-3 h-3 bg-blue-800 rounded-full border-2 border-gray-900 shadow-lg"></div>
              
              <div className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-lg p-3 md:p-4 hover:border-blue-800/50 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-0">
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-bold text-blue-800 mb-1">
                      BSc (Hons) in Information Technology Specialising in Software Engineering
                    </h3>
                    <p className="text-gray-400 text-xs md:text-sm">Sri Lanka Institute of Information Technology</p>
                  </div>
                  <div className="bg-blue-800/20 px-3 py-1 rounded-full border border-blue-800/30 self-start">
                    <span className="text-blue-300 text-xs font-medium whitespace-nowrap">2023 - Present</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="relative pl-12"
              variants={staggerItem}
            >
              <div className="absolute left-2.5 top-9 w-3 h-3 bg-blue-800 rounded-full border-2 border-gray-900 shadow-lg"></div>
              
              <div className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-lg p-3 md:p-4 hover:border-blue-800/50 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-0">
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-bold text-blue-800 mb-1">
                      GCE O/L & A/L (Engineering Technology)
                    </h3>
                    <p className="text-gray-400 text-xs md:text-sm">Swarna Jayanthi College, Kegalle</p>
                  </div>
                  <div className="bg-blue-600/20 px-3 py-1 rounded-full border border-blue-600/30 self-start">
                    <span className="text-blue-300 text-xs font-medium whitespace-nowrap">2015 - 2022</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Certificates and Badges Section - Lazy Loaded */}
        <Suspense fallback={<div className="h-96 flex items-center justify-center text-blue-800">Loading Certificates...</div>}>
          <CertificatesSection />
        </Suspense>
      </div>

      <style>
        {`
          .hover-trigger:hover .hover-display {
            display: block;
          }
        `}
      </style>
    </section>
  );
};
import vehicleService from '../assets/projects/vehicleService.png';
import portfolio from '../assets/projects/portfolio.png';
import homekeep from '../assets/projects/homekeep.png';
import cocktails from '../assets/projects/gsapCocktails.png';
import smartSpend from '../assets/projects/smartSpend.png';
import ceylonTrails from '../assets/projects/ceylonTrails.jpg';
import safeCert from '../assets/projects/safecert.png'
import launchWindow from '../assets/projects/launchWindow.jpg';

export const projectsData = [
  {
    id: 1,
    title: 'Home Keep',
    description: 'Home Keep is a professionally designed app built in Figma to simplify and streamline home maintenance, helping you keep your home in top shape with ease.',
    image: homekeep,
    tags: ['Figma'],
    designLink: 'https://www.behance.net/gallery/225180721/Home-Keep',
    githubLink: '',
    liveLink: '',
    status: 'completed',
  },
  {
    id: 2,
    title: 'Smart Spend',
    description: 'Smart Spend is a simple mobile app for managing personal finances. It tracks income, expenses, and savings while providing insights into spending habits through a user-friendly interface.',
    image: smartSpend,
    tags: ['Kotlin', 'Android Studio', 'Figma'],
    designLink: 'https://www.behance.net/gallery/233755199/Smart-Spend',
    githubLink: 'https://github.com/Thimeth0013/SmartSave',
    liveLink: '',
    status: 'completed',
  },
  {
    id: 3,
    title: 'My Website',
    description: 'A fast and responsive developer portfolio built with React, Tailwind CSS, and Vite — designed to showcase projects, technical skills, and design philosophy with smooth animations and clean UI.',
    image: portfolio,
    tags: ['React', 'TailwindCSS', 'Vite'],
    designLink: 'https://www.behance.net/gallery/228890885/My-Portfolio',
    githubLink: 'https://github.com/Thimeth0013/thimeth-sathmika',
    liveLink: 'https://thimeth0013.github.io/thimeth-sathmika/',
    status: 'completed',
  },
  {
    id: 4,
    title: 'Vehicle Service Center Management System',
    description: 'A MERN-based platform to schedule services with automated inventory management, financial management, customer management & staff management to streamline business operations.',
    image: vehicleService,
    tags: ['Node.js', 'React', 'MongoDB', 'Express'],
    designLink: 'https://www.behance.net/gallery/225208747/FixMate-Vehicle-Service-Center-Website',
    githubLink: 'https://github.com/Thimeth0013/IT-Project-2025',
    liveLink: '',
    status: 'completed',    
  },
  {
    id: 5,
    title: 'Mojito Cocktails',
    description: 'An animated and visually rich website built with React, Tailwind CSS, Vite, and GSAP — my first project using GSAP to explore advanced frontend animations.',
    image: cocktails,
    tags: ['React', 'TailwindCSS', 'Vite', 'GSAP Animations'],
    designLink: 'https://www.figma.com/design/MByXaI8pcleIbgTvsDat1X/Cocktail-GSAP-Website?node-id=0-1&p=f&t=N6byExgZAx0K0dba-0',
    githubLink: 'https://github.com/Thimeth0013/gsap-cocktails',
    liveLink: 'https://gsap-cocktails-topaz.vercel.app/#home',
    status: 'completed',
  },
  {
    id: 6,
    title: 'Safe Cert',
    description: 'Safe Cert is a comprehensive workplace safety and compliance management app designed to streamline employee training, certification tracking, and incident reporting.',
    image: safeCert,
    tags: ['TypeScript', 'Firebase', 'Expo Go'],
    designLink: 'https://www.figma.com/design/In14fTZofTB2vIbuuzCPry/UEE-App?node-id=108-1376&t=iXt5r3rRNcdP6QPi-1',
    githubLink: 'https://github.com/Y3S1Group/safecert_app',
    liveLink: '',
    status: 'completed',
  },
  {
    id: 7,
    title: 'Ceylon Trails',
    description: 'Ceylon Trails is a Sri Lanka–based travel blogging web platform where travellers can create, store, and share their travel experiences as digital memories.',
    image: ceylonTrails,
    tags: ['Node.js', 'React', 'MongoDB', 'Express'],
    designLink: 'https://www.behance.net/gallery/236846135/Ceylon-Trails',
    githubLink: 'https://github.com/Y3S1Group/ceylon_trails',
    liveLink: '',
    status: 'completed',
  },
  {
    id: 8,
    title: 'Launch Window',
    description: 'A centralized platform for discovering rocket launches, Launch Window automatically aggregates live streams from YouTube, creating a single hub for space enthusiasts.',
    image: launchWindow,
    tags: ['Node.js', 'React', 'MongoDB', 'Express'],
    designLink: '',
    githubLink: 'https://github.com/Thimeth0013/launch-window',
    liveLink: 'https://launch-window-ochre.vercel.app/',
    status: 'ongoing',
  },
];
import vehicleService from '../assets/projects/vehicleService.webp';
import portfolio from '../assets/projects/portfolio.webp';
import homekeep from '../assets/projects/homekeep.webp';
import cocktails from '../assets/projects/gsapCocktails.webp';
import smartSpend from '../assets/projects/smartSpend.webp';
import ceylonTrails from '../assets/projects/ceylonTrails.webp';
import safeCert from '../assets/projects/safecert.webp';
import launchWindow from '../assets/projects/launchWindow.webp';
import moneyMentor from '../assets/projects/moneyMentor.webp';
import healthCare from '../assets/projects/healthCare.webp';

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

    keyFeatures: [
      'Intelligent maintenance scheduling',
      'Service provider directory',
      'Visual home inventory management',
      'Maintenance cost tracking & analytics',
      'Seasonal care checklists',
      'DIY repair guides & tips'
    ],

    problem: 'Homeowners often struggle to keep track of routine maintenance tasks, leading to neglect, unexpected breakdowns, and expensive emergency repairs. Organizing service providers and warranties is typically chaotic.',

    impact: 'Home Keep centralizes all home management needs, extending the lifespan of appliances and property structure through timely maintenance. It reduces homeowner anxiety and saves money by preventing major repairs through consistent care.',

    architecture: [
      {
        label: 'Design Tool',
        value: 'Figma'
      },
      {
        label: 'Prototyping',
        value: 'Interactive Components & Smart Animate'
      },
      {
        label: 'Design System',
        value: 'Atomic Design Principles'
      },
      {
        label: 'UX Strategy',
        value: 'User Journey Mapping & Wireframing'
      }
    ]
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

    keyFeatures: [
      'Quick transaction logging',
      'Visual expense categorization charts',
      'Monthly budget limit setting',
      'Savings goal tracking',
      'Budget notifications'
    ],

    problem: 'Many individuals lack awareness of their daily spending habits, making it difficult to save money. Complex financial apps often deter users with steep learning curves, leading to abandonment of financial planning.',

    impact: 'Smart Spend empowers users to take control of their finances through a minimal, friction-free interface. By visualizing spending patterns, users can identify leaks in their budget and achieve savings goals faster.',

    architecture: [
      {
        label: 'Mobile Framework',
        value: 'Android (Kotlin)'
      },
      {
        label: 'Architecture Pattern',
        value: 'MVVM (Model-View-ViewModel)'
      },
      {
        label: 'Local Database',
        value: 'Shared Preferences'
      },
      {
        label: 'UI Toolkit',
        value: 'XML Layouts'
      },
      {
        label: 'Data Visualization',
        value: 'MPAndroidChart'
      }
    ]
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

    keyFeatures: [
      'Fully responsive layout for all devices',
      'Dynamic project gallery with filtering',
      'Smooth scroll animations (Framer Motion)',
      'Interactive contact form',
      'Performance optimized with Vite',
      'Clean, glassmorphism-inspired UI'
    ],

    architecture: [
      {
        label: 'Frontend Library',
        value: 'React.js'
      },
      {
        label: 'Styling',
        value: 'Tailwind CSS'
      },
      {
        label: 'Animations',
        value: 'Framer Motion'
      },
      {
        label: 'Build Tool',
        value: 'Vite'
      },
      {
        label: 'Hosting',
        value: 'GitHub Pages'
      }
    ]
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

    keyFeatures: [
      'Online service booking & scheduling',
      'Real-time inventory tracking',
      'Automated invoice generation',
      'Staff shift & performance management',
      'Financial reporting dashboard'
    ],

    problem: 'Traditional vehicle service centers rely on manual paperwork or disjointed systems, leading to booking conflicts, lost inventory, calculation errors, and poor customer communication.',

    impact: 'The system digitizes the entire workflow, reducing administrative time by 40%. It minimizes human error in billing and inventory, ensures optimal staff allocation, and improves customer satisfaction through transparent service records.',

    architecture: [
      {
        label: 'Frontend',
        value: 'React.js'
      },
      {
        label: 'Backend',
        value: 'Node.js & Express'
      },
      {
        label: 'Database',
        value: 'MongoDB'
      },
      {
        label: 'Authentication',
        value: 'JWT (JSON Web Tokens)'
      },
      {
        label: 'API Architecture',
        value: 'RESTful API'
      }
    ]
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

    keyFeatures: [
      'Scroll-triggered entrance animations',
      'Parallax scrolling effects',
      'Interactive 3D-feel transitions',
      'Mobile-responsive animation logic',
      'High-performance rendering'
    ],

    problem: 'Many web experiences feel static and boring. Mastering modern web animation is essential for creating immersive brand experiences, yet it requires overcoming significant technical challenges regarding performance and timing.',

    impact: 'This project demonstrates high-level frontend proficiency, specifically in complex animation orchestration. It creates a memorable user experience where the visuals guide the user through the content, increasing engagement time.',

    architecture: [
      {
        label: 'Core Framework',
        value: 'React.js'
      },
      {
        label: 'Animation Engine',
        value: 'GSAP (GreenSock) + ScrollTrigger'
      },
      {
        label: 'Styling',
        value: 'Tailwind CSS'
      },
      {
        label: 'Bundler',
        value: 'Vite'
      },
      {
        label: 'Deployment',
        value: 'Vercel'
      }
    ]
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

    keyFeatures: [
      'Digital safety certification wallet',
      'Real-time incident reporting',
      'Automated certificate expiry alerts',
      'Training module access & tracking',
      'QR code verification for site access',
      'Admin dashboard for compliance overview'
    ],

    problem: 'Industrial workplaces struggle with managing physical safety cards, tracking expired certifications, and collecting timely incident reports. Non-compliance leads to legal risks and unsafe working environments.',

    impact: 'Safe Cert modernizes safety compliance, ensuring 100% of on-site staff are certified. It drastically reduces response time for safety incidents and eliminates the administrative burden of manual record-keeping.',

    architecture: [
      {
        label: 'Mobile Framework',
        value: 'React Native (Expo)'
      },
      {
        label: 'Language',
        value: 'TypeScript'
      },
      {
        label: 'Backend / DB',
        value: 'Firebase (Auth, Firestore)'
      },
      {
        label: 'Storage',
        value: 'Firebase Cloud Storage & Cloudinary'
      },
      {
        label: 'Navigation',
        value: 'React Navigation'
      }
    ]
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

    keyFeatures: [
      'Ai ChatBot with posts serach',
      'User-generated travel blogs',
      'Interactive map-based location tagging',
      'Rich text editor for storytelling',
      'Social features (Likes & Comments)',
      'Personalized travel feed',
      'Profile & Image gallery management'
    ],

    problem: 'Travel information for Sri Lanka is often scattered or overly commercial. Travelers lack a dedicated community platform to share authentic, personal experiences and discover hidden gems beyond standard tourist guides.',

    impact: 'Ceylon Trails fosters a community of explorers, promoting local tourism through authentic storytelling. It allows users to preserve their memories digitally while helping future travelers plan better trips based on real experiences.',

    architecture: [
      {
        label: 'Frontend',
        value: 'React.js'
      },
      {
        label: 'Backend',
        value: 'Node.js & Express'
      },
      {
        label: 'Database',
        value: 'MongoDB Atlas'
      },
      {
        label: 'Image Hosting',
        value: 'Cloudinary / AWS S3'
      },
      {
        label: 'Authentication',
        value: 'JWT & Google OAuth'
      },
      {
        label: 'External APIs',
        value: 'OpenAI Api'
      },
    ]
  },
  {
    id: 8,
    title: 'Launch Window V3',
    description: 'A comprehensive, next-generation spaceflight tracking and mission telemetry platform offering real-time updates on rocket launches, 3D satellite tracking, and spaceflight news.',
    image: launchWindow,
    tags: ['Next.js', 'React 19', 'Three.js', 'GSAP', 'MongoDB'],
    designLink: 'https://www.behance.net/gallery/238751997/LAUNCH-WINDOW',
    githubLink: 'https://github.com/Thimeth0013/launch-window',
    liveLink: 'https://launch-window-v3.vercel.app/',
    status: 'completed',

    keyFeatures: [
      'Real-Time Launch Tracking with interactive timeline engine',
      'Interactive 3D Satellite Tracking rendered with Three.js',
      'Automated background Scrub Detection',
      'Aggregated Spaceflight News Feed',
      'Direct YouTube Live Streams Integration',
      'Advanced server-side Caching Architecture',
      'Premium UI with GSAP scroll-driven animations'
    ],

    problem: 'Space enthusiasts lack a unified, high-performance platform that seamlessly combines real-time launch telemetry and aggregated news into a premium interface.',

    impact: 'Launch Window V3 centralizes all mission data in a buttery-smooth, visually stunning experience. Advanced caching ensures fast interactions and real-time accuracy without hitting public API rate limits.',

    architecture: [
      {
        label: 'Frontend',
        value: 'Next.js 16, React 19, Tailwind CSS v4'
      },
      {
        label: 'Animations & 3D',
        value: 'GSAP, Lenis, Three.js & OGL'
      },
      {
        label: 'Backend & Database',
        value: 'Next.js API Routes, MongoDB (Mongoose 9)'
      },
      {
        label: 'Data Fetching',
        value: 'Axios, Automated Background Schedulers'
      },
      {
        label: 'External APIs',
        value: 'The Space Devs, N2YO, Spaceflight News, NASA, YouTube'
      }
    ]
  },
  {
    id: 9,
    title: 'AI-Enabled Smart Healthcare Platform',
    description: 'A fully containerized, cloud-native healthcare platform built with a robust Microservices Architecture consisting of 8 independent services to facilitate doctor appointments, video consultations, and AI-based health triage.',
    image: healthCare,
    tags: ['Microservices', 'RabbitMQ', 'Docker', 'Kubernetes'],
    designLink: 'https://stitch.withgoogle.com/projects/4366701402330493736',
    githubLink: 'https://github.com/Y3S2-SE/smart-healthcare-platform',
    liveLink: '',
    status: 'completed',

    keyFeatures: [
      '8 Independent Microservices (Auth, Patient, Doctor, Appointment, Telemedicine, Payment, AI Triage, API Gateway)',
      'Auth Service: Role-based access control (RBAC) using JWT',
      'Patient & Doctor Services: Profiles, medical reports, and registration verification',
      'Appointment & Payment Services: Real-time scheduling and Stripe/PayHere integration',
      'Telemedicine Service: Secure video session token generation',
      'AI Symptom Checker: NLP-based triage service for health suggestions',
      'Centralized API Gateway routing for an asynchronous React dashboard'
    ],

    problem: 'Traditional healthcare platforms often rely on monolithic architectures that are hard to scale and lack a centralized solution combining appointments, video consultations, and intelligent triage systems.',

    impact: 'The platform utilizes a highly scalable and resilient microservices architecture, isolating distinct business domains. This ensures zero-downtime scalability for individual services and streamlines the healthcare experience for all users.',

    architecture: [
      {
        label: 'System Design',
        value: 'Microservices Architecture (8 distributed services)'
      },
      {
        label: 'Backend',
        value: 'Node.js (Express), Python (Flask for AI)'
      },
      {
        label: 'Frontend',
        value: 'React.js'
      },
      {
        label: 'Databases',
        value: 'MongoDB & PostgreSQL'
      },
      {
        label: 'Containerization',
        value: 'Docker & Kubernetes (K8s)'
      },
      {
        label: 'Communication',
        value: 'RESTful APIs & Asynchronous Messaging'
      }
    ]
  },
  {
    id: 10,
    title: 'Gamified Savings Coach for Low-Income Youth',
    description: 'A full-stack web application designed to provide gamified financial literacy coaching specifically for low-income youth, helping them develop healthy savings habits.',
    image: moneyMentor,
    tags: ['React', 'Node.js', 'MongoDB', 'Express'],
    designLink: '',
    githubLink: 'https://github.com/Y3S2-SE/money-mentor.git',
    liveLink: 'https://money-mentor-v1.vercel.app/',
    status: 'completed',

    keyFeatures: [
      'Income & expense tracker with real-time currency conversion',
      'Gamification engine with XP-based leveling, daily streaks, and badges',
      'Knowledge Hub with finance courses, quizzes, and an AI financial advisor',
      'Groups & chat feature for community collaboration and messaging'
    ],

    problem: 'Low-income youth often lack engaging tools and foundational knowledge to develop healthy saving habits and financial literacy.',

    impact: 'MoneyMentor transforms financial education into an interactive, gamified experience, motivating users to achieve savings goals through structured courses, AI-driven advice, and peer support.',

    architecture: [
      {
        label: 'Frontend',
        value: 'React v19, Tailwind CSS v4, Mantine, Redux Toolkit'
      },
      {
        label: 'Backend',
        value: 'Node.js, Express.js v5'
      },
      {
        label: 'Database',
        value: 'MongoDB with Mongoose'
      },
      {
        label: 'Authentication',
        value: 'JWT, bcryptjs'
      },
      {
        label: 'Real-time & AI',
        value: 'WebSocket (ws), Google Generative AI (Gemini)'
      }
    ]
  }
];

export default projectsData;
import vehicleService from '../assets/projects/vehicleService.webp';
import portfolio from '../assets/projects/portfolio.webp';
import homekeep from '../assets/projects/homekeep.webp';
import cocktails from '../assets/projects/gsapCocktails.webp';
import smartSpend from '../assets/projects/smartSpend.webp';
import ceylonTrails from '../assets/projects/ceylonTrails.webp';
import safeCert from '../assets/projects/safecert.webp';
import launchWindow from '../assets/projects/launchWindow.webp';

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
    title: 'Launch Window',
    description: 'A centralized platform for discovering rocket launches, Launch Window automatically aggregates live streams from YouTube, creating a single hub for space enthusiasts.',
    image: launchWindow,
    tags: ['Node.js', 'React', 'MongoDB', 'Express'],
    designLink: 'https://www.behance.net/gallery/238751997/LAUNCH-WINDOW',
    githubLink: 'https://github.com/Thimeth0013/launch-window',
    liveLink: 'https://launch-window-ochre.vercel.app/',
    status: 'ongoing',
    
    keyFeatures: [
      'Real-time launch countdown and tracking',
      'Automatic YouTube live stream aggregation',
      'Mission details and rocket specifications',
      'Launch success probability indicators',
    ],
    
    problem: 'Space enthusiasts struggle to find live streams and accurate information about rocket launches across multiple sources. Information is scattered across various websites, social media, and YouTube channels, making it difficult to stay updated on upcoming launches.',
    
    impact: 'Launch Window consolidates all launch information in one place, providing real-time updates and automatic stream detection. Users can now easily track launches, watch live streams, and access comprehensive mission data without searching multiple platforms.',
    
    architecture: [
      {
        label: 'Frontend',
        value: 'React with TailwindCSS'
      },
      {
        label: 'Backend',
        value: 'Node.js & Express'
      },
      {
        label: 'Database',
        value: 'MongoDB for launch data and user preferences'
      },
      {
        label: 'External APIs',
        value: 'YouTube Data API, Launch Library 2'
      },
      {
        label: 'Deployment',
        value: 'Vercel (Frontend) + Railway (Backend)'
      }
    ]
  },
];

export default projectsData;
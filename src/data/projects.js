// Import project images
import vehicleService from '../assets/projects/vehicleService.png';
import portfolio from '../assets/projects/portfolio.png';
import homekeep from '../assets/projects/homekeep.png';
import cocktails from '../assets/projects/gsapCocktails.png';

export const projectsData = [
  {
    id: 1,
    title: 'Vehicle Service Center Management System',
    description: 'A MERN-based platform to manage vehicle service bookings, track repair status, and streamline customer interactions.',
    image: vehicleService,
    tags: ['Node.js', 'React', 'MongoDB', 'Express'],
    designLink: 'https://www.behance.net/gallery/225208747/FixMate-Vehicle-Service-Center-Website',
    githubLink: 'https://github.com/Thimeth0013/IT-Project-2025',
    liveLink: '',
  },
  {
    id: 2,
    title: 'My Website',
    description: 'A fast and responsive developer portfolio built with React, Tailwind CSS, and Vite — designed to showcase projects, technical skills, and design philosophy with smooth animations and clean UI.',
    image: portfolio,
    tags: ['React', 'TailwindCSS', 'Vite'],
    designLink: 'https://www.behance.net/gallery/228890885/My-Portfolio',
    githubLink: 'https://github.com/Thimeth0013/thimeth-sathmika',
    liveLink: 'https://thimeth0013.github.io/thimeth-sathmika/',
  },
  {
    id: 3,
    title: 'Mojito Cocktails',
    description: 'An animated and visually rich website built with React, Tailwind CSS, Vite, and GSAP — my first project using GSAP to explore advanced frontend animations.',
    image: cocktails,
    tags: ['React', 'TailwindCSS', 'Vite', 'GSAP Animations'],
    designLink: 'https://www.figma.com/design/MByXaI8pcleIbgTvsDat1X/Cocktail-GSAP-Website?node-id=0-1&p=f&t=N6byExgZAx0K0dba-0',
    githubLink: 'https://github.com/Thimeth0013/gsap-cocktails',
    liveLink: 'https://gsap-cocktails-topaz.vercel.app/#home',
  },
  {
    id: 4,
    title: 'Home Keep',
    description: 'Home Keep is a professionally designed app built in Figma to simplify and streamline home maintenance, helping you keep your home in top shape with ease.',
    image: homekeep,
    tags: ['Figma'],
    designLink: 'https://www.behance.net/gallery/225180721/Home-Keep',
    githubLink: '',
    liveLink: '',
  },
];

/*
HOW TO ADD A NEW PROJECT:
1. Import your project image at the top of this file
2. Add a new object to the projectsData array with the following structure:
   {
     id: [unique_number],
     title: 'Your Project Title',
     description: 'Brief description of your project',
     image: [imported_image_variable],
     tags: ['Tag1', 'Tag2', 'Tag3'],
     designLink: 'https://your-design-link.com' or '#' if not available,
     githubLink: 'https://github.com/your-repo' or '' if not available,
     liveLink: 'https://your-live-demo.com' or '' if not available,
   }

HOW TO REMOVE A PROJECT:
Simply delete the corresponding object from the projectsData array.

NOTES:
- Each project must have a unique id
- Use '#' for designLink if not available (will be filtered out)
- Use empty string '' for githubLink and liveLink if not available
- Tags should be an array of strings
- Make sure to import your image file at the top if adding new projects
*/
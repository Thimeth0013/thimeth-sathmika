import html from '../assets/skills/html.svg';
import css from '../assets/skills/css.svg';
import php from '../assets/skills/php.svg';
import git from '../assets/skills/git.svg';
import javascript from '../assets/skills/javascript.svg';
import typescript from '../assets/skills/typescript.svg';
import react from '../assets/skills/react.svg';
import nodejs from '../assets/skills/nodejs.svg';
import expressjs from '../assets/skills/expressjs.svg';
import mongodb from '../assets/skills/mongodb.svg';
import tailwindcss from '../assets/skills/tailwindcss.svg';
import bootstrap from '../assets/skills/bootstrap.svg';
import figma from '../assets/skills/figma.svg';
import photoshop from '../assets/skills/photoshop.svg';
import kotlin from '../assets/skills/kotlin.svg';
import vite from '../assets/skills/vite.svg';
import postman from '../assets/skills/postman.svg';
import mysql from '../assets/skills/mysql.svg';
import java from '../assets/skills/java.svg';
import expo from '../assets/skills/expo.svg';
import docker from '../assets/skills/docker.svg';
import nginx from '../assets/skills/nginx.svg';
import gsap from '../assets/skills/gsap.svg';
import motions from '../assets/skills/motion.svg';
import swagger from '../assets/skills/swagger.svg';
import postgress from '../assets/skills/postgress.svg';
import rabbitmq from '../assets/skills/rabbitmq.svg';
import nest from '../assets/skills/nest.svg';

// Skills: shown by the Skills scene in the hero's pinned scroll (SkillsScene.jsx).
// Skill name -> icon. Declaration order is the order icons appear in the sphere.
export const skillIcons = {
  'HTML': html,
  'CSS': css,
  'PHP': php,
  'Git': git,
  'JavaScript': javascript,
  'React': react,
  'Node.js': nodejs,
  'Express': expressjs,
  'MongoDB': mongodb,
  'Tailwind CSS': tailwindcss,
  'Bootstrap': bootstrap,
  'Figma': figma,
  'Photoshop': photoshop,
  'TypeScript': typescript,
  'Vite': vite,
  'Postman': postman,
  'MySQL': mysql,
  'Java': java,
  'Kotlin': kotlin,
  'Expo': expo,
  'Docker': docker,
  'Nginx': nginx,
  'GSAP': gsap,
  'Motion': motions,
  'Swagger': swagger,
  'PostgreSQL': postgress,
  'RabbitMQ': rabbitmq,
  'Nest.js': nest,
};

export const skillImages = Object.values(skillIcons);

// Skill name -> index in skillImages (for turning the sphere to a skill's icon).
export const skillToIconIndex = Object.fromEntries(Object.keys(skillIcons).map((name, index) => [name, index]));

export const skillCategories = [
  {
    category: 'Frontend & Mobile',
    items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'React Native', 'Expo', 'Kotlin', 'Tailwind CSS', 'Bootstrap', 'Motion', 'GSAP'],
  },
  {
    category: 'Backend & APIs',
    items: ['Node.js', 'Express', 'Nest.js', 'PHP', 'Java'],
  },
  {
    category: 'Databases',
    items: ['MongoDB', 'MySQL', 'PostgreSQL'],
  },
  {
    category: 'DevOps & Tooling',
    items: ['Docker', 'Nginx', 'Git', 'Vite', 'RabbitMQ', 'Swagger', 'Postman'],
  },
  {
    category: 'Design',
    items: ['Figma', 'Photoshop'],
  },
];

import { createContext, useContext } from 'react';
import { CirclePlay, Github, Globe, Palette } from 'lucide-react';

// Shared by the project details view (ProjectView.jsx) and the project cards (ProjectCard.jsx).

// open(project, cardElement, focusElement): provided by <ProjectViewProvider>.
export const ProjectViewContext = createContext(() => {});
export const useProjectView = () => useContext(ProjectViewContext);

// The separate "All work" page (work/index.html). The base may lack its trailing slash.
export const ALL_WORK = `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}work/`;

// A project's links, in the order they are shown (`key` is the field in projects.js).
export const LINKS = [
  { key: 'liveLink', label: 'Live demo', Icon: Globe },
  { key: 'videoLink', label: 'Walkthrough video', Icon: CirclePlay },
  { key: 'githubLink', label: 'Code', Icon: Github },
  { key: 'designLink', label: 'Design', Icon: Palette },
];

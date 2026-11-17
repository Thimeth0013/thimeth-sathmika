import { useRef } from 'react';
import { LINKS, useProjectView } from './projectView';

// A project's image as a card: used by Featured Work (WorkScene.jsx) and the All work grid
// (sections/Project.jsx). Pressing it opens the project's details, which grow out of this card
// (ProjectView.jsx). There is no zoom on hover; instead the project's links (live demo, code, design:
// whichever it has) show as round icon buttons in the top right corner, on hover or keyboard focus, and
// always on touch screens (which have no hover).
//
// `children` is laid over the image, under the button (e.g. Featured Work's title on a gradient).
export const ProjectThumb = ({ project, className = '', children }) => {
  const open = useProjectView();
  const cardRef = useRef(null);
  const buttonRef = useRef(null);
  const links = LINKS.filter(({ key }) => project[key]);
  return (
    <div ref={cardRef} className={`group relative overflow-hidden rounded-[18px] bg-forest/10 ${className}`}>
      <img src={project.image} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
      {children}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => open(project, cardRef.current, buttonRef.current)}
        aria-label={`${project.title}: view details`}
        className="absolute inset-0 cursor-pointer rounded-[18px] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
      />
      {links.length > 0 && (
        <ul className="absolute right-3 top-3 flex gap-1.5 opacity-0 transition-opacity duration-200 ease-out group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:none)]:opacity-100">
          {links.map((link) => {
            const { key, label } = link;
            const Icon = link.Icon;
            return (
            <li key={key}>
              <a
                href={project[key]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title}: ${label}`}
                title={label}
                className="grid size-10 place-items-center rounded-full bg-white/90 text-forest shadow-[0_6px_18px_-8px_rgb(10_40_22/0.6)] backdrop-blur-sm transition-[background-color,scale] duration-150 ease-out hover:bg-white active:scale-[0.94]"
              >
                <Icon aria-hidden="true" strokeWidth={1.75} className="size-[18px]" />
              </a>
            </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

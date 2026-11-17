import { IconStream } from './IconStream';
import { skillIcons } from '../data/skills';

// The Skills scene, after About in the hero's pinned scroll, on the white the sky fades into: the skill
// icons stream out of the middle of the screen as you scroll (IconStream); hover one to see its name.
// The hero's scroll hook (useFlyThrough in Home.jsx) drives the stream through `control`.
const ITEMS = Object.entries(skillIcons).map(([name, src]) => ({ name, src }));

export const SkillsScene = ({ control }) => (
  <div className="h-full w-full">
    <IconStream items={ITEMS} control={control} />
  </div>
);

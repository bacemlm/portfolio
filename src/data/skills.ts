// Only tools shown on the previous portfolio or listed in its README appear here.
// There are no percentage bars: each card says where the tool is actually used.

export interface Skill {
  name: string;
  /** Key in images.json for the logo, when one exists in the original assets. */
  icon?: string;
  /** Two-letter fallback when there is no logo file. */
  mark?: string;
  note: string;
}

export interface SkillGroup {
  id: string;
  label: string;
  blurb: string;
  skills: Skill[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    label: 'Frontend Development',
    blurb: 'Responsive websites written by hand, from structure to interaction.',
    skills: [
      { name: 'HTML5', icon: 'html', note: 'Semantic structure behind HdiaCamp, ASKJ and EDUKID.' },
      { name: 'CSS3', icon: 'css', note: 'Layouts, responsive design and animation, without a framework.' },
      { name: 'JavaScript', icon: 'js', note: 'Interactions, navigation and the quiz logic in EDUKID.' },
      { name: 'Sass / SCSS', icon: 'sass', note: 'Variables and nesting to keep larger stylesheets tidy.' },
      { name: 'Responsive Design', mark: 'RD', note: 'Every site is built to work from phone to desktop.' },
    ],
  },
  {
    id: 'uiux',
    label: 'UI/UX Design',
    blurb: 'Interfaces designed around a simple, clear user flow.',
    skills: [
      { name: 'Figma', icon: 'figma', note: 'Where KIDORA and Panorama were designed and prototyped.' },
      { name: 'Interface Design', mark: 'UI', note: 'Screens, components and visual hierarchy for mobile apps.' },
      { name: 'Prototyping', mark: 'PR', note: 'Clickable flows to test an idea before building it.' },
      { name: 'UI Documentation', mark: 'DO', note: 'Notes and specs that make a design easy to hand over.' },
    ],
  },
  {
    id: 'graphic',
    label: 'Graphic Design',
    blurb: 'Logos, kits, posters and social content with a consistent identity.',
    skills: [
      { name: 'Photoshop', icon: 'psd', note: 'Mockups, posters and social media visuals.' },
      { name: 'Illustrator', icon: 'illustrator', note: 'Vector logos and the BL-Services identity.' },
      { name: 'InDesign', icon: 'indesign', note: 'Multi-page layouts and print-ready documents.' },
      { name: 'Branding & Identity', mark: 'ID', note: 'Logo, palette and guidelines designed as one system.' },
    ],
  },
  {
    id: 'tools',
    label: 'Creative Tools',
    blurb: 'The everyday toolkit around design and code.',
    skills: [
      { name: 'After Effects', mark: 'Ae', note: 'Motion graphics for visual content.' },
      { name: 'Canva', icon: 'canva', note: 'Fast social media content and templates.' },
      { name: 'VS Code', icon: 'vscode', note: 'My editor for every development project.' },
    ],
  },
  {
    id: 'other',
    label: 'Other',
    blurb: 'Also part of my technical toolkit.',
    skills: [{ name: 'PHP', icon: 'php', note: 'Server-side scripting basics for dynamic pages.' }],
  },
];

// Everything here comes from the previous portfolio and its README.
// Nothing is invented: if a fact is missing, it is left out rather than guessed.

export const profile = {
  name: 'Bacem Lamloumi',
  firstName: 'Bacem',
  title: 'Frontend Developer & Graphic Designer',
  roles: ['Frontend Developer', 'Graphic Designer', 'UI/UX Enthusiast', 'Brand Identity Designer'],
  location: 'Medenine, Tunisia',
  email: 'lamloumibacem@gmail.com',
  phone: '+216 27 357 191',
  phoneHref: 'tel:+21627357191',
  siteUrl: 'https://bacemlm.github.io/portfolio/',
  intro:
    'I design and build for the web. From the first sketch in Figma to the last line of CSS, I care about interfaces that look sharp, load fast and feel natural to use.',
  bio: [
    'I work where development meets visual design. With a background in information technology, I build responsive, modern websites with HTML, CSS and JavaScript, and I design logos, posters, social media content and UI/UX interfaces in Photoshop, Illustrator and Figma.',
    'As Media Officer for a football club, I managed social media, created the visual content and worked on fan engagement. My time with the Tunisian Scouts and JCI Médenine (Junior Cell) taught me leadership, teamwork and what community service asks of you.',
    'I am motivated, creative and organized, and I like learning new technologies. My goal is to keep growing in web development, UI/UX design and digital communication, and to deliver high-quality work on every project I take on.',
  ],
} as const;

export type SocialId = 'github' | 'linkedin' | 'behance' | 'instagram' | 'facebook';

export const socials: { id: SocialId; label: string; handle: string; href: string }[] = [
  { id: 'github', label: 'GitHub', handle: 'bacemlm', href: 'https://github.com/bacemlm' },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    handle: 'Bacem Lamloumi',
    href: 'https://www.linkedin.com/in/bacem-lamloumi-3b0139399/',
  },
  { id: 'behance', label: 'Behance', handle: 'bacemlamloumi', href: 'https://www.behance.net/bacemlamloumi' },
  { id: 'instagram', label: 'Instagram', handle: 'bacem_lm', href: 'https://www.instagram.com/bacem_lm/' },
  { id: 'facebook', label: 'Facebook', handle: 'BacemLm', href: 'https://www.facebook.com/BacemLm' },
];

export const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
] as const;

export const strengths = [
  { title: 'Creative', text: 'A designer’s eye on every screen I build.' },
  { title: 'Organized', text: 'Clear structure, in files and in process.' },
  { title: 'Team player', text: 'Shaped by scouting and JCI Médenine.' },
  { title: 'Always learning', text: 'Eager to pick up new technologies.' },
];

export const interests = ['Web development', 'UI/UX design', 'Brand identity', 'Sports graphics', 'Digital communication'];

export const specializations = [
  'HTML & CSS',
  'JavaScript',
  'UI/UX Design',
  'Brand Identity',
  'Motion Graphics',
  'Adobe Creative Suite',
];

export type TimelineKind = 'education' | 'certificate' | 'experience' | 'community';

export interface TimelineEntry {
  kind: TimelineKind;
  year?: string;
  title: string;
  org?: string;
  text?: string;
  href?: string;
}

export const timeline: TimelineEntry[] = [
  {
    kind: 'education',
    year: '2025',
    title: 'Bachelor of Computer Science',
    text: 'Degree in computer science, the technical base under my development work.',
  },
  {
    kind: 'certificate',
    year: '2025',
    title: 'JavaScript Essential Training',
    org: 'LinkedIn Learning',
    href: 'https://www.linkedin.com/learning/certificates/ea70e58fc16a864a5b4ff78298a3e60e8357364f479d0fab85146727d710fd76',
  },
  {
    kind: 'certificate',
    year: '2025',
    title: 'EF SET English Certificate — C1',
    org: 'EF SET',
    href: 'https://cert.efset.org/en/5WToHy',
  },
  {
    kind: 'certificate',
    year: '2023',
    title: 'Introduction to CSS',
    org: 'Sololearn',
    href: 'https://www.sololearn.com/certificates/CC-RJZGMGFD',
  },
  {
    kind: 'certificate',
    year: '2023',
    title: 'Introduction to HTML',
    org: 'Sololearn',
    href: 'https://www.sololearn.com/certificates/CC-FWKCHX9N',
  },
  {
    kind: 'experience',
    title: 'Media Officer',
    org: 'Football club',
    text: 'Managed social media, created visual content and improved fan engagement.',
  },
  {
    kind: 'community',
    title: 'Member',
    org: 'Tunisian Scouts & JCI Médenine (Junior Cell)',
    text: 'Leadership, teamwork and community service.',
  },
];

export const certificates = timeline.filter((entry) => entry.kind === 'certificate');

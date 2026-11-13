// Project content is limited to what the previous portfolio, its README and the
// live project sites themselves show. No results, clients or metrics are invented.

export const categories = ['Development', 'UI/UX', 'Graphic Design', 'Branding'] as const;
export type Category = (typeof categories)[number];

export interface ProjectImage {
  /** Key in src/data/images.json (file name in assets-src without extension). */
  name: string;
  alt: string;
  caption?: string;
}

export interface Project {
  slug: string;
  title: string;
  kicker: string;
  categories: Category[];
  summary: string;
  overview: string[];
  /** What was actually delivered, as visible in the work itself. */
  delivered: string[];
  stack: string[];
  cover: ProjectImage;
  gallery?: ProjectImage[];
  /** How the cover sits in its frame: screenshots are cropped, artwork is shown whole. */
  fit?: 'cover' | 'contain';
  /** Background behind `contain` covers, sampled from the artwork. */
  tone?: string;
  live?: string;
  repo?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: 'hdiacamp',
    title: 'HdiaCamp',
    kicker: 'Martial arts club website',
    categories: ['Development'],
    summary:
      'A modern, responsive website for a martial arts club, built to present its programs, schedule and coaches clearly.',
    overview: [
      'HdiaCamp is the website of a martial arts club. The goal was an intuitive experience with a sleek, responsive design: a visitor should understand what the club offers and how to join within a few seconds.',
      'The site opens on a bold hero, then walks through the club’s story and mission, its training programs, the weekly schedule, the coaching team and the contact details.',
    ],
    delivered: [
      'Single-page layout with Home, About, Programs, Schedule, Trainers and Contact sections',
      'Program cards for Kickboxing, Karate, Muay-Thai, Body Building and Fitness',
      'Trainer profiles and a clear “Join Now” call to action',
      'Contact block with location, phone, email and working hours',
      'Responsive layout and scroll interactions written in plain JavaScript',
    ],
    stack: ['HTML', 'CSS', 'JavaScript'],
    cover: {
      name: 'hdiacamp',
      alt: 'HdiaCamp homepage: a dark hero with the headline “Train hard. Fight easy.” over a photo of the club’s fighters.',
    },
    live: 'https://bacemlm.github.io/hdiaCamp/',
    repo: 'https://github.com/bacemlm/hdiaCamp',
    featured: true,
  },
  {
    slug: 'askj',
    title: 'ASKJ',
    kicker: 'Boxing club website',
    categories: ['Development'],
    summary:
      'A dynamic, user-friendly website for promoting a boxing club, with quick access to its classes, coaches and location.',
    overview: [
      'ASKJ is the website of Ksar Jdid Sports Association, a combat sports club. It gives the club a home online where people can discover its disciplines and find out how to get in touch.',
      'The page is built around a strong hero message and a simple top navigation, so each section is one click away.',
    ],
    delivered: [
      'Hero section with a direct “Join now” call to action',
      'About, Classes, Trainers, Location and Contact sections',
      'Class presentation for Kick Boxing and Kung-Fu',
      'Location and contact details, plus a newsletter sign-up in the footer',
      'Responsive layout in HTML, CSS and JavaScript',
    ],
    stack: ['HTML', 'CSS', 'JavaScript'],
    cover: {
      name: 'askj',
      alt: 'ASKJ homepage: the headline “Every punch brings you closer to your goal” over a photo of a boxing ring crowd.',
    },
    live: 'https://bacemlm.github.io/askj/',
    repo: 'https://github.com/bacemlm/askj',
    featured: true,
  },
  {
    slug: 'asbk-jerseys',
    title: 'ASBK Jersey Designs',
    kicker: 'Official football kits',
    categories: ['Graphic Design', 'Branding'],
    summary:
      'The official match kits for Association Sportive Beni Khedache: first kit, second kit and goalkeeper kit.',
    overview: [
      'I had the opportunity to design the new official jerseys for Association Sportive Beni Khedache (ASBK). The set covers three kits that had to feel like one family while staying easy to tell apart on the pitch.',
      'Each kit is presented as a full mockup with shirt front and back, shorts, socks, crest and sponsor placement.',
    ],
    delivered: [
      'First kit: navy shirt with white trim and a tonal pattern on the sleeves',
      'Second kit: light grey shirt with a green central stripe',
      'Goalkeeper kit: yellow shirt with navy details',
      'Number and name styling, crest and sponsor placement on every kit',
      'Presentation mockups for each kit',
    ],
    stack: ['Sports design', 'Apparel design', 'Mockups'],
    cover: {
      name: 'kit1',
      alt: 'ASBK first kit mockup: navy shirt with white trim, number 10, shown with shorts, socks and a ball.',
      caption: 'First kit',
    },
    gallery: [
      {
        name: 'kit2',
        alt: 'ASBK second kit mockup: light grey shirt with a green central stripe, number 10.',
        caption: 'Second kit',
      },
      {
        name: 'goalkeeperV1',
        alt: 'ASBK goalkeeper kit mockup: yellow shirt with navy details, number 1.',
        caption: 'Goalkeeper kit',
      },
    ],
    featured: true,
  },
  {
    slug: 'kidora',
    title: 'KIDORA',
    kicker: 'Educational app · UI/UX',
    categories: ['UI/UX'],
    summary: 'Complete UI/UX design for an educational mobile app, with a focus on simplicity and a clear user flow.',
    overview: [
      'KIDORA is a mobile app concept for education. I designed the full interface in Figma, from the splash screen to the everyday screens, keeping every step short and easy to read.',
      'The visual language is soft and friendly: rounded cards, a warm coral accent and plenty of white space.',
    ],
    delivered: [
      'Complete mobile UI designed in Figma',
      'Screens for activities, evaluation, summary, messages and payment',
      'A consistent component style: cards, buttons and icons',
      'Clickable prototype of the main flow',
    ],
    stack: ['Figma', 'UI/UX', 'Prototyping'],
    cover: {
      name: 'kidora',
      alt: 'KIDORA app mockups: several phone screens on a coral background, with the KIDORA logo screen in the centre.',
    },
  },
  {
    slug: 'panorama',
    title: 'Panorama',
    kicker: 'Food app · UI/UX',
    categories: ['UI/UX'],
    summary: 'Complete UI/UX design for a restaurant-focused food app with a fresh, modern colour scheme.',
    overview: [
      'Panorama is a mobile UI for ordering food. The design is built around one confident green, large food photography and a simple path from login to choosing a dish.',
    ],
    delivered: [
      'Login and sign-up screens',
      'Home screen with search, categories and dish cards',
      'A bright green visual identity carried across every screen',
      'Designed and prototyped in Figma',
    ],
    stack: ['Figma', 'UI/UX', 'Prototyping'],
    cover: {
      name: 'panorama',
      alt: 'Panorama food app mockups: login screen, green splash screen and a menu screen with burger cards.',
    },
  },
  {
    slug: 'edukid',
    title: 'EDUKID',
    kicker: 'Quiz game for kids',
    categories: ['Development'],
    summary: 'A playful educational quiz game, built for the browser, that helps kids grow their knowledge.',
    overview: [
      'EDUKID (“Learning and Playing”) is a quiz game for children that runs in the browser. Kids start from a simple home screen and answer questions while they play.',
      'I built the game with plain HTML, CSS and JavaScript and gave it a colourful, friendly identity.',
    ],
    delivered: [
      'Start screen, game interface and quiz logic in JavaScript',
      'Arabic-language interface for young players',
      'Colourful visual identity and logo',
      'Published on GitHub Pages',
    ],
    stack: ['HTML', 'CSS', 'JavaScript'],
    cover: {
      name: 'edukid',
      alt: 'EDUKID logo: three cartoon children playing under a rainbow, with the words “EDUKID — Learning and Playing”.',
    },
    fit: 'contain',
    tone: '#8c52ff',
    live: 'https://bacemlm.github.io/edukid/',
    repo: 'https://github.com/bacemlm/edukid',
  },
  {
    slug: 'bl-services',
    title: 'BL-Services',
    kicker: 'Brand identity',
    categories: ['Branding', 'Graphic Design'],
    summary: 'A complete brand identity for a company: logo, colour palette and guidelines.',
    overview: [
      'BL-Services needed an identity it could use everywhere. I designed a geometric monogram built from the letters B and L, in a strict black and red palette, with the wordmark set underneath.',
    ],
    delivered: [
      'Logo design: geometric BL monogram and wordmark',
      'Black, red and white colour palette',
      'Brand guidelines',
      'Paper mockup presentation',
    ],
    stack: ['Illustrator', 'Photoshop', 'Logo design'],
    cover: {
      name: 'blservices',
      alt: 'BL-Services logo printed on textured white paper: a black and red geometric BL monogram.',
    },
  },
];

export const projectBySlug = (slug: string | null) => projects.find((project) => project.slug === slug);

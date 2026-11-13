export interface Service {
  id: string;
  title: string;
  /** What the client actually gets, in one sentence. */
  value: string;
  includes: string[];
  /** Value for the contact form's "service" field. */
  formValue: string;
}

export const services: Service[] = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    value: 'A fast, responsive website that works on every screen and is easy to keep up to date.',
    includes: ['HTML & CSS development', 'Responsive web design', 'JavaScript interactions', 'Performance optimization'],
    formValue: 'Frontend Development',
  },
  {
    id: 'uiux',
    title: 'UI/UX Design',
    value: 'Interfaces people understand at first glance, designed and prototyped before a single line of code.',
    includes: ['User interface design', 'User experience redesign', 'Prototyping in Figma'],
    formValue: 'UI/UX Design',
  },
  {
    id: 'brand',
    title: 'Brand Identity',
    value: 'A logo and visual system you can use everywhere, from your storefront to your social profiles.',
    includes: ['Logo design', 'Colour palette & typography', 'Brand guidelines', 'Marketing materials'],
    formValue: 'Brand Identity',
  },
  {
    id: 'graphic',
    title: 'Graphic Design',
    value: 'Visuals that get noticed and still look like you: posters, social content and sports kits.',
    includes: ['Posters & social media content', 'Sports kits & jersey design', 'Presentation mockups'],
    formValue: 'Graphic Design',
  },
];

# Bacem Lamloumi — Portfolio

Personal portfolio of **Bacem Lamloumi**, frontend developer and graphic designer based in Medenine, Tunisia.

**Live site:** https://bacemlm.github.io/portfolio/

A single-page site with a prerendered hero, an interactive canvas visual, a filterable project showcase with case-study dialogs, and a dark and light theme.

## Stack

| Area | Choice |
| --- | --- |
| Framework | React 19 + TypeScript, built with Vite |
| Styling | Tailwind CSS 4, design tokens as CSS variables in `src/index.css` |
| Animation | Motion for component animation, GSAP ScrollTrigger for scroll-linked effects, Lenis for smooth scrolling on desktop |
| Icons | lucide-react, plus hand-drawn brand icons in `src/components/ui/BrandIcon.tsx` |
| Fonts | Geist, Geist Mono and Space Grotesk, self-hosted through Fontsource |

There is no 3D engine and no component library. The hero sphere is a small Canvas 2D drawing.

## Run it locally

Requires Node.js 22 or newer.

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:5173/portfolio/.

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Type-check, build to `dist/`, then prerender the hero into `dist/index.html` |
| `npm run preview` | Serve the production build locally |
| `npm run images` | Regenerate the optimized images in `public/img/` from `assets-src/` |
| `npm run social` | Regenerate `public/og.png` and `public/apple-touch-icon.png` |
| `npm run typecheck` | TypeScript only |

## Deploy to GitHub Pages

The site is built for the `/portfolio/` path (see `base` in `vite.config.ts`).

1. Push this project to the `main` branch of `bacemlm/portfolio`.
2. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**. This is a one-time change: the old site was served straight from the branch, and this one needs a build step.
3. The workflow in `.github/workflows/deploy.yml` builds and publishes on every push to `main`.

To host it somewhere else, set the base path at build time, for example `VITE_BASE=/ npm run build`.

## Contact form

By default the form opens the visitor's email app with the message filled in. Nothing is sent from the page, and the form says so.

To deliver messages directly to your inbox:

1. Create a free access key at https://web3forms.com with your email address.
2. For local builds, copy `.env.example` to `.env` and set `VITE_WEB3FORMS_KEY`.
3. For the deployed site, add a repository secret named `VITE_WEB3FORMS_KEY` (**Settings → Secrets and variables → Actions**).

With a key, the form shows a loading state and reports the real result of the request. A hidden honeypot field and a minimum fill time filter out simple bots.

## Editing content

All text lives in `src/data/`. No component needs to change for a content update.

| File | Content |
| --- | --- |
| `profile.ts` | Name, intro, biography, contact details, social links, timeline, certificates |
| `projects.ts` | Projects, categories, case-study text, links, images |
| `skills.ts` | Skill groups and the note shown on each card |
| `services.ts` | Services and what each includes |

### Add a project

1. Put the original image in `assets-src/` (PNG or JPG, any size).
2. Run `npm run images`.
3. Add an entry to `projects` in `src/data/projects.ts`. The `name` of an image is its file name without the extension.

Set `featured: true` for the wide editorial layout. The case study opens at `?project=<slug>`, so it can be linked to directly.

## Project structure

```
assets-src/            Original artwork (source for the optimized images)
public/                Static files: optimized images, favicon, og.png, robots.txt, sitemap.xml
scripts/               Image optimization, social images, prerender
src/
  data/                All site content
  lib/                 Hooks, smooth scroll, GSAP setup, helpers
  components/
    layout/            Navigation, footer, scroll progress, cursor glow
    sections/          Hero, About, Skills, Projects, ProjectModal, Services, Contact
    ui/                Button, Picture, Reveal, Magnetic, SpotlightCard, icons
    BelowFold.tsx      Everything under the hero, loaded as a separate chunk
  App.tsx              Page shell and URL state for case studies
  entry-server.tsx     Build-time rendering of the hero
```

## How it loads

- The navigation and hero are rendered to HTML at build time, and the hero entrance animation is CSS, so the first screen appears before any JavaScript runs.
- The sections under the hero, with GSAP, are a separate chunk that loads after the first paint and mounts one section at a time.
- Lenis loads only on mouse or trackpad devices. Phones keep native scrolling.
- Images are served as AVIF with a WebP fallback at several widths, and load lazily below the fold.

## Accessibility and motion

- Skip link, landmarks, one `h1`, labelled form fields with inline error messages.
- Keyboard support for the navigation, mobile menu, skill tabs, project filters and case-study dialog (focus is trapped inside the dialog and returned on close).
- With `prefers-reduced-motion`, smooth scrolling, the rotating role, the cursor glow, parallax and the canvas animation are all off; content still fades in.
- Pointer effects (magnetic buttons, cursor glow, card spotlights) run only on devices with a mouse.

## What changed from the previous site

- Rebuilt from static HTML/CSS/JS into components, with all content in data files.
- Images went from 24 MB to about 2 MB.
- The contact form no longer shows a success message without sending anything.
- Dead `#` links on projects were removed. Projects with no live site show a case study instead.
- The "+∞ Happy Clients" and "+3 Years Experience" counters and the "Most Popular" badge were removed because nothing on the site backs them up.
- The three ASBK kits are one project with a gallery.
- Added a description, Open Graph tags, structured data, a sitemap and `robots.txt`.

## Known limitations and missing content

- **No profile photo.** The old site only had the BL monogram, so the About card uses a vector version of it.
- **No CV file.** There is no download button. Add the PDF to `public/` and a button can link to it.
- **Timeline gaps.** The degree has no institution, and the Media Officer role has no club name or dates, because the old site did not state them.
- **Availability.** No "available for freelance" badge is shown, since that was not confirmed.
- **EDUKID** uses its logo as the cover. There is no screenshot of the game in the original assets.
- **Case studies** describe what is visible in the work. They contain no results, metrics or client quotes.
- **Other repositories** on the GitHub profile (for example `onairgym`, `asbk.com`, `Scouts-Beni-khdache`) are not listed, because the old portfolio did not present them.
- **Performance on slow phones.** See the measurements below: the mobile score depends heavily on how much CPU is available.

## Measured results

Lighthouse against the production build served locally (`npm run preview`), November 2026.

| Run | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Desktop (3 runs) | 100 | 100 | 100 | 100 |
| Mobile, simulated throttling, idle machine (2 runs) | 99 | 100 | 100 | 100 |
| Mobile, simulated throttling, machine under load (4 runs) | 62–64 | 100 | 100 | 100 |
| Mobile, throttling applied for real (3 runs) | 59–69 | 100 | 100 | 100 |

First contentful paint was 0.8 s and layout shift was 0 in every simulated mobile run. What varies is blocking time while the lower sections mount, so a slow phone will show the hero quickly and then take longer to become fully interactive. These numbers are from a local server, not from GitHub Pages.

## License

Published for educational and personal inspiration. Commercial use is not allowed without permission.

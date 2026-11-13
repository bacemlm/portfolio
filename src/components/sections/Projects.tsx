import { ArrowUpRight, Maximize2 } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useRef, useState } from 'react';
import { categories, projects, type Category, type Project } from '../../data/projects';
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap';
import { cn } from '../../lib/utils';
import { BrandIcon } from '../ui/BrandIcon';
import { Picture } from '../ui/Picture';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

const EASE = [0.16, 1, 0.3, 1] as const;
type Filter = 'All' | Category;
const filters: Filter[] = ['All', ...categories];
const countFor = (filter: Filter) =>
  filter === 'All' ? projects.length : projects.filter((project) => project.categories.includes(filter)).length;

interface CardProps {
  project: Project;
  index: number;
  /** Large editorial layout (image beside text) vs. compact card. */
  large: boolean;
  flip: boolean;
  onOpen: (slug: string) => void;
}

function ProjectCard({ project, index, large, flip, onOpen }: CardProps) {
  const reduced = useReducedMotion();
  const contain = project.fit === 'contain';

  return (
    <article
      className={cn(
        'card group/card grid h-full overflow-hidden hover:border-line-strong',
        large && 'lg:grid-cols-12 lg:items-stretch',
      )}
    >
      <button
        type="button"
        onClick={() => onOpen(project.slug)}
        aria-label={`Open the ${project.title} case study`}
        className={cn(
          'relative block w-full overflow-hidden text-left outline-offset-[-4px]',
          large ? 'aspect-[16/10] lg:col-span-7 lg:aspect-auto lg:min-h-[27rem]' : 'aspect-[16/10]',
          large && flip && 'lg:order-2',
        )}
        style={contain ? { backgroundColor: project.tone } : undefined}
      >
        {/* Curtain reveal as the card scrolls into view. */}
        <motion.div
          className="absolute inset-0"
          initial={{ clipPath: reduced ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)' }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          {/* data-parallax is driven by GSAP; the inner picture handles the hover zoom. */}
          <div data-parallax={contain ? undefined : ''} className={cn('absolute', contain ? 'inset-0' : '-inset-y-[7%] inset-x-0')}>
            <Picture
              name={project.cover.name}
              alt={project.cover.alt}
              sizes={large ? '(min-width: 1024px) 58vw, 100vw' : '(min-width: 1024px) 46vw, 100vw'}
              className="size-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover/card:scale-[1.04]"
              imgClassName={contain ? 'object-contain p-[12%]' : 'object-cover'}
            />
          </div>
        </motion.div>

        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        />
        <span
          aria-hidden="true"
          className="glass absolute right-4 bottom-4 flex translate-y-2 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-fg opacity-0 transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)] group-hover/card:translate-y-0 group-hover/card:opacity-100 group-focus-visible/card:opacity-100"
        >
          <Maximize2 size={14} /> View case study
        </span>
      </button>

      <div className={cn('flex flex-col p-6 md:p-8', large && 'lg:col-span-5 lg:p-10', large && flip && 'lg:order-1')}>
        <p className="label-mono flex items-center justify-between gap-4 text-subtle">
          <span className="text-accent-text">{String(index + 1).padStart(2, '0')}</span>
          <span className="text-right">{project.categories.join(' · ')}</span>
        </p>

        <h3 className={cn('mt-6 font-semibold', large ? 'text-3xl md:text-[2.75rem] md:leading-[1.02]' : 'text-2xl md:text-3xl')}>
          {project.title}
        </h3>
        <p className="mt-2 text-accent-2-text">{project.kicker}</p>
        <p className="mt-4 leading-relaxed text-muted">{project.summary}</p>

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Stack">
          {project.stack.map((item) => (
            <li key={item} className="rounded-full border border-line bg-surface-2 px-3 py-1 font-mono text-xs text-muted">
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-1 pt-8">
          <button
            type="button"
            onClick={() => onOpen(project.slug)}
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium"
          >
            <span className="underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-accent">
              Case study
            </span>
            <span className="sr-only">: {project.title}</span>
          </button>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
            >
              Live site
              <span className="sr-only">: {project.title} (opens in a new tab)</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
            >
              <BrandIcon id="github" width={16} height={16} />
              Code
              <span className="sr-only">: {project.title} on GitHub (opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

interface ProjectsProps {
  onOpen: (slug: string) => void;
}

export function Projects({ onOpen }: ProjectsProps) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<Filter>('All');

  const visible = filter === 'All' ? projects : projects.filter((project) => project.categories.includes(filter));

  // Image parallax. Rebuilt whenever the filter changes the set of cards.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference) and (min-width: 768px)', () => {
        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((layer) => {
          gsap.fromTo(
            layer,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: 'none',
              scrollTrigger: { trigger: layer.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          );
        });
      });
      // Cards animate into their new positions first; measure once they have settled.
      const id = window.setTimeout(() => ScrollTrigger.refresh(), 700);
      return () => window.clearTimeout(id);
    },
    { scope: root, dependencies: [filter], revertOnUpdate: true },
  );

  return (
    <section ref={root} id="work" aria-labelledby="work-title" className="relative py-24 outline-none md:py-36">
      <div className="container-x">
        <SectionHeading
          index="03"
          label="Featured Projects"
          id="work-title"
          title="Selected work, in code and in pixels."
          lead="Websites I built, interfaces I designed and identities I drew. Open any project for the full case study."
        />

        <Reveal>
          <div
            role="group"
            aria-label="Filter projects by category"
            className="-mx-1 mb-10 flex gap-1 overflow-x-auto px-1 pb-2 [scrollbar-width:none]"
          >
            {filters.map((item) => {
              const selected = item === filter;
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setFilter(item)}
                  className={cn(
                    'relative flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm whitespace-nowrap transition-colors duration-300',
                    selected ? 'text-bg' : 'text-muted hover:text-fg',
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId="work-filter"
                      className="absolute inset-0 rounded-full bg-fg"
                      transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{item}</span>
                  <span className={cn('relative font-mono text-xs tabular-nums', selected ? 'text-bg/60' : 'text-subtle')}>
                    {countFor(item)}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <p className="sr-only" role="status">
          Showing {visible.length} {visible.length === 1 ? 'project' : 'projects'}
          {filter === 'All' ? '' : ` in ${filter}`}.
        </p>

        <ul className="grid gap-5 lg:grid-cols-12">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project, i) => {
              // Featured projects get the wide editorial layout; so does a lone result.
              const large = Boolean(project.featured) || visible.length === 1;
              const largeIndex = visible.slice(0, i).filter((p) => p.featured).length;
              return (
                <motion.li
                  key={project.slug}
                  layout={reduced ? false : 'position'}
                  className={large ? 'lg:col-span-12' : 'lg:col-span-6'}
                  initial={{ opacity: 0, scale: reduced ? 1 : 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: reduced ? 1 : 0.97 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <ProjectCard
                    project={project}
                    index={projects.indexOf(project)}
                    large={large}
                    flip={largeIndex % 2 === 1}
                    onOpen={onOpen}
                  />
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>
    </section>
  );
}

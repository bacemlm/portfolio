import { ArrowDownRight, ArrowUpRight, MapPin } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from 'react';
import { certificates, profile, socials } from '../../data/profile';
import { projects } from '../../data/projects';
import { scrollToSection } from '../../lib/scroll';
import { BrandIcon } from '../ui/BrandIcon';
import { Button } from '../ui/Button';
import { Magnetic } from '../ui/Magnetic';
import { HeroOrb } from './HeroOrb';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The entrance sequence is pure CSS (`animate-rise*` + a `--d` delay). The hero is prerendered
 * into index.html, so the stagger starts as soon as the stylesheet arrives instead of waiting
 * for JavaScript. Reduced motion is handled globally in index.css.
 */
const delay = (seconds: number) => ({ animationDelay: `${seconds}s` }) as CSSProperties;

/** Cycles through the professional roles; holds still when motion is reduced. */
function RotatingRole() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % profile.roles.length), 2600);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <span className="relative inline-flex h-[1.5em] overflow-hidden align-bottom">
      {/* The full list is announced once; the animated copy is decorative. */}
      <span className="sr-only">{profile.roles.join(', ')}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          aria-hidden="true"
          className="inline-block text-fg"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {profile.roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const facts = [
  { value: String(projects.length).padStart(2, '0'), label: 'Projects in this portfolio' },
  { value: String(certificates.length).padStart(2, '0'), label: 'Verified certificates' },
  { value: 'C1', label: 'English · EF SET' },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Scroll-linked exit: the visual drifts and the copy fades as the next section arrives.
  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end start'] });
  const orbY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const copyY = useTransform(scrollYProgress, [0.45, 1], ['0%', '-8%']);
  const copyOpacity = useTransform(scrollYProgress, [0.45, 1], [1, 0.15]);

  // Mouse-responsive lighting: the section only stores coordinates, CSS paints the light.
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--lx', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--ly', `${event.clientY - rect.top}px`);
  };

  const go = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToSection(id);
  };

  return (
    <section
      ref={root}
      id="home"
      aria-labelledby="hero-title"
      onPointerMove={onPointerMove}
      className="relative flex min-h-[100svh] flex-col overflow-clip pt-24 outline-none md:pt-28"
    >
      {/* Background: technical grid, two soft colour fields and the pointer light. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid mask-radial absolute inset-0 opacity-70" />
        <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-[70%] rounded-full bg-[radial-gradient(circle,var(--glow),transparent_65%)]" />
        <div className="absolute top-1/3 right-0 h-[30rem] w-[30rem] translate-x-1/4 rounded-full bg-[radial-gradient(circle,var(--glow-2),transparent_65%)]" />
        <div
          className="absolute inset-0 hidden opacity-70 [@media(hover:hover)]:block"
          style={{ background: 'radial-gradient(520px circle at var(--lx, 70%) var(--ly, 30%), var(--glow), transparent 60%)' }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
      </div>

      <div className="container-x grid flex-1 items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-4">
        <motion.div className="relative z-10 py-6" style={reduced ? undefined : { y: copyY, opacity: copyOpacity }}>
          <p className="label-mono mb-6 flex animate-rise items-center gap-3 text-muted" style={delay(0)}>
            <span aria-hidden="true" className="size-2 animate-pulse-soft rounded-full bg-accent-2" />
            Hello, I’m {profile.firstName}.
          </p>

          <h1
            id="hero-title"
            className="text-[clamp(2.75rem,9.4vw,6.25rem)] leading-[0.95] font-semibold tracking-[-0.045em]"
          >
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="inline-block animate-rise-mask" style={delay(0.05)}>
                I build
              </span>
            </span>
            <span className="block animate-rise-blur" style={delay(0.16)}>
              <span className="text-gradient inline-block pb-[0.1em]">digital experiences.</span>
            </span>
          </h1>

          <p className="mt-7 animate-rise font-display text-xl text-muted sm:text-2xl" style={delay(0.3)}>
            <RotatingRole />
          </p>

          <p className="mt-5 max-w-xl animate-rise text-lg leading-relaxed text-muted" style={delay(0.36)}>
            {profile.intro}
          </p>

          <div className="mt-9 flex animate-rise flex-wrap items-center gap-3" style={delay(0.46)}>
            <Magnetic>
              <Button href="#work" onClick={go('work')}>
                Explore My Work
                <ArrowDownRight
                  size={18}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:translate-y-0.5"
                />
              </Button>
            </Magnetic>
            <Magnetic>
              <Button href="#contact" onClick={go('contact')} variant="secondary">
                Let’s Connect
                <ArrowUpRight
                  size={18}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                />
              </Button>
            </Magnetic>
          </div>

          <ul className="mt-9 flex animate-rise flex-wrap items-center gap-1" style={delay(0.56)} aria-label="Social profiles">
            {socials.map((social) => (
              <li key={social.id}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${social.label} (opens in a new tab)`}
                  className="grid size-11 place-items-center rounded-full border border-transparent text-muted transition-colors duration-300 hover:border-line-strong hover:bg-surface hover:text-fg"
                >
                  <BrandIcon id={social.id} />
                </a>
              </li>
            ))}
            <li className="label-mono ml-2 flex items-center gap-2 text-subtle">
              <MapPin size={14} aria-hidden="true" />
              {profile.location}
            </li>
          </ul>
        </motion.div>

        {/* The visual sits behind the copy on small screens and beside it on large ones. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-16 left-1/2 -z-[5] aspect-square w-[min(120vw,34rem)] -translate-x-1/2 opacity-30 lg:relative lg:top-0 lg:left-0 lg:z-0 lg:w-full lg:max-w-[34rem] lg:translate-x-0 lg:justify-self-end lg:opacity-100"
        >
          {/* Outer layer: scroll drift (Motion). Inner layer: CSS entrance. */}
          <motion.div className="absolute inset-0" style={reduced ? undefined : { y: orbY, scale: orbScale }}>
            <div className="absolute inset-0 animate-orb-in" style={delay(0.15)}>
              <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--glow),transparent_70%)]" />
              <HeroOrb className="absolute inset-0 size-full" />
              <div className="absolute inset-[3%] rounded-full border border-line [mask-image:linear-gradient(135deg,#000,transparent_55%)]" />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container-x relative z-10 mt-6 animate-rise pb-8" style={delay(0.66)}>
        <div className="flex flex-col gap-6 border-t border-line pt-6 sm:flex-row sm:items-end sm:justify-between">
          <dl className="grid grid-cols-3 gap-6 sm:flex sm:gap-12">
            {facts.map((fact) => (
              <div key={fact.label} className="flex flex-col-reverse gap-1">
                <dt className="text-xs leading-snug text-subtle sm:text-sm">{fact.label}</dt>
                <dd className="font-display text-2xl font-semibold tabular-nums sm:text-3xl">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <a
            href="#about"
            onClick={go('about')}
            className="label-mono group hidden min-h-11 items-center gap-3 self-end text-muted transition-colors hover:text-fg sm:inline-flex"
          >
            Scroll
            <span aria-hidden="true" className="relative flex h-9 w-5 justify-center rounded-full border border-line-strong pt-1.5">
              <span className="size-1 animate-scroll-dot rounded-full bg-accent-2" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

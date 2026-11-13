import { ArrowUpRight, Award, BadgeCheck, GraduationCap, Megaphone, Users, type LucideIcon } from 'lucide-react';
import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';
import {
  certificates,
  interests,
  profile,
  specializations,
  strengths,
  timeline,
  type TimelineKind,
} from '../../data/profile';
import { Monogram } from '../ui/BrandIcon';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { SpotlightCard } from '../ui/SpotlightCard';

const STATEMENT = 'I work where development meets visual design: one person who can design the interface and build it too.';

const kindMeta: Record<TimelineKind, { label: string; icon: LucideIcon }> = {
  education: { label: 'Education', icon: GraduationCap },
  certificate: { label: 'Certificate', icon: Award },
  experience: { label: 'Experience', icon: Megaphone },
  community: { label: 'Community', icon: Users },
};

export function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Statement: each word lights up as it is scrolled through.
        gsap.fromTo(
          '[data-word]',
          // Starts readable (3:1 or better for large text), then reaches full strength.
          { opacity: 0.45 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: 'none',
            scrollTrigger: { trigger: '[data-statement]', start: 'top 82%', end: 'bottom 45%', scrub: 0.6 },
          },
        );
        // Timeline: the accent line draws itself alongside the entries.
        gsap.fromTo(
          '[data-timeline-line]',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: '[data-timeline]', start: 'top 70%', end: 'bottom 60%', scrub: 0.5 },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" aria-labelledby="about-title" className="relative py-24 outline-none md:py-36">
      <div className="container-x">
        <SectionHeading index="01" label="About" id="about-title" title="A developer with a designer’s eye." />

        <p
          data-statement
          className="mb-16 max-w-5xl font-display text-[clamp(1.6rem,3.6vw,3rem)] leading-[1.18] font-medium tracking-[-0.025em] md:mb-24"
        >
          <span className="sr-only">{STATEMENT}</span>
          <span aria-hidden="true">
            {STATEMENT.split(' ').map((word, i) => (
              <span key={i} data-word className="inline-block will-change-[opacity]">
                {word}&nbsp;
              </span>
            ))}
          </span>
        </p>

        {/* Bento: biography, identity card, strengths, focus areas, certificates. */}
        <div className="grid gap-4 md:grid-cols-6">
          <Reveal className="md:col-span-4">
            <SpotlightCard className="h-full p-7 md:p-10">
              <p className="label-mono mb-6 text-muted">Biography</p>
              <div className="space-y-5 text-[1.05rem] leading-relaxed text-muted">
                {profile.bio.map((paragraph, i) => (
                  <p key={i} className={i === 0 ? 'text-fg' : undefined}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </SpotlightCard>
          </Reveal>

          <Reveal delay={0.08} className="md:col-span-2">
            <SpotlightCard className="flex h-full flex-col overflow-hidden p-7">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 -z-10 h-40 bg-[radial-gradient(120%_100%_at_0%_0%,var(--glow),transparent_70%)]"
              />
              <Monogram className="size-16" />
              <h3 className="mt-6 text-2xl font-semibold">{profile.name}</h3>
              <p className="mt-1 text-muted">{profile.title}</p>
              <dl className="mt-auto space-y-3 pt-8 text-sm">
                {[
                  ['Based in', profile.location],
                  ['Education', 'Bachelor, Computer Science'],
                  ['English', 'C1 · EF SET'],
                ].map(([term, value]) => (
                  <div key={term} className="flex items-baseline justify-between gap-4 border-t border-line pt-3">
                    <dt className="label-mono text-subtle">{term}</dt>
                    <dd className="text-right text-fg">{value}</dd>
                  </div>
                ))}
              </dl>
            </SpotlightCard>
          </Reveal>

          <Reveal className="md:col-span-3">
            <SpotlightCard className="h-full p-7">
              <p className="label-mono mb-6 text-muted">Strengths</p>
              <ul className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                {strengths.map((strength) => (
                  <li key={strength.title}>
                    <h3 className="text-lg font-semibold">{strength.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{strength.text}</p>
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </Reveal>

          <Reveal delay={0.08} className="md:col-span-3">
            <SpotlightCard className="h-full p-7">
              <p className="label-mono mb-5 text-muted">Core expertise</p>
              <ul className="flex flex-wrap gap-2">
                {specializations.map((item) => (
                  <li key={item} className="rounded-full border border-line-strong bg-surface-2 px-3.5 py-1.5 text-sm">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="label-mono mt-8 mb-5 text-muted">Interests</p>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
                {interests.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span aria-hidden="true" className="size-1 rounded-full bg-accent-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </Reveal>
        </div>

        {/* Journey + certificates */}
        <div className="mt-20 grid gap-12 md:mt-28 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <p className="label-mono mb-5 text-muted">Journey</p>
              <h3 className="text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.08] font-semibold">
                Education, certificates and experience.
              </h3>
              <p className="mt-5 max-w-md leading-relaxed text-muted">
                Every certificate links to its public verification page, so you can check it yourself.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <ul className="mt-8 grid gap-2" aria-label="Verified certificates">
                {certificates.map((certificate) => (
                  <li key={certificate.title}>
                    <a
                      href={certificate.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex min-h-14 items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 transition-colors duration-300 hover:border-accent"
                    >
                      <BadgeCheck size={18} aria-hidden="true" className="shrink-0 text-accent-2-text" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{certificate.title}</span>
                        <span className="label-mono mt-1 block text-subtle">
                          {certificate.org} · {certificate.year}
                        </span>
                      </span>
                      <span className="sr-only">(verify, opens in a new tab)</span>
                      <ArrowUpRight
                        size={16}
                        aria-hidden="true"
                        className="shrink-0 text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <ol data-timeline className="relative">
            <span aria-hidden="true" className="absolute top-2 bottom-2 left-[1.1875rem] w-px bg-line" />
            <span
              aria-hidden="true"
              data-timeline-line
              className="absolute top-2 bottom-2 left-[1.1875rem] w-px origin-top bg-gradient-to-b from-accent to-accent-2"
            />
            {timeline.map((entry, i) => {
              const meta = kindMeta[entry.kind];
              const Icon = meta.icon;
              return (
                <li key={`${entry.title}-${i}`} className="relative pb-8 pl-16 last:pb-0">
                  <Reveal y={20} delay={0.04}>
                    <span
                      aria-hidden="true"
                      className="absolute top-0 left-0 grid size-10 place-items-center rounded-full border border-line-strong bg-surface text-accent-text"
                    >
                      <Icon size={17} />
                    </span>
                    <p className="label-mono flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-subtle">
                      {entry.year && <span className="text-accent-2-text">{entry.year}</span>}
                      <span>{meta.label}</span>
                    </p>
                    <h4 className="mt-2 text-xl font-semibold">{entry.title}</h4>
                    {entry.org && <p className="mt-0.5 text-muted">{entry.org}</p>}
                    {entry.text && <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">{entry.text}</p>}
                    {entry.href && (
                      <a
                        href={entry.href}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-accent-text underline-offset-4 hover:underline"
                      >
                        Verify certificate
                        <span className="sr-only">: {entry.title} (opens in a new tab)</span>
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </a>
                    )}
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

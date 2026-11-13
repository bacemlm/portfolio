import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useRef, useState, type KeyboardEvent } from 'react';
import { skillGroups, type Skill } from '../../data/skills';
import { asset, cn } from '../../lib/utils';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { SpotlightCard } from '../ui/SpotlightCard';

const EASE = [0.16, 1, 0.3, 1] as const;
const tabs = [{ id: 'all', label: 'All' }, ...skillGroups.map((group) => ({ id: group.id, label: group.label }))];
const allIcons = skillGroups.flatMap((group) => group.skills).filter((skill) => skill.icon);

function SkillLogo({ skill, size = 44 }: { skill: Skill; size?: number }) {
  if (skill.icon) {
    return (
      <img
        src={asset(`img/${skill.icon}-96.webp`)}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className="object-contain"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="grid place-items-center rounded-xl border border-line-strong bg-surface-2 font-mono text-sm font-medium text-accent-text"
      style={{ width: size, height: size }}
    >
      {skill.mark}
    </span>
  );
}

function SkillCard({ skill, group, wide }: { skill: Skill; group: string; wide: boolean }) {
  return (
    <SpotlightCard
      tabIndex={0}
      className={cn(
        'group flex h-full min-h-44 flex-col justify-between overflow-hidden p-5 outline-offset-4 hover:-translate-y-1',
        wide && 'sm:col-span-2',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <SkillLogo skill={skill} />
        <span className="label-mono text-right text-[0.65rem] text-subtle">{group}</span>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold">{skill.name}</h3>
        {/* Always readable on touch; revealed on hover or keyboard focus where hover exists. */}
        <p className="mt-1.5 text-sm leading-relaxed text-muted transition-[opacity,transform] duration-300 ease-out [@media(hover:hover)]:translate-y-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:translate-y-0 [@media(hover:hover)]:group-focus-visible:opacity-100">
          {skill.note}
        </p>
      </div>
    </SpotlightCard>
  );
}

export function Skills() {
  const [active, setActive] = useState('all');
  const reduced = useReducedMotion();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const visible = skillGroups
    .filter((group) => active === 'all' || group.id === active)
    .flatMap((group) => group.skills.map((skill) => ({ skill, group: group.label })));
  const blurb = skillGroups.find((group) => group.id === active)?.blurb ?? 'Hover or focus a card to see where each tool is used.';

  // Roving focus for the tab list: arrows move, Home/End jump.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = tabs.findIndex((tab) => tab.id === active);
    const next =
      event.key === 'ArrowRight'
        ? (index + 1) % tabs.length
        : event.key === 'ArrowLeft'
          ? (index - 1 + tabs.length) % tabs.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? tabs.length - 1
              : -1;
    if (next < 0) return;
    event.preventDefault();
    setActive(tabs[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="skills" aria-labelledby="skills-title" className="relative py-24 outline-none md:py-36">
      <div className="container-x">
        <SectionHeading
          index="02"
          label="Skills & Technologies"
          id="skills-title"
          title="The tools I design and build with."
          lead="No percentage bars. These are the technologies and tools I actually use, and where they show up in my work."
        />
      </div>

      {/* Logo ribbon: a nod to the original site’s slider, paused on hover and for reduced motion. */}
      <div aria-hidden="true" className="mask-fade-x mb-12 overflow-hidden border-y border-line py-6">
        <div className="flex w-max animate-marquee gap-14 pr-14 hover:[animation-play-state:paused]">
          {[...allIcons, ...allIcons].map((skill, i) => (
            <span key={i} className="flex items-center gap-3 text-muted">
              <SkillLogo skill={skill} size={30} />
              <span className="label-mono">{skill.name}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="container-x">
        <Reveal>
          <div
            role="tablist"
            aria-label="Skill categories"
            onKeyDown={onKeyDown}
            className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-2 [scrollbar-width:none]"
          >
            {tabs.map((tab, i) => {
              const selected = tab.id === active;
              return (
                <button
                  key={tab.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  type="button"
                  id={`skills-tab-${tab.id}`}
                  aria-selected={selected}
                  aria-controls="skills-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(tab.id)}
                  className={cn(
                    'relative min-h-11 shrink-0 rounded-full px-4 text-sm whitespace-nowrap transition-colors duration-300',
                    selected ? 'text-bg' : 'text-muted hover:text-fg',
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId="skills-tab"
                      className="absolute inset-0 rounded-full bg-fg"
                      transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <p className="mt-5 mb-8 min-h-6 text-muted" aria-live="polite">
          {blurb}
        </p>

        <div id="skills-panel" role="tabpanel" aria-labelledby={`skills-tab-${active}`}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={active}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
              initial="hidden"
              animate="show"
              exit="exit"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: reduced ? 0 : 0.035 } },
                exit: { opacity: 0, transition: { duration: 0.15 } },
              }}
            >
              {visible.map(({ skill, group }, i) => {
                // A few wider cards give the grid its bento rhythm.
                const wide = active === 'all' ? i % 7 === 0 : i === 0;
                return (
                  <motion.li
                    key={skill.name}
                    className={cn(wide && 'sm:col-span-2')}
                    variants={{
                      hidden: { opacity: 0, y: reduced ? 0 : 18 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                    }}
                  >
                    <SkillCard skill={skill} group={group} wide={false} />
                  </motion.li>
                );
              })}
            </motion.ul>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

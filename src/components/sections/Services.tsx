import { ArrowUpRight, Brush, CodeXml, PenTool, Shapes, type LucideIcon } from 'lucide-react';
import { services } from '../../data/services';
import { scrollToSection } from '../../lib/scroll';
import { cn } from '../../lib/utils';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { SpotlightCard } from '../ui/SpotlightCard';

const icons: Record<string, LucideIcon> = { frontend: CodeXml, uiux: PenTool, brand: Shapes, graphic: Brush };

// Asymmetric rhythm: wide / narrow, then narrow / wide.
const spans = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-5', 'lg:col-span-7'];

const process = [
  { step: 'Understand', text: 'We talk through what you need, who it is for and what success looks like.' },
  { step: 'Design', text: 'I shape the structure and the look, and share it early so you can react.' },
  { step: 'Build', text: 'The approved design becomes clean, responsive code or final artwork.' },
  { step: 'Refine', text: 'I test on real screens, polish the details and hand everything over.' },
];

interface ServicesProps {
  onChoose: (service: string) => void;
}

export function Services({ onChoose }: ServicesProps) {
  const choose = (service: string) => {
    onChoose(service);
    scrollToSection('contact');
  };

  return (
    <section id="services" aria-labelledby="services-title" className="relative py-24 outline-none md:py-36">
      <div className="container-x">
        <SectionHeading
          index="04"
          label="Services"
          id="services-title"
          title="What I can do for you."
          lead="Design and development from the same hands, so what gets designed is what gets built."
        />

        <ul className="grid gap-4 lg:grid-cols-12">
          {services.map((service, i) => {
            const Icon = icons[service.id];
            return (
              <li key={service.id} className={spans[i]}>
                <Reveal delay={(i % 2) * 0.08} className="h-full">
                  <SpotlightCard className="group flex h-full flex-col p-7 hover:-translate-y-1 md:p-9">
                    <div className="flex items-start justify-between">
                      <span className="grid size-12 place-items-center rounded-2xl border border-line-strong bg-surface-2 text-accent-text transition-colors duration-300 group-hover:border-accent group-hover:text-fg">
                        <Icon size={22} aria-hidden="true" />
                      </span>
                      <span aria-hidden="true" className="label-mono text-subtle">
                        0{i + 1}
                      </span>
                    </div>

                    <h3 className="mt-8 text-2xl font-semibold md:text-[1.75rem]">{service.title}</h3>
                    <p className="mt-3 max-w-md leading-relaxed text-muted">{service.value}</p>

                    <ul className="mt-6 flex flex-wrap gap-2">
                      {service.includes.map((item) => (
                        <li key={item} className="rounded-full border border-line px-3 py-1 text-sm text-muted">
                          {item}
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      onClick={() => choose(service.formValue)}
                      className="mt-auto inline-flex min-h-11 items-center gap-1.5 self-start pt-8 text-sm font-medium text-fg"
                    >
                      <span className="underline decoration-line-strong underline-offset-4 transition-colors group-hover:decoration-accent">
                        Start a {service.title.toLowerCase()} project
                      </span>
                      <ArrowUpRight
                        size={16}
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </button>
                  </SpotlightCard>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <div className="mt-20 md:mt-28">
          <Reveal>
            <p className="label-mono mb-8 text-muted">How I work</p>
          </Reveal>
          <ol className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {process.map((item, i) => (
              <li key={item.step} className="bg-bg">
                <Reveal delay={i * 0.06} className={cn('h-full p-6 md:p-7')}>
                  <span aria-hidden="true" className="label-mono text-accent-2-text">
                    Step 0{i + 1}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold">{item.step}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Reveal, SplitText } from './Reveal';

interface SectionHeadingProps {
  index: string;
  label: string;
  title: string;
  /** id for aria-labelledby on the section. */
  id: string;
  lead?: ReactNode;
  className?: string;
}

/** Numbered eyebrow + large display title used at the top of every section. */
export function SectionHeading({ index, label, title, id, lead, className }: SectionHeadingProps) {
  return (
    <header className={cn('mb-12 max-w-3xl md:mb-16', className)}>
      <Reveal y={12}>
        <p className="label-mono mb-5 flex items-center gap-3 text-muted">
          <span className="text-accent-text">{index}</span>
          <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
          {label}
        </p>
      </Reveal>
      <h2 id={id} className="text-[clamp(2rem,5.2vw,3.75rem)] leading-[1.04] font-semibold">
        <SplitText text={title} />
      </h2>
      {lead && (
        <Reveal delay={0.15} y={16}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{lead}</p>
        </Reveal>
      )}
    </header>
  );
}

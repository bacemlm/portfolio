import { ArrowLeft, ArrowRight, ArrowUpRight, Check, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { projects, type Project } from '../../data/projects';
import { lockScroll } from '../../lib/scroll';
import { cn } from '../../lib/utils';
import { BrandIcon } from '../ui/BrandIcon';
import { Button } from '../ui/Button';
import { Picture } from '../ui/Picture';

const EASE = [0.16, 1, 0.3, 1] as const;
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ProjectModalProps {
  project: Project | undefined;
  onClose: () => void;
  onNavigate: (slug: string) => void;
}

/**
 * Case study dialog. The open project lives in the URL (?project=slug), so a case study
 * can be linked to, refreshed and closed with the browser's Back button.
 */
export function ProjectModal({ project, onClose, onNavigate }: ProjectModalProps) {
  const reduced = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const open = Boolean(project);
  const slug = project?.slug;

  // While open: lock page scroll, make the page behind inert, restore focus afterwards.
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const page = document.getElementById('root');
    lockScroll(true);
    page?.setAttribute('inert', '');
    return () => {
      lockScroll(false);
      page?.removeAttribute('inert');
      previous?.focus?.({ preventScroll: true });
    };
  }, [open]);

  // On open and when moving between projects: focus the close button, scroll to the top.
  useEffect(() => {
    if (!slug) return;
    closeButton.current?.focus({ preventScroll: true });
    panel.current?.scrollTo({ top: 0 });
  }, [slug]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      // Keep Tab inside the dialog.
      if (event.key !== 'Tab' || !panel.current) return;
      const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const index = project ? projects.indexOf(project) : 0;
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const images = project ? [project.cover, ...(project.gallery ?? [])] : [];
  const contain = project?.fit === 'contain';

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onPointerDown={(event) => event.target === event.currentTarget && onClose()}
        >
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-title"
            data-lenis-prevent
            className="relative max-h-[94svh] w-full max-w-5xl overflow-y-auto overscroll-contain rounded-t-[1.75rem] border border-line-strong bg-bg shadow-[var(--shadow)] sm:max-h-[90svh] sm:rounded-[1.75rem]"
            initial={{ opacity: 0, y: reduced ? 0 : 60, scale: reduced ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduced ? 0 : 40 }}
            transition={{ duration: reduced ? 0.2 : 0.55, ease: EASE }}
          >
            <div className="glass sticky top-0 z-10 flex items-center justify-between gap-4 border-x-0 border-t-0 px-5 py-3 sm:px-8">
              <p className="label-mono truncate text-muted">
                <span className="text-accent-text">Case study</span> · {String(index + 1).padStart(2, '0')} /{' '}
                {String(projects.length).padStart(2, '0')}
              </p>
              <button
                ref={closeButton}
                type="button"
                onClick={onClose}
                aria-label="Close case study"
                className="grid size-11 shrink-0 place-items-center rounded-full border border-line-strong text-fg transition-colors hover:bg-fg hover:text-bg"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {/* Keyed by slug so moving to the next project replays the entrance. */}
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: reduced ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <header className="px-5 pt-8 pb-8 sm:px-10 sm:pt-12">
                <p className="label-mono text-accent-2-text">{project.categories.join(' · ')}</p>
                <h2 id="case-title" className="mt-4 text-[clamp(2.25rem,7vw,4.5rem)] leading-[0.98] font-semibold">
                  {project.title}
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{project.summary}</p>
              </header>

              <div
                className={cn('mx-5 overflow-hidden rounded-2xl border border-line sm:mx-10', contain && 'aspect-[16/9]')}
                style={contain ? { backgroundColor: project.tone } : undefined}
              >
                <Picture
                  name={project.cover.name}
                  alt={project.cover.alt}
                  sizes="(min-width: 1024px) 940px, 92vw"
                  eager
                  className={contain ? 'size-full' : undefined}
                  imgClassName={contain ? 'object-contain p-[6%]' : 'h-auto'}
                />
              </div>

              <div className="grid gap-10 px-5 py-10 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
                <div>
                  <h3 className="label-mono mb-5 text-muted">Overview</h3>
                  <div className="space-y-4 text-[1.05rem] leading-relaxed">
                    {project.overview.map((paragraph, i) => (
                      <p key={i} className={i === 0 ? 'text-fg' : 'text-muted'}>
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <h3 className="label-mono mt-10 mb-5 text-muted">What I delivered</h3>
                  <ul className="space-y-3">
                    {project.delivered.map((item) => (
                      <li key={item} className="flex gap-3 leading-relaxed text-muted">
                        <Check size={18} aria-hidden="true" className="mt-1 shrink-0 text-accent-2-text" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <aside className="space-y-8 lg:border-l lg:border-line lg:pl-10">
                  <div>
                    <h3 className="label-mono mb-4 text-muted">{project.live || project.repo ? 'Stack' : 'Tools & scope'}</h3>
                    <ul className="flex flex-wrap gap-2">
                      {project.stack.map((item) => (
                        <li
                          key={item}
                          className="rounded-full border border-line-strong bg-surface px-3 py-1 font-mono text-xs text-fg"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {(project.live || project.repo) && (
                    <div>
                      <h3 className="label-mono mb-4 text-muted">Links</h3>
                      <div className="flex flex-col items-start gap-3">
                        {project.live && (
                          <Button href={project.live} target="_blank" rel="noreferrer">
                            Visit live site
                            <span className="sr-only">(opens in a new tab)</span>
                            <ArrowUpRight size={17} aria-hidden="true" />
                          </Button>
                        )}
                        {project.repo && (
                          <Button href={project.repo} target="_blank" rel="noreferrer" variant="secondary">
                            <BrandIcon id="github" width={17} height={17} />
                            View source
                            <span className="sr-only">on GitHub (opens in a new tab)</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </aside>
              </div>

              {images.length > 1 && (
                <section aria-label="Gallery" className="space-y-5 px-5 pb-10 sm:px-10 sm:pb-14">
                  <h3 className="label-mono text-muted">Gallery</h3>
                  {images.slice(1).map((image) => (
                    <figure key={image.name}>
                      <div className="overflow-hidden rounded-2xl border border-line">
                        <Picture name={image.name} alt={image.alt} sizes="(min-width: 1024px) 940px, 92vw" imgClassName="h-auto" />
                      </div>
                      {image.caption && <figcaption className="label-mono mt-3 text-subtle">{image.caption}</figcaption>}
                    </figure>
                  ))}
                </section>
              )}

              <nav aria-label="More projects" className="grid grid-cols-2 border-t border-line">
                {[
                  { item: previous, label: 'Previous', Icon: ArrowLeft, align: 'items-start text-left' },
                  { item: next, label: 'Next', Icon: ArrowRight, align: 'items-end text-right border-l border-line' },
                ].map(({ item, label, Icon, align }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => onNavigate(item.slug)}
                    className={cn(
                      'group flex min-h-24 flex-col justify-center gap-1 px-5 py-6 transition-colors hover:bg-surface sm:px-10',
                      align,
                    )}
                  >
                    <span className="label-mono flex items-center gap-2 text-subtle">
                      {label === 'Previous' && <Icon size={14} aria-hidden="true" />}
                      {label}
                      {label === 'Next' && <Icon size={14} aria-hidden="true" />}
                    </span>
                    <span className="font-display text-lg font-semibold sm:text-2xl">{item.title}</span>
                  </button>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

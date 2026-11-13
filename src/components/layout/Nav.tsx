import { Menu, Moon, Sun, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { navItems, profile } from '../../data/profile';
import { useActiveSection, useScrolled, type Theme } from '../../lib/hooks';
import { lockScroll, scrollToSection } from '../../lib/scroll';
import { cn } from '../../lib/utils';
import { Monogram } from '../ui/BrandIcon';

const sectionIds = navItems.map((item) => item.id);

interface NavProps {
  theme: Theme;
  onToggleTheme: () => void;
  /** Changes when lazily mounted sections arrive, so the active-section tracking picks them up. */
  sectionsKey: number;
}

export function Nav({ theme, onToggleTheme, sectionsKey }: NavProps) {
  const active = useActiveSection(sectionIds, sectionsKey);
  const scrolled = useScrolled(32);
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const menuRoot = useRef<HTMLDivElement>(null);

  const go = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setOpen(false);
    // Let the mobile sheet release the scroll lock before scrolling.
    requestAnimationFrame(() => scrollToSection(id));
  };

  // Mobile sheet: lock scrolling, close on Escape, return focus to the trigger.
  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const background = Array.from(document.querySelectorAll<HTMLElement>('main, footer'));
    const inertBefore = background.map((element) => element.inert);
    background.forEach((element) => { element.inert = true; });
    firstLink.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
      if (event.key === 'Tab') {
        const items = Array.from(menuRoot.current?.querySelectorAll<HTMLElement>('header a[href], header button, #mobile-menu a[href]') ?? [])
          .filter((element) => element.getClientRects().length > 0);
        const first = items[0];
        const last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      background.forEach((element, i) => { element.inert = inertBefore[i]; });
      lockScroll(false);
    };
  }, [open]);

  // Close the sheet if the viewport grows to desktop width.
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const onChange = () => mql.matches && setOpen(false);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const ThemeIcon = theme === 'dark' ? Sun : Moon;

  return (
    <div ref={menuRoot} role={open ? 'dialog' : undefined} aria-modal={open ? true : undefined} aria-label={open ? 'Navigation menu' : undefined}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-bg"
      >
        Skip to content
      </a>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 md:pt-4">
        <nav
          aria-label="Primary"
          className={cn(
            'glass pointer-events-auto flex w-full items-center justify-between gap-2 rounded-full shadow-[var(--shadow)] transition-[max-width,padding] duration-500 ease-[var(--ease-out-expo)]',
            scrolled ? 'max-w-[46rem] py-1.5 pr-1.5 pl-3' : 'max-w-[60rem] py-2 pr-2 pl-4',
          )}
        >
          <a
            href="#home"
            onClick={go('home')}
            className="flex min-h-11 items-center gap-2.5 rounded-full pr-2 font-display text-[0.95rem] font-semibold tracking-tight"
            aria-label={`${profile.name} — back to top`}
          >
            <Monogram className="size-7 shrink-0" />
            <span className="whitespace-nowrap">
              Bacem
              {/* The surname steps aside on desktop once the bar goes compact. */}
              <span className={cn('text-muted', scrolled && 'lg:hidden')}> Lamloumi</span>
            </span>
          </a>

          <ul className="hidden items-center lg:flex">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={go(item.id)}
                    aria-current={isActive ? 'location' : undefined}
                    className={cn(
                      'relative flex min-h-10 items-center rounded-full px-3.5 text-sm transition-colors duration-300',
                      isActive ? 'text-fg' : 'text-muted hover:text-fg',
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full border border-line-strong bg-fg/[0.07]"
                        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              className="grid size-11 place-items-center rounded-full text-muted transition-colors duration-300 hover:bg-fg/[0.07] hover:text-fg"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, rotate: reduced ? 0 : -60, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: reduced ? 0 : 60, scale: 0.7 }}
                  transition={{ duration: 0.22 }}
                  className="grid place-items-center"
                >
                  <ThemeIcon size={18} aria-hidden="true" />
                </motion.span>
              </AnimatePresence>
            </button>

            <a
              href="#contact"
              onClick={go('contact')}
              className="hidden min-h-10 items-center rounded-full bg-fg px-4 text-sm font-medium whitespace-nowrap text-bg transition-transform duration-300 hover:scale-[1.03] active:scale-[0.97] lg:flex"
            >
              Let’s talk
            </a>

            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="grid size-11 place-items-center rounded-full text-fg transition-colors hover:bg-fg/[0.07] lg:hidden"
            >
              {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-bg/95 px-6 pt-28 pb-10 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ul className="flex flex-1 flex-col justify-center gap-1">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: reduced ? 0 : 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    ref={i === 0 ? firstLink : undefined}
                    href={`#${item.id}`}
                    onClick={go(item.id)}
                    aria-current={active === item.id ? 'location' : undefined}
                    className="flex min-h-14 items-baseline gap-4 border-b border-line py-3 font-display text-4xl font-semibold tracking-tight"
                  >
                    <span className="label-mono w-7 text-accent-text">0{i + 1}</span>
                    <span className={active === item.id ? 'text-fg' : 'text-muted'}>{item.label}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <p className="label-mono mt-8 text-subtle">{profile.location}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

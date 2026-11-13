import { ArrowUp } from 'lucide-react';
import type { MouseEvent } from 'react';
import { navItems, profile, socials } from '../../data/profile';
import { scrollToSection } from '../../lib/scroll';
import { BrandIcon, Monogram } from '../ui/BrandIcon';

export function Footer() {
  const go = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToSection(id);
  };

  return (
    <footer className="border-t border-line">
      <div className="container-x flex flex-col gap-10 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <a href="#home" onClick={go('home')} className="inline-flex min-h-11 items-center gap-2.5 font-display text-lg font-semibold">
            <Monogram className="size-8" />
            {profile.name}
          </a>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {profile.title}, based in {profile.location}.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-1 sm:grid-cols-3">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={go(item.id)}
                  className="flex min-h-11 items-center text-sm text-muted transition-colors hover:text-fg"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex gap-1">
          {socials.map((social) => (
            <li key={social.id}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${social.label} (opens in a new tab)`}
                className="grid size-11 place-items-center rounded-full text-muted transition-colors hover:bg-fg/[0.07] hover:text-fg"
              >
                <BrandIcon id={social.id} />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="container-x flex flex-col-reverse items-start justify-between gap-4 border-t border-line py-6 sm:flex-row sm:items-center">
        <p className="label-mono text-subtle">
          © {new Date().getFullYear()} {profile.name}. Designed &amp; built by me.
        </p>
        <a
          href="#home"
          onClick={go('home')}
          className="label-mono inline-flex min-h-11 items-center gap-2 text-muted transition-colors hover:text-fg"
        >
          Back to top <ArrowUp size={14} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}

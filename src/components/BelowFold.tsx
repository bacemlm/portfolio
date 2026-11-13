import { startTransition, useEffect, useState } from 'react';
import { type Project } from '../data/projects';
import { ScrollTrigger } from '../lib/gsap';
import { jumpTo, scrollToSection } from '../lib/scroll';
import { About } from './sections/About';
import { Contact } from './sections/Contact';
import { ProjectModal } from './sections/ProjectModal';
import { Projects } from './sections/Projects';
import { Services } from './sections/Services';
import { Skills } from './sections/Skills';

const SCROLL_KEY = 'portfolio:scroll';
const SECTION_COUNT = 6;

/** Run when the browser has a spare moment (falls back to a short timeout on Safari). */
const whenIdle = (callback: () => void) => {
  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(callback, { timeout: 300 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(callback, 60);
  return () => clearTimeout(id);
};

interface BelowFoldProps {
  project: Project | undefined;
  onOpenProject: (slug: string) => void;
  onNavigateProject: (slug: string) => void;
  onCloseProject: () => void;
  /** Reports how many sections are mounted (6 = all), so the nav can track them and the footer can follow. */
  onProgress: (mounted: number) => void;
}

/**
 * Everything under the hero. This file is a separate chunk (with GSAP), loaded after the hero
 * has painted. Sections are then mounted one at a time, top to bottom, each in its own low-priority
 * render, so the page never freezes while it builds itself.
 */
export default function BelowFold({ project, onOpenProject, onNavigateProject, onCloseProject, onProgress }: BelowFoldProps) {
  const [mounted, setMounted] = useState(1);
  const [service, setService] = useState('');

  useEffect(() => {
    onProgress(mounted);
    if (mounted < SECTION_COUNT) return whenIdle(() => startTransition(() => setMounted((count) => count + 1)));

    // The page now has its full height: honour a #section link, or put a reloaded page back where it was.
    let hash = window.location.hash.slice(1);
    try { hash = decodeURIComponent(hash); } catch { /* Ignore malformed anchor encoding. */ }
    let saved = 0;
    try { saved = Number(sessionStorage.getItem(SCROLL_KEY) ?? 0); } catch { /* Storage may be disabled. */ }
    if (hash && document.getElementById(hash)) scrollToSection(hash, { instant: true });
    else if (saved > 0) jumpTo(saved);
    ScrollTrigger.refresh();
  }, [mounted, onProgress]);

  // Sections arrive after load, so the browser cannot restore the scroll position by itself.
  useEffect(() => {
    const previousRestoration = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    const save = () => {
      try { sessionStorage.setItem(SCROLL_KEY, String(Math.round(window.scrollY))); } catch { /* Storage may be disabled. */ }
    };
    window.addEventListener('pagehide', save);
    return () => {
      window.removeEventListener('pagehide', save);
      history.scrollRestoration = previousRestoration;
    };
  }, []);

  return (
    <>
      <About />
      {mounted >= 2 && <Skills />}
      {mounted >= 3 && <Projects onOpen={onOpenProject} />}
      {mounted >= 4 && <Services onChoose={setService} />}
      {mounted >= 5 && <Contact service={service} />}
      <ProjectModal project={project} onClose={onCloseProject} onNavigate={onNavigateProject} />
    </>
  );
}

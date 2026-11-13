import { MotionConfig } from 'motion/react';
import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { CursorGlow, ScrollProgress } from './components/layout/Effects';
import { Footer } from './components/layout/Footer';
import { Nav } from './components/layout/Nav';
import { Hero } from './components/sections/Hero';
import { projectBySlug } from './data/projects';
import { useTheme } from './lib/hooks';
import { initSmoothScroll } from './lib/scroll';

// The hero and navigation are prerendered and hydrated first. Everything else is one lazy chunk.
const BelowFold = lazy(() => import('./components/BelowFold'));

const readProject = () =>
  typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('project');

/** Build the current URL with (or without) the ?project= parameter. */
const urlFor = (slug: string | null) => {
  const url = new URL(window.location.href);
  if (slug) url.searchParams.set('project', slug);
  else url.searchParams.delete('project');
  return url;
};

export default function App() {
  const { theme, toggle } = useTheme();
  const [slug, setSlug] = useState<string | null>(null);
  const [belowFold, setBelowFold] = useState(false);
  const [sectionsMounted, setSectionsMounted] = useState(0);

  useEffect(() => {
    // After the first paint: read URL state, start loading the rest of the page, enable smooth scroll.
    setSlug(readProject());
    const stopSmoothScroll = initSmoothScroll();
    // Give the hero a moment to finish hydrating before the rest of the page starts loading.
    const timer = window.setTimeout(() => setBelowFold(true), 120);
    return () => {
      window.clearTimeout(timer);
      stopSmoothScroll();
    };
  }, []);

  // The open case study is URL state: Back closes it, a shared link opens it.
  useEffect(() => {
    const onPop = () => setSlug(readProject());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const openProject = useCallback((next: string) => {
    window.history.pushState({ caseStudy: true }, '', urlFor(next));
    setSlug(next);
  }, []);

  const navigateProject = useCallback((next: string) => {
    window.history.replaceState(window.history.state, '', urlFor(next));
    setSlug(next);
  }, []);

  const closeProject = useCallback(() => {
    // Opened from this page: go back so the history stays clean. Opened from a link: just clear it.
    if (window.history.state?.caseStudy) window.history.back();
    else {
      window.history.replaceState(null, '', urlFor(null));
      setSlug(null);
    }
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <CursorGlow />
      <Nav theme={theme} onToggleTheme={toggle} sectionsKey={sectionsMounted} />
      <main id="main" className="relative z-[2]">
        <Hero />
        {belowFold && (
          <Suspense fallback={null}>
            <BelowFold
              project={projectBySlug(slug)}
              onOpenProject={openProject}
              onNavigateProject={navigateProject}
              onCloseProject={closeProject}
              onProgress={setSectionsMounted}
            />
          </Suspense>
        )}
      </main>
      {/* The footer follows once every section above it is in place, so it never jumps. */}
      {sectionsMounted >= 6 && (
        <div className="relative z-[2]">
          <Footer />
        </div>
      )}
    </MotionConfig>
  );
}

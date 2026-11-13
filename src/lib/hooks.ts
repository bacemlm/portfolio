import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

/** Subscribe to a media query. Safe on first render (reads the current value). */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** True on devices with a real hover-capable pointer (mouse, trackpad). */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)');

export type Theme = 'dark' | 'light';

// The theme lives on <html data-theme> (set before first paint by the inline script in
// index.html). React reads it through an external store, so the prerendered markup and
// the first client render always agree.
const themeListeners = new Set<() => void>();
const readTheme = (): Theme => (document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
const subscribeTheme = (listener: () => void) => {
  themeListeners.add(listener);
  return () => themeListeners.delete(listener);
};

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#fafafa' : '#09090b');
  try {
    localStorage.setItem('theme', theme);
  } catch {
    /* storage can be unavailable (private mode); the theme still applies for this visit */
  }
  themeListeners.forEach((listener) => listener());
}

/** Theme state, persisted in localStorage and applied to <html data-theme>. */
export function useTheme() {
  const theme = useSyncExternalStore<Theme>(subscribeTheme, readTheme, () => 'dark');
  const toggle = useCallback(() => applyTheme(readTheme() === 'dark' ? 'light' : 'dark'), []);
  return { theme, toggle };
}

/** Which section is currently under the top third of the viewport. */
export function useActiveSection(ids: readonly string[], mountedKey: unknown = 0) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    let frame = 0;
    const update = () => {
      frame = 0;
      const band = window.innerHeight * 0.35;
      const current = sections.filter((section) => section.getBoundingClientRect().top <= band).at(-1);
      setActive(current?.id ?? ids[0]);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    // Percentage root margins use viewport width, so a narrow IntersectionObserver
    // band can disappear on wide screens. Measure a height-based band instead.
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const observer = new ResizeObserver(schedule);
    const main = document.getElementById('main');
    if (main) observer.observe(main);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ids, mountedKey]);

  return active;
}

/** True once the page has been scrolled past `offset` pixels. */
export function useScrolled(offset = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [offset]);
  return scrolled;
}

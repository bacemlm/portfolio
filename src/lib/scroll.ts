import type Lenis from 'lenis';
import { isFinePointer, prefersReducedMotion } from './utils';

let lenis: Lenis | null = null;
let scrollLocked = false;
const scrollListeners = new Set<() => void>();

/** Run a callback on every smooth-scroll frame (used to keep GSAP ScrollTrigger in sync). */
export function onSmoothScroll(listener: () => void) {
  scrollListeners.add(listener);
  return () => scrollListeners.delete(listener);
}

/**
 * Smooth scrolling is an enhancement, not a requirement: it only runs on
 * mouse/trackpad devices and never when the visitor prefers reduced motion.
 * Touch devices keep native scrolling and never download the library.
 */
export function initSmoothScroll() {
  if (prefersReducedMotion() || !isFinePointer()) return () => {};

  let cancelled = false;
  let frame = 0;

  import('lenis').then(({ default: LenisClass }) => {
    if (cancelled) return;
    lenis = new LenisClass({ duration: 1.05, anchors: false });
    if (scrollLocked) lenis.stop();
    lenis.on('scroll', () => scrollListeners.forEach((listener) => listener()));
    const tick = (time: number) => {
      lenis?.raf(time);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  });

  return () => {
    cancelled = true;
    cancelAnimationFrame(frame);
    lenis?.destroy();
    lenis = null;
  };
}

/** Scroll to a section by id, update the URL hash and move focus for keyboard users. */
export function scrollToSection(id: string, options: { instant?: boolean } = {}) {
  const target = document.getElementById(id);
  if (!target) return;

  const instant = options.instant || prefersReducedMotion();
  if (lenis) {
    // Sections mount after load, so make sure Lenis knows the current page height first.
    lenis.resize();
    lenis.scrollTo(target, { offset: id === 'home' ? 0 : -72, duration: 1.2, immediate: instant, force: true });
  } else target.scrollIntoView({ behavior: instant ? 'instant' : 'smooth', block: 'start' });

  history.replaceState(history.state, '', id === 'home' ? location.pathname + location.search : `#${id}`);
  // Move focus without triggering a second (instant) scroll.
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}

/** Jump to an absolute scroll position (used to restore the position after a reload). */
export function jumpTo(y: number) {
  if (lenis) {
    lenis.resize();
    lenis.scrollTo(y, { immediate: true, force: true });
  } else window.scrollTo({ top: y, behavior: 'instant' });
}

/** Lock page scrolling while a dialog is open. */
export function lockScroll(locked: boolean) {
  scrollLocked = locked;
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { useEffect } from 'react';
import { useFinePointer } from '../../lib/hooks';

/** Thin reading-progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-accent to-accent-2"
      style={{ scaleX }}
    />
  );
}

/**
 * Soft light that trails the cursor across the whole page.
 * Mouse/trackpad only, and skipped entirely with reduced motion.
 */
export function CursorGlow() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const sx = useSpring(x, { stiffness: 90, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 90, damping: 22, mass: 0.6 });
  const enabled = fine && !reduced;

  useEffect(() => {
    if (!enabled) return;
    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[1] size-[520px] rounded-full will-change-transform"
      style={{
        x: sx,
        y: sy,
        translateX: '-50%',
        translateY: '-50%',
        background: 'radial-gradient(circle, var(--glow) 0%, transparent 62%)',
      }}
    />
  );
}

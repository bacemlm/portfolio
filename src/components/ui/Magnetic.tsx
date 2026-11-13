import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import type { PointerEvent, ReactNode } from 'react';
import { useFinePointer } from '../../lib/hooks';

interface MagneticProps {
  children: ReactNode;
  /** How far the element follows the pointer (0–1). */
  strength?: number;
  className?: string;
}

/** Pulls its child slightly toward the cursor. Inactive on touch and with reduced motion. */
export function Magnetic({ children, strength = 0.28, className }: MagneticProps) {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  if (!fine || reduced) return <span className={className}>{children}</span>;

  const onMove = (event: PointerEvent<HTMLSpanElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span className={className} style={{ x: sx, y: sy, display: 'inline-block' }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.span>
  );
}

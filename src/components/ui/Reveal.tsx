import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';
import type { ReactNode } from 'react';

const EASE = [0.16, 1, 0.3, 1] as const;

interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  delay?: number;
  /** Vertical travel in px. */
  y?: number;
}

/** Fades content up once as it enters the viewport. Opacity only when motion is reduced. */
export function Reveal({ children, delay = 0, y = 28, ...rest }: RevealProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: reduced ? 0.2 : 0.8, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  /** Animate when scrolled into view (default) or immediately on mount. */
  trigger?: 'view' | 'mount';
}

/** Word-by-word masked reveal for headings. Screen readers get the plain sentence. */
export function SplitText({ text, className, delay = 0, trigger = 'view' }: SplitTextProps) {
  const reduced = useReducedMotion();
  const words = text.split(' ');
  const animate = { y: '0%', opacity: 1 };

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              className="inline-block will-change-transform"
              initial={{ y: reduced ? '0%' : '105%', opacity: reduced ? 0 : 1 }}
              {...(trigger === 'mount'
                ? { animate }
                : { whileInView: animate, viewport: { once: true, margin: '0px 0px -10% 0px' } })}
              transition={{ duration: reduced ? 0.2 : 0.9, delay: delay + i * 0.06, ease: EASE }}
            >
              {word}
              {i < words.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        ))}
      </span>
    </span>
  );
}

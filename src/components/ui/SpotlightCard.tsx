import type { HTMLAttributes, PointerEvent } from 'react';
import { cn } from '../../lib/utils';

/** Card whose soft glow follows the pointer. The glow is pure CSS; JS only passes coordinates. */
export function SpotlightCard({ className, children, onPointerMove, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') {
      const rect = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`);
    }
    onPointerMove?.(event);
  };

  return (
    <div className={cn('card spotlight', className)} onPointerMove={handleMove} {...rest}>
      {children}
    </div>
  );
}

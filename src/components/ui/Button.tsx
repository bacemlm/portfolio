import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';

const base =
  'group/btn relative inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 text-[0.95rem] font-medium tracking-[-0.01em] transition-[transform,background-color,border-color,box-shadow,color] duration-300 ease-out active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<Variant, string> = {
  primary:
    'bg-fg text-bg shadow-[0_0_0_1px_var(--line-strong),0_10px_40px_-12px_var(--glow)] hover:shadow-[0_0_0_1px_var(--accent),0_14px_48px_-10px_var(--accent)]',
  secondary: 'border border-line-strong bg-surface/60 text-fg hover:border-accent hover:bg-surface',
  ghost: 'text-muted hover:text-fg',
};

interface CommonProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

type LinkProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type NativeButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

/** Renders an <a> when `href` is given, otherwise a <button>. */
export function Button(props: LinkProps | NativeButtonProps) {
  const { variant = 'primary', className, children } = props;
  const classes = cn(base, variants[variant], className);

  if (props.href !== undefined) {
    const { variant: _v, className: _c, children: _ch, ...rest } = props;
    return (
      <a className={classes} {...rest}>
        {children}
      </a>
    );
  }
  const { variant: _v, className: _c, children: _ch, ...rest } = props;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

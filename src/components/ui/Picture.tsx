import manifest from '../../data/images.json';
import { asset, cn } from '../../lib/utils';

type ImageName = keyof typeof manifest;

interface PictureProps {
  name: string;
  alt: string;
  /** The `sizes` attribute: how wide the image is rendered at each breakpoint. */
  sizes?: string;
  className?: string;
  imgClassName?: string;
  /** Load immediately instead of lazily (only for above-the-fold images). */
  eager?: boolean;
}

/**
 * Responsive image from the generated set in public/img (see scripts/optimize-images.mjs).
 * Serves AVIF with a WebP fallback and reserves space with width/height to avoid layout shift.
 */
export function Picture({ name, alt, sizes = '100vw', className, imgClassName, eager = false }: PictureProps) {
  const entry = manifest[name as ImageName];
  if (!entry) return null;

  const srcSet = (ext: string) => entry.widths.map((w) => `${asset(`img/${name}-${w}.${ext}`)} ${w}w`).join(', ');
  const largest = entry.widths[entry.widths.length - 1];

  return (
    <picture className={cn('block', className)}>
      {entry.avif && <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />}
      <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
      <img
        src={asset(`img/${name}-${largest}.webp`)}
        alt={alt}
        width={entry.width}
        height={entry.height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={cn('block h-full w-full', imgClassName)}
      />
    </picture>
  );
}

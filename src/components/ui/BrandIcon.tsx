import type { SVGProps } from 'react';
import type { SocialId } from '../../data/profile';

// Brand marks are no longer shipped with lucide-react, so they live here as small stroke icons
// drawn to match the rest of the icon set (24px grid, 1.75 stroke).
const paths: Record<SocialId, React.ReactNode> = {
  github: (
    <>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </>
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  behance: (
    <>
      <path d="M2.5 5.5h5.25a3 3 0 0 1 0 6H2.5z" />
      <path d="M2.5 11.5h6a3.5 3.5 0 0 1 0 7h-6z" />
      <path d="M14.2 14.5h7.3a3.7 3.7 0 1 0-1.1 2.9" />
      <path d="M15.5 6.5h5" />
    </>
  ),
  instagram: (
    <>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </>
  ),
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
};

export function BrandIcon({ id, ...props }: { id: SocialId } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[id]}
    </svg>
  );
}

/** The BL monogram, redrawn as vector from the original logo for the nav, footer and favicon. */
export function Monogram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 7h13a6 6 0 0 1 4.3 10.2A6.5 6.5 0 0 1 18.5 29H5zM10.5 11.5v4.5H17a2.25 2.25 0 0 0 0-4.5zM10.5 20v4.5H18a2.25 2.25 0 0 0 0-4.5z"
        fill="currentColor"
      />
      <path d="M26.500 18h5v10.500H37v4.500H26.500z" fill="var(--accent)" />
    </svg>
  );
}

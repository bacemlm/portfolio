import { useEffect, useRef } from 'react';
import { isFinePointer, prefersReducedMotion } from '../../lib/utils';

interface Point {
  x: number;
  y: number;
  z: number;
}

/** Evenly distributed points on a unit sphere (Fibonacci lattice). */
function spherePoints(count: number): Point[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = golden * i;
    return { x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius };
  });
}

const TAU = Math.PI * 2;
const ALPHA_STEPS = 6;
const COLOR_STEPS = 5;

const hexToRgb = (hex: string) => {
  const value = parseInt(hex.trim().replace('#', ''), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255] as const;
};

/**
 * The hero visual: a slowly rotating sphere of dots, lit from wherever the pointer is.
 * Canvas 2D on purpose: it looks three-dimensional without shipping a 3D engine.
 * It pauses when off-screen or when the tab is hidden, and renders one still frame
 * for visitors who prefer reduced motion.
 */
export function HeroOrb({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduced = prefersReducedMotion();
    const fine = isFinePointer();
    const points = spherePoints(fine ? 900 : 380);

    // Dots are grouped into a few alpha × colour buckets and each bucket is filled in one path.
    // That turns ~900 fill calls per frame into at most 30, which matters on phones.
    const bucketCount = ALPHA_STEPS * COLOR_STEPS;
    const buckets = Array.from({ length: bucketCount }, () => new Float32Array(points.length * 3));
    const counts = new Uint16Array(bucketCount);
    let styles: string[] = [];

    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;

    // Rotation state: `spin` advances on its own, `tilt` eases toward the pointer.
    let spin = 0.6;
    const tilt = { x: -0.25, y: 0, tx: -0.25, ty: 0 };
    const light = { x: -0.4, y: -0.5, tx: -0.4, ty: -0.5 };

    const readColors = () => {
      const css = getComputedStyle(document.documentElement);
      const a = hexToRgb(css.getPropertyValue('--accent'));
      const b = hexToRgb(css.getPropertyValue('--accent-2'));
      styles = [];
      for (let ai = 0; ai < ALPHA_STEPS; ai++) {
        for (let ci = 0; ci < COLOR_STEPS; ci++) {
          const mix = ci / (COLOR_STEPS - 1);
          const channel = (i: number) => Math.round(a[i] + (b[i] - a[i]) * mix);
          const alpha = ((ai + 1) / ALPHA_STEPS).toFixed(2);
          styles.push(`rgba(${channel(0)}, ${channel(1)}, ${channel(2)}, ${alpha})`);
        }
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const radius = Math.min(width, height) * 0.4;
      const cx = width / 2;
      const cy = height / 2;
      const cosY = Math.cos(spin + tilt.y);
      const sinY = Math.sin(spin + tilt.y);
      const cosX = Math.cos(tilt.x);
      const sinX = Math.sin(tilt.x);
      const camera = 3.2;
      counts.fill(0);

      for (const p of points) {
        // Rotate around Y, then X.
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.x * sinY + p.z * cosY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        const scale = camera / (camera - z2);
        const px = cx + x1 * radius * scale;
        const py = cy + y2 * radius * scale;

        // Light: brighter where the surface faces the pointer; back of the sphere stays faint.
        const facing = Math.max(0, x1 * light.x + y2 * light.y + z2 * 0.75);
        const depth = (z2 + 1) / 2;
        const alpha = Math.min(1, 0.1 + depth * 0.32 + facing * 0.6);
        const size = (0.55 + depth * 1.05 + facing * 0.9) * scale;
        const mix = Math.min(1, Math.max(0, (y2 + 1) / 2 + facing * 0.25));

        const ai = Math.min(ALPHA_STEPS - 1, (alpha * ALPHA_STEPS) | 0);
        const ci = Math.min(COLOR_STEPS - 1, (mix * COLOR_STEPS) | 0);
        const bucket = ai * COLOR_STEPS + ci;
        const offset = counts[bucket]++ * 3;
        buckets[bucket][offset] = px;
        buckets[bucket][offset + 1] = py;
        buckets[bucket][offset + 2] = size;
      }

      for (let bucket = 0; bucket < bucketCount; bucket++) {
        const count = counts[bucket];
        if (!count) continue;
        const data = buckets[bucket];
        ctx.fillStyle = styles[bucket];
        ctx.beginPath();
        for (let i = 0; i < count * 3; i += 3) {
          ctx.moveTo(data[i] + data[i + 2], data[i + 1]);
          ctx.arc(data[i], data[i + 1], data[i + 2], 0, TAU);
        }
        ctx.fill();
      }
    };

    // Phones render every other frame (~30 fps): the motion is slow enough that it reads the same.
    let skip = false;
    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (!fine) {
        skip = !skip;
        if (skip) return;
      }
      spin += fine ? 0.0022 : 0.0044;
      tilt.x += (tilt.tx - tilt.x) * 0.05;
      tilt.y += (tilt.ty - tilt.y) * 0.05;
      light.x += (light.tx - light.x) * 0.06;
      light.y += (light.ty - light.y) * 0.06;
      draw();
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (!reduced && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    const onPointer = (event: PointerEvent) => {
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = (event.clientY / window.innerHeight) * 2 - 1;
      tilt.ty = nx * 0.5;
      tilt.tx = -0.25 + ny * 0.35;
      light.tx = nx;
      light.ty = ny;
    };

    readColors();
    resize();
    draw();
    // One still frame straight away; the animation starts once hydration has had room to finish.
    const startTimer = window.setTimeout(start, 900);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw();
    });
    resizeObserver.observe(canvas);

    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    viewObserver.observe(canvas);

    // Repaint with the new palette when the theme changes.
    const themeObserver = new MutationObserver(() => {
      readColors();
      draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    document.addEventListener('visibilitychange', start);
    if (fine && !reduced) window.addEventListener('pointermove', onPointer, { passive: true });

    return () => {
      window.clearTimeout(startTimer);
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      viewObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener('visibilitychange', start);
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}

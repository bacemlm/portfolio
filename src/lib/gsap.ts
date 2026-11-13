// GSAP lives in its own lazily loaded chunk: only the sections below the fold import this file,
// so the hero can paint without waiting for it.
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onSmoothScroll } from './scroll';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// When Lenis drives the scroll position, tell ScrollTrigger on every frame.
onSmoothScroll(ScrollTrigger.update);

export { gsap, ScrollTrigger, useGSAP };

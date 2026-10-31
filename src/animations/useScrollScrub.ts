import { useRef } from 'react';
import { gsap, useGSAP } from './gsap';

/**
 * GSAP ScrollTrigger scrub helper. Pass a function that builds a timeline on the container.
 * Example: const ref = useScrollScrub((tl) => tl.to('.title', { x: -200 }));
 */
export function useScrollScrub<T extends HTMLElement = HTMLDivElement>(
  build: (tl: gsap.core.Timeline) => void,
  opts: { start?: string; end?: string; pin?: boolean; scrub?: number | boolean } = {},
) {
  const ref = useRef<T>(null);
  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: opts.start ?? 'top bottom', end: opts.end ?? 'bottom top', scrub: opts.scrub ?? 1, pin: opts.pin },
      });
      build(tl);
    },
    { scope: ref },
  );
  return ref;
}

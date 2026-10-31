import type { ReactNode } from 'react';

/** Infinite CSS marquee. Duplicates children for a seamless loop; pauses on hover. */
export function Marquee({ children, duration = 30, reverse = false, className = '' }: { children: ReactNode; duration?: number; reverse?: boolean; className?: string }) {
  return (
    <div className={`group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)] ${className}`}>
      <div className="flex w-max shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused]"
        style={{ ['--marquee-duration' as string]: `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' }}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>{children}</div>
      </div>
    </div>
  );
}

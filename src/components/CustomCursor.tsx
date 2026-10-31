import { useEffect, useRef, useState } from 'react';

/**
 * Dot + trailing ring cursor. Grows over elements with [data-cursor="hover"], a, button.
 * Shows a label for [data-cursor-label="View"]. Hidden on touch devices.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');
  const [active, setActive] = useState(false);
  const [enabled] = useState(() => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches);

  useEffect(() => {
    if (!enabled) return;
    const pos = { x: innerWidth / 2, y: innerHeight / 2 }, trail = { ...pos };
    let raf = 0;
    const move = (e: PointerEvent) => {
      pos.x = e.clientX; pos.y = e.clientY;
      const t = (e.target as HTMLElement).closest<HTMLElement>('a,button,[data-cursor]');
      setActive(!!t);
      setLabel(t?.dataset.cursorLabel ?? '');
    };
    const loop = () => {
      trail.x += (pos.x - trail.x) * 0.18; trail.y += (pos.y - trail.y) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener('pointermove', move);
    loop();
    document.documentElement.style.cursor = 'none';
    return () => { removeEventListener('pointermove', move); cancelAnimationFrame(raf); document.documentElement.style.cursor = ''; };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[100] -ml-1 -mt-1 h-2 w-2 rounded-full bg-fg mix-blend-difference" />
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[99]">
        <div className={`-translate-x-1/2 -translate-y-1/2 rounded-full border border-fg/50 transition-all duration-300 ease-out grid place-items-center text-[10px] font-mono uppercase tracking-widest
          ${label ? 'h-20 w-20 bg-accent text-white border-transparent' : active ? 'h-14 w-14 bg-fg/10' : 'h-8 w-8'}`}>
          {label}
        </div>
      </div>
    </>
  );
}

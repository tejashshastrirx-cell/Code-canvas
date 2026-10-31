import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { ReactNode } from 'react';

/** 3D tilt card with cursor-following spotlight. */
export function TiltCard({ children, className = '', max = 10 }: { children: ReactNode; className?: string; max?: number }) {
  const mx = useMotionValue(0.5), my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [max, -max]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 200, damping: 20 });
  const spot = useMotionTemplate`radial-gradient(400px circle at ${useTransform(mx, (v) => v * 100)}% ${useTransform(my, (v) => v * 100)}%, rgb(var(--accent) / 0.18), transparent 60%)`;
  return (
    <motion.div style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width); my.set((e.clientY - r.top) / r.height); }}
      onPointerLeave={() => { mx.set(0.5); my.set(0.5); }}
      className={`relative overflow-hidden rounded-3xl border border-line/10 bg-surface/60 ${className}`}>
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: spot }} />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

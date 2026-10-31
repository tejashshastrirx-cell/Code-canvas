import { useProgress } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/** Full-screen intro loader tied to the global three.js loading manager. */
export function Loader({ brand = 'LOADING', minDuration = 900 }: { brand?: string; minDuration?: number }) {
  const { progress } = useProgress();
  const [done, setDone] = useState(false);
  const [minElapsed, setMinElapsed] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMinElapsed(true), minDuration); return () => clearTimeout(t); }, [minDuration]);
  // Fail-safe: never block the page for more than 4s.
  useEffect(() => { const t = setTimeout(() => setDone(true), 4000); return () => clearTimeout(t); }, []);
  useEffect(() => { if (minElapsed && progress >= 100) setDone(true); }, [minElapsed, progress]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div exit={{ opacity: 0, y: '-100%' }} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-bg">
          <div className="font-display text-sm tracking-[0.5em] text-muted">{brand}</div>
          <div className="mt-6 h-px w-48 overflow-hidden bg-fg/10">
            <motion.div className="h-full bg-gradient-to-r from-accent to-accent2" animate={{ width: `${progress}%` }} />
          </div>
          <div className="mt-4 font-mono text-xs text-muted">{Math.round(progress)}%</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

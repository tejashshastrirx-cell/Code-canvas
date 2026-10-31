import type { Variants } from 'framer-motion';

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
};

export const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

export const maskReveal: Variants = {
  hidden: { y: '110%' },
  show: (i: number = 0) => ({ y: '0%', transition: { duration: 1, delay: i * 0.06, ease: [0.76, 0, 0.24, 1] } }),
};

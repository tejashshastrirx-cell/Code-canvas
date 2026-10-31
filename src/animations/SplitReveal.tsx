import { motion } from 'framer-motion';
import { maskReveal } from './variants';

/** Word-by-word masked reveal. Animates once when scrolled into view. */
export function SplitReveal({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <motion.span className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-10%' }} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
          <motion.span className="inline-block" variants={maskReveal} custom={i + delay * 10}>
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

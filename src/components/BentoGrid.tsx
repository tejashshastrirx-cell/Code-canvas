import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '@/animations/variants';

export interface BentoItem { title: string; body: string; icon?: ReactNode; span?: string; visual?: ReactNode }

/** Responsive bento grid. `span` takes Tailwind classes e.g. "md:col-span-2 md:row-span-2". */
export function BentoGrid({ items }: { items: BentoItem[] }) {
  return (
    <div className="grid auto-rows-[minmax(220px,auto)] grid-cols-1 gap-4 md:grid-cols-4">
      {items.map((it, i) => (
        <motion.article key={it.title} variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }}
          className={`group relative flex flex-col justify-end overflow-hidden rounded-3xl border border-line/10 bg-surface/60 p-6 transition-colors hover:border-accent/40 ${it.span ?? ''}`}>
          {it.visual && <div className="absolute inset-0">{it.visual}</div>}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/20 to-transparent" />
          <div className="relative">
            {it.icon && <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-accent/15 text-accent">{it.icon}</div>}
            <h3 className="text-xl font-medium">{it.title}</h3>
            <p className="mt-2 max-w-sm text-sm text-muted">{it.body}</p>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

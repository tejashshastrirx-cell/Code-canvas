import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ModelViewer } from '@/three';
import { SectionHeading } from '@/components';
import { MODELS } from '@/data/assets';

export interface Product { name: string; tag: string; price: string; url: string; blurb: string }

const DEFAULT: Product[] = [
  { name: 'Aero Runner', tag: 'Footwear', price: '$189', url: MODELS.products.sneaker, blurb: 'Knit upper, sculpted sole, built for motion.' },
  { name: 'Pulse Box', tag: 'Audio', price: '$249', url: MODELS.products.boombox, blurb: 'Retro silhouette, room-filling sound.' },
  { name: 'Flux Bottle', tag: 'Lifestyle', price: '$39', url: MODELS.products.waterBottle, blurb: 'Brushed steel, 24h cold.' },
  { name: 'Frame One', tag: 'Optics', price: '$899', url: MODELS.products.camera, blurb: 'Analogue soul, precision engineering.' },
  { name: 'Heritage', tag: 'Collector', price: '$2,400', url: MODELS.hero.antiqueCamera, blurb: 'A field camera from another century.' },
];

/** Interactive 3D product configurator: tab list + drag-to-rotate viewer + animated details. */
export function ProductShowcase({ products = DEFAULT }: { products?: Product[] }) {
  const [i, setI] = useState(0);
  const p = products[i];
  return (
    <section id="showcase" className="container-x py-28 md:py-40">
      <SectionHeading eyebrow="01 — Interactive" title="Every object, fully explorable." body="Drag to rotate. Real glTF models lit by an HDRI studio, with physically based materials." />
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="relative h-[420px] overflow-hidden rounded-[2rem] border border-line/10 bg-gradient-to-b from-surface to-bg md:h-[600px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgb(var(--accent)/0.18),transparent_60%)]" />
          <ModelViewer key={p.url} url={p.url} size={p.url === MODELS.products.waterBottle ? 2.8 : 2.4} />
          <span className="absolute bottom-5 left-6 font-mono text-xs text-muted">DRAG TO ROTATE</span>
        </div>
        <div className="flex flex-col gap-3">
          {products.map((pr, idx) => (
            <button key={pr.name} onClick={() => setI(idx)} data-cursor="hover"
              className={`group flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition ${idx === i ? 'border-accent bg-accent/10' : 'border-line/10 hover:border-line/30'}`}>
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-widest text-muted">{pr.tag}</span>
                <span className="font-display text-lg">{pr.name}</span>
              </span>
              <span className="font-mono text-sm text-muted">{pr.price}</span>
            </button>
          ))}
          <AnimatePresence mode="wait">
            <motion.p key={p.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-4 text-muted">
              {p.blurb}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

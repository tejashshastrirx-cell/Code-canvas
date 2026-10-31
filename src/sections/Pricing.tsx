import { useState } from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, SectionHeading, TiltCard } from '@/components';

export interface Plan { name: string; monthly: number; features: string[]; featured?: boolean }
const DEFAULT: Plan[] = [
  { name: 'Starter', monthly: 19, features: ['1 project', 'Core components', 'Community support'] },
  { name: 'Studio', monthly: 49, features: ['10 projects', '3D product viewer', 'Shader library', 'Priority support'], featured: true },
  { name: 'Enterprise', monthly: 149, features: ['Unlimited projects', 'Custom shaders', 'Dedicated engineer', 'SLA'] },
];

/** Pricing with monthly/yearly toggle (20% off yearly) and tilt cards. */
export function Pricing({ plans = DEFAULT }: { plans?: Plan[] }) {
  const [yearly, setYearly] = useState(false);
  return (
    <section id="pricing" className="container-x py-28 md:py-40">
      <SectionHeading eyebrow="06 — Pricing" title="Simple, honest pricing." align="center" />
      <div className="mb-12 flex justify-center">
        <div className="glass relative flex rounded-full p-1 text-sm">
          {['Monthly', 'Yearly −20%'].map((l, i) => (
            <button key={l} onClick={() => setYearly(i === 1)} className="relative z-10 px-5 py-2">
              {(i === 1) === yearly && <motion.span layoutId="price-pill" className="absolute inset-0 -z-10 rounded-full bg-fg" />}
              <span className={(i === 1) === yearly ? 'text-bg' : 'text-muted'}>{l}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <TiltCard key={p.name} className={`p-8 ${p.featured ? 'border-accent/60 shadow-[0_0_80px_-20px_rgb(var(--accent)/0.6)]' : ''}`}>
            {p.featured && <span className="absolute right-6 top-6 rounded-full bg-accent px-3 py-1 font-mono text-[10px] uppercase text-white">Popular</span>}
            <h3 className="font-display text-xl">{p.name}</h3>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-display text-5xl">${yearly ? Math.round(p.monthly * 0.8) : p.monthly}</span>
              <span className="text-muted">/mo</span>
            </div>
            <ul className="mt-8 space-y-3 text-sm">
              {p.features.map((f) => <li key={f} className="flex items-center gap-3"><Check size={16} className="text-accent" />{f}</li>)}
            </ul>
            <Button variant={p.featured ? 'primary' : 'outline'} className="mt-10 w-full justify-center" magnetic={false}>Choose {p.name}</Button>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}

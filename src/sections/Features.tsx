import { Cpu, Layers, Sparkles, Zap, Gem, Globe } from 'lucide-react';
import { BentoGrid, SectionHeading, type BentoItem } from '@/components';
import { ShaderBackground } from '@/three';

const DEFAULT: BentoItem[] = [
  { title: 'Shader-driven surfaces', body: 'Custom GLSL gradients and particles that react to the cursor.', icon: <Sparkles size={18} />, span: 'md:col-span-2 md:row-span-2 min-h-[360px]',
    visual: <ShaderBackground className="absolute inset-0" a="#6d3bff" b="#00c8ff" c="#ff4d9d" /> },
  { title: 'Real-time', body: 'Adaptive DPR keeps 60fps on modest GPUs.', icon: <Zap size={18} />, span: 'md:col-span-2' },
  { title: 'Modular', body: 'Every section is a prop-driven component.', icon: <Layers size={18} /> },
  { title: 'Lightweight', body: 'Textures resized to 1K WebP.', icon: <Cpu size={18} /> },
  { title: 'Licensed right', body: 'Every asset is CC0, CC-BY, OFL or ISC — and credited.', icon: <Gem size={18} />, span: 'md:col-span-2' },
  { title: 'Works anywhere', body: 'Static build with relative paths. Deploy to any host.', icon: <Globe size={18} />, span: 'md:col-span-2' },
];

export function Features({ items = DEFAULT }: { items?: BentoItem[] }) {
  return (
    <section id="features" className="container-x py-28 md:py-40">
      <SectionHeading eyebrow="02 — Capabilities" title="Built for the two-hour sprint." />
      <BentoGrid items={items} />
    </section>
  );
}

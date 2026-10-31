import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Button, Magnetic, Marquee, TiltCard } from '@/components';
import { Reveal, SplitReveal } from '@/animations';
import { ShaderBackground } from '@/three';

/** Visual index of standalone UI primitives. */
export default function Kit() {
  return (
    <main className="container-x space-y-20 pb-24 pt-32">
      <header>
        <p className="eyebrow">Component kit</p>
        <h1 className="mt-3 text-5xl font-medium md:text-7xl"><SplitReveal text="Primitives, ready to compose." /></h1>
      </header>
      <section className="space-y-4">
        <p className="eyebrow">Buttons (magnetic)</p>
        <div className="flex flex-wrap gap-3">
          <Button icon={<ArrowUpRight size={16} />}>Primary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
          <Magnetic strength={0.6}><span className="inline-grid h-16 w-16 place-items-center rounded-full bg-accent text-white"><Sparkles size={20} /></span></Magnetic>
        </div>
      </section>
      <section className="space-y-4">
        <p className="eyebrow">Tilt cards</p>
        <div className="grid gap-4 md:grid-cols-3">
          {['Spotlight', 'Perspective', 'Spring'].map((t, i) => (
            <Reveal key={t} delay={i}><TiltCard className="p-8"><h3 className="text-2xl">{t}</h3><p className="mt-2 text-muted">Move your cursor over me.</p></TiltCard></Reveal>
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <p className="eyebrow">Shader gradient</p>
        <div className="relative h-72 overflow-hidden rounded-3xl"><ShaderBackground className="absolute inset-0" /></div>
      </section>
      <section className="space-y-4">
        <p className="eyebrow">Marquee</p>
        <Marquee duration={15}>{['One', 'Two', 'Three', 'Four', 'Five'].map((w) => <span key={w} className="mx-6 font-display text-4xl">{w} ✦</span>)}</Marquee>
      </section>
    </main>
  );
}

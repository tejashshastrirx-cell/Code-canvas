import { SplitReveal } from '@/animations/SplitReveal';
import { Reveal } from '@/animations/Reveal';

export function SectionHeading({ eyebrow, title, body, align = 'left' }: { eyebrow: string; title: string; body?: string; align?: 'left' | 'center' }) {
  return (
    <div className={`mb-14 max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      <Reveal><p className="eyebrow mb-4">{eyebrow}</p></Reveal>
      <h2 className="text-4xl font-medium leading-[1.05] md:text-6xl"><SplitReveal text={title} /></h2>
      {body && <Reveal delay={2}><p className="mt-6 text-lg text-muted">{body}</p></Reveal>}
    </div>
  );
}

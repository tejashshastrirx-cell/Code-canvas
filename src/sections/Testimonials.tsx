import { Marquee, SectionHeading } from '@/components';

export interface Testimonial { quote: string; name: string; role: string }
const DEFAULT: Testimonial[] = [
  { quote: 'The first viewport alone won us the pitch.', name: 'Ava Lindqvist', role: 'Creative Lead, Northbound' },
  { quote: 'Felt like a product launch, not a landing page.', name: 'Marcus Oyelaran', role: 'Founder, Halcyon Audio' },
  { quote: 'Smooth on my five-year-old phone. Unreal.', name: 'Priya Natarajan', role: 'Head of Digital, Verde' },
  { quote: 'Our conversion rate doubled after the 3D configurator.', name: 'Tom Becker', role: 'E-commerce Director, Lumen' },
  { quote: 'Every interaction feels considered.', name: 'Sofia Marquez', role: 'Design Director, Atelier 9' },
];

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="glass mx-3 w-[320px] shrink-0 rounded-3xl p-7 md:w-[400px]">
      <blockquote className="font-serif text-xl leading-snug md:text-2xl">“{t.quote}”</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-accent to-accent2 font-display text-sm text-white">
          {t.name.split(' ').map((n) => n[0]).join('')}
        </span>
        <span><span className="block text-sm font-medium">{t.name}</span><span className="text-xs text-muted">{t.role}</span></span>
      </figcaption>
    </figure>
  );
}

/** Two-row testimonial marquee (fictional placeholder quotes — replace per brief). */
export function Testimonials({ items = DEFAULT }: { items?: Testimonial[] }) {
  return (
    <section id="testimonials" className="py-28 md:py-40">
      <div className="container-x"><SectionHeading eyebrow="05 — Voices" title="Loved by teams who ship." align="center" /></div>
      <Marquee duration={50}>{items.map((t) => <Card key={t.name} t={t} />)}</Marquee>
      <Marquee duration={60} reverse className="mt-6">{[...items].reverse().map((t) => <Card key={t.name} t={t} />)}</Marquee>
    </section>
  );
}

import { Marquee } from '@/components';
import { ICONS } from '@/data/assets';

/** Big kinetic word marquee + icon strip. */
export function MarqueeSection({ words = ['Real-time 3D', 'PBR Materials', 'Cinematic Light', 'GSAP Motion', 'WebGL', 'Shaders', 'Responsive'] }: { words?: string[] }) {
  return (
    <section id="marquee" className="border-y border-line/10 py-10">
      <Marquee duration={40}>
        {words.map((w) => (
          <span key={w} className="mx-8 flex items-center gap-8 font-display text-5xl font-medium tracking-tight md:text-7xl">
            {w}<span className="h-3 w-3 rounded-full bg-accent" />
          </span>
        ))}
      </Marquee>
      <Marquee duration={25} reverse className="mt-8 opacity-60">
        {ICONS.map((i) => <img key={i.name} src={i.src} alt={i.name} className="mx-10 h-7 w-7 dark:invert" />)}
      </Marquee>
    </section>
  );
}

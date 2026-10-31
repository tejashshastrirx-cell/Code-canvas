import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { Scene, Model } from '@/three';
import { gsap, ScrollTrigger, useGSAP } from '@/animations/gsap';
import { HDRI, MODELS } from '@/data/assets';

const progress = { value: 0 };

function ScrubbedModel({ url }: { url: string }) {
  const ref = useRef<Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    const p = progress.value;
    ref.current.rotation.y = p * Math.PI * 2;
    ref.current.position.y = Math.sin(p * Math.PI) * 0.2;
    ref.current.scale.setScalar(0.9 + p * 0.25);
  });
  return <group ref={ref}><Model url={url} size={2.4} /></group>;
}

export interface Chapter { kicker: string; title: string; body: string }
const DEFAULT: Chapter[] = [
  { kicker: 'Light', title: 'Lit by the real world.', body: 'HDRI environments captured on location give every reflection a story.' },
  { kicker: 'Material', title: 'Honest materials.', body: 'Metal, glass and wood — measured, physically based, 1K optimised.' },
  { kicker: 'Motion', title: 'Choreographed by scroll.', body: 'GSAP ScrollTrigger drives the 3D scene frame-perfectly.' },
];

/** Pinned scroll-story: a GLB rotates with scroll progress while chapters cross-fade. */
export function ScrollStory({ chapters = DEFAULT, model = MODELS.hero.lantern }: { chapters?: Chapter[]; model?: string }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    const steps = gsap.utils.toArray<HTMLElement>('.chapter');
    gsap.set(steps.slice(1), { autoAlpha: 0, y: 40 });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root.current, start: 'top top', end: `+=${chapters.length * 100}%`, pin: true, scrub: 1,
        onUpdate: (st: ScrollTrigger) => { progress.value = st.progress; },
      },
    });
    steps.forEach((s, i) => {
      if (i === 0) return;
      tl.to(steps[i - 1], { autoAlpha: 0, y: -40 }).to(s, { autoAlpha: 1, y: 0 }, '<0.2');
    });
    tl.to('.story-bar', { scaleX: 1, ease: 'none', duration: tl.duration() }, 0);
  }, { scope: root });

  return (
    <section ref={root} id="story" className="relative h-[100svh] overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[55%] md:inset-y-0 md:left-1/3 md:h-auto">
        <Scene hdri={HDRI.sunset} camera={{ position: [0, 0, 6], fov: 35 }}><ScrubbedModel url={model} /></Scene>
      </div>
      <div className="container-x relative flex h-full items-end pb-24 md:items-center md:pb-0">
        <div className="relative h-56 w-full max-w-md md:h-64">
          {chapters.map((c, i) => (
            <div key={c.title} className="chapter absolute inset-0">
              <p className="eyebrow mb-4">0{i + 1} / {c.kicker}</p>
              <h3 className="text-4xl font-medium leading-tight md:text-6xl">{c.title}</h3>
              <p className="mt-5 text-muted">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 h-px w-48 -translate-x-1/2 bg-fg/10">
        <div className="story-bar h-full origin-left scale-x-0 bg-accent" />
      </div>
    </section>
  );
}

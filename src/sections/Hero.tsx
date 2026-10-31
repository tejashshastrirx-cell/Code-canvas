import { Float, Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group } from 'three';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Scene, Model, ParticleField, FloatingObjects, CameraRig, Effects } from '@/three';
import { Button, scrollToId, useTheme } from '@/components';
import { gsap, useGSAP } from '@/animations/gsap';
import { HDRI, MODELS } from '@/data/assets';

function Centerpiece({ url, mobile }: { url: string; mobile: boolean }) {
  const ref = useRef<Group>(null);
  useFrame((s, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.15;
    ref.current.rotation.x = s.pointer.y * 0.15;
  });
  return (
    <group ref={ref} position={mobile ? [0, 0.9, 0] : [1.5, 0, 0]}>
      <Float speed={1.2} floatIntensity={0.6} rotationIntensity={0.2}>
        <Model url={url} size={mobile ? 2.2 : 2.9} envMapIntensity={1.4} />
      </Float>
    </group>
  );
}

export interface HeroProps {
  eyebrow?: string;
  title?: [string, string];
  body?: string;
  model?: string;
  hdri?: string;
}

/** Fullscreen 3D hero: centrepiece GLB, glass abstract objects, particles, bloom, GSAP intro + scroll-out. */
export function Hero({
  eyebrow = 'Code Canvas — Studio Edition',
  title = ['Sculpt the', 'impossible.'],
  body = 'A premium real-time 3D starter. Physically-based materials, cinematic lighting and motion — ready for any brief.',
  model = MODELS.hero.marbleBust,
  hdri = HDRI.city,
}: HeroProps) {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    const tl = gsap.timeline({ delay: 1.1 });
    tl.from('.hero-line > span', { yPercent: 110, duration: 1.2, stagger: 0.12, ease: 'expo.out' })
      .from('.hero-fade', { opacity: 0, y: 20, stagger: 0.1, duration: 0.8 }, '-=0.7')
      .from('.hero-canvas', { opacity: 0, scale: 1.08, duration: 2, ease: 'power2.out' }, 0);
    gsap.to('.hero-canvas', { yPercent: 25, opacity: 0.2, scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-copy', { yPercent: -40, opacity: 0, scrollTrigger: { trigger: root.current, start: 'top top', end: '70% top', scrub: true } });
  }, { scope: root });

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const { theme } = useTheme();
  const bg = theme === 'dark' ? '#07070c' : '#f6f5f1';
  return (
    <section ref={root} id="top" className="relative h-[100svh] min-h-[640px] overflow-hidden">
      <div className="hero-canvas absolute inset-0">
        <Scene hdri={hdri} envIntensity={0.9} camera={{ position: [0, 0, 6], fov: 38 }}>
          <color attach="background" args={[bg]} />
          <fog attach="fog" args={[bg, 7, 16]} />
          <Centerpiece url={model} mobile={isMobile} />
          <FloatingObjects />
          <ParticleField count={isMobile ? 900 : 2200} />
          <Sparkles count={60} scale={8} size={2} speed={0.3} color="#b9a4ff" />
          <CameraRig base={[0, 0, 6]} strength={0.5} />
          <Effects enabled={!isMobile} bloom={0.7} />
        </Scene>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgb(var(--bg))_85%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-bg via-bg/70 to-transparent md:h-1/2 md:via-bg/30" />
      <div className="hero-copy container-x pointer-events-none relative z-10 flex h-full flex-col justify-end pb-16 md:pb-24">
        <p className="hero-fade eyebrow mb-6">{eyebrow}</p>
        <h1 className="text-[clamp(3.2rem,11vw,10rem)] font-medium leading-[0.88] tracking-[-0.04em]">
          <span className="hero-line block overflow-hidden"><span className="block">{title[0]}</span></span>
          <span className="hero-line block overflow-hidden"><span className="block font-serif italic text-gradient pr-4">{title[1]}</span></span>
        </h1>
        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="hero-fade max-w-md text-base text-muted md:text-lg">{body}</p>
          <div className="hero-fade pointer-events-auto flex gap-3">
            <Button icon={<ArrowUpRight size={16} />} onClick={() => scrollToId('showcase')}>Explore products</Button>
            <Button variant="ghost" onClick={() => scrollToId('pricing')}>Pricing</Button>
          </div>
        </div>
      </div>
      <button onClick={() => scrollToId('marquee')} aria-label="Scroll down"
        className="hero-fade absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 animate-bounce text-muted md:block"><ArrowDown size={18} /></button>
    </section>
  );
}

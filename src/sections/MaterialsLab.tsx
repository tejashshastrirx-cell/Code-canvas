import { useState } from 'react';
import { ContactShadows, Float } from '@react-three/drei';
import { Scene, PBRSphere } from '@/three';
import { SectionHeading } from '@/components';
import { HDRI, MATERIALS } from '@/data/assets';

const LIST = Object.entries(MATERIALS) as [keyof typeof MATERIALS, (typeof MATERIALS)[keyof typeof MATERIALS]][];

/** PBR material showcase: ambientCG texture sets on spheres, hover/tap to focus. */
export function MaterialsLab() {
  const [active, setActive] = useState(0);
  return (
    <section id="materials" className="container-x py-28 md:py-40">
      <SectionHeading eyebrow="03 — Materials" title="Five physically based surfaces." body="Colour, normal, roughness and metalness maps from ambientCG (CC0)." />
      <div className="h-[340px] overflow-hidden rounded-[2rem] border border-line/10 bg-surface/50 md:h-[420px]">
        <Scene hdri={HDRI.studio} camera={{ position: [0, 0, 12], fov: 28 }}>
          {LIST.map(([name, maps], i) => (
            <Float key={name} speed={2} floatIntensity={active === i ? 1 : 0.3}>
              <PBRSphere maps={maps} position={[(i - 2) * 2.3, 0, 0]} scale={active === i ? 1.05 : 0.8}
                onPointerOver={() => setActive(i)} onClick={() => setActive(i)} />
            </Float>
          ))}
          <ContactShadows position={[0, -1.3, 0]} opacity={0.4} scale={14} blur={2.5} />
        </Scene>
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {LIST.map(([name], i) => (
          <button key={name} onClick={() => setActive(i)}
            className={`rounded-full px-4 py-2 font-mono text-xs uppercase tracking-widest transition ${active === i ? 'bg-fg text-bg' : 'border border-line/15 text-muted'}`}>{name}</button>
        ))}
      </div>
    </section>
  );
}

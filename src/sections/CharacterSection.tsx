import { useCallback, useState } from 'react';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import { Scene, AnimatedCharacter } from '@/three';
import { SectionHeading } from '@/components';
import { HDRI, MODELS } from '@/data/assets';

const PREFERRED = ['Wave', 'Dance', 'Idle', 'Running', 'Jump', 'ThumbsUp', 'Yes', 'No'];

/** Rigged character with clickable animation clips (RobotExpressive by Quaternius, CC0). */
export function CharacterSection({ url = MODELS.characters.robot }: { url?: string }) {
  const [names, setNames] = useState<string[]>([]);
  const [action, setAction] = useState('Wave');
  const onActions = useCallback((n: string[]) => setNames(n), []);
  const buttons = names.length ? PREFERRED.filter((p) => names.includes(p)) : [];
  return (
    <section id="character" className="container-x grid items-center gap-10 py-28 md:grid-cols-2 md:py-40">
      <div>
        <SectionHeading eyebrow="04 — Characters" title="Give your brand a personality." body="Skinned, animated glTF characters with cross-faded clips. Tap a move." />
        <div className="flex flex-wrap gap-2">
          {buttons.map((b) => (
            <button key={b} onClick={() => setAction(b)}
              className={`rounded-full px-4 py-2 text-sm transition ${action === b ? 'bg-accent text-white' : 'border border-line/15 hover:border-accent'}`}>{b}</button>
          ))}
        </div>
      </div>
      <div className="h-[460px] overflow-hidden rounded-[2rem] border border-line/10 bg-gradient-to-b from-accent/10 to-transparent md:h-[560px]">
        <Scene hdri={HDRI.studio} shadows camera={{ position: [0, 2.2, 7], fov: 35 }}>
          <directionalLight position={[3, 5, 2]} intensity={1.5} castShadow />
          <AnimatedCharacter url={url} action={action} onActions={onActions} position={[0, -1.6, 0]} scale={0.55} />
          <ContactShadows position={[0, -1.6, 0]} opacity={0.5} scale={8} blur={2} />
          <OrbitControls enablePan={false} enableZoom={false} target={[0, 0.2, 0]} minPolarAngle={1} maxPolarAngle={1.6} />
        </Scene>
      </div>
    </section>
  );
}

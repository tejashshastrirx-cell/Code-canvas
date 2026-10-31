import { ContactShadows, OrbitControls, PresentationControls } from '@react-three/drei';
import { Suspense } from 'react';
import { Scene } from './Scene';
import { Model } from './Model';
import { HDRI } from '@/data/assets';

/**
 * Interactive product viewer: drag to rotate, auto-rotate, contact shadow, studio HDRI.
 * `mode="orbit"` for full orbit + zoom, `"present"` for constrained drag with spring-back.
 */
export function ModelViewer({ url, mode = 'present', size = 2.4, autoRotate = true, hdri = HDRI.studio, className = 'h-full w-full' }:
  { url: string; mode?: 'orbit' | 'present'; size?: number; autoRotate?: boolean; hdri?: string; className?: string }) {
  const model = <Model url={url} size={size} />;
  return (
    <div className={className} data-cursor-label="Drag">
      <Scene hdri={hdri} camera={{ position: [0, 0.6, 6], fov: 35 }} shadows>
        <Suspense fallback={null}>
          {mode === 'orbit' ? (
            <>
              {model}
              <OrbitControls autoRotate={autoRotate} autoRotateSpeed={1.2} enablePan={false} minDistance={3} maxDistance={10} makeDefault />
            </>
          ) : (
            <PresentationControls global snap rotation={[0.1, 0.4, 0]} polar={[-0.3, 0.3]} azimuth={[-Infinity, Infinity]} config={{ mass: 1, tension: 170 }}>
              {model}
            </PresentationControls>
          )}
          <ContactShadows position={[0, -size / 2 - 0.05, 0]} opacity={0.55} scale={10} blur={2.4} far={4} />
        </Suspense>
      </Scene>
    </div>
  );
}

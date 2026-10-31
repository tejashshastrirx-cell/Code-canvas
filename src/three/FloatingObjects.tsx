import { Float, MeshTransmissionMaterial, useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import type { BufferGeometry, Mesh } from 'three';
import { MODELS } from '@/data/assets';

type Item = { url: string; position: [number, number, number]; scale?: number; glass?: boolean; speed?: number };

const DEFAULT: Item[] = [
  { url: MODELS.abstract.torusKnot, position: [-3.2, 1.4, -1], scale: 0.55 },
  { url: MODELS.abstract.blob, position: [3.3, -1.2, -0.5], scale: 0.7, glass: true },
  { url: MODELS.abstract.ringStack, position: [2.8, 1.8, -2], scale: 0.6 },
  { url: MODELS.abstract.shard, position: [-2.6, -1.7, 0], scale: 0.45, glass: true },
  { url: MODELS.abstract.twistedPrism, position: [0.2, 2.6, -3], scale: 0.4 },
];

function Obj({ url, position, scale = 1, glass, speed = 1.5 }: Item) {
  const { scene } = useGLTF(url);
  const mesh = useMemo(() => {
    let m: Mesh | undefined;
    scene.traverse((o) => { if ((o as Mesh).isMesh && !m) m = o as Mesh; });
    return m!;
  }, [scene]);
  return (
    <Float speed={speed} rotationIntensity={1.2} floatIntensity={1.5} position={position}>
      <mesh geometry={mesh.geometry as BufferGeometry} scale={scale} material={glass ? undefined : mesh.material}>
        {glass && <MeshTransmissionMaterial samples={4} resolution={256} thickness={0.6} roughness={0.05} chromaticAberration={0.4} anisotropicBlur={0.2} backside />}
      </mesh>
    </Float>
  );
}

/** Floating abstract shapes (pre-generated GLBs). Some rendered as refractive glass. */
export function FloatingObjects({ items = DEFAULT }: { items?: Item[] }) {
  return <>{items.map((it, i) => <Obj key={i} {...it} />)}</>;
}

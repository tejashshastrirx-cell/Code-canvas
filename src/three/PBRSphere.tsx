import { useTexture } from '@react-three/drei';
import type { ThreeElements } from '@react-three/fiber';
import { useMemo } from 'react';
import { RepeatWrapping, SRGBColorSpace, type Texture } from 'three';
import type { MaterialMaps } from '@/data/assets';

/** Hook: load an ambientCG-style map set as a ready-to-spread meshStandardMaterial props object. */
export function usePBR(maps: MaterialMaps, repeat = 1) {
  const keys = (['color', 'normal', 'roughness', 'metalness'] as const).filter((k) => maps[k]);
  const tex = useTexture(Object.fromEntries(keys.map((k) => [k, maps[k]!]))) as Record<string, Texture>;
  return useMemo(() => {
    Object.values(tex).forEach((t) => { t.wrapS = t.wrapT = RepeatWrapping; t.repeat.set(repeat, repeat); });
    tex.color.colorSpace = SRGBColorSpace;
    return { map: tex.color, normalMap: tex.normal, roughnessMap: tex.roughness, ...(tex.metalness ? { metalnessMap: tex.metalness, metalness: 1 } : {}) };
  }, [tex, repeat]);
}

export function PBRSphere({ maps, repeat = 2, ...rest }: ThreeElements['mesh'] & { maps: MaterialMaps; repeat?: number }) {
  const props = usePBR(maps, repeat);
  return (
    <mesh castShadow {...rest}>
      <sphereGeometry args={[1, 96, 96]} />
      <meshStandardMaterial {...props} />
    </mesh>
  );
}

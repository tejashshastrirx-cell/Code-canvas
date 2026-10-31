import { Center, useGLTF } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import type { ThreeElements } from '@react-three/fiber';
import { Box3, Mesh, Vector3, type Object3D } from 'three';

type Props = ThreeElements['group'] & {
  url: string;
  /** Normalise so the largest dimension equals this size (world units). */
  size?: number;
  castShadow?: boolean;
  /** Override envMapIntensity for all materials. */
  envMapIntensity?: number;
};

/** Load any GLB, auto-centre and normalise scale. Clones so the same file can render many times. */
export function Model({ url, size = 2, castShadow = true, envMapIntensity, ...rest }: Props) {
  const { scene } = useGLTF(url);
  const obj = useMemo(() => scene.clone(true), [scene]);
  const scale = useMemo(() => {
    const s = new Box3().setFromObject(obj).getSize(new Vector3());
    return size / Math.max(s.x, s.y, s.z || 1);
  }, [obj, size]);
  useEffect(() => {
    obj.traverse((o: Object3D) => {
      if ((o as Mesh).isMesh) {
        const m = o as Mesh;
        m.castShadow = castShadow; m.receiveShadow = true;
        if (envMapIntensity !== undefined) (m.material as any).envMapIntensity = envMapIntensity;
      }
    });
  }, [obj, castShadow, envMapIntensity]);
  return (
    <group {...rest}>
      <Center scale={scale}><primitive object={obj} /></Center>
    </group>
  );
}

export const preloadModels = (urls: string[]) => urls.forEach((u) => useGLTF.preload(u));

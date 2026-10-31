import { useAnimations, useGLTF } from '@react-three/drei';
import type { ThreeElements } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import type { Group } from 'three';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';

type Props = ThreeElements['group'] & { url: string; action?: string; fade?: number; onActions?: (names: string[]) => void };

/** Skinned GLB with named animation clips. Cross-fades when `action` changes. */
export function AnimatedCharacter({ url, action, fade = 0.4, onActions, ...rest }: Props) {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(url);
  const clone = useMemo(() => cloneSkinned(scene), [scene]);
  const { actions, names } = useAnimations(animations, group);
  useEffect(() => { onActions?.(names); }, [names, onActions]);
  useEffect(() => {
    const a = actions[action ?? names[0]];
    a?.reset().fadeIn(fade).play();
    return () => { a?.fadeOut(fade); };
  }, [action, actions, names, fade]);
  useEffect(() => { clone.traverse((o: any) => { if (o.isMesh) o.castShadow = true; }); }, [clone]);
  return <group ref={group} {...rest}><primitive object={clone} /></group>;
}

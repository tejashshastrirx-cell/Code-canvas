import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';

/** Eases the camera toward the pointer for subtle parallax. Place inside <Canvas>. */
export function CameraRig({ strength = 0.6, base = [0, 0, 5] as [number, number, number] }) {
  useFrame((state, dt) => {
    easing.damp3(state.camera.position, [base[0] + state.pointer.x * strength, base[1] + state.pointer.y * strength * 0.6, base[2]], 0.35, dt);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

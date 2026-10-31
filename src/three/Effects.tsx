import { Bloom, ChromaticAberration, EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';

/** Cinematic post stack. Keep it light: disable on mobile via `enabled`. */
export function Effects({ bloom = 0.6, enabled = true, chroma = true }: { bloom?: number; enabled?: boolean; chroma?: boolean }) {
  if (!enabled) return null;
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={bloom} luminanceThreshold={0.7} luminanceSmoothing={0.2} mipmapBlur />
      <ChromaticAberration offset={new Vector2(chroma ? 0.0006 : 0, chroma ? 0.0006 : 0)} radialModulation={false} modulationOffset={0} />
      <Noise opacity={0.03} blendFunction={BlendFunction.OVERLAY} />
      <Vignette eskil={false} offset={0.2} darkness={0.7} />
    </EffectComposer>
  );
}

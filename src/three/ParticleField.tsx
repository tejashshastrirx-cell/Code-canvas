import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { AdditiveBlending, Color, type Points, type ShaderMaterial } from 'three';

const vert = /* glsl */ `
  uniform float uTime; uniform float uSize; uniform vec2 uMouse;
  attribute float aScale; varying float vAlpha;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.3 + position.x * 0.5) * 0.25;
    p.x += cos(uTime * 0.2 + position.z * 0.5) * 0.25;
    p.xy += uMouse * 0.4 * (p.z + 3.0) * 0.1;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * aScale * (1.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
    vAlpha = smoothstep(12.0, 2.0, -mv.z);
  }`;
const frag = /* glsl */ `
  uniform vec3 uColorA; uniform vec3 uColorB; varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = pow(1.0 - d * 2.0, 2.0) * vAlpha;
    gl_FragColor = vec4(mix(uColorA, uColorB, gl_PointCoord.y), a);
  }`;

/** GPU particle cloud with drift and pointer parallax. Two-colour gradient, additive blending. */
export function ParticleField({ count = 2500, radius = 8, size = 60, colorA = '#8c5cff', colorB = '#00dcff' }) {
  const ref = useRef<Points>(null);
  const [positions, scales] = useMemo(() => {
    const p = new Float32Array(count * 3), s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = radius * Math.cbrt(Math.random()), th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
      p.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th) * 0.6, r * Math.cos(ph)], i * 3);
      s[i] = 0.3 + Math.random();
    }
    return [p, s];
  }, [count, radius]);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 }, uSize: { value: size }, uMouse: { value: [0, 0] },
    uColorA: { value: new Color(colorA) }, uColorB: { value: new Color(colorB) },
  }), [size, colorA, colorB]);
  useFrame((s) => {
    const m = ref.current!.material as ShaderMaterial;
    m.uniforms.uTime.value = s.clock.elapsedTime;
    m.uniforms.uMouse.value = [s.pointer.x, s.pointer.y];
    ref.current!.rotation.y = s.clock.elapsedTime * 0.02;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
      </bufferGeometry>
      <shaderMaterial vertexShader={vert} fragmentShader={frag} uniforms={uniforms} transparent depthWrite={false} blending={AdditiveBlending} />
    </points>
  );
}

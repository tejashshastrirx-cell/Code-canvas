import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Color, type ShaderMaterial } from 'three';

const vert = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;
const frag = /* glsl */ `
  precision highp float;
  uniform float uTime; uniform vec2 uMouse; uniform vec3 uA; uniform vec3 uB; uniform vec3 uC; uniform vec3 uBg;
  varying vec2 vUv;
  // 2D simplex noise (Ashima Arts, MIT)
  vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy)); vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1; i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0); m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0; vec3 h = abs(x) - 0.5; vec3 ox = floor(x + 0.5); vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g; g.x = a0.x * x0.x + h.x * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  void main(){
    vec2 uv = vUv; float t = uTime * 0.06;
    float n1 = snoise(uv * 1.6 + vec2(t, -t) + uMouse * 0.15);
    float n2 = snoise(uv * 2.4 - vec2(t * 1.3, t * 0.7));
    vec3 col = mix(uBg, uA, smoothstep(-0.2, 0.9, n1));
    col = mix(col, uB, smoothstep(0.1, 1.0, n2) * 0.8);
    col = mix(col, uC, smoothstep(0.5, 1.0, n1 * n2 + 0.3) * 0.5);
    float grain = fract(sin(dot(uv * uTime, vec2(12.9898, 78.233))) * 43758.5453) * 0.04;
    gl_FragColor = vec4(col + grain, 1.0);
  }`;

export interface GradientColors { a?: string; b?: string; c?: string; bg?: string }

/** Fullscreen-quad animated noise gradient. Use inside any <Canvas>. */
export function ShaderGradientPlane({ a = '#5b2bff', b = '#00c2ff', c = '#ff3d8b', bg = '#07070c', speed = 1 }: GradientColors & { speed?: number }) {
  const ref = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 }, uMouse: { value: [0, 0] },
    uA: { value: new Color(a) }, uB: { value: new Color(b) }, uC: { value: new Color(c) }, uBg: { value: new Color(bg) },
  }), [a, b, c, bg]);
  useFrame((s) => {
    ref.current!.uniforms.uTime.value = s.clock.elapsedTime * speed;
    ref.current!.uniforms.uMouse.value = [s.pointer.x, s.pointer.y];
  });
  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={ref} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} depthWrite={false} depthTest={false} />
    </mesh>
  );
}

/** Standalone animated gradient background (absolute-fill). */
export function ShaderBackground({ className = 'absolute inset-0 -z-10', ...colors }: GradientColors & { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}>
      <Canvas frameloop={visible ? 'always' : 'never'} dpr={[1, 1.5]} gl={{ antialias: false }}><ShaderGradientPlane {...colors} /></Canvas>
    </div>
  );
}

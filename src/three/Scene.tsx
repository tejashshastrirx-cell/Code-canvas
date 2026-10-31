import { Canvas, type CanvasProps } from '@react-three/fiber';
import { AdaptiveDpr, Environment, PerformanceMonitor, Preload } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';
import { HDRI } from '@/data/assets';

export interface SceneProps extends Omit<CanvasProps, 'children'> {
  children: ReactNode;
  /** Local HDRI path (from HDRI registry) or false for none. Works offline. */
  hdri?: string | false;
  /** Show HDRI as visible background. */
  background?: boolean;
  envIntensity?: number;
}

/**
 * Opinionated R3F canvas: pauses when off-screen, sane tone mapping, adaptive DPR that degrades on slow GPUs,
 * local HDRI lighting, Suspense boundary and asset preloading.
 */
export function Scene({ children, hdri = HDRI.studio, background = false, envIntensity = 1, camera, ...rest }: SceneProps) {
  const [dpr, setDpr] = useState(1.5);
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  // Only render while on screen: big win when a page has several canvases.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '200px' });
    io.observe(wrap.current!);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={wrap} className="h-full w-full">
    <Canvas
      frameloop={visible ? 'always' : 'never'}
      dpr={dpr}
      camera={camera ?? { position: [0, 0, 5], fov: 40 }}
      gl={{ antialias: true, toneMapping: ACESFilmicToneMapping, outputColorSpace: SRGBColorSpace, powerPreference: 'high-performance' }}
      {...rest}>
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(Math.min(2, window.devicePixelRatio))} />
      <AdaptiveDpr pixelated />
      <Suspense fallback={null}>
        {hdri && <Environment files={hdri} background={background} environmentIntensity={envIntensity} />}
        {children}
        <Preload all />
      </Suspense>
    </Canvas>
    </div>
  );
}

import { lazy, Suspense, useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { CustomCursor, GlassNav, Loader, SmoothScroll, ThemeProvider } from '@/components';
import { ScrollTrigger } from '@/animations/gsap';
import Home from '@/pages/Home';

const Kit = lazy(() => import('@/pages/Kit'));
const AssetLibrary = lazy(() => import('@/pages/AssetLibrary'));

function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); ScrollTrigger.refresh(); }, [pathname]);
  return null;
}

const LINKS = [
  { label: 'Showcase', id: 'showcase' },
  { label: 'Materials', id: 'materials' },
  { label: 'Pricing', id: 'pricing' },
  { label: 'Kit', to: '/kit' },
  { label: 'Assets', to: '/assets' },
];

// HashRouter: routes work on any static host with zero server config.
export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <SmoothScroll>
          <div className="grain">
            <Loader brand="CODE CANVAS" />
            <CustomCursor />
            <GlassNav brand="Canvas®" links={LINKS} cta={{ label: 'Get started', id: 'pricing' }} />
            <ScrollReset />
            <Suspense fallback={<div className="h-screen" />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/kit" element={<Kit />} />
                <Route path="/assets" element={<AssetLibrary />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </Suspense>
          </div>
        </SmoothScroll>
      </HashRouter>
    </ThemeProvider>
  );
}

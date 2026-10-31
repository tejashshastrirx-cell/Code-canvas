# Code Canvas Ultimate

Premium 3D web starter for a 2-hour design/dev competition — Vite + React + TypeScript + Three.js (R3F/Drei) + GSAP + Framer Motion + Tailwind, with a curated, licence-checked local asset library.

## Quick start
```bash
npm ci
npm run dev        # http://localhost:5173
npm run build      # type-check + production build → dist/
npm run preview    # serve dist on :4173
npm run qa         # headless Chromium: desktop+mobile screenshots, console errors
```
Browser-only? See **BROWSER_ONLY_GUIDE.md**. Competition? Paste **COMPETITION_MASTER_PROMPT.md**.

## Routes
`/#/` demo site · `/#/kit` component kit · `/#/assets` asset browser (every model, HDRI switcher, icons).

## Structure
```
src/components  ThemeProvider, ThemeToggle, SmoothScroll(Lenis), CustomCursor, Magnetic, Button,
                GlassNav (responsive), Loader, TiltCard, BentoGrid, Marquee, SectionHeading
src/sections    Hero (3D), MarqueeSection, ProductShowcase (3D viewer), Features (bento+shader),
                ScrollStory (GSAP pin+scrub 3D), MaterialsLab (PBR), CharacterSection (animated),
                Testimonials, Pricing, Footer (with CC-BY credits)
src/three       Scene, Model, ModelViewer, CameraRig, ParticleField (GLSL), FloatingObjects (glass),
                ShaderGradient (GLSL), AnimatedCharacter, PBRSphere/usePBR, Effects (post)
src/animations  gsap setup, variants, Reveal, SplitReveal, useScrollScrub
src/data        assets.ts (typed asset registry), credits.ts
scripts         discover-assets.ts, download-assets.ts, verify-assets.ts, generate-abstract.ts, qa.mjs
config          asset-manifest.json, mcp-sources.json, api-sources.json
public/assets   models/{hero,products,characters,environments,abstract} textures/ hdri/ fonts/ icons/
```

## Assets
25 curated manifest entries (60 files, ~26 MB): 16 GLB models (3 hero, 4 product, 2 animated characters, 2 environment, 5 abstract), 5 PBR sets, 3 HDRIs, 4 fonts, 15 icons — see **ASSET_CREDITS.md**. CC0 except: Shopify sneaker & Fox rig (CC-BY 4.0, credited in footer), fonts (OFL), icons (ISC).

Docs: MCP_SETUP.md · MCP_STATUS.md · CLAUDE.md · `.claude/skills/creative-director/SKILL.md` · design-references/

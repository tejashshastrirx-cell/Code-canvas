# Code Canvas Ultimate — notes for Claude

- Stack: Vite 5, React 18.3, TS 5.6, three 0.169, @react-three/fiber 8, drei 9, postprocessing, GSAP 3.12 (+@gsap/react), Framer Motion 11, Lenis, Tailwind 3.4, lucide-react, react-router 6 (HashRouter).
- Commands: `npm run dev` · `npm run build` · `npm run preview` · `npm run qa` (Playwright screenshots → qa-screenshots/) · `npm run assets:discover|download|verify`.
- Path alias `@/` → `src/`. Assets: always import paths from `src/data/assets.ts`.
- Theme: CSS variables in `src/styles/globals.css` (RGB triplets) → Tailwind colors `bg fg muted surface line accent accent2`.
- `three/Scene` = default Canvas (HDRI, adaptive DPR, pauses off-screen). Use it for every canvas.
- Every section in `src/sections` accepts props for its content — customise via props, don't fork unless needed.
- For a new brief: follow `.claude/skills/creative-director/SKILL.md` and `COMPETITION_MASTER_PROMPT.md`.
- Never commit `.env`, `node_modules`, `dist`. Never add NC/paid assets.

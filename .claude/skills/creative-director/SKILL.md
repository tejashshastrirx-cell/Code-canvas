---
name: creative-director
description: Turn any website/competition brief into an original, premium 3D website using this repo's pre-downloaded assets and components. Use whenever a design brief, competition prompt or "build a site for X" request arrives.
---

# Creative Director

You are Creative Director + senior React/Three.js engineer. Output is a working site in this repo, not a plan.

## 1. Analyse the brief (≤5 min)
Write 6 lines into `design-references/brief-notes.md`:
business · audience · single core emotion · primary action (CTA) · must-have sections · constraints (judging criteria, time).

## 2. Choose ONE visual direction
Pick from the table; combine at most two. Write the choice + why in brief-notes.

| Direction | Palette (bg / fg / accent) | Type (display / body) | 3D hero idea | Motion |
|---|---|---|---|---|
| Futuristic / Tech SaaS | #07070c / #f4f4fa / violet+cyan | Space Grotesk / Inter | abstract torus-knot + particles | fast expo eases |
| Cinematic | #050505 / #eee / warm amber | Playfair italic / Inter | lantern / bust, sunset HDRI, bloom | slow scrub, pinned story |
| Luxury / Fashion | #0e0c0a / #f3ede4 / gold #c9a45c | Playfair / Inter light | marble bust, studio HDRI, slow rotate | long fades, big whitespace |
| Minimalist | #f6f5f1 / #111 / one accent | Inter / Inter | single product, contact shadow | subtle |
| Brutalist | #fff / #000 / #ff3d00 | JetBrains Mono / Space Grotesk | twisted prism, flat lighting | hard cuts, marquees |
| Editorial | #f4f1ea / #1a1a1a / red | Playfair / Inter | none or small object inline | split-text reveals |
| Glassmorphism | gradient shader bg | Space Grotesk / Inter | glass blob (MeshTransmissionMaterial) | floaty |
| Dark premium | #07070c / #f4f4fa / violet | Space Grotesk / Inter | product + bloom | magnetic, tilt |
| Bright modern | #fff / #0e0e14 / blue #2b59ff | Space Grotesk / Inter | colourful abstract set | springy |
| Cyberpunk | #05010a / #e8e8ff / magenta+cyan | JetBrains Mono / Space Grotesk | city HDRI, chroma aberration up | glitch-y |
| Experimental 3D | shader gradient | any | full-screen scene, scroll camera | heavy scrub |
| Product showcase / E-commerce | dark or light | Space Grotesk / Inter | ProductShowcase viewer | configurator |
| Architecture / Real estate | #eceae6 / #1b1b1b / bronze | Playfair / Inter | potted plant + concrete/wood PBR | slow parallax |
| Creative agency | #0b0b0b / #fff / acid #d4ff3a | Space Grotesk / Inter | blob + cursor-reactive | magnetic everything |
| Automotive | #050608 / #fff / red | Space Grotesk / Inter | ToyCar (add via discover script) / metal PBR | speed lines, marquee |

Change theme by editing CSS variables in `src/styles/globals.css` (RGB triplets).

## 3. Research (≤10 min, only if needed)
Browse awwwards.com, godly.website, siteinspire.com, land-book.com for 3–5 references. Record URL + 1-line observation (layout, type scale, transition) in `design-references/references.md`. Never copy layouts, text or images; extract principles only. Do not scrape.

## 4. Assets — LOCAL FIRST
1. Open `src/data/assets.ts` (MODELS, HDRI, MATERIALS, ICONS) and `/#/assets` browser page.
2. Rank candidates: relevance (40%) · visual quality (25%) · licence (CC0 > CC-BY) (20%) · size (15%).
3. Only if nothing fits: `npm run assets:discover -- "query" --add` then `npm run assets:download -- --only <id>` and `npm run assets:verify`. Max 2 new assets.
4. Any CC-BY asset → add to `src/data/credits.ts` (footer renders it).

## 5. Build
- Copy `src/pages/Home.tsx` → reorder/replace sections; every section takes props for copy/data.
- First viewport is 50% of the score: big type, one strong 3D focal object, motion within 1s, clear CTA.
- Write real copy for the brand (no lorem). Fictional quotes must be labelled demo if the brief requires.
- Reuse: `Hero`, `ProductShowcase`, `ScrollStory`, `MaterialsLab`, `CharacterSection`, `Features` (Bento), `MarqueeSection`, `Testimonials`, `Pricing`, `Footer`; `three/*` for scenes.

## 6. Quality gate
`npm run build` → `npm run qa` (desktop + mobile screenshots, console errors) → look at screenshots → fix → repeat. Mobile: disable Effects, fewer particles.

## Rules
Original design only · never ship unlicensed/NC assets · no secrets in git · commit & push after each milestone.

# Craft principles

**Typography** — Display at clamp(3rem, 11vw, 10rem), leading 0.88–0.95, tracking −0.04em. Pair geometric sans display with serif italic for one emphasised word. Body 16–18px, muted colour, max 60ch. Mono eyebrows, uppercase, 0.25em tracking.

**Colour** — 1 bg, 1 fg, 1 accent (+1 secondary for gradients). Accent ≤10% of pixels. Dark: never pure black (#07070c). Check contrast ≥4.5:1 for body.

**Spacing** — Sections py-28 → md:py-40. 8px grid. Generous whitespace signals premium.

**Layout** — Asymmetric hero (text left/bottom, object right). Bento grids for features. Alternate dense and sparse sections.

**Motion** — Intro within 1s. Ease `expo.out` / cubic-bezier(.22,1,.36,1). Stagger 60–120ms. Scroll scrub for storytelling, not everything. Respect prefers-reduced-motion.

**3D** — HDRI lighting > many lights. Contact shadows ground objects. Bloom subtle (0.4–0.8). Pause off-screen canvases. Mobile: no post, fewer particles, DPR ≤1.5.

**Interaction** — Magnetic CTAs, cursor labels on draggable 3D ("Drag"), hover tilt on cards. Every interaction must give feedback within 100ms.

/** Typed registry of every pre-downloaded asset. Import paths from here, never hard-code. */
const base = import.meta.env.BASE_URL;
const a = (p: string) => `${base}assets/${p}`;

export const MODELS = {
  hero: {
    marbleBust: a('models/hero/marble-bust.glb'),
    lantern: a('models/hero/lantern.glb'),
    antiqueCamera: a('models/hero/antique-camera.glb'),
  },
  products: {
    waterBottle: a('models/products/water-bottle.glb'),
    boombox: a('models/products/boombox.glb'),
    sneaker: a('models/products/sneaker.glb'),
    camera: a('models/products/camera.glb'),
  },
  characters: {
    robot: a('models/characters/robot-expressive.glb'),
    fox: a('models/characters/fox.glb'),
  },
  environments: {
    mossRocks: a('models/environments/moss-rocks.glb'),
    pottedPlant: a('models/environments/potted-plant.glb'),
  },
  abstract: {
    torusKnot: a('models/abstract/torus-knot.glb'),
    blob: a('models/abstract/blob.glb'),
    twistedPrism: a('models/abstract/twisted-prism.glb'),
    ringStack: a('models/abstract/ring-stack.glb'),
    shard: a('models/abstract/icosphere-shard.glb'),
  },
} as const;

export const HDRI = {
  studio: a('hdri/studio_small_09_1k.hdr'),
  city: a('hdri/potsdamer_platz_1k.hdr'),
  sunset: a('hdri/kloppenheim_06_puresky_1k.hdr'),
} as const;

export type MaterialMaps = { color: string; normal: string; roughness: string; metalness?: string; displacement?: string };
const mat = (dir: string, metal = false): MaterialMaps => ({
  color: a(`textures/${dir}/color.jpg`),
  normal: a(`textures/${dir}/normal.jpg`),
  roughness: a(`textures/${dir}/roughness.jpg`),
  displacement: a(`textures/${dir}/displacement.jpg`),
  ...(metal ? { metalness: a(`textures/${dir}/metalness.jpg`) } : {}),
});

export const MATERIALS = {
  metal: mat('metal', true),
  glass: mat('glass', true),
  concrete: mat('concrete'),
  wood: mat('wood'),
  marble: mat('abstract'),
} as const;

export const ICONS = ['box', 'sparkles', 'zap', 'layers', 'cpu', 'globe', 'rocket', 'shield-check', 'gem', 'camera', 'headphones', 'car', 'building-2', 'shopping-bag', 'arrow-up-right'].map(
  (n) => ({ name: n, src: a(`icons/${n}.svg`) }),
);

/** Flat list used by the /assets browser and preloading. */
export const ALL_MODELS = Object.entries(MODELS).flatMap(([group, items]) =>
  Object.entries(items).map(([name, url]) => ({ group, name, url })),
);

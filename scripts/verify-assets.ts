/**
 * Verifies every file in public/assets: magic bytes, GLB parse (meshes/animations),
 * that every manifest entry exists, and that every file is credited.
 * Exit code 1 on any failure. Usage: npm run assets:verify
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { ASSET_DIR, ROOT, exists, loadManifest } from './lib/assets.ts';

const walk = (d: string): string[] =>
  readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));

const MAGIC: Record<string, (b: Buffer) => boolean> = {
  '.jpg': (b) => b[0] === 0xff && b[1] === 0xd8,
  '.png': (b) => b.subarray(1, 4).toString() === 'PNG',
  '.hdr': (b) => b.subarray(0, 10).toString().startsWith('#?'),
  '.woff2': (b) => b.subarray(0, 4).toString() === 'wOF2',
  '.svg': (b) => b.toString('utf8', 0, 300).includes('<svg'),
  '.glb': (b) => b.subarray(0, 4).toString() === 'glTF',
};

async function main() {
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  const errors: string[] = [];
  const files = walk(ASSET_DIR);
  let bytes = 0;
  for (const f of files) {
    const rel = relative(ROOT, f);
    const buf = readFileSync(f);
    bytes += buf.length;
    const check = MAGIC[extname(f)];
    if (!check) { errors.push(`${rel}: unexpected file type`); continue; }
    if (!check(buf)) { errors.push(`${rel}: bad file signature`); continue; }
    if (extname(f) === '.glb') {
      try {
        const doc = await io.read(f);
        const r = doc.getRoot();
        const meshes = r.listMeshes().length, anims = r.listAnimations().map((a) => a.getName());
        if (!meshes) errors.push(`${rel}: no meshes`);
        console.log(`✔ ${rel}  ${(buf.length / 1024).toFixed(0)}KB  meshes=${meshes} textures=${r.listTextures().length}${anims.length ? ` anims=[${anims.join(', ')}]` : ''}`);
      } catch (e: any) { errors.push(`${rel}: GLB parse failed: ${e.message}`); }
    } else console.log(`✔ ${rel}  ${(buf.length / 1024).toFixed(0)}KB`);
  }
  const credits = exists(join(ROOT, 'ASSET_CREDITS.md')) ? readFileSync(join(ROOT, 'ASSET_CREDITS.md'), 'utf8') : '';
  for (const a of loadManifest()) {
    if (!exists(join(ASSET_DIR, a.out))) errors.push(`manifest ${a.id}: missing ${a.out}`);
  }
  for (const f of files) if (!credits.includes(relative(ROOT, f))) errors.push(`${relative(ROOT, f)}: not listed in ASSET_CREDITS.md`);

  console.log(`\n${files.length} files, ${(bytes / 1048576).toFixed(1)} MB`);
  if (errors.length) { console.error(`\n${errors.length} problem(s):\n- ${errors.join('\n- ')}`); process.exit(1); }
  console.log('All assets verified.');
}
main();

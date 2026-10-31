/**
 * Downloads every asset listed in config/asset-manifest.json into public/assets,
 * optimises large models, and regenerates ASSET_CREDITS.md.
 *
 * Usage:
 *   npm run assets:download            # download missing assets only
 *   npm run assets:download -- --force # re-download everything
 *   npm run assets:download -- --only fox,metal
 *
 * Rules: only permitted licences are fetched, only public unauthenticated
 * endpoints are used, failures are logged and skipped (never fatal).
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, renameSync, rmSync, statSync, writeFileSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import { ASSET_DIR, ROOT, PERMITTED_LICENSES, download, ensureDir, exists, getJson, loadManifest, type AssetEntry } from './lib/assets.ts';
import { generateAbstract } from './generate-abstract.ts';

const args = process.argv.slice(2);
const force = args.includes('--force');
const onlyIdx = args.indexOf('--only');
const only = onlyIdx >= 0 ? args[onlyIdx + 1].split(',') : null;
const GLTF_TRANSFORM = join(ROOT, 'node_modules/.bin/gltf-transform');

function optimizeGlb(file: string) {
  const tmp = file.replace(/\.glb$/, '.opt.glb');
  // Resize textures to <=1024px and convert to WebP. No mesh compression so the
  // file loads without external Draco decoders (works offline).
  execFileSync(GLTF_TRANSFORM, ['optimize', file, tmp, '--compress', 'false', '--texture-compress', 'webp', '--texture-size', '1024'], { stdio: 'pipe' });
  renameSync(tmp, file);
}

async function polyhavenModel(a: AssetEntry, dest: string) {
  const files = await getJson(`https://api.polyhaven.com/files/${a.source}`);
  const gltf = files.gltf?.[a.res ?? '1k']?.gltf;
  if (!gltf) throw new Error('no gltf at requested resolution');
  const tmp = mkdtempSync(join(tmpdir(), 'ph-'));
  const main = join(tmp, basename(new URL(gltf.url).pathname));
  await download(gltf.url, main);
  for (const [rel, f] of Object.entries<any>(gltf.include ?? {})) await download(f.url, join(tmp, rel));
  ensureDir(dirname(dest));
  execFileSync(GLTF_TRANSFORM, ['copy', main, dest], { stdio: 'pipe' });
  optimizeGlb(dest);
  rmSync(tmp, { recursive: true, force: true });
}

async function polyhavenHdri(a: AssetEntry, dest: string) {
  const files = await getJson(`https://api.polyhaven.com/files/${a.source}`);
  const url = files.hdri?.[a.res ?? '1k']?.hdr?.url;
  if (!url) throw new Error('no hdr at requested resolution');
  await download(url, dest);
}

const MAP_NAMES: Record<string, string> = {
  Color: 'color', NormalGL: 'normal', Roughness: 'roughness', Metalness: 'metalness',
  AmbientOcclusion: 'ao', Displacement: 'displacement', Opacity: 'opacity',
};

async function ambientcg(a: AssetEntry, destDir: string) {
  const tmp = mkdtempSync(join(tmpdir(), 'acg-'));
  const zip = join(tmp, 'a.zip');
  await download(`https://ambientcg.com/get?file=${a.source}_1K-JPG.zip`, zip);
  execFileSync('unzip', ['-o', '-q', zip, '-d', join(tmp, 'x')]);
  ensureDir(destDir);
  let count = 0;
  for (const f of readdirSync(join(tmp, 'x'))) {
    const m = f.match(/_(Color|NormalGL|Roughness|Metalness|AmbientOcclusion|Displacement|Opacity)\.jpg$/);
    if (m) { copyFileSync(join(tmp, 'x', f), join(destDir, `${MAP_NAMES[m[1]]}.jpg`)); count++; }
  }
  rmSync(tmp, { recursive: true, force: true });
  if (!count) throw new Error('zip contained no recognised maps');
}

async function run() {
  const assets = loadManifest();
  const results: { a: AssetEntry; ok: boolean; note: string }[] = [];
  for (const a of assets) {
    if (only && !only.includes(a.id)) continue;
    if (!PERMITTED_LICENSES.includes(a.license)) {
      results.push({ a, ok: false, note: `skipped: licence ${a.license} not permitted` });
      continue;
    }
    const dest = join(ASSET_DIR, a.out);
    const already = a.out.endsWith('/') ? exists(dest) && readdirSync(dest).length > 0 : exists(dest);
    if (already && !force) { results.push({ a, ok: true, note: 'cached' }); continue; }
    try {
      switch (a.type) {
        case 'url':
          await download(a.url!, dest);
          if (a.optimize) optimizeGlb(dest);
          break;
        case 'polyhaven-model': await polyhavenModel(a, dest); break;
        case 'polyhaven-hdri': await polyhavenHdri(a, dest); break;
        case 'ambientcg': await ambientcg(a, dest); break;
        case 'icons':
          for (const n of a.names!) await download(`${a.baseUrl}${n}.svg`, join(dest, `${n}.svg`));
          break;
        case 'procedural': await generateAbstract(dest); break;
      }
      results.push({ a, ok: true, note: 'downloaded' });
      console.log(`✔ ${a.id}`);
    } catch (e: any) {
      results.push({ a, ok: false, note: `FAILED: ${e.message}` });
      console.error(`✘ ${a.id}: ${e.message}`);
    }
  }
  if (!only) writeCredits(assets);
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} assets ok`);
  failed.forEach((r) => console.log(`  - ${r.a.id}: ${r.note}`));
}

function listFiles(a: AssetEntry): string[] {
  const p = join(ASSET_DIR, a.out);
  if (!exists(p)) return [];
  if (statSync(p).isDirectory()) return readdirSync(p).map((f) => `public/assets/${a.out}${f}`);
  return [`public/assets/${a.out}`];
}

function writeCredits(assets: AssetEntry[]) {
  const rows = assets.map((a) => {
    const files = listFiles(a);
    const attr = a.license === 'CC0-1.0' ? 'None required (credit appreciated)'
      : a.license === 'OFL-1.1' ? 'Keep licence with font; do not sell font alone'
      : a.license === 'ISC' ? 'Keep ISC notice (see LICENSES/lucide-ISC.txt)'
      : a.attribution ?? 'Credit creator';
    return `| ${a.id} | [source](${a.page === 'local' ? 'scripts/generate-abstract.ts' : a.page}) | ${a.creator} | ${a.license} | ${attr} | ${files.map((f) => `\`${f}\``).join('<br>') || '_missing_'} |`;
  });
  const md = `# Asset Credits

Generated by \`npm run assets:download\` from \`config/asset-manifest.json\`. Do not edit by hand.

**Licence summary:** CC0-1.0 (public domain), CC-BY-4.0 (attribution required — see below),
OFL-1.1 (fonts), ISC (Lucide icons). No paid, watermarked, NC or restricted assets are included.

## Attribution required on the live site (CC-BY-4.0)
${assets.filter((a) => a.license === 'CC-BY-4.0').map((a) => `- ${a.attribution}`).join('\n')}

The demo site renders these in its footer via \`src/data/credits.ts\`.

## All assets

| Asset | Source | Creator | Licence | Attribution | Local path |
|---|---|---|---|---|---|
${rows.join('\n')}
`;
  writeFileSync(join(ROOT, 'ASSET_CREDITS.md'), md);
  console.log('wrote ASSET_CREDITS.md');
}

run();

/**
 * Searches permitted free asset APIs, filters by licence/downloadability, ranks results
 * and prints candidates you can paste into config/asset-manifest.json.
 *
 * Usage:
 *   npm run assets:discover -- "car"                 # all sources
 *   npm run assets:discover -- "wood" --type texture
 *   npm run assets:discover -- "chair" --add         # append top Poly Haven/ambientCG hit to manifest
 *
 * Sources (all public, no key needed for search):
 *   - Poly Haven API  (CC0)          https://api.polyhaven.com
 *   - ambientCG API   (CC0)          https://ambientcg.com/api/v2
 *   - Sketchfab API   (search only)  https://api.sketchfab.com/v3 — downloads need the
 *     user's own SKETCHFAB_API_TOKEN and are NOT automated here; only CC0 / CC-BY
 *     downloadable models are listed.
 *   - Khronos glTF-Sample-Assets (CC0/CC-BY, per-model metadata.json)
 * A failing source is skipped, never fatal.
 */
import { getJson, loadManifest, saveManifest, type AssetEntry } from './lib/assets.ts';

const args = process.argv.slice(2);
const query = (args.find((a) => !a.startsWith('--')) ?? '').toLowerCase();
const typeIdx = args.indexOf('--type');
const type = typeIdx >= 0 ? args[typeIdx + 1] : 'all';
const add = args.includes('--add');

interface Candidate {
  source: string; id: string; name: string; kind: 'model' | 'texture' | 'hdri';
  license: string; page: string; score: number; downloadable: boolean; note?: string;
}

const relevance = (text: string) => {
  if (!query) return 1;
  const t = text.toLowerCase();
  return t === query ? 3 : t.includes(query) ? 2 : query.split(' ').some((w) => t.includes(w)) ? 1 : 0;
};

async function polyHaven(): Promise<Candidate[]> {
  const out: Candidate[] = [];
  const kinds = { models: 'model', textures: 'texture', hdris: 'hdri' } as const;
  for (const [t, kind] of Object.entries(kinds)) {
    if (type !== 'all' && type !== kind) continue;
    const data = await getJson<Record<string, any>>(`https://api.polyhaven.com/assets?t=${t}`);
    for (const [id, v] of Object.entries(data)) {
      const nameRel = Math.max(relevance(id), relevance(v.name));
      const tagRel = Math.max(0, ...(v.tags ?? []).map(relevance), ...(v.categories ?? []).map(relevance));
      if (!nameRel && !tagRel) continue;
      out.push({ source: 'polyhaven', id, name: v.name, kind, license: 'CC0-1.0', page: `https://polyhaven.com/a/${id}`,
        downloadable: true, score: nameRel * 12 + tagRel * 3 + Math.log10(1 + (v.download_count ?? 0)) });
    }
  }
  return out;
}

async function ambientCg(): Promise<Candidate[]> {
  if (type !== 'all' && type !== 'texture') return [];
  const d = await getJson(`https://ambientcg.com/api/v2/full_json?type=Material&q=${encodeURIComponent(query)}&sort=Popular&limit=15`);
  return d.foundAssets.map((a: any, i: number) => ({
    source: 'ambientcg', id: a.assetId, name: a.displayName, kind: 'texture', license: 'CC0-1.0',
    page: `https://ambientcg.com/view?id=${a.assetId}`, downloadable: true, score: 20 - i * 0.5,
  }));
}

async function sketchfab(): Promise<Candidate[]> {
  if (type !== 'all' && type !== 'model') return [];
  // license slugs: cc0 = CC0, by = CC-BY. Filtering server-side to downloadable + permissive only.
  const out: Candidate[] = [];
  for (const lic of ['cc0', 'by']) {
    const d = await getJson(`https://api.sketchfab.com/v3/search?type=models&downloadable=true&license=${lic}&q=${encodeURIComponent(query)}&sort_by=-likeCount&count=8`);
    for (const m of d.results ?? []) out.push({
      source: 'sketchfab', id: m.uid, name: m.name, kind: 'model',
      license: lic === 'cc0' ? 'CC0-1.0' : 'CC-BY-4.0', page: m.viewerUrl, downloadable: !!m.isDownloadable,
      score: 15 + Math.log10(1 + m.likeCount) - (m.faceCount > 300000 ? 5 : 0),
      note: `by ${m.user?.displayName}; ${m.faceCount} faces; download needs your SKETCHFAB_API_TOKEN via sketchfab.com (manual)`,
    });
  }
  return out;
}

const KHRONOS = ['Lantern', 'AntiqueCamera', 'WaterBottle', 'BoomBox', 'SheenChair', 'ToyCar', 'GlassVaseFlowers', 'MaterialsVariantsShoe',
  'ChronographWatch', 'SunglassesKhronos', 'CarConcept', 'IridescenceLamp', 'Fox', 'CesiumMan', 'Avocado', 'Corset', 'FlightHelmet', 'SheenCloth', 'ABeautifulGame'];

async function khronos(): Promise<Candidate[]> {
  if (type !== 'all' && type !== 'model') return [];
  const out: Candidate[] = [];
  for (const m of KHRONOS.filter((m) => relevance(m.replace(/([A-Z])/g, ' $1')))) {
    const meta = await getJson(`https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/${m}/metadata.json`).catch(() => null);
    const lic: string[] = (meta?.legal ?? []).map((l: any) => l.license).filter((l: string) => !l.startsWith('LicenseRef-LegalMark'));
    const ok = lic.length > 0 && lic.every((l) => ['CC0-1.0', 'CC-BY-4.0'].includes(l));
    out.push({ source: 'khronos', id: m, name: m, kind: 'model', license: lic.join('+') || 'unknown',
      page: `https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/${m}`, downloadable: ok, score: ok ? 18 : 0 });
  }
  return out;
}

async function main() {
  const all: Candidate[] = [];
  for (const [name, fn] of Object.entries({ polyHaven, ambientCg, sketchfab, khronos })) {
    try { all.push(...(await fn())); } catch (e: any) { console.warn(`! ${name} unavailable: ${e.message} — skipping`); }
  }
  const ranked = all.filter((c) => c.downloadable).sort((a, b) => b.score - a.score).slice(0, 25);
  console.table(ranked.map(({ source, id, kind, license, score, note }) => ({ source, id, kind, license, score: score.toFixed(1), note: note ?? '' })));

  if (add) {
    const top = ranked.find((c) => c.source === 'polyhaven' || c.source === 'ambientcg');
    if (!top) return console.log('No auto-downloadable candidate to add.');
    const manifest = loadManifest();
    const entry: AssetEntry = top.source === 'ambientcg'
      ? { id: top.id.toLowerCase(), category: 'textures/abstract', type: 'ambientcg', source: top.id, out: `textures/${top.id.toLowerCase()}/`, creator: 'ambientCG', license: 'CC0-1.0', page: top.page }
      : top.kind === 'hdri'
        ? { id: top.id, category: 'hdri', type: 'polyhaven-hdri', source: top.id, res: '1k', out: `hdri/${top.id}_1k.hdr`, creator: 'Poly Haven', license: 'CC0-1.0', page: top.page }
        : top.kind === 'model'
          ? { id: top.id, category: 'models/hero', type: 'polyhaven-model', source: top.id, res: '1k', out: `models/hero/${top.id}.glb`, creator: 'Poly Haven', license: 'CC0-1.0', page: top.page }
          : { id: top.id, category: 'textures/abstract', type: 'url', url: '', out: '', creator: 'Poly Haven', license: 'CC0-1.0', page: top.page };
    if (!entry.out) return console.log('Poly Haven textures: add manually.');
    if (manifest.some((a) => a.id === entry.id)) return console.log(`${entry.id} already in manifest`);
    saveManifest([...manifest, entry]);
    console.log(`Added ${entry.id} → run: npm run assets:download -- --only ${entry.id}`);
  }
}
main();

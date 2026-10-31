import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

export const ROOT = resolve(import.meta.dirname, '../..');
export const ASSET_DIR = join(ROOT, 'public/assets');
export const MANIFEST_PATH = join(ROOT, 'config/asset-manifest.json');

export interface AssetEntry {
  id: string;
  category: string;
  type: 'url' | 'polyhaven-model' | 'polyhaven-hdri' | 'ambientcg' | 'icons' | 'procedural';
  out: string;
  url?: string;
  source?: string;
  res?: string;
  optimize?: boolean;
  files?: string[];
  names?: string[];
  baseUrl?: string;
  creator: string;
  license: string;
  attribution?: string;
  animated?: boolean;
  page: string;
}

export function loadManifest(): AssetEntry[] {
  return JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')).assets;
}

export function saveManifest(assets: AssetEntry[]) {
  const raw = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
  raw.assets = assets;
  writeFileSync(MANIFEST_PATH, JSON.stringify(raw, null, 2) + '\n');
}

/** Licences we accept without manual review. Anything else is skipped. */
export const PERMITTED_LICENSES = ['CC0-1.0', 'CC-BY-4.0', 'OFL-1.1', 'ISC', 'MIT'];

export const ensureDir = (p: string) => mkdirSync(p, { recursive: true });

export async function download(url: string, dest: string, retries = 3): Promise<number> {
  ensureDir(dirname(dest));
  for (let i = 0; ; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'code-canvas-ultimate-asset-fetcher/1.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      const buf = Buffer.from(await res.arrayBuffer());
      writeFileSync(dest, buf);
      return buf.length;
    } catch (err) {
      if (i >= retries) throw err;
      await new Promise((r) => setTimeout(r, 2000 * 2 ** i));
    }
  }
}

export async function getJson<T = any>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { 'User-Agent': 'code-canvas-ultimate-asset-fetcher/1.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json() as Promise<T>;
}

export const exists = (p: string) => existsSync(p);

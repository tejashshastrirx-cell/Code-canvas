/**
 * Generates 5 original abstract GLB objects from Three.js geometry (CC0, made in this repo).
 * Usage: npx tsx scripts/generate-abstract.ts
 */
import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Document, NodeIO } from '@gltf-transform/core';
import { join } from 'node:path';
import { ASSET_DIR, ensureDir } from './lib/assets.ts';

type Spec = { file: string; geo: () => THREE.BufferGeometry; color: [number, number, number]; metal: number; rough: number };

function noisify(g: THREE.BufferGeometry, amp: number, freq: number) {
  const p = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = Math.sin(v.x * freq) * Math.cos(v.y * freq * 1.3) * Math.sin(v.z * freq * 0.7);
    v.multiplyScalar(1 + n * amp);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

function twist(g: THREE.BufferGeometry, turns: number) {
  const p = g.attributes.position as THREE.BufferAttribute;
  g.computeBoundingBox();
  const { min, max } = g.boundingBox!;
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i);
    const a = ((y - min.y) / (max.y - min.y)) * Math.PI * 2 * turns;
    const x = p.getX(i), z = p.getZ(i);
    p.setXYZ(i, x * Math.cos(a) - z * Math.sin(a), y, x * Math.sin(a) + z * Math.cos(a));
  }
  g.computeVertexNormals();
  return g;
}

function ringStack() {
  const parts: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 5; i++) {
    const t = new THREE.TorusGeometry(1 - i * 0.15, 0.06, 12, 96);
    t.rotateX(Math.PI / 2 + i * 0.35);
    t.rotateZ(i * 0.5);
    parts.push(t.toNonIndexed());
  }
  const merged = new THREE.BufferGeometry();
  const pos: number[] = [], nor: number[] = [];
  for (const g of parts) {
    pos.push(...(g.attributes.position.array as Float32Array));
    nor.push(...(g.attributes.normal.array as Float32Array));
  }
  merged.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  merged.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  return merged;
}

const specs: Spec[] = [
  { file: 'torus-knot.glb', geo: () => new THREE.TorusKnotGeometry(0.8, 0.26, 256, 48, 2, 3), color: [0.9, 0.9, 0.95], metal: 1, rough: 0.15 },
  { file: 'blob.glb', geo: () => noisify(mergeVertices(new THREE.IcosahedronGeometry(1, 28)), 0.25, 2.4), color: [0.55, 0.35, 1], metal: 0.2, rough: 0.3 },
  { file: 'twisted-prism.glb', geo: () => twist(new THREE.BoxGeometry(0.8, 2.2, 0.8, 8, 96, 8), 0.6), color: [1, 0.45, 0.2], metal: 0.6, rough: 0.25 },
  { file: 'ring-stack.glb', geo: ringStack, color: [0.95, 0.75, 0.35], metal: 1, rough: 0.2 },
  { file: 'icosphere-shard.glb', geo: () => noisify(new THREE.IcosahedronGeometry(1, 1).toNonIndexed(), 0.3, 3), color: [0.3, 0.85, 1], metal: 0.1, rough: 0.05 },
];

export async function generateAbstract(outDir = join(ASSET_DIR, 'models/abstract')) {
  ensureDir(outDir);
  const io = new NodeIO();
  for (const s of specs) {
    const g = s.geo();
    if (!g.attributes.normal) g.computeVertexNormals();
    const doc = new Document();
    const buffer = doc.createBuffer();
    const name = s.file.replace('.glb', '');
    const prim = doc.createPrimitive()
      .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(new Float32Array(g.attributes.position.array)).setBuffer(buffer))
      .setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(new Float32Array(g.attributes.normal.array)).setBuffer(buffer))
      .setMaterial(doc.createMaterial(name).setBaseColorFactor([...s.color, 1]).setMetallicFactor(s.metal).setRoughnessFactor(s.rough));
    if (g.index) prim.setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(g.index.array)).setBuffer(buffer));
    const node = doc.createNode(name).setMesh(doc.createMesh(name).addPrimitive(prim));
    doc.createScene('Scene').addChild(node);
    await io.write(join(outDir, s.file), doc);
    console.log('  generated', s.file);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) generateAbstract();

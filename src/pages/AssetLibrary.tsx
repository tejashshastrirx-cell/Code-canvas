import { useState } from 'react';
import { ModelViewer } from '@/three';
import { ALL_MODELS, HDRI, ICONS, MATERIALS } from '@/data/assets';

/** Browse every pre-downloaded model/HDRI/icon. Use it to pick assets quickly during the competition. */
export default function AssetLibrary() {
  const [sel, setSel] = useState(ALL_MODELS[0]);
  const [hdri, setHdri] = useState<string>(HDRI.studio);
  return (
    <main className="container-x pb-20 pt-32">
      <p className="eyebrow">Asset library</p>
      <h1 className="mt-3 text-5xl font-medium">{ALL_MODELS.length} models · {Object.keys(HDRI).length} HDRIs · {Object.keys(MATERIALS).length} materials · {ICONS.length} icons</h1>
      <div className="mt-10 grid gap-6 lg:grid-cols-[280px_1fr]">
        <ul className="max-h-[600px] space-y-1 overflow-auto pr-2">
          {ALL_MODELS.map((m) => (
            <li key={m.url}>
              <button onClick={() => setSel(m)} className={`w-full rounded-xl px-4 py-2 text-left text-sm ${sel.url === m.url ? 'bg-accent text-white' : 'hover:bg-fg/5'}`}>
                <span className="font-mono text-[10px] uppercase opacity-60">{m.group}</span> {m.name}
              </button>
            </li>
          ))}
        </ul>
        <div>
          <div className="h-[520px] overflow-hidden rounded-3xl border border-line/10 bg-surface/50">
            <ModelViewer key={sel.url + hdri} url={sel.url} mode="orbit" hdri={hdri} />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <code className="mr-auto rounded bg-fg/5 px-3 py-1 font-mono text-xs">{`MODELS.${sel.group}.${sel.name}`}</code>
            {Object.entries(HDRI).map(([k, v]) => (
              <button key={k} onClick={() => setHdri(v)} className={`rounded-full px-3 py-1 ${hdri === v ? 'bg-fg text-bg' : 'border border-line/15'}`}>{k}</button>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            {ICONS.map((i) => (
              <figure key={i.name} className="grid w-20 place-items-center gap-1 rounded-xl border border-line/10 p-3">
                <img src={i.src} alt={i.name} className="h-6 w-6 dark:invert" />
                <figcaption className="truncate text-[10px] text-muted">{i.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

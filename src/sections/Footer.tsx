import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Magnetic, scrollToId } from '@/components';
import { REQUIRED_CREDITS } from '@/data/credits';

export interface FooterColumn { title: string; links: { label: string; href: string }[] }
const DEFAULT: FooterColumn[] = [
  { title: 'Explore', links: [{ label: 'Showcase', href: '#showcase' }, { label: 'Materials', href: '#materials' }, { label: 'Pricing', href: '#pricing' }] },
  { title: 'Kit', links: [{ label: 'Components', href: '#/kit' }, { label: 'Asset library', href: '#/assets' }] },
];

/** CTA band + link columns + giant wordmark + mandatory CC-BY credits. */
export function Footer({ brand = 'CANVAS', columns = DEFAULT, cta = 'Let’s build something unreal.' }: { brand?: string; columns?: FooterColumn[]; cta?: string }) {
  return (
    <footer id="contact" className="relative overflow-hidden border-t border-line/10 pt-28">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <h2 className="max-w-2xl text-5xl font-medium leading-[0.95] md:text-7xl">{cta}</h2>
          <Magnetic strength={0.5}>
            <button onClick={() => scrollToId('top')} data-cursor-label="Go"
              className="grid h-36 w-36 place-items-center rounded-full bg-accent text-white transition hover:scale-105">
              <span className="flex items-center gap-1 font-display">Start <ArrowUpRight size={18} /></span>
            </button>
          </Magnetic>
        </div>
        <div className="mt-24 grid gap-10 border-t border-line/10 pt-10 sm:grid-cols-2 md:grid-cols-4">
          {columns.map((c) => (
            <div key={c.title}>
              <p className="eyebrow mb-4">{c.title}</p>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l.label}>
                    {l.href.startsWith('#/') ? <Link to={l.href.slice(1)} className="text-muted transition hover:text-fg">{l.label}</Link>
                      : <button onClick={() => scrollToId(l.href.slice(1))} className="text-muted transition hover:text-fg">{l.label}</button>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="md:col-span-2">
            <p className="eyebrow mb-4">Newsletter</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input type="email" required placeholder="you@studio.com" aria-label="Email"
                className="min-w-0 flex-1 rounded-full border border-line/15 bg-transparent px-5 py-3 text-sm outline-none focus:border-accent" />
              <Button magnetic={false} type="submit">Join</Button>
            </form>
          </div>
        </div>
      </div>
      <div className="select-none whitespace-nowrap text-center font-display text-[22vw] font-semibold leading-none tracking-[-0.06em] text-fg/[0.04]">{brand}</div>
      <div className="container-x flex flex-col gap-2 border-t border-line/10 py-6 text-xs text-muted md:flex-row md:justify-between">
        <span>© {new Date().getFullYear()} {brand}. Demo content.</span>
        <span>
          3D credits:{' '}
          {REQUIRED_CREDITS.map((c, i) => (
            <span key={c.asset}>{i > 0 && ' · '}<a href={c.href} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">{c.asset}</a> {c.text} ({c.license})</span>
          ))}
          {' '}· Other assets CC0 (Poly Haven, ambientCG, Khronos, Quaternius).
        </span>
      </div>
    </footer>
  );
}

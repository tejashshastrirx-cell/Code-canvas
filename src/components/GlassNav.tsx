import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { scrollToId } from './SmoothScroll';

export interface NavLink { label: string; id?: string; to?: string }

/** Floating glass navigation: shrinks on scroll, hides on scroll-down, full-screen mobile menu. */
export function GlassNav({ brand, links, cta }: { brand: string; links: NavLink[]; cta?: { label: string; id: string } }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = 0;
    const on = () => {
      const y = scrollY;
      setScrolled(y > 40);
      setHidden(y > last && y > 300);
      last = y;
    };
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);

  const go = (l: NavLink) => { setOpen(false); if (l.id) scrollToId(l.id); };

  return (
    <>
      <motion.header animate={{ y: hidden && !open ? -120 : 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
        <nav className={`glass flex w-full max-w-5xl items-center justify-between rounded-full pl-6 pr-2 transition-all duration-500 ${scrolled ? 'py-2' : 'py-3'}`}>
          <Link to="/" className="font-display text-lg font-semibold tracking-tight" data-cursor="hover">{brand}</Link>
          <ul className="hidden items-center gap-8 text-sm text-muted md:flex">
            {links.map((l) => (
              <li key={l.label}>
                {l.to ? <Link to={l.to} className="transition hover:text-fg">{l.label}</Link>
                  : <button onClick={() => go(l)} className="transition hover:text-fg">{l.label}</button>}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {cta && <button onClick={() => scrollToId(cta.id)} className="hidden rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition hover:bg-accent hover:text-white sm:block">{cta.label}</button>}
            <button className="grid h-10 w-10 place-items-center md:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ clipPath: 'circle(0% at 90% 5%)' }} animate={{ clipPath: 'circle(150% at 90% 5%)' }} exit={{ clipPath: 'circle(0% at 90% 5%)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }} className="fixed inset-0 z-40 flex flex-col justify-center bg-bg px-8 md:hidden">
            {links.map((l, i) => (
              <motion.div key={l.label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.06 }}>
                {l.to ? <Link to={l.to} onClick={() => setOpen(false)} className="block py-3 font-display text-5xl">{l.label}</Link>
                  : <button onClick={() => go(l)} className="block py-3 text-left font-display text-5xl">{l.label}</button>}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

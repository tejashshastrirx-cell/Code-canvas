import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { Magnetic } from './Magnetic';

type Variant = 'primary' | 'ghost' | 'outline';
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant; icon?: ReactNode; magnetic?: boolean; href?: string;
}

const styles: Record<Variant, string> = {
  primary: 'bg-fg text-bg hover:shadow-[0_0_40px_-5px_rgb(var(--accent)/0.8)]',
  ghost: 'glass text-fg hover:bg-fg/10',
  outline: 'border border-fg/20 text-fg hover:border-accent',
};

/** Premium pill button: sliding gradient fill, optional icon, optional magnetic wrapper, renders <a> when href set. */
export function Button({ variant = 'primary', icon, magnetic = true, href, className, children, ...rest }: Props) {
  const cls = clsx('group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-medium transition-all duration-500', styles[variant], className);
  const inner = (
    <>
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-accent to-accent2 transition-transform duration-500 ease-out group-hover:translate-x-0" />
      <span className="relative z-10 transition-colors duration-500 group-hover:text-white">{children}</span>
      {icon && <span className="relative z-10 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-0.5 group-hover:text-white">{icon}</span>}
    </>
  );
  const el = href ? <a href={href} className={cls} data-cursor="hover">{inner}</a> : <button className={cls} data-cursor="hover" {...rest}>{inner}</button>;
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}

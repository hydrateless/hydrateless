import { type HTMLAttributes, type ReactNode } from 'react';

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  current?: boolean;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

/** Semantic breadcrumb navigation (`<nav> > <ol>`). CSS-only, no enhancer. */
export function Breadcrumb({ items, ...rest }: BreadcrumbProps) {
  return (
    <nav {...rest} data-hl-breadcrumb aria-label={rest['aria-label'] ?? 'Breadcrumb'}>
      <ol>
        {items.map((item, i) => (
          <li key={i}>
            {item.current || !item.href ? (
              <span aria-current={item.current ? 'page' : undefined}>{item.label}</span>
            ) : (
              <a href={item.href}>{item.label}</a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

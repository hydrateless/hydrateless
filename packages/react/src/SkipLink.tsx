import { type AnchorHTMLAttributes, type ReactNode } from 'react';

export type SkipLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children?: ReactNode;
};

/** Accessibility skip-navigation link, visually hidden until focused. */
export function SkipLink({ children = 'Skip to content', className, ...rest }: SkipLinkProps) {
  return (
    <a {...rest} className={['a11y-skip-link', className].filter(Boolean).join(' ')}>
      {children}
    </a>
  );
}

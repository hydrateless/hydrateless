import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { cx } from './util.js';

/** Props for {@link SkipLink}. */
export type SkipLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children?: ReactNode;
};

/** Accessibility skip-navigation link, visually hidden until focused. */
export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(function SkipLink(
  { children = 'Skip to content', className, ...rest },
  ref,
) {
  return (
    <a {...rest} ref={ref} className={cx('hl-skip-link', className)}>
      {children}
    </a>
  );
});

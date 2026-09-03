import {
  forwardRef,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type LiHTMLAttributes,
  type ReactNode,
} from 'react';

/** Props for {@link Breadcrumb}. */
export type BreadcrumbProps = HTMLAttributes<HTMLElement>;

/**
 * Semantic breadcrumb navigation (`<nav> > <ol>`). CSS-only, no enhancer.
 * Compose with `<BreadcrumbItem>`.
 *
 * ```tsx
 * <Breadcrumb>
 *   <BreadcrumbItem href="/">Home</BreadcrumbItem>
 *   <BreadcrumbItem current>Components</BreadcrumbItem>
 * </Breadcrumb>
 * ```
 */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { children, ...rest },
  ref,
) {
  return (
    <nav {...rest} ref={ref} data-hl-breadcrumb aria-label={rest['aria-label'] ?? 'Breadcrumb'}>
      <ol>{children}</ol>
    </nav>
  );
});

/** Props for {@link BreadcrumbItem}. */
export interface BreadcrumbItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'children'> {
  href?: string;
  /** Marks the current page; renders a non-link with `aria-current="page"`. */
  current?: boolean;
  children?: ReactNode;
  /** Extra attributes for the `<a>` when `href` is set. */
  anchorProps?: AnchorHTMLAttributes<HTMLAnchorElement>;
}

/** A single crumb. Renders a link unless `current` (or no `href`) is set. */
export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  function BreadcrumbItem({ href, current, anchorProps, children, ...rest }, ref) {
    return (
      <li {...rest} ref={ref}>
        {current || !href ? (
          <span aria-current={current ? 'page' : undefined}>{children}</span>
        ) : (
          <a {...anchorProps} href={href}>
            {children}
          </a>
        )}
      </li>
    );
  },
);

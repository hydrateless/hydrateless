import {
  useEffect,
  useRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { enhanceMenu, type EnhanceMenuOptions } from '@hydrateless/enhancers';

/** Props for {@link Menu}. */
export interface MenuProps extends HTMLAttributes<HTMLUListElement> {
  orientation?: EnhanceMenuOptions['orientation'];
}

/**
 * Menubar / navigation menu with single-level submenus. Compose with
 * `<MenuItem>`; nest items by passing a `submenu`. The enhancer wires roving
 * tabindex, orientation-aware arrow navigation, and submenu toggling.
 *
 * ```tsx
 * <Menu orientation="horizontal">
 *   <MenuItem href="/">Home</MenuItem>
 *   <MenuItem submenu={<><MenuItem href="/docs">Docs</MenuItem></>}>Resources</MenuItem>
 * </Menu>
 * ```
 */
export function Menu({ orientation = 'horizontal', children, ...rest }: MenuProps) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return enhanceMenu(ref.current, { orientation }).destroy;
  }, [orientation]);

  return (
    <ul
      {...rest}
      ref={ref}
      data-hl-menu
      role={orientation === 'vertical' ? 'menu' : 'menubar'}
      aria-orientation={orientation}
    >
      {children}
    </ul>
  );
}

/** Props for {@link MenuItem}. */
export interface MenuItemProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'href' | 'type'
> {
  /** Render as a link instead of a button. */
  href?: string;
  /** Convenience handler fired on activation. */
  onSelect?: () => void;
  /** Nested `<MenuItem>`s; renders a single-level submenu. */
  submenu?: ReactNode;
  /** Extra attributes for the `<a>` when `href` is set. */
  anchorProps?: AnchorHTMLAttributes<HTMLAnchorElement>;
}

/**
 * A menu entry. Children are the label; pass `submenu` to nest a flyout. With
 * `href` it renders an anchor, otherwise a button.
 */
export function MenuItem({
  href,
  onSelect,
  onClick,
  submenu,
  anchorProps,
  children,
  ...rest
}: MenuItemProps) {
  const hasSubmenu = submenu != null;
  return (
    <li role="none">
      {href && !hasSubmenu ? (
        <a {...anchorProps} role="menuitem" href={href}>
          {children}
        </a>
      ) : (
        <button
          {...rest}
          type="button"
          role="menuitem"
          onClick={(e) => {
            onSelect?.();
            onClick?.(e);
          }}
        >
          {children}
        </button>
      )}
      {hasSubmenu && (
        <ul role="menu" data-hl-menu-submenu hidden>
          {submenu}
        </ul>
      )}
    </li>
  );
}

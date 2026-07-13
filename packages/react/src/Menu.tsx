import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { enhanceMenu, type EnhanceMenuOptions, type MenuApi } from '@hydrateless/enhancers';
import { useEnhancer } from './useEnhancer.js';
import { useLatest } from './util.js';

/** Props for {@link Menu}. */
export interface MenuProps extends Omit<HTMLAttributes<HTMLUListElement>, 'onSelect'> {
  orientation?: EnhanceMenuOptions['orientation'];
  /** Called with the open submenu's value (or `null`) after every change. */
  onOpenChange?: (value: string | null) => void;
  /** Called with the item's value when a leaf menu item is activated. */
  onSelect?: (value: string) => void;
}

/**
 * Menubar / navigation menu with single-level submenus rendered in the top
 * layer. Compose with `<MenuItem>`; nest items by passing a `submenu`. The
 * enhancer wires roving tabindex, orientation-aware arrow navigation, and
 * submenu toggling.
 *
 * ```tsx
 * <Menu orientation="horizontal">
 *   <MenuItem href="/">Home</MenuItem>
 *   <MenuItem submenu={<><MenuItem href="/docs">Docs</MenuItem></>}>Resources</MenuItem>
 * </Menu>
 * ```
 */
export function Menu({
  orientation = 'horizontal',
  onOpenChange,
  onSelect,
  children,
  ...rest
}: MenuProps) {
  const onOpenChangeRef = useLatest(onOpenChange);
  const onSelectRef = useLatest(onSelect);

  const { ref } = useEnhancer<HTMLUListElement, MenuApi>(
    (el) =>
      enhanceMenu(el, {
        orientation,
        onOpenChange: (value) => onOpenChangeRef.current?.(value),
        onSelect: (value) => onSelectRef.current?.(value),
      }),
    [orientation],
  );

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
  'href' | 'type' | 'value'
> {
  /** Render as a link instead of a button. */
  href?: string;
  /** Stable value identifying this item; defaults to its label text. */
  value?: string;
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
  value,
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
        <a {...anchorProps} role="menuitem" href={href} data-hl-value={value}>
          {children}
        </a>
      ) : (
        <button
          {...rest}
          type="button"
          role="menuitem"
          data-hl-value={value}
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

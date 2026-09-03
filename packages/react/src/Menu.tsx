import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import { enhanceMenu, type EnhanceMenuOptions, type MenuApi } from '@hydrateless/enhancers';
import { useEnhancer } from './useEnhancer.js';
import { useControlled } from './internal/useControlled.js';
import { useSyncApi } from './internal/useSyncApi.js';
import { useForwardedRef } from './internal/useForwardedRef.js';

/** Props for {@link Menu}. */
export interface MenuProps extends Omit<
  HTMLAttributes<HTMLUListElement>,
  'onSelect' | 'defaultValue'
> {
  /** Layout of the top-level items. Defaults to `horizontal` (a menubar). */
  orientation?: EnhanceMenuOptions['orientation'];
  /** Controlled value of the open submenu, or `null` when all are closed (pair with `onValueChange`). */
  value?: string | null;
  /** Submenu to open initially for uncontrolled usage. */
  defaultValue?: string | null;
  /** Called with the open submenu's value (or `null`) after every change. */
  onValueChange?: (value: string | null) => void;
  /**
   * Called with the item's value when a leaf item is activated. For
   * `menuitemcheckbox`/`menuitemradio` items, `checked` is the new state.
   */
  onSelect?: (value: string, item: HTMLElement, checked?: boolean) => void;
}

/**
 * Menubar / navigation menu with single-level submenus rendered in the top
 * layer. Compose with `<MenuItem>` for leaf items and `<MenuSubmenu>` for
 * items that open a flyout. The enhancer wires roving tabindex,
 * orientation-aware arrow navigation, typeahead, and submenu toggling; the
 * open submenu is the component's value (from `<MenuSubmenu value>`,
 * defaulting to the index).
 *
 * ```tsx
 * <Menu orientation="horizontal">
 *   <MenuItem href="/">Home</MenuItem>
 *   <MenuSubmenu label="Resources" value="resources">
 *     <MenuItem href="/docs">Docs</MenuItem>
 *   </MenuSubmenu>
 * </Menu>
 * ```
 */
export const Menu = forwardRef<HTMLUListElement, MenuProps>(function Menu(
  {
    orientation = 'horizontal',
    value: valueProp,
    defaultValue,
    onValueChange,
    onSelect,
    children,
    ...rest
  },
  forwardedRef,
) {
  const ref = useForwardedRef(forwardedRef);
  const [value, setValue] = useControlled<string | null>(
    valueProp,
    defaultValue ?? null,
    onValueChange,
  );
  const api = useEnhancer<EnhanceMenuOptions, MenuApi>(
    ref,
    enhanceMenu,
    { orientation, defaultValue: value, onValueChange: setValue, onSelect },
    [orientation],
  );
  useSyncApi(api, valueProp, (api, value) => api.setValue(value));

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
});

/** Props for {@link MenuItem}. */
export interface MenuItemProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'href' | 'type' | 'value'
> {
  /** Render as a link instead of a button. */
  href?: string;
  /** Value reported to `onSelect`; defaults to the item's text. */
  value?: string;
  /** `menuitemcheckbox` toggles; `menuitemradio` is exclusive within its menu. Defaults to `menuitem`. */
  role?: 'menuitem' | 'menuitemcheckbox' | 'menuitemradio';
  /** Checked state for checkable roles (rendered as `aria-checked`). */
  checked?: boolean;
  /** Skip the item in keyboard navigation and ignore activation. */
  disabled?: boolean;
  /** Extra attributes for the `<a>` when `href` is set. */
  anchorProps?: AnchorHTMLAttributes<HTMLAnchorElement>;
}

/** A leaf menu entry. With `href` it renders an anchor, otherwise a button. */
export const MenuItem = forwardRef<HTMLElement, MenuItemProps>(function MenuItem(
  { href, value, role = 'menuitem', checked, disabled, anchorProps, children, ...rest },
  ref,
) {
  const shared = {
    role,
    'aria-checked': role === 'menuitem' ? undefined : (checked ?? false),
    'aria-disabled': disabled || undefined,
    'data-hl-value': value,
  };
  return (
    <li role="none">
      {href ? (
        <a {...anchorProps} {...shared} ref={ref as Ref<HTMLAnchorElement>} href={href}>
          {children}
        </a>
      ) : (
        <button
          {...rest}
          {...shared}
          ref={ref as Ref<HTMLButtonElement>}
          type="button"
          disabled={disabled}
        >
          {children}
        </button>
      )}
    </li>
  );
});

/** Props for {@link MenuSubmenu}. */
export interface MenuSubmenuProps extends Omit<HTMLAttributes<HTMLUListElement>, 'value'> {
  /** Content of the top-level trigger. */
  label: ReactNode;
  /** Stable value identifying this submenu; defaults to its index among top-level items. */
  value?: string;
  /** Skip the trigger in keyboard navigation and keep the submenu closed. */
  disabled?: boolean;
  /** Extra attributes for the trigger button. */
  triggerProps?: ButtonHTMLAttributes<HTMLButtonElement>;
}

/**
 * A top-level menu entry that opens a flyout of `<MenuItem>`s. Rest props go
 * to the submenu list (`role="menu"`); use `triggerProps` for the button.
 */
export const MenuSubmenu = forwardRef<HTMLUListElement, MenuSubmenuProps>(function MenuSubmenu(
  { label, value, disabled, triggerProps, children, ...rest },
  ref,
) {
  return (
    <li role="none">
      <button
        {...triggerProps}
        type="button"
        role="menuitem"
        aria-disabled={disabled || undefined}
        disabled={disabled}
        data-hl-value={value}
      >
        {label}
      </button>
      <ul {...rest} ref={ref} role="menu" data-hl-menu-submenu>
        {children}
      </ul>
    </li>
  );
});

import {
  createContext,
  forwardRef,
  useContext,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type LiHTMLAttributes,
} from 'react';
import {
  enhanceDropdown,
  type DropdownApi,
  type EnhanceDropdownOptions,
} from '@hydrateless/enhancers';
import { useEnhancer } from './useEnhancer.js';
import { cx } from './util.js';
import { useControlled } from './internal/useControlled.js';
import { useSyncApi } from './internal/useSyncApi.js';
import { useForwardedRef } from './internal/useForwardedRef.js';
import { useHlId } from './internal/useHlId.js';

/** The menu id, shared so the trigger's `popovertarget` matches before hydration. */
const DropdownContext = createContext<string | undefined>(undefined);

/** Props for {@link Dropdown}. */
export interface DropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Placement used by the JS positioning fallback. Defaults to `bottom-start`. */
  placement?: EnhanceDropdownOptions['placement'];
  /** Close the menu after an item is activated. Defaults to `true`. */
  closeOnSelect?: boolean;
  /** Controlled open state (pair with `onOpenChange`). */
  open?: boolean;
  /** Open the menu initially for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Called after the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Called with the item's value when a menu item is activated. For
   * `menuitemcheckbox`/`menuitemradio` items, `checked` is the new state.
   */
  onSelect?: (value: string, item: HTMLElement, checked?: boolean) => void;
}

/**
 * Button-triggered menu following the WAI-ARIA menu-button pattern. Compose with
 * `<DropdownTrigger>`, `<DropdownMenu>`, `<DropdownItem>`, `<DropdownGroup>`,
 * and `<DropdownSeparator>`. The menu renders as a native `popover` the
 * trigger opens through `popovertarget`, so it works before hydration; the
 * enhancer adds keyboard navigation, typeahead, checkable items, and focus
 * return. Open state works uncontrolled or controlled.
 *
 * ```tsx
 * <Dropdown onSelect={(value) => run(value)}>
 *   <DropdownTrigger>Actions</DropdownTrigger>
 *   <DropdownMenu>
 *     <DropdownItem value="edit">Edit</DropdownItem>
 *     <DropdownSeparator />
 *     <DropdownItem value="delete">Delete</DropdownItem>
 *   </DropdownMenu>
 * </Dropdown>
 * ```
 */
export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(function Dropdown(
  {
    placement,
    closeOnSelect,
    open: openProp,
    defaultOpen,
    onOpenChange,
    onSelect,
    children,
    ...rest
  },
  forwardedRef,
) {
  const ref = useForwardedRef(forwardedRef);
  const menuId = useHlId('dropdown-menu');
  const [open, setOpen] = useControlled(openProp, defaultOpen ?? false, onOpenChange);
  const api = useEnhancer<EnhanceDropdownOptions, DropdownApi>(
    ref,
    enhanceDropdown,
    { placement, closeOnSelect, defaultOpen: open, onOpenChange: setOpen, onSelect },
    [placement, closeOnSelect],
  );
  // Only move focus into the menu when this call actually opens it; the echo
  // of the enhancer's own `onOpenChange` must not yank focus back to item one.
  useSyncApi(api, openProp, (api, open) => api.setOpen(open, { focus: !api.open }));

  return (
    <DropdownContext.Provider value={menuId}>
      <div {...rest} ref={ref} data-hl-dropdown>
        {children}
      </div>
    </DropdownContext.Provider>
  );
});

/** Props for {@link DropdownTrigger}. */
export type DropdownTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>;

/** The button that opens the menu; carries `popovertarget` so it works pre-hydration. */
export const DropdownTrigger = forwardRef<HTMLButtonElement, DropdownTriggerProps>(
  function DropdownTrigger({ children, type, ...rest }, ref) {
    const menuId = useContext(DropdownContext);
    // React passes the camelCase prop through verbatim; the DOM attribute is
    // lowercase, so set it as such for byte-identical server and client markup.
    const target = { popovertarget: rest.popoverTarget ?? menuId };
    return (
      <button
        {...rest}
        {...target}
        popoverTarget={undefined}
        ref={ref}
        type={type ?? 'button'}
        data-hl-dropdown-trigger
      >
        {children}
      </button>
    );
  },
);

/** Props for {@link DropdownMenu}. */
export type DropdownMenuProps = HTMLAttributes<HTMLUListElement>;

/** The menu surface (a native `popover`); holds items, groups, and separators. */
export const DropdownMenu = forwardRef<HTMLUListElement, DropdownMenuProps>(function DropdownMenu(
  { id, children, ...rest },
  ref,
) {
  const menuId = useContext(DropdownContext);
  return (
    <ul {...rest} ref={ref} id={id ?? menuId} popover="auto" data-hl-dropdown-menu>
      {children}
    </ul>
  );
});

/** Props for {@link DropdownItem}. */
export interface DropdownItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  /** Value reported to `onSelect`; defaults to the item's text. */
  value?: string;
  /** `menuitemcheckbox` toggles; `menuitemradio` is exclusive within its group. Defaults to `menuitem`. */
  role?: 'menuitem' | 'menuitemcheckbox' | 'menuitemradio';
  /** Checked state for checkable roles (rendered as `aria-checked`). */
  checked?: boolean;
  /** Skip the item in keyboard navigation and ignore activation. */
  disabled?: boolean;
}

/** A menu item. Renders `<li><button role="menuitem">`. */
export const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(function DropdownItem(
  { children, value, role = 'menuitem', checked, disabled, type, ...rest },
  ref,
) {
  return (
    <li role="none">
      <button
        {...rest}
        ref={ref}
        type={type ?? 'button'}
        role={role}
        aria-checked={role === 'menuitem' ? undefined : (checked ?? false)}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        data-hl-value={value}
      >
        {children}
      </button>
    </li>
  );
});

/** Props for {@link DropdownGroup}. */
export interface DropdownGroupProps extends HTMLAttributes<HTMLUListElement> {
  /** Accessible name of the group. */
  label?: string;
}

/**
 * A labelled `role="group"` of items; `menuitemradio` items inside it are
 * exclusive with each other.
 */
export const DropdownGroup = forwardRef<HTMLUListElement, DropdownGroupProps>(
  function DropdownGroup({ label, children, ...rest }, ref) {
    return (
      <li role="none">
        <ul {...rest} ref={ref} role="group" aria-label={label}>
          {children}
        </ul>
      </li>
    );
  },
);

/** Props for {@link DropdownSeparator}. */
export type DropdownSeparatorProps = Omit<LiHTMLAttributes<HTMLLIElement>, 'role'>;

/** A visual divider between groups of items. */
export const DropdownSeparator = forwardRef<HTMLLIElement, DropdownSeparatorProps>(
  function DropdownSeparator({ className, ...rest }, ref) {
    return (
      <li {...rest} ref={ref} role="separator" className={cx('hl-dropdown-separator', className)} />
    );
  },
);

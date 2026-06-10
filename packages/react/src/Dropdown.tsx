import {
  useEffect,
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
import { useLatest } from './util.js';

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  placement?: EnhanceDropdownOptions['placement'];
  /** Controlled open state (pair with `onOpenChange`). */
  open?: boolean;
  /** Open the menu initially for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Called after the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Button-triggered menu following the WAI-ARIA menu-button pattern. Compose with
 * `<DropdownTrigger>`, `<DropdownMenu>`, `<DropdownItem>`, and
 * `<DropdownSeparator>`. The enhancer adds keyboard navigation, typeahead, and
 * `aria-expanded`/`role` wiring; open state works uncontrolled or controlled.
 *
 * ```tsx
 * <Dropdown>
 *   <DropdownTrigger>Actions</DropdownTrigger>
 *   <DropdownMenu>
 *     <DropdownItem onSelect={edit}>Edit</DropdownItem>
 *     <DropdownSeparator />
 *     <DropdownItem onSelect={remove}>Delete</DropdownItem>
 *   </DropdownMenu>
 * </Dropdown>
 * ```
 */
export function Dropdown({
  placement,
  open,
  defaultOpen,
  onOpenChange,
  children,
  ...rest
}: DropdownProps) {
  const onOpenChangeRef = useLatest(onOpenChange);
  const initialOpenRef = useLatest(open ?? defaultOpen);

  const { ref, api } = useEnhancer<HTMLDivElement, DropdownApi>(
    (el) =>
      enhanceDropdown(el, {
        placement,
        defaultOpen: initialOpenRef.current,
        onOpenChange: (next) => onOpenChangeRef.current?.(next),
      }),
    [placement],
  );

  useEffect(() => {
    if (open != null) api.current?.setOpen(open);
  }, [open, api]);

  return (
    <div {...rest} data-hl-dropdown ref={ref}>
      {children}
    </div>
  );
}

export type DropdownTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>;

/** The button that opens the menu. */
export function DropdownTrigger({ children, type, ...rest }: DropdownTriggerProps) {
  return (
    <button {...rest} type={type ?? 'button'} data-hl-dropdown-trigger>
      {children}
    </button>
  );
}

export type DropdownMenuProps = HTMLAttributes<HTMLUListElement>;

/** The menu surface; holds `<DropdownItem>` and `<DropdownSeparator>`. */
export function DropdownMenu({ children, ...rest }: DropdownMenuProps) {
  return (
    <ul {...rest} data-hl-dropdown-menu>
      {children}
    </ul>
  );
}

export interface DropdownItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Convenience handler fired on click; you can also pass `onClick`. */
  onSelect?: () => void;
}

/** A selectable menu item (`role="menuitem"`). */
export function DropdownItem({ children, onSelect, onClick, type, ...rest }: DropdownItemProps) {
  return (
    <li>
      <button
        {...rest}
        type={type ?? 'button'}
        role="menuitem"
        onClick={(e) => {
          onSelect?.();
          onClick?.(e);
        }}
      >
        {children}
      </button>
    </li>
  );
}

export type DropdownSeparatorProps = Omit<LiHTMLAttributes<HTMLLIElement>, 'role'>;

/** A visual divider between groups of items. */
export function DropdownSeparator(props: DropdownSeparatorProps) {
  return <li {...props} role="separator" />;
}

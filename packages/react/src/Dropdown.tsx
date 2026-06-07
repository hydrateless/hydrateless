import {
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type LiHTMLAttributes,
} from 'react';
import { enhanceDropdown, type EnhanceDropdownOptions } from '@hydrateless/enhancers';

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  placement?: EnhanceDropdownOptions['placement'];
}

/**
 * Button-triggered menu following the WAI-ARIA menu-button pattern. Compose with
 * `<DropdownTrigger>`, `<DropdownMenu>`, `<DropdownItem>`, and
 * `<DropdownSeparator>`. The enhancer adds keyboard navigation, typeahead, and
 * `aria-expanded`/`role` wiring.
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
export function Dropdown({ placement, children, ...rest }: DropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return enhanceDropdown(ref.current, { placement });
  }, [placement]);

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

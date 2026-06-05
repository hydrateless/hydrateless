import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { enhanceDropdown } from '@hydrateless/enhancers';

export interface DropdownItem {
  label: ReactNode;
  onSelect?: () => void;
  separator?: boolean;
  disabled?: boolean;
}

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  trigger: ReactNode;
  items: DropdownItem[];
}

/**
 * Button-triggered menu following the WAI-ARIA menu pattern. The enhancer adds
 * keyboard navigation, typeahead, and `aria-expanded`/`role` wiring.
 */
export function Dropdown({ trigger, items, ...rest }: DropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return enhanceDropdown(ref.current);
  }, [items.length]);

  return (
    <div {...rest} data-hl-dropdown ref={ref}>
      <button type="button" data-hl-dropdown-trigger>
        {trigger}
      </button>
      <ul data-hl-dropdown-menu>
        {items.map((item, i) =>
          item.separator ? (
            <li role="separator" key={i} />
          ) : (
            <li key={i}>
              <button
                type="button"
                role="menuitem"
                onClick={item.onSelect}
                disabled={item.disabled}
              >
                {item.label}
              </button>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}

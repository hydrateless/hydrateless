import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { enhanceMenu } from '@hydrateless/enhancers';

export interface MenuItemDef {
  label: ReactNode;
  href?: string;
  onSelect?: () => void;
  disabled?: boolean;
  items?: MenuItemDef[];
}

export interface MenuProps extends HTMLAttributes<HTMLUListElement> {
  items: MenuItemDef[];
  orientation?: 'horizontal' | 'vertical';
}

function renderItems(items: MenuItemDef[]): ReactNode {
  return items.map((item, i) => (
    <li role="none" key={i}>
      {item.href && !item.items ? (
        <a role="menuitem" href={item.href}>
          {item.label}
        </a>
      ) : (
        <button type="button" role="menuitem" onClick={item.onSelect} disabled={item.disabled}>
          {item.label}
        </button>
      )}
      {item.items && (
        <ul role="menu" data-hl-menu-submenu hidden>
          {renderItems(item.items)}
        </ul>
      )}
    </li>
  ));
}

/**
 * Menubar / navigation menu. The enhancer wires roving tabindex, arrow
 * navigation, and single-level submenu toggling per the WAI-ARIA menubar
 * pattern.
 */
export function Menu({ items, orientation = 'horizontal', ...rest }: MenuProps) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return enhanceMenu(ref.current, { orientation });
  }, [items, orientation]);

  return (
    <ul
      {...rest}
      ref={ref}
      data-hl-menu
      role={orientation === 'vertical' ? 'menu' : 'menubar'}
      aria-orientation={orientation}
    >
      {renderItems(items)}
    </ul>
  );
}

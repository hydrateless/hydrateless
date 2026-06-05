import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { enhanceTabs } from '@hydrateless/enhancers';

export interface TabItem {
  label: ReactNode;
  content: ReactNode;
}

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  items: TabItem[];
}

/**
 * Tabbed interface. The enhancer wires ARIA roles, roving tabindex, and arrow
 * key navigation once the markup is rendered.
 */
export function Tabs({ items, ...rest }: TabsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return enhanceTabs(ref.current);
  }, [items.length]);

  return (
    <div {...rest} data-hl-tabs ref={ref}>
      <div role="tablist">
        {items.map((item, i) => (
          <button type="button" role="tab" key={i}>
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item, i) => (
        <div role="tabpanel" key={i}>
          {item.content}
        </div>
      ))}
    </div>
  );
}

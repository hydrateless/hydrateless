import { useEffect, useRef, type ButtonHTMLAttributes, type HTMLAttributes } from 'react';
import { enhanceTabs, type EnhanceTabsOptions } from '@hydrateless/enhancers';

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  /** `manual` (default): arrows move focus, Enter/Space activates. `automatic`: arrows activate immediately. */
  activation?: EnhanceTabsOptions['activation'];
  orientation?: EnhanceTabsOptions['orientation'];
}

/**
 * Tabbed interface root. Compose with `<TabList>`, `<Tab>`, and `<TabPanel>`.
 * The enhancer wires ARIA roles, roving tabindex, and arrow-key navigation
 * once the markup is mounted.
 *
 * ```tsx
 * <Tabs>
 *   <TabList>
 *     <Tab>Overview</Tab>
 *     <Tab>Install</Tab>
 *   </TabList>
 *   <TabPanel>Zero runtime by default.</TabPanel>
 *   <TabPanel>npm install hydrateless</TabPanel>
 * </Tabs>
 * ```
 */
export function Tabs({ activation, orientation, children, ...rest }: TabsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return enhanceTabs(ref.current, { activation, orientation });
  }, [activation, orientation]);

  return (
    <div {...rest} data-hl-tabs ref={ref}>
      {children}
    </div>
  );
}

export type TabListProps = HTMLAttributes<HTMLDivElement>;

/** The row of tab triggers. Renders `role="tablist"`. */
export function TabList({ children, ...rest }: TabListProps) {
  return (
    <div {...rest} role="tablist">
      {children}
    </div>
  );
}

export type TabProps = ButtonHTMLAttributes<HTMLButtonElement>;

/** A single tab trigger. Renders `role="tab"`. */
export function Tab({ children, type, ...rest }: TabProps) {
  return (
    <button {...rest} type={type ?? 'button'} role="tab">
      {children}
    </button>
  );
}

export type TabPanelProps = HTMLAttributes<HTMLDivElement>;

/** Content for the matching tab. Renders `role="tabpanel"`. */
export function TabPanel({ children, ...rest }: TabPanelProps) {
  return (
    <div {...rest} role="tabpanel">
      {children}
    </div>
  );
}

import { useEffect, type ButtonHTMLAttributes, type HTMLAttributes } from 'react';
import { enhanceTabs, type EnhanceTabsOptions, type TabsApi } from '@hydrateless/enhancers';
import { useEnhancer } from './useEnhancer.js';
import { useLatest } from './util.js';

/** Props for {@link Tabs}. */
export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  /** `manual` (default): arrows move focus, Enter/Space activates. `automatic`: arrows activate immediately. */
  activation?: EnhanceTabsOptions['activation'];
  orientation?: EnhanceTabsOptions['orientation'];
  /** Controlled value of the selected tab (pair with `onValueChange`). */
  value?: string;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string;
  /** Called with the new tab value after every selection change. */
  onValueChange?: (value: string) => void;
}

/**
 * Tabbed interface root. Compose with `<TabList>`, `<Tab>`, and `<TabPanel>`.
 * The enhancer wires ARIA roles, roving tabindex, and arrow-key navigation
 * once the markup is mounted. Tab values come from each `<Tab value>`,
 * defaulting to the index; selection works uncontrolled (`defaultValue`) or
 * controlled (`value` + `onValueChange`).
 *
 * ```tsx
 * <Tabs value={tab} onValueChange={setTab}>
 *   <TabList>
 *     <Tab value="overview">Overview</Tab>
 *     <Tab value="install">Install</Tab>
 *   </TabList>
 *   <TabPanel>Zero runtime by default.</TabPanel>
 *   <TabPanel>npm install hydrateless</TabPanel>
 * </Tabs>
 * ```
 */
export function Tabs({
  activation,
  orientation,
  value,
  defaultValue,
  onValueChange,
  children,
  ...rest
}: TabsProps) {
  const onValueChangeRef = useLatest(onValueChange);
  const initialValueRef = useLatest(value ?? defaultValue);

  const { ref, api } = useEnhancer<HTMLDivElement, TabsApi>(
    (el) =>
      enhanceTabs(el, {
        activation,
        orientation,
        defaultValue: initialValueRef.current,
        onValueChange: (next) => onValueChangeRef.current?.(next),
      }),
    [activation, orientation],
  );

  useEffect(() => {
    if (value != null) api.current?.setValue(value);
  }, [value, api]);

  return (
    <div {...rest} data-hl-tabs ref={ref}>
      {children}
    </div>
  );
}

/** Props for {@link TabList}. */
export type TabListProps = HTMLAttributes<HTMLDivElement>;

/** The row of tab triggers. Renders `role="tablist"`. */
export function TabList({ children, ...rest }: TabListProps) {
  return (
    <div {...rest} role="tablist">
      {children}
    </div>
  );
}

/** Props for {@link Tab}. */
export interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Stable value identifying this tab; defaults to its index. */
  value?: string;
}

/** A single tab trigger. Renders `role="tab"`. */
export function Tab({ children, type, value, ...rest }: TabProps) {
  return (
    <button {...rest} type={type ?? 'button'} role="tab" data-hl-value={value}>
      {children}
    </button>
  );
}

/** Props for {@link TabPanel}. */
export type TabPanelProps = HTMLAttributes<HTMLDivElement>;

/** Content for the matching tab. Renders `role="tabpanel"`. */
export function TabPanel({ children, ...rest }: TabPanelProps) {
  return (
    <div {...rest} role="tabpanel">
      {children}
    </div>
  );
}

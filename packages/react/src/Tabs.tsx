import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { enhanceTabs, type EnhanceTabsOptions, type TabsApi } from '@hydrateless/enhancers';
import { useEnhancer } from './useEnhancer.js';
import { useControlled } from './internal/useControlled.js';
import { useSyncApi } from './internal/useSyncApi.js';
import { useForwardedRef } from './internal/useForwardedRef.js';
import { IndexContext, indexChildren } from './internal/indexChildren.js';

interface TabsContextValue {
  /** Selected tab value; `undefined` before any selection (the first tab wins). */
  selected: string | undefined;
  /** Index of the selected tab, so panels without a `value` can match by position. */
  selectedIndex: number;
}

const TabsContext = createContext<TabsContextValue>({ selected: undefined, selectedIndex: 0 });

/** Values of the `<Tab>`s inside the `<TabList>` child, by position. */
function tabValues(children: ReactNode): string[] | null {
  const list = Children.toArray(children).find((c) => isValidElement(c) && c.type === TabList);
  if (!isValidElement<TabListProps>(list)) return null;
  return Children.toArray(list.props.children)
    .filter((c) => isValidElement<TabProps>(c) && c.type === Tab)
    .map((tab, i) => (tab as { props: TabProps }).props.value ?? String(i));
}

/** Whether the tab or panel rendering this hook is the selected one. */
function useSelected(value: string | undefined): boolean {
  const { selected, selectedIndex } = useContext(TabsContext);
  const index = useContext(IndexContext);
  return value != null && selected != null ? value === selected : index === selectedIndex;
}

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
 * The role-based markup, `aria-selected`, `hidden`, and roving `tabindex` are
 * all rendered from the value, so server output is correct before the
 * enhancer adds keyboard navigation. Tab values come from each `<Tab value>`,
 * defaulting to the index; panels match tabs by position. Selection works
 * uncontrolled (`defaultValue`) or controlled (`value` + `onValueChange`).
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
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { activation, orientation, value: valueProp, defaultValue, onValueChange, children, ...rest },
  forwardedRef,
) {
  const ref = useForwardedRef(forwardedRef);
  const [selected, setValue] = useControlled(valueProp, defaultValue, onValueChange);
  const api = useEnhancer<EnhanceTabsOptions, TabsApi>(
    ref,
    enhanceTabs,
    { activation, orientation, defaultValue: selected, onValueChange: setValue },
    [activation, orientation],
  );
  useSyncApi(api, valueProp, (api, value) => api.setValue(value));

  const values = tabValues(children);
  const selectedIndex = selected == null ? 0 : values ? values.indexOf(selected) : Number(selected);

  return (
    <TabsContext.Provider value={{ selected, selectedIndex }}>
      <div {...rest} ref={ref} data-hl-tabs>
        {indexChildren(children, TabPanel)}
      </div>
    </TabsContext.Provider>
  );
});

/** Props for {@link TabList}. */
export type TabListProps = HTMLAttributes<HTMLDivElement>;

/** The row of tab triggers. Renders `role="tablist"`. */
export const TabList = forwardRef<HTMLDivElement, TabListProps>(function TabList(
  { children, ...rest },
  ref,
) {
  return (
    <div {...rest} ref={ref} role="tablist">
      {indexChildren(children, Tab)}
    </div>
  );
});

/** Props for {@link Tab}. */
export interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Stable value identifying this tab; defaults to its index. */
  value?: string;
}

/** A single tab trigger. Renders `role="tab"` with `aria-selected` from the Tabs value. */
export const Tab = forwardRef<HTMLButtonElement, TabProps>(function Tab(
  { children, type, value, ...rest },
  ref,
) {
  const selected = useSelected(value);
  return (
    <button
      {...rest}
      ref={ref}
      type={type ?? 'button'}
      role="tab"
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      data-hl-value={value}
    >
      {children}
    </button>
  );
});

/** Props for {@link TabPanel}. */
export type TabPanelProps = HTMLAttributes<HTMLDivElement>;

/** Content for the tab at the same position. Renders `role="tabpanel"`, hidden unless selected. */
export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(function TabPanel(
  { children, ...rest },
  ref,
) {
  const selected = useSelected(undefined);
  return (
    <div {...rest} ref={ref} role="tabpanel" hidden={!selected}>
      {children}
    </div>
  );
});

<script lang="ts">
  import { enhanceTabs, type EnhanceTabsOptions } from '@hydrateless/enhancers';
  import { untrack } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { setTabsContext } from '../context.js';
  import { useEnhancer } from '../useEnhancer.svelte.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** `manual` (default): arrows move focus, Enter/Space selects. `automatic`: arrows select. */
    activation?: EnhanceTabsOptions['activation'];
    /** Layout of the tab list; also picks the arrow keys used. */
    orientation?: EnhanceTabsOptions['orientation'];
    /** Selected tab value; two-way bindable (`bind:value`). */
    value?: string;
    /** Initially selected tab for uncontrolled usage. Defaults to the first tab. */
    defaultValue?: string;
    /** Called with the new tab value after every selection change. */
    onValueChange?: (value: string) => void;
    /** A `<TabList>` followed by one `<TabPanel>` per tab. */
    children?: Snippet;
  }

  let {
    activation,
    orientation,
    value = $bindable(),
    defaultValue,
    onValueChange,
    children,
    ...rest
  }: Props = $props();
  // svelte-ignore state_referenced_locally -- seeds the uncontrolled initial value once
  if (value === undefined) value = defaultValue;

  // Tabs and panels register in document order so `aria-selected`/`hidden`
  // render on the server and the enhancer finds them already in agreement.
  const tabValues: string[] = [];
  let panelCount = 0;
  setTabsContext({
    get value() {
      return value ?? tabValues[0];
    },
    registerTab(tabValue) {
      const index = tabValues.length;
      tabValues.push(tabValue ?? String(index));
      return index;
    },
    registerPanel() {
      return panelCount++;
    },
    tabValueAt: (index) => tabValues[index],
  });

  const tabs = useEnhancer(enhanceTabs, () => ({
    activation,
    orientation,
    defaultValue: untrack(() => value),
    onValueChange: (next) => {
      value = next;
      onValueChange?.(next);
    },
  }));

  $effect(() => {
    if (value != null) tabs.api?.setValue(value);
  });
</script>

<div {...rest} data-hl-tabs data-hl-orientation={orientation} {@attach tabs.attach}>
  {@render children?.()}
</div>

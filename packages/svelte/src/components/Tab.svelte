<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { getTabsContext } from '../context.js';

  interface Props extends HTMLButtonAttributes {
    /** Stable value identifying this tab; defaults to its index. */
    value?: string;
    /** Tab label. */
    children?: Snippet;
  }

  let { value, type, children, ...rest }: Props = $props();
  const tabs = getTabsContext();
  // svelte-ignore state_referenced_locally -- the value identifies this tab for its lifetime
  const index = tabs?.registerTab(value) ?? 0;
  const ownValue = $derived(value ?? String(index));
  const selected = $derived(tabs ? tabs.value === ownValue : undefined);
</script>

<button
  {...rest}
  type={type ?? 'button'}
  role="tab"
  data-hl-value={value}
  aria-selected={selected}
  tabindex={selected === undefined ? undefined : selected ? 0 : -1}
>
  {@render children?.()}
</button>

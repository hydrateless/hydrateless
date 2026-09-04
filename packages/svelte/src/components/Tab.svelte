<script lang="ts">
  import { onDestroy, type Snippet } from 'svelte';
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
  const registration = tabs?.registerTab(() => value);
  onDestroy(() => registration?.unregister());
  let node = $state<HTMLButtonElement | null>(null);
  $effect(() => registration?.attach(node));
  const ownValue = $derived(value ?? String(registration?.index ?? 0));
  const selected = $derived(tabs ? tabs.value === ownValue : undefined);
</script>

<button
  {...rest}
  bind:this={node}
  type={type ?? 'button'}
  role="tab"
  data-hl-value={value}
  aria-selected={selected}
  tabindex={selected === undefined ? undefined : selected ? 0 : -1}
>
  {@render children?.()}
</button>

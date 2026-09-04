<script lang="ts">
  import { onDestroy, type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getTabsContext } from '../context.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Panel content, shown while the tab at the same index is selected. */
    children?: Snippet;
  }

  let { children, ...rest }: Props = $props();
  const tabs = getTabsContext();
  const registration = tabs?.registerPanel();
  onDestroy(() => registration?.unregister());
  let node = $state<HTMLDivElement | null>(null);
  $effect(() => registration?.attach(node));
  // Rendered on the server too, so the unselected panels never flash before
  // the enhancer takes over `hidden`.
  const hidden = $derived(tabs ? tabs.value !== tabs.tabValueAt(registration?.index ?? 0) : false);
</script>

<div {...rest} bind:this={node} role="tabpanel" {hidden} tabindex={tabs ? 0 : undefined}>
  {@render children?.()}
</div>

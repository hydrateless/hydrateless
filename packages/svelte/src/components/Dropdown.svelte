<script lang="ts">
  import { enhanceDropdown, type EnhanceDropdownOptions } from '@hydrateless/enhancers';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    placement?: EnhanceDropdownOptions['placement'];
    children?: Snippet;
  }

  let { placement, children, ...rest }: Props = $props();
  let host = $state<HTMLDivElement>();

  $effect(() => {
    if (!host) return;
    return enhanceDropdown(host, { placement });
  });
</script>

<div {...rest} data-hl-dropdown bind:this={host}>
  {@render children?.()}
</div>

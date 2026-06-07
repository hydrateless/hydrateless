<script lang="ts">
  import { enhanceTabs, type EnhanceTabsOptions } from '@hydrateless/enhancers';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    activation?: EnhanceTabsOptions['activation'];
    orientation?: EnhanceTabsOptions['orientation'];
    children?: Snippet;
  }

  let { activation, orientation, children, ...rest }: Props = $props();
  let host = $state<HTMLDivElement>();

  $effect(() => {
    if (!host) return;
    return enhanceTabs(host, { activation, orientation });
  });
</script>

<div {...rest} data-hl-tabs bind:this={host}>
  {@render children?.()}
</div>

<script lang="ts">
  import { enhanceAccordion } from '@hydrateless/enhancers';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Allow more than one panel to stay open at a time. */
    allowMultiple?: boolean;
    children?: Snippet;
  }

  let { allowMultiple = false, children, ...rest }: Props = $props();
  let host = $state<HTMLDivElement>();

  $effect(() => {
    if (!host) return;
    return enhanceAccordion(host, { allowMultiple });
  });
</script>

<div {...rest} data-hl-accordion bind:this={host}>
  {@render children?.()}
</div>

<script lang="ts">
  import { enhanceToc } from '@hydrateless/enhancers';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLElement> {
    contentSelector?: string;
    headings?: string;
    scrollSpy?: boolean;
  }

  let { contentSelector, headings, scrollSpy, ...rest }: Props = $props();
  let host = $state<HTMLElement>();

  $effect(() => {
    if (!host) return;
    return enhanceToc(host.ownerDocument, { contentSelector, headings, scrollSpy }).destroy;
  });
</script>

<nav {...rest} data-hl-toc bind:this={host}></nav>

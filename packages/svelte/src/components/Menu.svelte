<script lang="ts">
  import { enhanceMenu, type EnhanceMenuOptions } from '@hydrateless/enhancers';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLUListElement> {
    orientation?: EnhanceMenuOptions['orientation'];
    children?: Snippet;
  }

  let { orientation = 'horizontal', children, ...rest }: Props = $props();
  let host = $state<HTMLUListElement>();

  $effect(() => {
    if (!host) return;
    return enhanceMenu(host, { orientation });
  });
</script>

<ul
  {...rest}
  bind:this={host}
  data-hl-menu
  role={orientation === 'vertical' ? 'menu' : 'menubar'}
  aria-orientation={orientation}
>
  {@render children?.()}
</ul>

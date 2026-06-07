<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    src?: string;
    alt?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    shape?: 'circle' | 'square';
    children?: Snippet;
  }

  let { src, alt = '', size, shape, class: klass, children, ...rest }: Props = $props();
  let failed = $state(false);
</script>

<span
  {...rest}
  class={['hl-avatar', klass]}
  data-hl-size={size}
  data-hl-shape={shape === 'square' ? 'square' : undefined}
>
  {#if src && !failed}
    <img {src} {alt} onerror={() => (failed = true)} />
  {:else}
    {@render children?.()}
  {/if}
</span>

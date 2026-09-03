<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    /** Image source; on load failure the fallback `children` render instead. */
    src?: string;
    /** Alternative text for the image; empty when the name is shown alongside. */
    alt?: string;
    /** Avatar size. */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    /** Avatar shape. Defaults to a circle. */
    shape?: 'circle' | 'square';
    /** Fallback content, typically initials. */
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

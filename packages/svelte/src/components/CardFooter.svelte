<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Footer content, typically actions. */
    children?: Snippet;
  }

  let { class: klass, children, ...rest }: Props = $props();
</script>

<div {...rest} class={['hl-card-footer', klass]}>
  {@render children?.()}
</div>

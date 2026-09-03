<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Drawer title; the enhancer labels the drawer with this section. */
    children?: Snippet;
  }

  let { class: klass, children, ...rest }: Props = $props();
</script>

<div {...rest} class={['hl-drawer-header', klass]}>
  {@render children?.()}
</div>

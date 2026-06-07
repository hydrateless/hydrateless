<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    open: boolean;
    children?: Snippet;
  }

  let { open, children, ...rest }: Props = $props();
</script>

<div {...rest} data-hl-popover role="dialog" hidden={!open}>
  {@render children?.()}
</div>

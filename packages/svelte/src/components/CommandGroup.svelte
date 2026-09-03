<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Optional heading shown above the grouped items. */
    label?: Snippet;
    /** `<CommandItem>`s in this group. */
    children?: Snippet;
  }

  let { label, children, ...rest }: Props = $props();
</script>

<div {...rest} data-hl-command-group>
  {#if label}<div class="hl-command-group-label" role="presentation">{@render label()}</div>{/if}
  {@render children?.()}
</div>

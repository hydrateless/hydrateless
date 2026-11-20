<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** `<CommandItem>`s, optionally wrapped in `<CommandGroup>`s. */
    children?: Snippet;
  }

  let { class: klass, children, ...rest }: Props = $props();
</script>

<div {...rest} class={['hl-command-list', klass]} data-hl-command-list role="listbox">
  {@render children?.()}
</div>

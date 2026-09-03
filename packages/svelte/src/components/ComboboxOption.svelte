<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLLiAttributes } from 'svelte/elements';

  interface Props extends HTMLLiAttributes {
    /** Value committed when the option is chosen. */
    value: string;
    /** Skip the option in keyboard navigation and refuse selection. */
    disabled?: boolean;
    /** Option label; defaults to `value`. */
    children?: Snippet;
  }

  let { value, disabled, children, ...rest }: Props = $props();
</script>

<li {...rest} role="option" data-hl-value={value} aria-disabled={disabled ? 'true' : undefined}>
  {#if children}{@render children()}{:else}{value}{/if}
</li>

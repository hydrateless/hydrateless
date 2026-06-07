<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends HTMLButtonAttributes {
    /** Convenience handler fired on click; you can also pass `onclick`. */
    onSelect?: () => void;
    children?: Snippet;
  }

  let { onSelect, onclick, type, children, ...rest }: Props = $props();
</script>

<li>
  <button
    {...rest}
    type={type ?? 'button'}
    role="menuitem"
    onclick={(e) => {
      onSelect?.();
      onclick?.(e);
    }}
  >
    {@render children?.()}
  </button>
</li>

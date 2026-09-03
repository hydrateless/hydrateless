<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLUListElement> {
    /** `<ComboboxOption>`s. */
    children?: Snippet;
  }

  let { children, ...rest }: Props = $props();
</script>

<!-- No `hidden` in the markup: before the enhancer runs, the stylesheet keeps
     the listbox reachable on focus-within as a no-JS baseline. -->
<ul {...rest} role="listbox">
  {@render children?.()}
</ul>

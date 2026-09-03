<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLUListElement> {
    /** Accessible name of the group, rendered as `aria-label`. */
    label?: string;
    /** `<DropdownItem>`s; `menuitemradio` items are exclusive within the group. */
    children?: Snippet;
  }

  let { label, class: klass, children, ...rest }: Props = $props();
</script>

<li>
  <ul {...rest} role="group" aria-label={label} class={['hl-dropdown-group', klass]}>
    {@render children?.()}
  </ul>
</li>

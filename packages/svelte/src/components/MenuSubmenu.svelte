<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLAttributes<HTMLUListElement>, 'title'> {
    /** Plain-text label of the trigger item. Use the `trigger` snippet for rich content. */
    label?: string;
    /** Rich trigger content; overrides `label`. */
    trigger?: Snippet;
    /** Value the Menu reports while this submenu is open; defaults to the top-level index. */
    value?: string;
    /** Skip the trigger in keyboard navigation and keep the submenu closed. */
    disabled?: boolean;
    /** Nested `<MenuItem>`s. */
    children?: Snippet;
  }

  let { label, trigger, value, disabled, class: klass, children, ...rest }: Props = $props();
</script>

<!-- No `hidden` in the markup: before the enhancer runs, the stylesheet shows
     the submenu on hover/focus-within so the navigation stays usable. -->
<li role="none">
  <button type="button" role="menuitem" data-hl-value={value} disabled={disabled || undefined}>
    {#if trigger}{@render trigger()}{:else}{label}{/if}
  </button>
  <ul {...rest} role="menu" data-hl-menu-submenu class={klass}>
    {@render children?.()}
  </ul>
</li>

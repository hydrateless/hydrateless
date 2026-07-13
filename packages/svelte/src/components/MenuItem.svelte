<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLButtonAttributes, 'type' | 'value'> {
    /** Render as a link instead of a button. */
    href?: string;
    /** Stable value identifying this item; defaults to its label text. */
    value?: string;
    /** Convenience handler fired on activation. */
    onSelect?: () => void;
    /** Nested `<MenuItem>`s; renders a single-level submenu. */
    submenu?: Snippet;
    /** Extra attributes for the `<a>` when `href` is set. */
    anchorProps?: HTMLAnchorAttributes;
    children?: Snippet;
  }

  let { href, value, onSelect, onclick, submenu, anchorProps, children, ...rest }: Props = $props();
</script>

<li role="none">
  {#if href && !submenu}
    <a {...anchorProps} role="menuitem" {href} data-hl-value={value}>{@render children?.()}</a>
  {:else}
    <button
      {...rest}
      type="button"
      role="menuitem"
      data-hl-value={value}
      onclick={(e) => {
        onSelect?.();
        onclick?.(e);
      }}
    >
      {@render children?.()}
    </button>
  {/if}
  {#if submenu}
    <ul role="menu" data-hl-menu-submenu hidden>{@render submenu()}</ul>
  {/if}
</li>

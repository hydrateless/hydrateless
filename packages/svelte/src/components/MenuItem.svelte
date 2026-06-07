<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLButtonAttributes, 'type'> {
    /** Render as a link instead of a button. */
    href?: string;
    /** Convenience handler fired on activation. */
    onSelect?: () => void;
    /** Nested `<MenuItem>`s; renders a single-level submenu. */
    submenu?: Snippet;
    /** Extra attributes for the `<a>` when `href` is set. */
    anchorProps?: HTMLAnchorAttributes;
    children?: Snippet;
  }

  let { href, onSelect, onclick, submenu, anchorProps, children, ...rest }: Props = $props();
</script>

<li role="none">
  {#if href && !submenu}
    <a {...anchorProps} role="menuitem" {href}>{@render children?.()}</a>
  {:else}
    <button
      {...rest}
      type="button"
      role="menuitem"
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

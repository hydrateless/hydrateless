<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLAttributes<HTMLElement>, 'role'> {
    /** Render as a link instead of a button. */
    href?: string;
    /** Stable value identifying this item; defaults to its label text. */
    value?: string;
    /** Skip the item in keyboard navigation and ignore activation. */
    disabled?: boolean;
    /** `menuitemcheckbox` toggles; `menuitemradio` is exclusive within its menu. */
    role?: 'menuitem' | 'menuitemcheckbox' | 'menuitemradio';
    /** Checked state for checkable roles; rendered as `aria-checked`. */
    checked?: boolean;
    /** Convenience handler fired on activation; the Menu's `onSelect` also fires. */
    onSelect?: () => void;
    /** Item label. */
    children?: Snippet;
  }

  let {
    href,
    value,
    disabled,
    role = 'menuitem',
    checked,
    onSelect,
    onclick,
    children,
    ...rest
  }: Props = $props();
  const checkable = $derived(role !== 'menuitem');
  const ariaChecked = $derived(checkable ? (checked ?? false) : undefined);

  function handleClick(e: MouseEvent) {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onSelect?.();
    onclick?.(e as MouseEvent & { currentTarget: EventTarget & HTMLElement });
  }
</script>

<li role="none">
  {#if href}
    <a
      {...rest}
      {href}
      {role}
      data-hl-value={value}
      aria-disabled={disabled || undefined}
      aria-checked={ariaChecked}
      onclick={handleClick}>{@render children?.()}</a
    >
  {:else}
    <button
      {...rest}
      type="button"
      {role}
      data-hl-value={value}
      disabled={disabled || undefined}
      aria-checked={ariaChecked}
      onclick={handleClick}
    >
      {@render children?.()}
    </button>
  {/if}
</li>

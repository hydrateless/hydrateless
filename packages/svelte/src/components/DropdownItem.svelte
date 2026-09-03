<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLButtonAttributes, 'role' | 'value'> {
    /** Value reported to `onSelect`; defaults to the item's text. */
    value?: string;
    /** Skip the item in keyboard navigation and ignore activation. */
    disabled?: boolean;
    /** `menuitemcheckbox` toggles; `menuitemradio` is exclusive within its `<DropdownGroup>`. */
    role?: 'menuitem' | 'menuitemcheckbox' | 'menuitemradio';
    /** Checked state for checkable roles; rendered as `aria-checked`. */
    checked?: boolean;
    /** Convenience handler fired on activation; the Dropdown's `onSelect` also fires. */
    onSelect?: () => void;
    /** Item label. */
    children?: Snippet;
  }

  let {
    value,
    disabled,
    role = 'menuitem',
    checked,
    onSelect,
    onclick,
    type,
    children,
    ...rest
  }: Props = $props();
  const checkable = $derived(role !== 'menuitem');
</script>

<li>
  <button
    {...rest}
    type={type ?? 'button'}
    {role}
    data-hl-value={value}
    disabled={disabled || undefined}
    aria-checked={checkable ? (checked ?? false) : undefined}
    onclick={(e) => {
      if (disabled) return;
      onSelect?.();
      onclick?.(e);
    }}
  >
    {@render children?.()}
  </button>
</li>

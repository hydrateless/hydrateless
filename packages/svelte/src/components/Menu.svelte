<script lang="ts">
  import { enhanceMenu, type EnhanceMenuOptions } from '@hydrateless/enhancers';
  import { untrack } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { useEnhancer } from '../useEnhancer.svelte.js';

  interface Props extends Omit<HTMLAttributes<HTMLUListElement>, 'onselect'> {
    /** Layout of the top-level items. Defaults to `horizontal` (a menubar). */
    orientation?: EnhanceMenuOptions['orientation'];
    /**
     * Value of the open submenu, or `null` when all are closed; two-way
     * bindable (`bind:value`). Submenu values come from `<MenuSubmenu value>`,
     * defaulting to the top-level index.
     */
    value?: string | null;
    /** Submenu to open initially for uncontrolled usage. */
    defaultValue?: string | null;
    /** Called with the open submenu's value (or `null`) after every change. */
    onValueChange?: (value: string | null) => void;
    /**
     * Called with the item's value when a leaf item is activated. For
     * `menuitemcheckbox`/`menuitemradio` items, `checked` is the new state.
     */
    onSelect?: (value: string, item: HTMLElement, checked?: boolean) => void;
    /** `<MenuItem>`s and `<MenuSubmenu>`s. */
    children?: Snippet;
  }

  let {
    orientation = 'horizontal',
    value = $bindable(),
    defaultValue = null,
    onValueChange,
    onSelect,
    children,
    ...rest
  }: Props = $props();
  // svelte-ignore state_referenced_locally -- seeds the uncontrolled initial value once
  if (value === undefined) value = defaultValue;

  const menu = useEnhancer(enhanceMenu, () => ({
    orientation,
    defaultValue: untrack(() => value),
    onValueChange: (next) => {
      value = next;
      onValueChange?.(next);
    },
    onSelect: (itemValue, item, checked) => onSelect?.(itemValue, item, checked),
  }));

  $effect(() => {
    if (value !== undefined) menu.api?.setValue(value);
  });
</script>

<ul
  {...rest}
  data-hl-menu
  role={orientation === 'vertical' ? 'menu' : 'menubar'}
  aria-orientation={orientation}
  {@attach menu.attach}
>
  {@render children?.()}
</ul>

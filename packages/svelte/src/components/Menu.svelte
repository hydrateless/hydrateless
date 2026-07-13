<script lang="ts">
  import { enhanceMenu, type EnhanceMenuOptions, type MenuApi } from '@hydrateless/enhancers';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLAttributes<HTMLUListElement>, 'onselect'> {
    orientation?: EnhanceMenuOptions['orientation'];
    /** Open submenu value (or `null`); two-way bindable (`bind:open`). */
    open?: string | null;
    /** Fires with the item's value when a leaf menu item is activated. */
    onSelect?: (value: string) => void;
    children?: Snippet;
  }

  let {
    orientation = 'horizontal',
    open = $bindable(),
    onSelect,
    children,
    ...rest
  }: Props = $props();
  let host = $state<HTMLUListElement>();
  let api = $state<MenuApi | null>(null);

  $effect(() => {
    if (!host) return;
    const handle = enhanceMenu(host, {
      orientation,
      onOpenChange: (value) => (open = value),
      onSelect: (value) => onSelect?.(value),
    });
    api = handle.api;
    return () => {
      handle.destroy();
      api = null;
    };
  });

  $effect(() => {
    if (open !== undefined) api?.setOpen(open);
  });
</script>

<ul
  {...rest}
  bind:this={host}
  data-hl-menu
  role={orientation === 'vertical' ? 'menu' : 'menubar'}
  aria-orientation={orientation}
>
  {@render children?.()}
</ul>

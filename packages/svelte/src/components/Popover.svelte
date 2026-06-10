<script lang="ts">
  import { combine, onClickOutside, onEscape } from '@hydrateless/enhancers';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Open state; two-way bindable (`bind:open`). Escape/outside clicks close it. */
    open?: boolean;
    children?: Snippet;
  }

  let { open = $bindable(false), children, ...rest }: Props = $props();
  let host = $state<HTMLDivElement>();

  $effect(() => {
    const el = host;
    if (!el || !open) return;
    const dismiss = () => (open = false);
    return combine([onClickOutside(el, dismiss), onEscape(dismiss, el.ownerDocument)]);
  });
</script>

<div {...rest} data-hl-popover role="dialog" hidden={!open} bind:this={host}>
  {@render children?.()}
</div>

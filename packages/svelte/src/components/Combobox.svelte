<script lang="ts">
  import { enhanceCombobox, type EnhanceComboboxOptions } from '@hydrateless/enhancers';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
    filter?: EnhanceComboboxOptions['filter'];
    autoHighlight?: EnhanceComboboxOptions['autoHighlight'];
    /** Called with the committed value when an option is selected. */
    onValueChange?: (value: string) => void;
    children?: Snippet;
  }

  let { filter, autoHighlight, onValueChange, children, ...rest }: Props = $props();
  let host = $state<HTMLDivElement>();

  $effect(() => {
    if (!host) return;
    const node = host;
    const dispose = enhanceCombobox(node, { filter, autoHighlight });
    const handler = (e: Event) => onValueChange?.((e as CustomEvent).detail.value);
    node.addEventListener('hl:select', handler);
    return () => {
      node.removeEventListener('hl:select', handler);
      dispose();
    };
  });
</script>

<div {...rest} data-hl-combobox bind:this={host}>
  {@render children?.()}
</div>

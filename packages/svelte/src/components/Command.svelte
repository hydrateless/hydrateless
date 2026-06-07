<script lang="ts">
  import { enhanceCommand } from '@hydrateless/enhancers';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Lowercased key that opens the palette's dialog with Cmd/Ctrl. */
    hotkey?: string;
    /** Fires with the chosen item's value when a command runs. */
    onSelect?: (value: string) => void;
    children?: Snippet;
  }

  let { hotkey, onSelect, children, ...rest }: Props = $props();
  let host = $state<HTMLDivElement>();

  $effect(() => {
    if (!host) return;
    const node = host;
    const dispose = enhanceCommand(node, { hotkey });
    const handler = (e: Event) => onSelect?.((e as CustomEvent).detail.value);
    node.addEventListener('hl:command', handler);
    return () => {
      node.removeEventListener('hl:command', handler);
      dispose();
    };
  });
</script>

<div {...rest} data-hl-command data-hl-command-hotkey={hotkey} bind:this={host}>
  {@render children?.()}
</div>

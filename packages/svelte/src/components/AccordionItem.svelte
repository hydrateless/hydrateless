<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLAttributes<HTMLDetailsElement>, 'title'> {
    /** The clickable summary/trigger row. */
    summary?: Snippet;
    /** Stable value identifying this item; defaults to its index. */
    value?: string;
    defaultOpen?: boolean;
    children?: Snippet;
  }

  let { summary, value, defaultOpen = false, children, ...rest }: Props = $props();
  let el = $state<HTMLDetailsElement>();

  $effect(() => {
    if (el && defaultOpen) el.open = true;
  });
</script>

<details {...rest} bind:this={el} data-hl-value={value}>
  <summary>{@render summary?.()}</summary>
  <div class="hl-accordion-panel">{@render children?.()}</div>
</details>

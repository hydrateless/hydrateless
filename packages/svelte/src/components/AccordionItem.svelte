<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLAttributes<HTMLDetailsElement>, 'title'> {
    /** The clickable summary/trigger row. */
    summary?: Snippet;
    defaultOpen?: boolean;
    children?: Snippet;
  }

  let { summary, defaultOpen = false, children, ...rest }: Props = $props();
  let el = $state<HTMLDetailsElement>();

  $effect(() => {
    if (el && defaultOpen) el.open = true;
  });
</script>

<details {...rest} bind:this={el}>
  <summary>{@render summary?.()}</summary>
  <div class="accordion-panel">{@render children?.()}</div>
</details>

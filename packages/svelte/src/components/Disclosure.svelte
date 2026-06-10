<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLAttributes<HTMLDetailsElement>, 'title'> {
    /** The clickable summary/trigger row. */
    summary?: Snippet;
    defaultOpen?: boolean;
    children?: Snippet;
  }

  let { summary, defaultOpen = false, class: klass, children, ...rest }: Props = $props();
  let el = $state<HTMLDetailsElement>();

  $effect(() => {
    if (el && defaultOpen) el.open = true;
  });
</script>

<details {...rest} bind:this={el} class={['hl-disclosure', klass]} data-hl-disclosure>
  <summary>{@render summary?.()}</summary>
  <div class="hl-disclosure-panel">{@render children?.()}</div>
</details>

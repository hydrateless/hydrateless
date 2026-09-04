<script lang="ts">
  import { onDestroy, type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getAccordionContext } from '../context.js';

  interface Props extends Omit<HTMLAttributes<HTMLDetailsElement>, 'title'> {
    /** Stable value identifying this item; defaults to its index. */
    value?: string;
    /** Plain-text header. Use the `summary` snippet for rich content. */
    title?: string;
    /** The clickable summary/trigger row; overrides `title`. */
    summary?: Snippet;
    /** Panel content. */
    children?: Snippet;
  }

  let { value, title, summary, children, ...rest }: Props = $props();
  const accordion = getAccordionContext();
  const registration = accordion?.registerItem();
  onDestroy(() => registration?.unregister());
  let node = $state<HTMLDetailsElement | null>(null);
  $effect(() => registration?.attach(node));
  const ownValue = $derived(value ?? String(registration?.index ?? 0));
  // Rendered on the server from the Accordion's value so the open panel shows
  // before the enhancer runs; the enhancer then keeps `open` in step.
  const open = $derived(accordion ? accordion.value.includes(ownValue) : undefined);
</script>

<details {...rest} bind:this={node} data-hl-value={value} {open}>
  <summary
    >{#if summary}{@render summary()}{:else}{title}{/if}</summary
  >
  <div class="hl-accordion-panel">{@render children?.()}</div>
</details>

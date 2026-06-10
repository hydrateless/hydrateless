<script lang="ts">
  import { enhanceTooltip } from '@hydrateless/enhancers';
  import type { Snippet } from 'svelte';

  interface Props {
    /** The hint text shown on hover/focus. */
    label?: string;
    /** Richer hint content; overrides `label` when provided. */
    tip?: Snippet;
    id?: string;
    /** A single focusable element that triggers the tooltip. */
    children?: Snippet;
  }

  let { label, tip, id, children }: Props = $props();
  const generatedId = `hl-tip-${Math.random().toString(36).slice(2, 8)}`;
  const tipId = $derived(id ?? generatedId);
  let host = $state<HTMLSpanElement>();

  $effect(() => {
    if (!host) return;
    const trigger = host.querySelector<HTMLElement>(':scope > :first-child');
    if (trigger) {
      trigger.setAttribute('data-hl-tooltip', tipId);
      trigger.setAttribute('aria-describedby', tipId);
    }
    return enhanceTooltip(host).destroy;
  });
</script>

<span bind:this={host} style="position:relative;display:inline-block">
  {@render children?.()}
  <span id={tipId} role="tooltip" hidden
    >{#if tip}{@render tip()}{:else}{label}{/if}</span
  >
</span>

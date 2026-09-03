<script lang="ts">
  import { enhanceTooltip, type EnhanceTooltipOptions } from '@hydrateless/enhancers';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { useEnhancer } from '../useEnhancer.svelte.js';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    /** The hint shown on hover/focus: plain text or a snippet for rich content. */
    content?: string | Snippet;
    /** Preferred placement relative to the trigger. Defaults to `top`. */
    placement?: EnhanceTooltipOptions['placement'];
    /** Delay in ms before showing on hover. Focus shows immediately. */
    showDelay?: number;
    /** Grace period in ms before hiding, so the pointer can reach the tip. */
    hideDelay?: number;
    /** Whether the tip is shown; two-way bindable (`bind:open`). */
    open?: boolean;
    /** Called after the tip shows or hides. */
    onOpenChange?: (open: boolean) => void;
    /** A single focusable element that triggers the tooltip. */
    children?: Snippet;
  }

  let {
    content,
    placement,
    showDelay,
    hideDelay,
    open = $bindable(),
    onOpenChange,
    class: klass,
    style,
    children,
    ...rest
  }: Props = $props();
  // SSR-safe: $props.id() is stable across server and client renders.
  const generatedId = $props.id();
  const tipId = `hl-tip-${generatedId}`;

  // The trigger is whatever the consumer renders first, so it's linked to the
  // tip here rather than asking them to repeat the id.
  const tooltip = useEnhancer(
    (node: HTMLElement, options?: Partial<EnhanceTooltipOptions>) => {
      const trigger = node.querySelector<HTMLElement>(':scope > :first-child');
      trigger?.setAttribute('data-hl-tooltip', tipId);
      trigger?.setAttribute('aria-describedby', tipId);
      return enhanceTooltip(node, options);
    },
    () => ({
      placement,
      showDelay,
      hideDelay,
      onOpenChange: (next) => {
        open = next;
        onOpenChange?.(next);
      },
    }),
  );

  $effect(() => {
    if (open != null) tooltip.api?.setOpen(open);
  });
</script>

<span
  {...rest}
  class={['hl-tooltip-anchor', klass]}
  style={['position:relative;display:inline-block', style].filter(Boolean).join(';')}
  {@attach tooltip.attach}
>
  {@render children?.()}
  <span id={tipId} role="tooltip" hidden
    >{#if typeof content === 'function'}{@render content()}{:else}{content}{/if}</span
  >
</span>

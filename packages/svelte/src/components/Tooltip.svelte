<script lang="ts">
  import { enhanceTooltip, type EnhanceTooltipOptions } from '@hydrateless/enhancers';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { TooltipTriggerProps } from '../context.js';
  import { useEnhancer } from '../useEnhancer.svelte.js';

  interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
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
    /**
     * A single focusable element that triggers the tooltip. The snippet
     * receives the trigger attributes; spread them so server-rendered markup
     * links the trigger to the tip before any script runs:
     *
     * ```svelte
     * <Tooltip content="Save">
     *   {#snippet children(trigger)}<Button {...trigger}>Save</Button>{/snippet}
     * </Tooltip>
     * ```
     *
     * Without the spread, the first child is linked on the client instead.
     */
    children?: Snippet<[TooltipTriggerProps]>;
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
  const triggerProps: TooltipTriggerProps = {
    'data-hl-tooltip': tipId,
    'aria-describedby': tipId,
  };

  // Consumers that don't spread the snippet's trigger props still get linked
  // on the client: whatever they rendered first is the trigger.
  const tooltip = useEnhancer(
    (node: HTMLElement, options?: Partial<EnhanceTooltipOptions>) => {
      const trigger = node.querySelector<HTMLElement>(':scope > :first-child');
      if (trigger && !trigger.hasAttribute('data-hl-tooltip')) {
        trigger.setAttribute('data-hl-tooltip', tipId);
        trigger.setAttribute('aria-describedby', tipId);
      }
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
  {@render children?.(triggerProps)}
  <span id={tipId} role="tooltip" hidden
    >{#if typeof content === 'function'}{@render content()}{:else}{content}{/if}</span
  >
</span>

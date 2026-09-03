<script lang="ts">
  import { enhanceToast, type EnhanceToastOptions } from '@hydrateless/enhancers';
  import type { HTMLAttributes } from 'svelte/elements';
  import { useEnhancer } from '../useEnhancer.svelte.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Default auto-dismiss duration in ms for toasts shown without one. */
    duration?: number;
    /** Called after a toast appears (`open: true`) or is dismissed (`open: false`). */
    onOpenChange?: EnhanceToastOptions['onOpenChange'];
  }

  let { duration, onOpenChange, ...rest }: Props = $props();

  // Enhanced on mount so `useToast()` adopts this region (and its defaults)
  // instead of appending its own to <body>.
  const toast = useEnhancer(enhanceToast, () => ({
    duration,
    onOpenChange: (open, el) => onOpenChange?.(open, el),
  }));
</script>

<div {...rest} data-hl-toast-region {@attach toast.attach}></div>

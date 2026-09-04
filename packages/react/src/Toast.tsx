import { forwardRef, type HTMLAttributes } from 'react';
import { enhanceToast, type EnhanceToastOptions, type ToastApi } from '@hydrateless/enhancers';
import { useEnhancer } from './useEnhancer.js';
import { useForwardedRef } from './internal/useForwardedRef.js';

let sharedApi: ToastApi | null = null;

function ensureApi(): ToastApi {
  if (!sharedApi) {
    const handle = enhanceToast(document);
    sharedApi = handle.api!;
  }
  return sharedApi;
}

/** A stable facade so `useToast()` is safe to call before anything mounted. */
const facade: ToastApi = {
  show: (message, options) => ensureApi().show(message, options),
  dismiss: (toast) => ensureApi().dismiss(toast),
  dismissAll: () => ensureApi().dismissAll(),
};

/** Props for {@link ToastRegion}. */
export interface ToastRegionProps extends HTMLAttributes<HTMLDivElement> {
  /** Default auto-dismiss duration in ms for toasts shown without one. */
  duration?: number;
  /** Called after a toast appears (`open: true`) or is dismissed (`open: false`). */
  onOpenChange?: (open: boolean, toast: HTMLElement) => void;
}

/**
 * The polite live region toasts render into. Render once near the root of
 * your app to control where toasts appear; it enhances on mount and adopts
 * declarative `data-hl-toast-trigger` buttons anywhere in the document. If
 * omitted, the first `show()` call creates a region at the end of `<body>`.
 */
export const ToastRegion = forwardRef<HTMLDivElement, ToastRegionProps>(function ToastRegion(
  { duration, onOpenChange, ...props },
  forwardedRef,
) {
  const ref = useForwardedRef(forwardedRef);
  useEnhancer<EnhanceToastOptions, ToastApi>(
    ref,
    (region, options) => {
      // Enhance at document level so delegated triggers outside the region
      // work, and hand the live API to `useToast()` callers.
      const handle = enhanceToast(region.ownerDocument, options);
      sharedApi = handle.api;
      return {
        ...handle,
        destroy: () => {
          handle.destroy();
          sharedApi = null;
        },
      };
    },
    { duration, onOpenChange },
    [duration],
  );

  return <div {...props} ref={ref} data-hl-toast-region />;
});

/**
 * Access the imperative toast API: `show(message, { duration, intent })`
 * returns the toast element, `dismiss(toast)` removes it. Works with or
 * without a mounted {@link ToastRegion}.
 *
 * ```tsx
 * const toast = useToast();
 * toast.show('Saved', { intent: 'success' });
 * ```
 */
export function useToast(): ToastApi {
  return facade;
}

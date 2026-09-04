import { enhanceToast, type EnhanceToastOptions, type ToastApi } from '@hydrateless/enhancers';

/**
 * Imperative toast API: `show(message, { duration, intent })`,
 * `dismiss(toast)`, and `dismissAll()`. Toasts render into the page's `[data-hl-toast-region]`
 * (mount a `<ToastRegion>` once near the app root) or into a region created
 * on demand, so no provider is required and it's safe to call from any
 * component.
 */
export function useToast(options?: EnhanceToastOptions): ToastApi {
  // Resolve the live region on every call rather than caching it: a
  // `<ToastRegion>` may mount after the first toast, or be replaced by a
  // route change, and `enhanceToast` hands back the current region's API.
  const api = () => enhanceToast(document, options).api;
  return {
    show: (message, opts) => api()!.show(message, opts),
    dismiss: (toast) => api()?.dismiss(toast),
    dismissAll: () => api()?.dismissAll(),
  };
}

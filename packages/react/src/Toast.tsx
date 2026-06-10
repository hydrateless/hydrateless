import { useEffect, useRef, type HTMLAttributes } from 'react';
import { enhanceToast, type ToastApi } from '@hydrateless/enhancers';

let sharedApi: ToastApi | null = null;

function ensureApi(): ToastApi {
  if (!sharedApi) {
    const handle = enhanceToast(document);
    sharedApi = handle.api!;
  }
  return sharedApi;
}

/** A stable façade so `useToast()` is safe to call before anything mounted. */
const facade: ToastApi = {
  show: (message, options) => ensureApi().show(message, options),
  dismiss: (toast) => ensureApi().dismiss(toast),
};

export type ToastRegionProps = HTMLAttributes<HTMLDivElement>;

/**
 * The polite live region toasts render into. Render once near the root of
 * your app to control where toasts appear; if omitted, the first `show()`
 * call creates a region at the end of `<body>`.
 */
export function ToastRegion(props: ToastRegionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    // Adopt this region (and its declarative triggers) into the shared API.
    const handle = enhanceToast(ref.current.ownerDocument);
    sharedApi = handle.api;
    return () => {
      handle.destroy();
      sharedApi = null;
    };
  }, []);

  return <div {...props} data-hl-toast-region ref={ref} />;
}

/**
 * Access the imperative toast API (`show`/`dismiss`). Works with or without a
 * mounted {@link ToastRegion}.
 */
export function useToast(): ToastApi {
  return facade;
}

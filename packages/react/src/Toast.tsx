import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import { enhanceToast, type ToastApi } from '@hydrateless/enhancers';

const ToastContext = createContext<ToastApi | null>(null);

export interface ToastProviderProps {
  children?: ReactNode;
}

/**
 * Provides a toast region and exposes the imperative toast API via
 * {@link useToast}. Render once near the root of your app.
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const apiRef = useRef<ToastApi | null>(null);

  // A stable façade so `useToast()` can be called immediately, even before the
  // region's effect has wired up the real API.
  const facade = useRef<ToastApi>({
    show: (message, options) =>
      apiRef.current ? apiRef.current.show(message, options) : document.createElement('div'),
    dismiss: (toast) => apiRef.current?.dismiss(toast),
    destroy: () => apiRef.current?.destroy(),
  });

  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const region = regionRef.current;
    if (!region) return;
    const api = enhanceToast(region.ownerDocument);
    apiRef.current = api;
    return () => {
      api.destroy();
      apiRef.current = null;
    };
  }, []);

  return (
    <ToastContext.Provider value={facade.current}>
      {children}
      <div data-hl-toast-region ref={regionRef} />
    </ToastContext.Provider>
  );
}

/** Access the toast API. Must be called within a {@link ToastProvider}. */
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return ctx;
}

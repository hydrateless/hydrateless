import { onMounted, onUnmounted } from 'vue';
import { enhanceToast, type ToastApi, type ToastOptions } from '@hydrateless/enhancers';

export interface UseToastReturn {
  show: (message: string, options?: ToastOptions) => HTMLElement;
  dismiss: (toast: HTMLElement) => void;
}

/**
 * Sets up a toast region for the current component tree and returns an
 * imperative API. The region is torn down automatically on unmount.
 */
export function useToast(): UseToastReturn {
  let api: ToastApi | null = null;

  onMounted(() => {
    api = enhanceToast(document);
  });

  onUnmounted(() => {
    api?.destroy();
    api = null;
  });

  return {
    show: (message, options) => (api ? api.show(message, options) : document.createElement('div')),
    dismiss: (toast) => api?.dismiss(toast),
  };
}

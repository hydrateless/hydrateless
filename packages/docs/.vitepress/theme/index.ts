import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import { auto } from '@hydrateless/auto';
import 'hydrateless/hydrateless.css';
import './custom.css';

// Re-run the auto-initializer on every route change so the live demos embedded
// in the docs are enhanced after VitePress's client-side navigation. The
// previous run is disposed first to avoid stacking global listeners.
export default {
  extends: DefaultTheme,
  enhanceApp({ router }) {
    if (typeof window === 'undefined') return;

    let dispose: (() => void) | null = null;
    const run = () => {
      window.setTimeout(async () => {
        dispose?.();
        dispose = await auto(document);
      }, 0);
    };

    const previous = router.onAfterRouteChanged?.bind(router);
    router.onAfterRouteChanged = (to: string) => {
      previous?.(to);
      run();
    };

    run();
  },
} satisfies Theme;

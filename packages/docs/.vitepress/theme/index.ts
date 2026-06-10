import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import { auto } from '@hydrateless/auto';
import 'hydrateless/hydrateless.css';
import './custom.css';

// One call enhances the live demos embedded in the docs. The auto-initializer
// keeps watching the DOM, so content swapped in by VitePress's client-side
// navigation is enhanced (and disposed) automatically.
export default {
  extends: DefaultTheme,
  enhanceApp() {
    if (typeof window === 'undefined') return;
    void auto(document);
  },
} satisfies Theme;

<script lang="ts">
  import { enhanceToc, type EnhanceTocOptions } from '@hydrateless/enhancers';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { useEnhancer } from '../useEnhancer.svelte.js';

  interface Props extends HTMLAttributes<HTMLElement> {
    /** Selector for the region whose headings populate the list. Defaults to `main, article`. */
    contentSelector?: string;
    /** Selector for which headings to include. Defaults to `h2,h3`. */
    headings?: string;
    /** Highlight the entry for the heading currently in view. Defaults to `true`. */
    scrollSpy?: boolean;
    /** Placeholder shown until the list is built (and restored if the Toc is destroyed). */
    children?: Snippet;
  }

  let { contentSelector, headings, scrollSpy, children, ...rest }: Props = $props();

  // The headings live outside the nav, so the enhancer scans the document and
  // finds this nav as the `[data-hl-toc]` root within it.
  const toc = useEnhancer(
    (node: HTMLElement, options?: Partial<EnhanceTocOptions>) =>
      enhanceToc(node.ownerDocument, options),
    () => ({ contentSelector, headings, scrollSpy }),
  );
</script>

<nav {...rest} data-hl-toc {@attach toc.attach}>
  {@render children?.()}
</nav>

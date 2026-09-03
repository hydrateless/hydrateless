import { forwardRef, type HTMLAttributes } from 'react';
import { enhanceToc, type EnhanceTocOptions, type TocApi } from '@hydrateless/enhancers';
import { useEnhancer } from './useEnhancer.js';
import { useForwardedRef } from './internal/useForwardedRef.js';

/** Props for {@link Toc}. */
export interface TocProps extends HTMLAttributes<HTMLElement> {
  /** CSS selector for the content root to scan for headings. */
  contentSelector?: string;
  /** Comma-separated heading selector, e.g. `"h2,h3"`. */
  headings?: string;
  /** Highlight the current section while scrolling. */
  scrollSpy?: boolean;
}

/** Auto-generated table of contents with optional scroll-spy. */
export const Toc = forwardRef<HTMLElement, TocProps>(function Toc(
  { contentSelector, headings, scrollSpy, ...rest },
  forwardedRef,
) {
  const ref = useForwardedRef(forwardedRef);
  useEnhancer<EnhanceTocOptions, TocApi>(
    ref,
    // The content lives outside the nav, so scan from the document.
    (nav, options) => enhanceToc(nav.ownerDocument, options),
    { contentSelector, headings, scrollSpy },
    [contentSelector, headings, scrollSpy],
  );

  return <nav {...rest} ref={ref} data-hl-toc />;
});

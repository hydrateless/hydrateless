import { useEffect, useRef, type HTMLAttributes } from 'react';
import { enhanceToc } from '@hydrateless/enhancers';

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
export function Toc({ contentSelector, headings, scrollSpy, ...rest }: TocProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return enhanceToc(ref.current.ownerDocument, { contentSelector, headings, scrollSpy }).destroy;
  }, [contentSelector, headings, scrollSpy]);

  return <nav {...rest} data-hl-toc ref={ref} />;
}

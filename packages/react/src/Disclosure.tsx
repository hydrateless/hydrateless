import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';

export interface DisclosureProps extends Omit<HTMLAttributes<HTMLDetailsElement>, 'title'> {
  summary: ReactNode;
  defaultOpen?: boolean;
}

/**
 * A single expandable section. Purely presentational — native `<details>`
 * handles open/close, so no enhancer is required for a lone disclosure. Use
 * `useEnhancer(enhanceDisclosure)` on a wrapper if you need a mutually
 * exclusive group.
 */
export function Disclosure({ summary, defaultOpen = false, children, ...rest }: DisclosureProps) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (ref.current && defaultOpen) ref.current.open = true;
  }, [defaultOpen]);

  return (
    <details {...rest} className="hydrateless-disclosure" data-hl-disclosure ref={ref}>
      <summary>{summary}</summary>
      <div className="disclosure-panel">{children}</div>
    </details>
  );
}

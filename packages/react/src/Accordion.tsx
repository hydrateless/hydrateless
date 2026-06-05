import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { enhanceAccordion } from '@hydrateless/enhancers';

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /** Allow more than one panel to stay open at a time. */
  allowMultiple?: boolean;
}

export function Accordion({ allowMultiple = false, children, ...rest }: AccordionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return enhanceAccordion(ref.current, { allowMultiple });
  }, [allowMultiple]);

  return (
    <div {...rest} data-hl-accordion ref={ref}>
      {children}
    </div>
  );
}

export interface AccordionItemProps extends Omit<HTMLAttributes<HTMLDetailsElement>, 'title'> {
  summary: ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({
  summary,
  defaultOpen = false,
  children,
  ...rest
}: AccordionItemProps) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (ref.current && defaultOpen) ref.current.open = true;
  }, [defaultOpen]);

  return (
    <details {...rest} ref={ref}>
      <summary>{summary}</summary>
      <div className="accordion-panel">{children}</div>
    </details>
  );
}

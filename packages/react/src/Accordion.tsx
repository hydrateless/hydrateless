import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { enhanceAccordion, type AccordionApi } from '@hydrateless/enhancers';
import { useEnhancer } from './useEnhancer.js';
import { useLatest } from './util.js';

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /** Allow more than one panel to stay open at a time. */
  allowMultiple?: boolean;
  /** Controlled list of open item values (pair with `onValueChange`). */
  value?: string[];
  /** Initially open item values for uncontrolled usage. */
  defaultValue?: string[];
  /** Called with the open item values after every change. */
  onValueChange?: (value: string[]) => void;
}

/**
 * Accordion of native `<details>` items. Item values come from each
 * `<AccordionItem value>`, defaulting to the index. Open state works
 * uncontrolled (`defaultValue`, or `defaultOpen` on items) or controlled
 * (`value` + `onValueChange`).
 */
export function Accordion({
  allowMultiple = false,
  value,
  defaultValue,
  onValueChange,
  children,
  ...rest
}: AccordionProps) {
  const onValueChangeRef = useLatest(onValueChange);
  const initialValueRef = useLatest(value ?? defaultValue);

  const { ref, api } = useEnhancer<HTMLDivElement, AccordionApi>(
    (el) =>
      enhanceAccordion(el, {
        allowMultiple,
        defaultValue: initialValueRef.current,
        onValueChange: (next) => onValueChangeRef.current?.(next),
      }),
    [allowMultiple],
  );

  useEffect(() => {
    if (value != null) api.current?.setValue(value);
  }, [value, api]);

  return (
    <div {...rest} data-hl-accordion ref={ref}>
      {children}
    </div>
  );
}

export interface AccordionItemProps extends Omit<HTMLAttributes<HTMLDetailsElement>, 'title'> {
  summary: ReactNode;
  /** Stable value identifying this item; defaults to its index. */
  value?: string;
  defaultOpen?: boolean;
}

export function AccordionItem({
  summary,
  value,
  defaultOpen = false,
  children,
  ...rest
}: AccordionItemProps) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (ref.current && defaultOpen) ref.current.open = true;
  }, [defaultOpen]);

  return (
    <details {...rest} data-hl-value={value} ref={ref}>
      <summary>{summary}</summary>
      <div className="hl-accordion-panel">{children}</div>
    </details>
  );
}

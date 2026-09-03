import { createContext, forwardRef, useContext, type HTMLAttributes, type ReactNode } from 'react';
import {
  enhanceAccordion,
  type AccordionApi,
  type EnhanceAccordionOptions,
} from '@hydrateless/enhancers';
import { useEnhancer } from './useEnhancer.js';
import { useControlled } from './internal/useControlled.js';
import { useSyncApi } from './internal/useSyncApi.js';
import { useForwardedRef } from './internal/useForwardedRef.js';
import { IndexContext, indexChildren } from './internal/indexChildren.js';

const AccordionContext = createContext<string[]>([]);

/** Props for {@link Accordion}. */
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
 * `<AccordionItem value>`, defaulting to the index, and each item's `open`
 * attribute is rendered from the value so server output already shows the
 * right panels. Open state works uncontrolled (`defaultValue`) or controlled
 * (`value` + `onValueChange`).
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  { allowMultiple = false, value: valueProp, defaultValue, onValueChange, children, ...rest },
  forwardedRef,
) {
  const ref = useForwardedRef(forwardedRef);
  const [value = [], setValue] = useControlled(valueProp, defaultValue, onValueChange);
  const api = useEnhancer<EnhanceAccordionOptions, AccordionApi>(
    ref,
    enhanceAccordion,
    { allowMultiple, defaultValue: value, onValueChange: setValue },
    [allowMultiple],
  );
  useSyncApi(api, valueProp, (api, value) => api.setValue(value));

  return (
    <AccordionContext.Provider value={value}>
      <div {...rest} ref={ref} data-hl-accordion>
        {indexChildren(children, AccordionItem)}
      </div>
    </AccordionContext.Provider>
  );
});

/** Props for {@link AccordionItem}. */
export interface AccordionItemProps extends Omit<HTMLAttributes<HTMLDetailsElement>, 'title'> {
  /** The always-visible header content. */
  summary: ReactNode;
  /** Stable value identifying this item; defaults to its index. */
  value?: string;
}

/** A single collapsible item within an {@link Accordion}, rendered as a native `<details>`. */
export const AccordionItem = forwardRef<HTMLDetailsElement, AccordionItemProps>(
  function AccordionItem({ summary, value, children, ...rest }, ref) {
    const open = useContext(AccordionContext);
    const index = useContext(IndexContext);
    return (
      <details
        {...rest}
        ref={ref}
        data-hl-value={value}
        open={open.includes(value ?? String(index))}
      >
        <summary>{summary}</summary>
        <div className="hl-accordion-panel">{children}</div>
      </details>
    );
  },
);

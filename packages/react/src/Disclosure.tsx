import { useEffect, type HTMLAttributes, type ReactNode } from 'react';
import { enhanceDisclosure, type DisclosureApi } from '@hydrateless/enhancers';
import { useEnhancer } from './useEnhancer.js';
import { cx, useLatest } from './util.js';

/** Props for {@link Disclosure}. */
export interface DisclosureProps extends Omit<HTMLAttributes<HTMLDetailsElement>, 'title'> {
  summary: ReactNode;
  /** Controlled open state (pair with `onOpenChange`). */
  open?: boolean;
  /** Open the disclosure initially for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Called after the disclosure opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Group name. Disclosures sharing a `name` are exclusive: the browser closes
   * the others when one opens, with no JavaScript.
   */
  name?: string;
}

/**
 * A single expandable section built on native `<details>`, which handles
 * open/close (and exclusive groups, via the `name` attribute) on its own.
 * Open state works uncontrolled (`defaultOpen`) or controlled (`open` +
 * `onOpenChange`).
 */
export function Disclosure({
  summary,
  open,
  defaultOpen,
  onOpenChange,
  name,
  className,
  children,
  ...rest
}: DisclosureProps) {
  const onOpenChangeRef = useLatest(onOpenChange);
  const initialOpenRef = useLatest(open ?? defaultOpen);

  const { ref, api } = useEnhancer<HTMLDetailsElement, DisclosureApi>(
    (el) =>
      enhanceDisclosure(el, {
        defaultOpen: initialOpenRef.current,
        onOpenChange: (next) => onOpenChangeRef.current?.(next),
      }),
    [],
  );

  useEffect(() => {
    if (open != null) api.current?.setOpen(open);
  }, [open, api]);

  return (
    <details
      {...rest}
      name={name}
      className={cx('hl-disclosure', className)}
      data-hl-disclosure
      ref={ref}
    >
      <summary>{summary}</summary>
      <div className="hl-disclosure-panel">{children}</div>
    </details>
  );
}

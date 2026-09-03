import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import {
  enhanceDisclosure,
  type DisclosureApi,
  type EnhanceDisclosureOptions,
} from '@hydrateless/enhancers';
import { useEnhancer } from './useEnhancer.js';
import { cx } from './util.js';
import { useControlled } from './internal/useControlled.js';
import { useSyncApi } from './internal/useSyncApi.js';
import { useForwardedRef } from './internal/useForwardedRef.js';

/** Props for {@link Disclosure}. */
export interface DisclosureProps extends Omit<HTMLAttributes<HTMLDetailsElement>, 'title'> {
  /** The always-visible header content. */
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
export const Disclosure = forwardRef<HTMLDetailsElement, DisclosureProps>(function Disclosure(
  { summary, open: openProp, defaultOpen, onOpenChange, name, className, children, ...rest },
  forwardedRef,
) {
  const ref = useForwardedRef(forwardedRef);
  const [open, setOpen] = useControlled(openProp, defaultOpen ?? false, onOpenChange);
  const api = useEnhancer<EnhanceDisclosureOptions, DisclosureApi>(ref, enhanceDisclosure, {
    defaultOpen: open,
    onOpenChange: setOpen,
  });
  useSyncApi(api, openProp, (api, open) => api.setOpen(open));

  return (
    <details
      {...rest}
      ref={ref}
      name={name}
      open={open}
      className={cx('hl-disclosure', className)}
      data-hl-disclosure
    >
      <summary>{summary}</summary>
      <div className="hl-disclosure-panel">{children}</div>
    </details>
  );
});

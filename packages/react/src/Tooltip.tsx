import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  type ReactElement,
  type ReactNode,
} from 'react';
import { enhanceTooltip } from '@hydrateless/enhancers';

export interface TooltipProps {
  /** The hint text shown on hover/focus. */
  label: ReactNode;
  /** A single focusable element that triggers the tooltip. */
  children: ReactElement;
  id?: string;
}

/**
 * Adds an accessible tooltip to a focusable trigger. The enhancer toggles the
 * tip on hover/focus and dismisses it on Escape.
 */
export function Tooltip({ label, children, id }: TooltipProps) {
  const generatedId = useId().replace(/:/g, '');
  const tipId = id ?? `hl-tip-${generatedId}`;
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return enhanceTooltip(ref.current);
  }, [tipId]);

  const trigger = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        'data-hl-tooltip': tipId,
        'aria-describedby': tipId,
      })
    : children;

  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      {trigger}
      <span id={tipId} role="tooltip" hidden>
        {label}
      </span>
    </span>
  );
}

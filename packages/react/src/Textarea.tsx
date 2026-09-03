import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cx } from './util.js';
import { useFieldControl } from './internal/useFieldControl.js';

/** Props for {@link Textarea}. */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Error state; also inherited from an enclosing {@link Field}. */
  invalid?: boolean;
  /** Grow with the content (`field-sizing: content` where supported). */
  autosize?: boolean;
}

/**
 * Multi-line text input styled with the `hl-textarea` primitive. Inside a
 * {@link Field} it picks up `id`, `aria-describedby`, `aria-invalid`, and
 * `required`.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, autosize, className, ...rest },
  ref,
) {
  const props = useFieldControl(rest, invalid);
  return (
    <textarea
      {...props}
      ref={ref}
      className={cx('hl-textarea', className)}
      data-hl-autosize={autosize || undefined}
      data-hl-invalid={props['aria-invalid'] || undefined}
    />
  );
});

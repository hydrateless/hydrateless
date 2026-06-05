import { forwardRef, type TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

/** Multi-line text input styled with the `hl-textarea` primitive. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, className, ...rest },
  ref,
) {
  return (
    <textarea
      {...rest}
      ref={ref}
      className={['hl-textarea', className].filter(Boolean).join(' ')}
      data-hl-invalid={invalid || undefined}
      aria-invalid={invalid || rest['aria-invalid']}
    />
  );
});

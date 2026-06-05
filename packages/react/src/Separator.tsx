import { forwardRef, type HTMLAttributes } from 'react';

export interface SeparatorProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
  /** Purely decorative — removes it from the accessibility tree. */
  decorative?: boolean;
}

/** Separator primitive — `<hr class="hl-separator">`. */
export const Separator = forwardRef<HTMLHRElement, SeparatorProps>(function Separator(
  { orientation = 'horizontal', decorative, className, ...rest },
  ref,
) {
  return (
    <hr
      {...rest}
      ref={ref}
      className={['hl-separator', className].filter(Boolean).join(' ')}
      data-hl-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      aria-orientation={orientation}
      role={decorative ? 'presentation' : 'separator'}
    />
  );
});

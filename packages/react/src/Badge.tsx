import { forwardRef, type HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  intent?: 'neutral' | 'primary' | 'danger' | 'success' | 'warning' | 'info';
  variant?: 'soft' | 'solid' | 'outline';
  size?: 'sm' | 'md';
}

/** Badge primitive — `hl-badge` with intent/variant/size modifiers. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { intent, variant, size, className, children, ...rest },
  ref,
) {
  return (
    <span
      {...rest}
      ref={ref}
      className={['hl-badge', className].filter(Boolean).join(' ')}
      data-hl-intent={intent}
      data-hl-variant={variant}
      data-hl-size={size}
    >
      {children}
    </span>
  );
});

import { forwardRef, type ButtonHTMLAttributes } from 'react';

/** Props for {@link Button}. */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'soft' | 'outline' | 'ghost' | 'link';
  intent?: 'neutral' | 'primary' | 'danger' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  /** Stretch to the container width. */
  block?: boolean;
  /** Square, icon-only button. */
  icon?: boolean;
  /** Show a spinner and disable interaction. */
  loading?: boolean;
}

/** Button primitive: `hl-button` with intent/variant/size modifiers. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, intent, size, block, icon, loading, className, children, disabled, type, ...rest },
  ref,
) {
  return (
    <button
      {...rest}
      ref={ref}
      type={type ?? 'button'}
      className={['hl-button', className].filter(Boolean).join(' ')}
      data-hl-variant={variant}
      data-hl-intent={intent}
      data-hl-size={size}
      data-hl-block={block || undefined}
      data-hl-icon={icon || undefined}
      data-hl-loading={loading || undefined}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
    >
      {children}
    </button>
  );
});

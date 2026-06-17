import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

/** Props for {@link Alert}. */
export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  intent?: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
  title?: ReactNode;
  /** Leading icon, rendered before the body. */
  icon?: ReactNode;
}

/** Alert primitive — `hl-alert` with intent, optional icon + title. */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { intent, title, icon, className, children, ...rest },
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      role={rest.role ?? 'alert'}
      className={['hl-alert', className].filter(Boolean).join(' ')}
      data-hl-intent={intent}
    >
      {icon}
      <div className="hl-alert-body">
        {title != null && <p className="hl-alert-title">{title}</p>}
        {children}
      </div>
    </div>
  );
});

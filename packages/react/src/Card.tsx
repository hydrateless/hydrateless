import { forwardRef, type HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Hover/active elevation for clickable cards. */
  interactive?: boolean;
}

/** Card container — `hl-card`. Compose with the Card.* parts. */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { interactive, className, children, ...rest },
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={['hl-card', className].filter(Boolean).join(' ')}
      data-hl-interactive={interactive || undefined}
    >
      {children}
    </div>
  );
});

export type CardSectionProps = HTMLAttributes<HTMLDivElement>;

export const CardHeader = forwardRef<HTMLDivElement, CardSectionProps>(function CardHeader(
  { className, ...rest },
  ref,
) {
  return (
    <div {...rest} ref={ref} className={['hl-card-header', className].filter(Boolean).join(' ')} />
  );
});

export const CardBody = forwardRef<HTMLDivElement, CardSectionProps>(function CardBody(
  { className, ...rest },
  ref,
) {
  return (
    <div {...rest} ref={ref} className={['hl-card-body', className].filter(Boolean).join(' ')} />
  );
});

export const CardFooter = forwardRef<HTMLDivElement, CardSectionProps>(function CardFooter(
  { className, ...rest },
  ref,
) {
  return (
    <div {...rest} ref={ref} className={['hl-card-footer', className].filter(Boolean).join(' ')} />
  );
});

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  function CardTitle({ className, ...rest }, ref) {
    return (
      <h3 {...rest} ref={ref} className={['hl-card-title', className].filter(Boolean).join(' ')} />
    );
  },
);

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function CardDescription({ className, ...rest }, ref) {
  return (
    <p
      {...rest}
      ref={ref}
      className={['hl-card-description', className].filter(Boolean).join(' ')}
    />
  );
});

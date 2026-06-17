import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';

/** Props for {@link Skeleton}. */
export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'rect' | 'text' | 'circle';
  width?: string | number;
  height?: string | number;
}

/** Skeleton placeholder primitive — `hl-skeleton`. */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { variant, width, height, className, style, ...rest },
  ref,
) {
  const sizeStyle: CSSProperties = {
    ...(width != null && { inlineSize: width }),
    ...(height != null && { blockSize: height }),
    ...style,
  };
  return (
    <span
      {...rest}
      ref={ref}
      className={['hl-skeleton', className].filter(Boolean).join(' ')}
      data-hl-variant={variant}
      style={sizeStyle}
      aria-hidden="true"
    />
  );
});

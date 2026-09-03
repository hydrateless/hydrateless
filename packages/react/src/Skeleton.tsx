import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cx } from './util.js';

/** Props for {@link Skeleton}. */
export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /** Placeholder silhouette. Defaults to a rectangle. */
  shape?: 'rect' | 'text' | 'circle';
  /** Inline size (maps to the logical `inline-size`). */
  width?: string | number;
  /** Block size (maps to the logical `block-size`). */
  height?: string | number;
}

/** Skeleton placeholder primitive: `hl-skeleton`. Hidden from assistive tech. */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { shape, width, height, className, style, ...rest },
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
      className={cx('hl-skeleton', className)}
      data-hl-shape={shape}
      style={sizeStyle}
      aria-hidden="true"
    />
  );
});

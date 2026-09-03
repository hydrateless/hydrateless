import { forwardRef, type TableHTMLAttributes } from 'react';
import { cx } from './util.js';

/** Props for {@link Table}. */
export interface TableProps extends Omit<TableHTMLAttributes<HTMLTableElement>, 'align'> {
  /** Zebra-stripe the body rows. */
  striped?: boolean;
  /** Highlight body rows on hover. */
  hover?: boolean;
  /** Default cell alignment. */
  align?: 'start' | 'center' | 'end';
  /** Cell density. */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Semantic table styled with the `hl-table` primitive. Pass `<thead>`,
 * `<tbody>`, and friends as children; wrap it in an element with
 * `overflow-x: auto` (the `hl-table-wrapper` class) when rows may overflow.
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { striped, hover, align, size, className, children, ...rest },
  ref,
) {
  return (
    <table
      {...rest}
      ref={ref}
      className={cx('hl-table', className)}
      data-hl-striped={striped || undefined}
      data-hl-hover={hover || undefined}
      data-hl-align={align}
      data-hl-size={size}
    >
      {children}
    </table>
  );
});

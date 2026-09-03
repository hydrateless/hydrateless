import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from './util.js';

/** Props for {@link Pagination}. */
export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** The current 1-based page. */
  page: number;
  /** Total number of pages. */
  count: number;
  /** Called with the requested page. */
  onPageChange?: (page: number) => void;
  /** Pages to show on each side of the current page. Defaults to 1. */
  siblingCount?: number;
  /** Render Previous/Next controls. Defaults to true. */
  showControls?: boolean;
  prevLabel?: ReactNode;
  nextLabel?: ReactNode;
}

const ELLIPSIS = 'ellipsis';

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function paginationRange(
  page: number,
  count: number,
  siblingCount: number,
): Array<number | typeof ELLIPSIS> {
  const totalNumbers = siblingCount * 2 + 5;
  if (totalNumbers >= count) return range(1, count);

  const leftSibling = Math.max(page - siblingCount, 1);
  const rightSibling = Math.min(page + siblingCount, count);
  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < count - 1;

  if (!showLeftDots && showRightDots) {
    return [...range(1, siblingCount * 2 + 3), ELLIPSIS, count];
  }
  if (showLeftDots && !showRightDots) {
    return [1, ELLIPSIS, ...range(count - (siblingCount * 2 + 2), count)];
  }
  return [1, ELLIPSIS, ...range(leftSibling, rightSibling), ELLIPSIS, count];
}

/** Pagination primitive: `hl-pagination` with smart ellipsis truncation. */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    page,
    count,
    onPageChange,
    siblingCount = 1,
    showControls = true,
    prevLabel = '‹',
    nextLabel = '›',
    className,
    ...rest
  },
  ref,
) {
  const items = paginationRange(page, count, siblingCount);
  const go = (target: number) => {
    if (target >= 1 && target <= count && target !== page) onPageChange?.(target);
  };

  return (
    <nav
      {...rest}
      ref={ref}
      className={cx('hl-pagination', className)}
      aria-label={rest['aria-label'] ?? 'Pagination'}
    >
      <ul>
        {showControls && (
          <li>
            <button
              type="button"
              className="hl-pagination-item"
              aria-label="Previous page"
              disabled={page <= 1}
              onClick={() => go(page - 1)}
            >
              {prevLabel}
            </button>
          </li>
        )}
        {items.map((item, i) =>
          item === ELLIPSIS ? (
            <li key={`e${i}`} aria-hidden="true">
              <span className="hl-pagination-ellipsis">…</span>
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className="hl-pagination-item"
                aria-current={item === page ? 'page' : undefined}
                aria-label={`Page ${item}`}
                onClick={() => go(item)}
              >
                {item}
              </button>
            </li>
          ),
        )}
        {showControls && (
          <li>
            <button
              type="button"
              className="hl-pagination-item"
              aria-label="Next page"
              disabled={page >= count}
              onClick={() => go(page + 1)}
            >
              {nextLabel}
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
});

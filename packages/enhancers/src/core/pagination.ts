/** A gap between page numbers in a {@link paginationRange}. */
export const ELLIPSIS = 'ellipsis';

/** One entry of a {@link paginationRange}: a page number or an {@link ELLIPSIS}. */
export type PaginationEntry = number | typeof ELLIPSIS;

const range = (from: number, to: number): number[] =>
  Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i);

/**
 * The page numbers to show for `page` of `total` pages: `boundaries` pages at
 * each end, `siblings` on each side of the current page, and an
 * {@link ELLIPSIS} wherever pages are skipped. Near either end the window
 * slides instead of shrinking, so the list keeps a stable width. Shared by
 * the pagination enhancer and every framework binding so all four agree on
 * the shape.
 */
export function paginationRange(
  page: number,
  total: number,
  siblings = 1,
  boundaries = 1,
): PaginationEntry[] {
  const count = Math.max(0, Math.floor(total));
  if (count === 0) return [];
  const current = Math.min(Math.max(1, Math.floor(page)), count);

  // Everything fits: current, its siblings, both boundaries, and two gaps.
  const window = siblings * 2 + boundaries * 2 + 3;
  if (window >= count) return range(1, count);

  const left = Math.max(current - siblings, boundaries);
  const right = Math.min(current + siblings, count - boundaries);
  const leftGap = left > boundaries + 2;
  const rightGap = right < count - (boundaries + 1);

  if (!leftGap && rightGap) {
    const leftCount = siblings * 2 + boundaries + 2;
    return [...range(1, leftCount), ELLIPSIS, ...range(count - boundaries + 1, count)];
  }
  if (leftGap && !rightGap) {
    const rightCount = boundaries + 1 + siblings * 2;
    return [...range(1, boundaries), ELLIPSIS, ...range(count - rightCount, count)];
  }
  return [
    ...range(1, boundaries),
    ELLIPSIS,
    ...range(left, right),
    ELLIPSIS,
    ...range(count - boundaries + 1, count),
  ];
}

<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLAttributes<HTMLElement>, 'onchange'> {
    /** Current page (1-based). */
    page: number;
    /** Total number of pages. */
    count: number;
    /** Called with the requested page when the user navigates. */
    onPageChange?: (page: number) => void;
    /** Pages to show on each side of the current page. Defaults to 1. */
    siblingCount?: number;
    /** Render Previous/Next controls. Defaults to true. */
    showControls?: boolean;
    /** Visible label of the Previous control. */
    prevLabel?: string;
    /** Visible label of the Next control. */
    nextLabel?: string;
  }

  let {
    page,
    count,
    onPageChange,
    siblingCount = 1,
    showControls = true,
    prevLabel = '\u2039',
    nextLabel = '\u203a',
    class: klass,
    'aria-label': ariaLabel = 'Pagination',
    ...rest
  }: Props = $props();

  const ELLIPSIS = 'ellipsis' as const;

  function range(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  function paginationRange(p: number, c: number, sib: number): Array<number | typeof ELLIPSIS> {
    const totalNumbers = sib * 2 + 5;
    if (totalNumbers >= c) return range(1, c);
    const leftSibling = Math.max(p - sib, 1);
    const rightSibling = Math.min(p + sib, c);
    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < c - 1;
    if (!showLeftDots && showRightDots) return [...range(1, sib * 2 + 3), ELLIPSIS, c];
    if (showLeftDots && !showRightDots) return [1, ELLIPSIS, ...range(c - (sib * 2 + 2), c)];
    return [1, ELLIPSIS, ...range(leftSibling, rightSibling), ELLIPSIS, c];
  }

  const items = $derived(paginationRange(page, count, siblingCount));

  function go(target: number) {
    if (target >= 1 && target <= count && target !== page) onPageChange?.(target);
  }
</script>

<nav {...rest} class={['hl-pagination', klass]} aria-label={ariaLabel}>
  <ul>
    {#if showControls}
      <li>
        <button
          type="button"
          class="hl-pagination-item"
          aria-label="Previous page"
          disabled={page <= 1}
          onclick={() => go(page - 1)}
        >
          {prevLabel}
        </button>
      </li>
    {/if}
    {#each items as item, i (typeof item === 'number' ? `p${item}` : `e${i}`)}
      {#if item === ELLIPSIS}
        <li aria-hidden="true"><span class="hl-pagination-ellipsis">{'\u2026'}</span></li>
      {:else}
        <li>
          <button
            type="button"
            class="hl-pagination-item"
            aria-current={item === page ? 'page' : undefined}
            aria-label={`Page ${item}`}
            onclick={() => go(item)}
          >
            {item}
          </button>
        </li>
      {/if}
    {/each}
    {#if showControls}
      <li>
        <button
          type="button"
          class="hl-pagination-item"
          aria-label="Next page"
          disabled={page >= count}
          onclick={() => go(page + 1)}
        >
          {nextLabel}
        </button>
      </li>
    {/if}
  </ul>
</nav>

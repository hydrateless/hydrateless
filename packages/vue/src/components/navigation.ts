import { defineComponent, h, ref, type ExtractPublicPropTypes, type PropType } from 'vue';
import { enhanceToc, type EnhanceTocOptions } from '@hydrateless/enhancers';
import { cx } from '../internal/index.js';
import { useEnhancer } from '../useEnhancer.js';

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
  if (!showLeftDots && showRightDots) return [...range(1, siblingCount * 2 + 3), ELLIPSIS, count];
  if (showLeftDots && !showRightDots)
    return [1, ELLIPSIS, ...range(count - (siblingCount * 2 + 2), count)];
  return [1, ELLIPSIS, ...range(leftSibling, rightSibling), ELLIPSIS, count];
}

const paginationProps = {
  /** Current page (1-based); use `v-model:page`. */
  page: { type: Number, required: true },
  /** Total number of pages. */
  count: { type: Number, required: true },
  /** Pages shown on each side of the current one. */
  siblingCount: { type: Number, default: 1 },
  showControls: { type: Boolean, default: true },
  prevLabel: { type: String, default: '\u2039' },
  nextLabel: { type: String, default: '\u203a' },
} as const;

/** Props for {@link Pagination}. */
export type PaginationProps = ExtractPublicPropTypes<typeof paginationProps>;

/** Pagination primitive: `hl-pagination` with smart ellipsis truncation. Emits `update:page`. */
export const Pagination = defineComponent({
  name: 'HlPagination',
  inheritAttrs: false,
  props: paginationProps,
  emits: ['update:page'],
  setup(props, { attrs, emit }) {
    const go = (target: number) => {
      if (target >= 1 && target <= props.count && target !== props.page)
        emit('update:page', target);
    };
    return () => {
      const items = paginationRange(props.page, props.count, props.siblingCount);
      const lis = [];
      if (props.showControls) {
        lis.push(
          h('li', [
            h(
              'button',
              {
                type: 'button',
                class: 'hl-pagination-item',
                'aria-label': 'Previous page',
                disabled: props.page <= 1,
                onClick: () => go(props.page - 1),
              },
              props.prevLabel,
            ),
          ]),
        );
      }
      items.forEach((item, i) => {
        if (item === ELLIPSIS) {
          lis.push(
            h('li', { key: `e${i}`, 'aria-hidden': 'true' }, [
              h('span', { class: 'hl-pagination-ellipsis' }, '\u2026'),
            ]),
          );
        } else {
          lis.push(
            h('li', { key: item }, [
              h(
                'button',
                {
                  type: 'button',
                  class: 'hl-pagination-item',
                  'aria-current': item === props.page ? 'page' : undefined,
                  'aria-label': `Page ${item}`,
                  onClick: () => go(item),
                },
                String(item),
              ),
            ]),
          );
        }
      });
      if (props.showControls) {
        lis.push(
          h('li', [
            h(
              'button',
              {
                type: 'button',
                class: 'hl-pagination-item',
                'aria-label': 'Next page',
                disabled: props.page >= props.count,
                onClick: () => go(props.page + 1),
              },
              props.nextLabel,
            ),
          ]),
        );
      }
      return h(
        'nav',
        { 'aria-label': 'Pagination', ...attrs, class: cx('hl-pagination', attrs.class as string) },
        [h('ul', lis)],
      );
    };
  },
});

const tocProps = {
  /** Selector for the region whose headings populate the list. */
  contentSelector: { type: String, default: undefined },
  /** Selector for which headings to include. */
  headings: { type: String, default: undefined },
  scrollSpy: { type: Boolean as PropType<boolean | undefined>, default: undefined },
} as const;

/** Props for {@link Toc}. */
export type TocProps = ExtractPublicPropTypes<typeof tocProps>;

/** Auto-generated table of contents with optional scroll-spy. */
export const Toc = defineComponent({
  name: 'HlToc',
  inheritAttrs: false,
  props: tocProps,
  setup(props, { slots, attrs }) {
    const host = ref<HTMLElement | null>(null);
    useEnhancer(
      host,
      // Enhance from the document so `contentSelector` resolves page-wide.
      (el: HTMLElement, options?: EnhanceTocOptions) => enhanceToc(el.ownerDocument, options),
      () => ({
        contentSelector: props.contentSelector,
        headings: props.headings,
        scrollSpy: props.scrollSpy,
      }),
      () => [props.contentSelector, props.headings, props.scrollSpy],
    );
    return () =>
      h(
        'nav',
        { 'aria-label': 'Table of contents', ...attrs, 'data-hl-toc': '', ref: host },
        slots.default?.(),
      );
  },
});

/** Props for {@link SkipLink}. */
export type SkipLinkProps = Record<never, never>;

/** Accessibility skip-navigation link, visually hidden until focused. */
export const SkipLink = defineComponent({
  name: 'HlSkipLink',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'a',
        { ...attrs, class: cx('hl-skip-link', attrs.class as string) },
        slots.default?.() ?? 'Skip to content',
      );
  },
});

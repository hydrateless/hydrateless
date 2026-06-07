import { defineComponent, h, type PropType } from 'vue';
import { enhanceToc } from '@hydrateless/enhancers';
import { cx, useHostEnhancer } from '../internal.js';

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

/** Pagination primitive — `hl-pagination` with smart ellipsis truncation. Emits `update:page`. */
export const Pagination = defineComponent({
  name: 'HlPagination',
  inheritAttrs: false,
  props: {
    page: { type: Number, required: true },
    count: { type: Number, required: true },
    siblingCount: { type: Number, default: 1 },
    showControls: { type: Boolean, default: true },
    prevLabel: { type: String, default: '\u2039' },
    nextLabel: { type: String, default: '\u203a' },
  },
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
        {
          ...attrs,
          class: cx('hl-pagination', attrs.class as string),
          'aria-label': (attrs['aria-label'] as string) ?? 'Pagination',
        },
        [h('ul', lis)],
      );
    };
  },
});

/** Auto-generated table of contents with optional scroll-spy. */
export const Toc = defineComponent({
  name: 'HlToc',
  inheritAttrs: false,
  props: {
    contentSelector: { type: String, default: undefined },
    headings: { type: String, default: undefined },
    scrollSpy: { type: Boolean as PropType<boolean | undefined>, default: undefined },
  },
  setup(props, { attrs }) {
    const host = useHostEnhancer((el) =>
      enhanceToc(el.ownerDocument, {
        contentSelector: props.contentSelector,
        headings: props.headings,
        scrollSpy: props.scrollSpy,
      }),
    );
    return () => h('nav', { ...attrs, 'data-hl-toc': '', ref: host });
  },
});

/** Accessibility skip-navigation link, visually hidden until focused. */
export const SkipLink = defineComponent({
  name: 'HlSkipLink',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'a',
        { ...attrs, class: cx('a11y-skip-link', attrs.class as string) },
        slots.default?.() ?? 'Skip to content',
      );
  },
});

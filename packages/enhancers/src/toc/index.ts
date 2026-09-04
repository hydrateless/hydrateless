import { defineEnhancer } from '../core/define.js';
import { ensureId } from '../core/dom.js';
import { Events } from '../core/events.js';
import { type Disposer } from '../core/lifecycle.js';

/** Options for {@link enhanceToc}. */
export type EnhanceTocOptions = {
  /** Selector for the region whose headings populate the list. Defaults to `main, article`. */
  contentSelector?: string;
  /** Selector for which headings to include. Defaults to `h2,h3`. */
  headings?: string;
  /** Highlight the entry for the heading currently in view. Defaults to `true`. */
  scrollSpy?: boolean;
  /** Rebuild the list automatically when the content region changes. Defaults to `true`. */
  watch?: boolean;
  /** Called with the id of the heading in view whenever it changes. */
  onValueChange?: (value: string | null) => void;
};

/** Imperative handle returned by {@link enhanceToc}. */
export type TocApi = {
  /** Id of the heading currently marked `aria-current`, or `null`. */
  readonly value: string | null;
  /** Mark the entry for heading `value` as current (or clear with `null`). */
  setValue: (value: string | null) => void;
  /** Rebuild the list from the current headings. */
  refresh: () => void;
};

/**
 * Build a nested table of contents from the headings inside a content region
 * and render it as a list of anchor links, replacing the nav's placeholder
 * content (which is restored on destroy). With `scrollSpy` enabled, the entry
 * for the heading currently in view is marked with `aria-current`, and that
 * heading's id is observable through `onValueChange`/`hl:change` and
 * controllable through the returned API. The list rebuilds itself when the
 * content region changes (`watch`); `refresh()` forces one. Markup can set
 * `data-hl-content-selector`, `data-hl-headings`, `data-hl-scroll-spy`, and
 * `data-hl-watch` on the root.
 */
export const enhanceToc = defineEnhancer<EnhanceTocOptions, TocApi>({
  name: 'toc',
  selector: '[data-hl-toc]',
  defaults: { contentSelector: 'main, article', headings: 'h2,h3', scrollSpy: true, watch: true },
  attributes: {
    contentSelector: 'string',
    headings: 'string',
    scrollSpy: 'boolean',
    watch: 'boolean',
  },
  setup({ root, container, options, observe, add, emit }) {
    const doc = root.ownerDocument;
    const scope: ParentNode = container instanceof Document ? doc : container;

    // Preserve the server-rendered placeholder so destroy leaves the page as
    // it was before enhancement.
    const original = Array.from(root.childNodes);
    add(() => root.replaceChildren(...original));

    let stopSpy: Disposer | null = null;
    add(() => stopSpy?.());

    const linkById = new Map<string, HTMLAnchorElement>();
    let current: string | null = null;
    const setCurrent = (id: string | null) => {
      if (id === current) return;
      current = id;
      linkById.forEach((a, key) => {
        if (key === id) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
      options.onValueChange?.(id);
      emit(Events.change, { value: id });
    };

    const contentRoot = () =>
      scope.querySelector<HTMLElement>(options.contentSelector!) ?? doc.body;

    const build = () => {
      stopSpy?.();
      stopSpy = null;
      linkById.clear();

      const headings = Array.from(contentRoot().querySelectorAll<HTMLElement>(options.headings!));
      if (headings.length === 0) {
        root.replaceChildren();
        return;
      }

      const list = doc.createElement('ul');
      let currentList = list;
      let lastLevel = Number(headings[0].tagName.slice(1));

      for (const heading of headings) {
        const level = Number(heading.tagName.slice(1));
        ensureId(heading, `hl-${heading.tagName.toLowerCase()}`);

        while (level > lastLevel) {
          const sublist = doc.createElement('ul');
          const parentItem =
            currentList.lastElementChild ?? currentList.appendChild(doc.createElement('li'));
          parentItem.appendChild(sublist);
          currentList = sublist;
          lastLevel += 1;
        }
        while (level < lastLevel) {
          const parentList = currentList.parentElement?.closest('ul');
          if (parentList) currentList = parentList;
          lastLevel -= 1;
        }

        const item = doc.createElement('li');
        const link = doc.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent ?? '';
        if (heading.id === current) link.setAttribute('aria-current', 'true');
        item.appendChild(link);
        currentList.appendChild(item);
        linkById.set(heading.id, link);
      }

      root.replaceChildren(list);
      if (current !== null && !linkById.has(current)) setCurrent(null);

      if (options.scrollSpy && typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver(
          (entries) => {
            let best: Element | null = null;
            let bestTop = Number.NEGATIVE_INFINITY;
            for (const entry of entries) {
              if (entry.isIntersecting && entry.boundingClientRect.top > bestTop) {
                best = entry.target;
                bestTop = entry.boundingClientRect.top;
              }
            }
            if (best?.id) setCurrent(best.id);
          },
          { rootMargin: '0px 0px -60% 0px', threshold: [0, 1] },
        );

        headings.forEach((h) => observer.observe(h));
        stopSpy = () => observer.disconnect();
      }
    };

    build();

    if (options.watch) {
      // The nav often lives inside the content region it indexes, so ignore
      // our own rebuilds: only mutations outside the root count.
      observe(
        contentRoot(),
        (records) => {
          if (records.some((record) => !root.contains(record.target))) build();
        },
        { childList: true, subtree: true, characterData: true },
      );
    }

    return {
      get value() {
        return current;
      },
      setValue: setCurrent,
      refresh: build,
    };
  },
});

import { defineEnhancer, ensureId, type Disposer } from '../core/index.js';

/** Options for {@link enhanceToc}. */
export type EnhanceTocOptions = {
  /** Selector for the region whose headings populate the list. Defaults to `main, article`. */
  contentSelector?: string;
  /** Selector for which headings to include. Defaults to `h2,h3`. */
  headings?: string;
  /** Highlight the entry for the heading currently in view. Defaults to `true`. */
  scrollSpy?: boolean;
};

/** Imperative handle returned by {@link enhanceToc}. */
export type TocApi = {
  /** Rebuild the list from the current headings (e.g. after content changes). */
  refresh: () => void;
};

/**
 * Build a nested table of contents from the headings inside a content region
 * and render it as a list of anchor links, replacing the nav's placeholder
 * content (which is restored on destroy). With `scrollSpy` enabled, the entry
 * for the heading currently in view is marked with `aria-current`. Call
 * `refresh()` on the returned API after the content changes.
 */
export const enhanceToc = defineEnhancer<EnhanceTocOptions, TocApi>({
  name: 'toc',
  selector: '[data-hl-toc]',
  defaults: { contentSelector: 'main, article', headings: 'h2,h3', scrollSpy: true },
  setup({ root, container, options, add }) {
    const doc = root.ownerDocument;
    const scope: ParentNode = container instanceof Document ? doc : container;

    // Preserve the server-rendered placeholder so destroy leaves the page as
    // it was before enhancement.
    const original = Array.from(root.childNodes);
    add(() => root.replaceChildren(...original));

    let stopSpy: Disposer | null = null;
    add(() => stopSpy?.());

    const build = () => {
      stopSpy?.();
      stopSpy = null;

      const contentRoot =
        scope.querySelector<HTMLElement>(
          root.getAttribute('data-hl-toc-content') || options.contentSelector!,
        ) ?? doc.body;

      const headings = Array.from(contentRoot.querySelectorAll<HTMLElement>(options.headings!));
      if (headings.length === 0) return;

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
        item.appendChild(link);
        currentList.appendChild(item);
      }

      root.replaceChildren(list);

      if (options.scrollSpy && typeof IntersectionObserver !== 'undefined') {
        const linkById = new Map<string, HTMLAnchorElement>();
        root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
          linkById.set(decodeURIComponent(a.getAttribute('href')!.slice(1)), a);
        });

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
            if (best?.id) {
              linkById.forEach((a) => a.removeAttribute('aria-current'));
              linkById.get(best.id)?.setAttribute('aria-current', 'true');
            }
          },
          { rootMargin: '0px 0px -60% 0px', threshold: [0, 1] },
        );

        headings.forEach((h) => observer.observe(h));
        stopSpy = () => observer.disconnect();
      }
    };

    build();

    return { refresh: build };
  },
});

export type EnhanceTocOptions = {
  contentSelector?: string;
  headings?: string;
  scrollSpy?: boolean;
};

export function enhanceToc(
  container: Document | HTMLElement = document,
  options: EnhanceTocOptions = {},
): void {
  const { contentSelector = 'main, article', headings = 'h2,h3', scrollSpy = true } = options;
  const navs = Array.from(container.querySelectorAll<HTMLElement>('[data-hl-toc]'));
  if (navs.length === 0) return;

  const contentRoot =
    container.querySelector<HTMLElement>(
      navs[0].getAttribute('data-hl-toc-content') || contentSelector,
    ) ||
    (container as Document).body ||
    (container as HTMLElement);

  const hs = Array.from(contentRoot.querySelectorAll<HTMLElement>(headings));
  if (hs.length === 0) return;

  for (const nav of navs) {
    const list = document.createElement('ul');
    let currentUl = list;
    let lastLevel = 2;

    hs.forEach((h) => {
      const level = Number(h.tagName.slice(1));
      if (!h.id) h.id = `hl-${h.tagName.toLowerCase()}-${Math.random().toString(36).slice(2)}`;
      while (level > lastLevel) {
        const ul = document.createElement('ul');
        const li = currentUl.lastElementChild || document.createElement('li');
        if (!li.parentElement) currentUl.appendChild(li);
        li.appendChild(ul);
        currentUl = ul;
        lastLevel++;
      }
      while (level < lastLevel) {
        const parentUl = currentUl.parentElement?.closest('ul');
        if (parentUl) currentUl = parentUl;
        lastLevel--;
      }
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${h.id}`;
      a.textContent = h.textContent || '';
      li.appendChild(a);
      currentUl.appendChild(li);
    });

    nav.innerHTML = '';
    nav.appendChild(list);
  }

  if (scrollSpy) {
    const linkForId = new Map<string, HTMLAnchorElement>();
    navs.forEach((nav) =>
      nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
        const id = decodeURIComponent(a.getAttribute('href')!.slice(1));
        linkForId.set(id, a);
      }),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        let best: Element | null = null;
        let bestTop = Number.NEGATIVE_INFINITY;
        for (const entry of entries) {
          const top = entry.boundingClientRect.top;
          if (entry.isIntersecting && top > bestTop) {
            best = entry.target;
            bestTop = top;
          }
        }
        if (best && best.id) {
          linkForId.forEach((a) => a.removeAttribute('aria-current'));
          const link = linkForId.get(best.id);
          if (link) link.setAttribute('aria-current', 'true');
        }
      },
      { rootMargin: '0px 0px -60% 0px', threshold: [0, 1] },
    );

    hs.forEach((h) => observer.observe(h));
  }
}

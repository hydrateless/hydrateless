type PopoverOptions = {
  triggerEvent?: 'click' | 'hover';
};

export function enhancePopover(
  container: Document | HTMLElement = document,
  options: PopoverOptions = {},
): void {
  const { triggerEvent = 'click' } = options;
  const popovers = Array.from(
    container.querySelectorAll<HTMLElement>('[popover], [data-hl-popover]'),
  );
  const openers = Array.from(container.querySelectorAll<HTMLElement>('[data-hl-popover-open]'));
  const closers = Array.from(container.querySelectorAll<HTMLElement>('[data-hl-popover-close]'));

  function show(el: HTMLElement): void {
    if (el.popover != null) el.showPopover();
    else el.hidden = false;
  }
  function hide(el: HTMLElement): void {
    if (el.popover != null) el.hidePopover();
    else el.hidden = true;
  }

  function byId(id: string): HTMLElement | null {
    return container.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
  }

  for (const opener of openers) {
    const ref = opener.getAttribute('data-hl-popover-open');
    if (!ref) continue;
    const id = ref.startsWith('#') ? ref.slice(1) : ref;
    const target = byId(id);
    if (!target) continue;

    if (triggerEvent === 'click') {
      opener.addEventListener('click', (e) => {
        e.preventDefault();
        show(target);
      });
    } else {
      opener.addEventListener('mouseenter', () => show(target));
      opener.addEventListener('mouseleave', () => hide(target));
      opener.addEventListener('focus', () => show(target));
      opener.addEventListener('blur', () => hide(target));
    }
  }

  for (const closer of closers) {
    const ref = closer.getAttribute('data-hl-popover-close');
    if (!ref) continue;
    const id = ref.startsWith('#') ? ref.slice(1) : ref;
    const target = byId(id);
    if (!target) continue;
    closer.addEventListener('click', (e) => {
      e.preventDefault();
      hide(target);
    });
  }

  document.addEventListener('click', (e) => {
    const t = e.target as Node;
    if (openers.some((o) => o === t || o.contains(t))) return;
    if (closers.some((c) => c === t || c.contains(t))) return;
    for (const p of popovers) {
      if (p.hasAttribute('popover')) continue;
      if (!p.hidden && !p.contains(t)) hide(p);
    }
  });
}

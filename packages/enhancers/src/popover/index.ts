import { combine, on, type Disposer } from '../utils/lifecycle.js';

type PopoverOptions = {
  triggerEvent?: 'click' | 'hover';
};

const enhanced = new WeakSet<Element>();

export function enhancePopover(
  container: Document | HTMLElement = document,
  options: PopoverOptions = {},
): Disposer {
  const { triggerEvent = 'click' } = options;
  const popovers = Array.from(
    container.querySelectorAll<HTMLElement>('[popover], [data-hl-popover]'),
  );
  const openers = Array.from(container.querySelectorAll<HTMLElement>('[data-hl-popover-open]'));
  const closers = Array.from(container.querySelectorAll<HTMLElement>('[data-hl-popover-close]'));
  const disposers: Disposer[] = [];

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
    if (enhanced.has(opener)) continue;
    const ref = opener.getAttribute('data-hl-popover-open');
    if (!ref) continue;
    const id = ref.startsWith('#') ? ref.slice(1) : ref;
    const target = byId(id);
    if (!target) continue;

    enhanced.add(opener);
    disposers.push(() => enhanced.delete(opener));

    if (triggerEvent === 'click') {
      disposers.push(
        on(opener, 'click', (e) => {
          e.preventDefault();
          show(target);
        }),
      );
    } else {
      disposers.push(on(opener, 'mouseenter', () => show(target)));
      disposers.push(on(opener, 'mouseleave', () => hide(target)));
      disposers.push(on(opener, 'focus', () => show(target)));
      disposers.push(on(opener, 'blur', () => hide(target)));
    }
  }

  for (const closer of closers) {
    if (enhanced.has(closer)) continue;
    const ref = closer.getAttribute('data-hl-popover-close');
    if (!ref) continue;
    const id = ref.startsWith('#') ? ref.slice(1) : ref;
    const target = byId(id);
    if (!target) continue;
    enhanced.add(closer);
    disposers.push(() => enhanced.delete(closer));
    disposers.push(
      on(closer, 'click', (e) => {
        e.preventDefault();
        hide(target);
      }),
    );
  }

  disposers.push(
    on(document, 'click', (e) => {
      const t = e.target as Node;
      if (openers.some((o) => o === t || o.contains(t))) return;
      if (closers.some((c) => c === t || c.contains(t))) return;
      for (const p of popovers) {
        if (p.hasAttribute('popover')) continue;
        if (!p.hidden && !p.contains(t)) hide(p);
      }
    }),
  );

  return combine(disposers);
}

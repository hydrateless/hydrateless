import { combine, on, type Disposer } from '../utils/lifecycle.js';

const enhanced = new WeakSet<Element>();

export function enhanceTooltip(container: Document | HTMLElement = document): Disposer {
  const triggers = Array.from(container.querySelectorAll<HTMLElement>('[data-hl-tooltip]'));
  const disposers: Disposer[] = [];

  function resolveTooltip(el: HTMLElement): HTMLElement | null {
    const id = el.getAttribute('aria-describedby') || el.getAttribute('data-hl-tooltip');
    if (!id) return null;
    const finalId = id.startsWith('#') ? id.slice(1) : id;
    return container.querySelector<HTMLElement>(`#${CSS.escape(finalId)}`);
  }

  function show(tt: HTMLElement): void {
    tt.removeAttribute('hidden');
  }
  function hide(tt: HTMLElement): void {
    tt.setAttribute('hidden', '');
  }

  for (const el of triggers) {
    if (enhanced.has(el)) continue;
    const tt = resolveTooltip(el);
    if (!tt) continue;

    enhanced.add(el);
    disposers.push(() => enhanced.delete(el));

    disposers.push(on(el, 'mouseenter', () => show(tt)));
    disposers.push(on(el, 'mouseleave', () => hide(tt)));
    disposers.push(on(el, 'focus', () => show(tt)));
    disposers.push(on(el, 'blur', () => hide(tt)));
    disposers.push(
      on(el, 'keydown', (e) => {
        if ((e as KeyboardEvent).key === 'Escape') hide(tt);
      }),
    );
  }

  return combine(disposers);
}

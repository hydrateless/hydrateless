export function enhanceTooltip(container: Document | HTMLElement = document): void {
  const triggers = Array.from(container.querySelectorAll<HTMLElement>('[data-hl-tooltip]'));

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
    const tt = resolveTooltip(el);
    if (!tt) continue;
    el.addEventListener('mouseenter', () => show(tt));
    el.addEventListener('mouseleave', () => hide(tt));
    el.addEventListener('focus', () => show(tt));
    el.addEventListener('blur', () => hide(tt));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hide(tt);
    });
  }
}

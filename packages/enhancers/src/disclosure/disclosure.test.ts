import { describe, it, expect, beforeEach, vi } from 'vitest';
import { enhanceDisclosure } from './index.js';

describe('enhanceDisclosure', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <details data-hl-disclosure><summary>A</summary><div class="hl-disclosure-panel">Content A</div></details>
      <details data-hl-disclosure><summary>B</summary><div class="hl-disclosure-panel">Content B</div></details>
    `;
  });

  it('exposes open state through the handle api', () => {
    const handle = enhanceDisclosure(document);
    const [a] = document.querySelectorAll('details');

    expect(handle.instances).toHaveLength(2);
    expect(handle.api!.open).toBe(false);
    handle.api!.setOpen(true);
    expect(a.open).toBe(true);
    expect(handle.api!.open).toBe(true);
    handle.api!.setOpen(false);
    expect(a.open).toBe(false);
  });

  it('applies defaultOpen on enhance', () => {
    enhanceDisclosure(document, { defaultOpen: true });
    const [a, b] = document.querySelectorAll('details');
    expect(a.open).toBe(true);
    expect(b.open).toBe(true);
  });

  it('notifies onOpenChange and emits hl:open-change on toggle', () => {
    const onOpenChange = vi.fn();
    const events: boolean[] = [];
    document.addEventListener('hl:open-change', (e) => {
      events.push((e as CustomEvent).detail.open);
    });
    enhanceDisclosure(document, { onOpenChange });
    const [a] = document.querySelectorAll('details');

    a.open = true;
    a.dispatchEvent(new Event('toggle'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(events).toEqual([true]);

    a.open = false;
    a.dispatchEvent(new Event('toggle'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(events).toEqual([true, false]);
  });

  it('does not re-notify when the state has not changed', () => {
    const onOpenChange = vi.fn();
    enhanceDisclosure(document, { onOpenChange });
    const [a] = document.querySelectorAll('details');

    a.dispatchEvent(new Event('toggle'));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('handles no matching elements', () => {
    document.body.innerHTML = '<div>Nothing</div>';
    expect(() => enhanceDisclosure(document)).not.toThrow();
  });
});

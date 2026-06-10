import { describe, it, expect, beforeEach, vi } from 'vitest';
import { defineEnhancer } from './define.js';
import { Events } from './events.js';

const enhanceCounter = defineEnhancer<{ step?: number }, { count: () => number }>({
  name: 'counter',
  selector: '[data-counter]',
  defaults: { step: 1 },
  setup({ root, options, on, emit }) {
    let count = 0;
    on(root, 'click', () => {
      count += options.step!;
      emit(Events.change, { value: String(count) });
    });
    return { count: () => count };
  },
});

describe('defineEnhancer', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button data-counter id="a">A</button>
      <button data-counter id="b">B</button>
    `;
  });

  it('creates one instance per matching root', () => {
    const handle = enhanceCounter(document);
    expect(handle.instances).toHaveLength(2);
    expect(handle.instances.map((i) => i.root.id)).toEqual(['a', 'b']);
  });

  it('exposes the first instance api on the handle', () => {
    const handle = enhanceCounter(document);
    document.getElementById('a')!.click();
    expect(handle.api!.count()).toBe(1);
    expect(handle.instances[1].api.count()).toBe(0);
  });

  it('accepts an element root directly', () => {
    const handle = enhanceCounter(document.getElementById('a')!);
    expect(handle.instances).toHaveLength(1);
  });

  it('applies defaults and per-call options', () => {
    const handle = enhanceCounter(document.getElementById('a')!, { step: 5 });
    document.getElementById('a')!.click();
    expect(handle.api!.count()).toBe(5);
  });

  it('is idempotent per root until destroyed', () => {
    const first = enhanceCounter(document);
    const second = enhanceCounter(document);
    expect(first.instances).toHaveLength(2);
    expect(second.instances).toHaveLength(0);

    first.destroy();
    const third = enhanceCounter(document);
    expect(third.instances).toHaveLength(2);
  });

  it('destroy removes listeners registered through on()', () => {
    const handle = enhanceCounter(document);
    const a = document.getElementById('a')!;
    a.click();
    handle.destroy();
    a.click();
    expect(handle.api!.count()).toBe(1);
  });

  it('emit dispatches bubbling hl:* custom events', () => {
    const spy = vi.fn();
    document.addEventListener(Events.change, spy);
    enhanceCounter(document);
    document.getElementById('a')!.click();

    expect(spy).toHaveBeenCalledTimes(1);
    const event = spy.mock.calls[0][0] as CustomEvent;
    expect(event.detail.value).toBe('1');
    expect(event.bubbles).toBe(true);
    document.removeEventListener(Events.change, spy);
  });
});

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

  it('defaults the container to the document', () => {
    const handle = enhanceCounter();
    expect(handle.instances).toHaveLength(2);
    handle.destroy();
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

  it('exposes its definition for introspection', () => {
    expect(enhanceCounter.definition.name).toBe('counter');
    expect(enhanceCounter.definition.selector).toBe('[data-counter]');
    expect(enhanceCounter.definition.defaults).toEqual({ step: 1 });
  });

  it('ignores undefined caller options so they never shadow defaults', () => {
    const handle = enhanceCounter(document.getElementById('a')!, { step: undefined });
    document.getElementById('a')!.click();
    expect(handle.api!.count()).toBe(1);
  });

  describe('data-hl-* attribute options', () => {
    type Opts = {
      flag?: boolean;
      count?: number;
      label?: string;
      mode?: 'a' | 'b';
      list?: string[];
    };
    const enhanceAttrs = defineEnhancer<Opts, Opts>({
      name: 'attrs',
      selector: '[data-attrs]',
      defaults: { flag: false, count: 1, label: 'x', mode: 'a', list: [] },
      attributes: {
        flag: 'boolean',
        count: 'number',
        label: 'string',
        mode: ['a', 'b'],
        list: (raw) => raw.split(','),
      },
      setup: ({ options }) => options,
    });

    it('reads typed options from kebab-cased data attributes', () => {
      document.body.innerHTML = `
        <div data-attrs data-hl-flag data-hl-count="3" data-hl-label="hi" data-hl-mode="b" data-hl-list="p,q"></div>
      `;
      expect(enhanceAttrs(document).api).toEqual({
        flag: true,
        count: 3,
        label: 'hi',
        mode: 'b',
        list: ['p', 'q'],
      });
    });

    it('parses boolean "false" and ignores values that fail to parse', () => {
      document.body.innerHTML = `
        <div data-attrs data-hl-flag="false" data-hl-count="abc" data-hl-mode="zzz"></div>
      `;
      const api = enhanceAttrs(document).api!;
      expect(api.flag).toBe(false);
      expect(api.count).toBe(1);
      expect(api.mode).toBe('a');
    });

    it('lets caller options win over attributes', () => {
      document.body.innerHTML = `<div data-attrs data-hl-count="3"></div>`;
      expect(enhanceAttrs(document, { count: 9 }).api!.count).toBe(9);
    });
  });

  it('observe() watches a subtree until destroy', async () => {
    const seen: number[] = [];
    const enhanceWatcher = defineEnhancer({
      name: 'watcher',
      selector: '[data-counter]',
      setup({ root, observe }) {
        observe(root, (records) => seen.push(records.length));
      },
    });
    const a = document.getElementById('a')!;
    const handle = enhanceWatcher(a);
    a.appendChild(document.createElement('span'));
    await new Promise((r) => setTimeout(r, 0));
    expect(seen).toHaveLength(1);

    handle.destroy();
    a.appendChild(document.createElement('span'));
    await new Promise((r) => setTimeout(r, 0));
    expect(seen).toHaveLength(1);
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

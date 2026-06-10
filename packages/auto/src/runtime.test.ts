import { describe, it, expect, beforeEach, vi } from 'vitest';
import { enhanceTabs } from '@hydrateless/enhancers';
import { createAuto, type Loader, type Run } from './runtime.js';

const TABS_MARKUP = `
  <div data-hl-tabs>
    <div role="tablist"><button role="tab">A</button><button role="tab">B</button></div>
    <div role="tabpanel">A</div>
    <div role="tabpanel">B</div>
  </div>
`;

/** A loader that only knows about tabs, counting how often it is asked. */
function tabsLoader(opts: { async?: boolean } = {}) {
  const calls: string[] = [];
  const run = enhanceTabs as unknown as Run;
  const load: Loader = (name) => {
    calls.push(name);
    if (name !== 'tabs') return undefined;
    return opts.async ? Promise.resolve(run) : run;
  };
  return { load, calls };
}

/** Wait for the MutationObserver callback + the coalescing microtask. */
const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('createAuto', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('enhances matching markup on the initial scan (sync loader)', async () => {
    document.body.innerHTML = TABS_MARKUP;
    const { load } = tabsLoader();
    const controller = createAuto(load)(document, { watch: false });
    await controller.ready;

    expect(document.querySelector('[role="tab"]')!.getAttribute('aria-selected')).toBe('true');
    controller.dispose();
  });

  it('enhances matching markup with an async loader', async () => {
    document.body.innerHTML = TABS_MARKUP;
    const { load } = tabsLoader({ async: true });
    const controller = createAuto(load)(document, { watch: false });
    await controller.ready;

    expect(document.querySelector('[role="tab"]')!.getAttribute('aria-selected')).toBe('true');
    controller.dispose();
  });

  it('skips loaders for components not present in the DOM', async () => {
    document.body.innerHTML = TABS_MARKUP;
    const { load, calls } = tabsLoader();
    const controller = createAuto(load)(document, { watch: false });
    await controller.ready;

    expect(calls).toEqual(['tabs']);
    controller.dispose();
  });

  it('enhances markup added after the initial scan', async () => {
    const { load } = tabsLoader();
    const controller = createAuto(load)(document);
    await controller.ready;

    document.body.innerHTML = TABS_MARKUP;
    await settle();

    expect(document.querySelector('[role="tab"]')!.getAttribute('aria-selected')).toBe('true');
    controller.dispose();
  });

  it('disposes instances whose roots are removed from the document', async () => {
    document.body.innerHTML = TABS_MARKUP;
    const { load } = tabsLoader();
    const controller = createAuto(load)(document);
    await controller.ready;

    const root = document.querySelector<HTMLElement>('[data-hl-tabs]')!;
    root.remove();
    document.body.appendChild(root);
    await settle();

    // The root was disposed on removal and re-enhanced after re-insertion:
    // a single click must still work (no double-bound listeners).
    const tabs = root.querySelectorAll<HTMLElement>('[role="tab"]');
    tabs[1].click();
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    controller.dispose();
  });

  it('dispose tears down instances and stops watching', async () => {
    document.body.innerHTML = TABS_MARKUP;
    const { load } = tabsLoader();
    const controller = createAuto(load)(document);
    await controller.ready;
    controller.dispose();

    const tabs = document.querySelectorAll<HTMLElement>('[role="tab"]');
    tabs[1].click();
    // Listeners removed: selection no longer changes.
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');

    // New markup is ignored after dispose.
    const spy = vi.fn(() => enhanceTabs as unknown as Run);
    document.body.insertAdjacentHTML('beforeend', TABS_MARKUP);
    await settle();
    expect(spy).not.toHaveBeenCalled();
  });
});

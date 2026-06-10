import { MANIFEST, type ComponentName } from '@hydrateless/enhancers/manifest';
import type { Disposer, EnhancerHandle } from '@hydrateless/enhancers/core';

/** An enhancer's run function, normalized over the uniform handle contract. */
export type Run = (container: Document | HTMLElement) => EnhancerHandle<unknown>;

/** Resolve a component name to its run function, possibly asynchronously. */
export type Loader = (name: ComponentName) => Run | Promise<Run> | undefined;

export interface AutoOptions {
  /**
   * Keep watching the container with a MutationObserver, enhancing markup as
   * it is added and disposing instances whose roots leave the document.
   * Defaults to `true`.
   */
  watch?: boolean;
}

export interface AutoController {
  /** Resolves once the initial scan has loaded and run every enhancer. */
  ready: Promise<void>;
  /** Stop watching and tear down every instance created so far. */
  dispose: Disposer;
}

/**
 * Build an auto-initializer from a loader. The same runtime powers both the
 * lazy ESM entry (dynamic `import()` per enhancer) and the self-contained CDN
 * bundle (all enhancers statically linked): scan the container for manifest
 * selectors, run the matching enhancers, then keep the page hydrated as the
 * DOM changes.
 */
export function createAuto(load: Loader) {
  return function start(
    container: Document | HTMLElement = document,
    options: AutoOptions = {},
  ): AutoController {
    const { watch = true } = options;
    /** Per-root teardowns, so removed roots can be disposed individually. */
    const tracked = new Map<HTMLElement, Disposer>();
    let disposed = false;

    const adopt = (handle: EnhancerHandle<unknown>) => {
      if (disposed) {
        handle.destroy();
        return;
      }
      for (const instance of handle.instances) {
        // Re-scans can produce a second instance for the same root (e.g. the
        // toast region adopting newly added triggers); compose the teardowns.
        const previous = tracked.get(instance.root);
        tracked.set(
          instance.root,
          previous
            ? () => {
                previous();
                instance.destroy();
              }
            : instance.destroy,
        );
      }
    };

    const scan = (): Promise<void> => {
      const pending: Promise<void>[] = [];
      for (const { name, selector } of MANIFEST) {
        if (!container.querySelector(selector)) continue;
        const loaded = load(name);
        if (!loaded) continue;
        if (loaded instanceof Promise) {
          pending.push(loaded.then((run) => adopt(run(container))));
        } else {
          adopt(loaded(container));
        }
      }
      return Promise.all(pending).then(() => undefined);
    };

    const ready = scan();

    let observer: MutationObserver | null = null;
    if (watch && typeof MutationObserver !== 'undefined') {
      const target = container instanceof Document ? container.documentElement : container;
      let scheduled = false;
      observer = new MutationObserver((mutations) => {
        for (const [root, destroy] of tracked) {
          if (!root.isConnected) {
            destroy();
            tracked.delete(root);
          }
        }
        if (!scheduled && mutations.some((m) => m.addedNodes.length > 0)) {
          scheduled = true;
          // Coalesce bursts of mutations into one scan.
          queueMicrotask(() => {
            scheduled = false;
            if (!disposed) void scan();
          });
        }
      });
      observer.observe(target, { childList: true, subtree: true });
    }

    return {
      ready,
      dispose: () => {
        disposed = true;
        observer?.disconnect();
        for (const destroy of tracked.values()) destroy();
        tracked.clear();
      },
    };
  };
}

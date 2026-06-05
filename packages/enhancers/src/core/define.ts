import { combine, on as onEvent, selectRoots, uid as makeUid, type Disposer } from './lifecycle.js';

/**
 * The toolkit handed to an enhancer's `setup`. Everything registered through
 * `on`/`add` is torn down automatically when the returned disposer runs.
 */
export interface EnhancerContext<Options extends object> {
  /** The matched component root. */
  root: HTMLElement;
  /** The container the enhancer was invoked with (often `document`). */
  container: Document | HTMLElement;
  /** Options merged with the definition's defaults. */
  options: Options;
  /** Attach an event listener that is auto-removed on dispose. */
  on: <E extends Event = Event>(
    target: EventTarget,
    type: string,
    handler: (event: E) => void,
    options?: boolean | AddEventListenerOptions,
  ) => void;
  /** Register an arbitrary disposer to run on teardown. */
  add: (disposer: Disposer) => void;
  /** Generate a unique id namespaced to this enhancer. */
  uid: (prefix?: string) => string;
}

export interface EnhancerDefinition<Options extends object = Record<string, never>> {
  /** Stable name, used for generated ids and the auto-loader manifest. */
  name: string;
  /** CSS selector identifying each component root. */
  selector: string;
  /** Default options merged under caller-provided options. */
  defaults?: Options;
  /** Wire behavior for a single root. May return an extra disposer. */
  setup: (ctx: EnhancerContext<Options>) => Disposer | void;
}

export type Enhancer<Options extends object = Record<string, never>> = (
  container?: Document | HTMLElement,
  options?: Partial<Options>,
) => Disposer;

/**
 * Turn a per-root `setup` into a full enhancer with the shared lifecycle every
 * Hydrateless component needs: root discovery (including the container itself),
 * idempotent de-duplication, automatic listener teardown, and re-enhancement
 * after disposal. This is the single contract all enhancers are built on.
 */
export function defineEnhancer<Options extends object = Record<string, never>>(
  def: EnhancerDefinition<Options>,
): Enhancer<Options> {
  const enhanced = new WeakSet<Element>();

  return (container: Document | HTMLElement = document, options?: Partial<Options>): Disposer => {
    const roots = selectRoots(container, def.selector);
    const disposers: Disposer[] = [];

    for (const root of roots) {
      if (enhanced.has(root)) continue;
      enhanced.add(root);

      const bag: Disposer[] = [];
      const ctx: EnhancerContext<Options> = {
        root,
        container,
        options: { ...(def.defaults ?? {}), ...(options ?? {}) } as Options,
        on: (target, type, handler, listenerOptions) => {
          bag.push(onEvent(target, type, handler, listenerOptions));
        },
        add: (disposer) => {
          bag.push(disposer);
        },
        uid: (prefix) => makeUid(prefix ?? def.name),
      };

      const extra = def.setup(ctx);
      if (typeof extra === 'function') bag.push(extra);

      disposers.push(() => {
        enhanced.delete(root);
        combine(bag)();
      });
    }

    return combine(disposers);
  };
}

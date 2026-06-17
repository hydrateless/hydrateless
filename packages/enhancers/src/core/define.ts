import { combine, on as onEvent, selectRoots, uid as makeUid, type Disposer } from './lifecycle.js';
import { emit, type EmitOptions } from './events.js';

/**
 * The toolkit handed to an enhancer's `setup`. Everything registered through
 * `on`/`add` is torn down automatically when the instance is destroyed.
 */
export interface EnhancerContext<Options extends object> {
  /** The matched component root. */
  root: HTMLElement;
  /** The container the enhancer was invoked with (often `document`). */
  container: Document | HTMLElement;
  /** Options merged with the definition's defaults. */
  options: Options;
  /** Attach an event listener that is auto-removed on destroy. */
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
  /**
   * Dispatch a bubbling `hl:*` CustomEvent from the root. Returns `false` when
   * a cancelable event was prevented.
   */
  emit: (type: string, detail?: unknown, options?: EmitOptions) => boolean;
}

/** One enhanced root: its element, its imperative API, and its own teardown. */
export interface EnhancerInstance<Api = null> {
  root: HTMLElement;
  api: Api;
  destroy: Disposer;
}

/**
 * What every enhancer call returns. `api` is the first instance's API (or
 * `null` when nothing matched), the common case for framework bindings, which
 * always enhance a single root. `instances` carries one entry per enhanced
 * root for callers that enhance a whole container.
 */
export interface EnhancerHandle<Api = null> {
  /** Tear down every instance this call created. */
  destroy: Disposer;
  /** The first enhanced root's API, or `null` when nothing matched. */
  api: Api | null;
  /** One entry per enhanced root, in document order. */
  instances: EnhancerInstance<Api>[];
}

/** Declarative description of an enhancer, passed to {@link defineEnhancer}. */
export interface EnhancerDefinition<Options extends object = Record<string, never>, Api = null> {
  /** Stable name, used for generated ids and the auto-loader manifest. */
  name: string;
  /** CSS selector identifying each component root. */
  selector: string;
  /** Default options merged under caller-provided options. */
  defaults?: Options;
  /** Wire behavior for a single root. May return the instance's public API. */
  setup: (ctx: EnhancerContext<Options>) => Api | void;
}

/** The callable produced by {@link defineEnhancer}: enhances a container and returns a handle. */
export type Enhancer<Options extends object = Record<string, never>, Api = null> = (
  container?: Document | HTMLElement,
  options?: Partial<Options>,
) => EnhancerHandle<Api>;

/** Build a handle from a list of instances. */
export function toHandle<Api>(instances: EnhancerInstance<Api>[]): EnhancerHandle<Api> {
  return {
    destroy: combine(instances.map((instance) => instance.destroy)),
    api: instances[0]?.api ?? null,
    instances,
  };
}

/**
 * Turn a per-root `setup` into a full enhancer with the shared lifecycle every
 * Hydrateless component needs: root discovery (including the container itself),
 * idempotent de-duplication, automatic listener teardown, re-enhancement after
 * destroy, and a uniform handle exposing each instance's imperative API. This
 * is the single contract all enhancers are built on.
 */
export function defineEnhancer<Options extends object = Record<string, never>, Api = null>(
  def: EnhancerDefinition<Options, Api>,
): Enhancer<Options, Api> {
  const enhanced = new WeakSet<Element>();

  return (
    container: Document | HTMLElement = document,
    options?: Partial<Options>,
  ): EnhancerHandle<Api> => {
    const roots = selectRoots(container, def.selector);
    const instances: EnhancerInstance<Api>[] = [];

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
        emit: (type, detail, emitOptions) => emit(root, type, detail, emitOptions),
      };

      const api = (def.setup(ctx) ?? null) as Api;

      instances.push({
        root,
        api,
        destroy: () => {
          enhanced.delete(root);
          combine(bag)();
        },
      });
    }

    return toHandle(instances);
  };
}

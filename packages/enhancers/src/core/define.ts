import { combine, on as onEvent, selectRoots, uid as makeUid, type Disposer } from './lifecycle.js';
import { emit, type EmitOptions } from './events.js';
import { isBrowser } from './dom.js';

/**
 * How a `data-hl-*` attribute on a component root is parsed into an option:
 *
 * - `'boolean'`: present (or `"true"`) is `true`, `"false"` is `false`.
 * - `'number'`: parsed with `Number()`; non-numeric values are ignored.
 * - `'string'`: taken verbatim.
 * - a list of strings: accepted only when the value is one of them.
 * - a function: called with the raw string; return `undefined` to ignore it.
 */
export type AttributeType =
  | 'boolean'
  | 'number'
  | 'string'
  | readonly string[]
  | ((raw: string) => unknown);

/**
 * Which options an enhancer reads from its root's `data-hl-*` attributes, so
 * markup alone can configure it (the auto-loader and CDN bundle pass no
 * options). Keys are option names; each maps to the kebab-cased attribute, so
 * `allowMultiple` is read from `data-hl-allow-multiple`.
 */
export type AttributeSchema<Options extends object> = {
  readonly [K in keyof Options]?: AttributeType;
};

/**
 * The toolkit handed to an enhancer's `setup`. Everything registered through
 * `on`/`observe`/`add` is torn down automatically when the instance is destroyed.
 */
export interface EnhancerContext<Options extends object> {
  /** The matched component root. */
  root: HTMLElement;
  /** The container the enhancer was invoked with (often `document`). */
  container: Document | HTMLElement;
  /** Options merged from the definition's defaults, the root's `data-hl-*` attributes, and the caller. */
  options: Options;
  /** Attach an event listener that is auto-removed on destroy. */
  on: <E extends Event = Event>(
    target: EventTarget,
    type: string,
    handler: (event: E) => void,
    options?: boolean | AddEventListenerOptions,
  ) => void;
  /**
   * Watch `target` with a MutationObserver that is disconnected on destroy.
   * Defaults to `{ childList: true, subtree: true }`, which is what enhancers
   * need to pick up items added or removed after they ran. No-op where
   * `MutationObserver` is unavailable.
   */
  observe: (
    target: Node,
    callback: (records: MutationRecord[]) => void,
    init?: MutationObserverInit,
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
  /** Options that markup can set through `data-hl-*` attributes on the root. */
  attributes?: AttributeSchema<Options>;
  /** Wire behavior for a single root. May return the instance's public API. */
  setup: (ctx: EnhancerContext<Options>) => Api | void;
}

/**
 * The callable produced by {@link defineEnhancer}: enhances a container and
 * returns a handle. Its `definition` exposes the name, selector, defaults, and
 * attribute schema so tooling (docs, the auto-loader) can introspect it.
 */
export type Enhancer<Options extends object = Record<string, never>, Api = null> = ((
  container?: Document | HTMLElement,
  options?: Partial<Options>,
) => EnhancerHandle<Api>) & {
  readonly definition: Readonly<EnhancerDefinition<Options, Api>>;
};

/** Build a handle from a list of instances. */
export function toHandle<Api>(instances: EnhancerInstance<Api>[]): EnhancerHandle<Api> {
  return {
    destroy: combine(instances.map((instance) => instance.destroy)),
    api: instances[0]?.api ?? null,
    instances,
  };
}

/**
 * Resolve the container an enhancer was called with. Outside a browser (SSR,
 * tests without a DOM) there is nothing to enhance, so callers get `null` and
 * an empty handle instead of a `document is not defined` crash.
 */
export function resolveContainer(
  container: Document | HTMLElement | undefined,
): Document | HTMLElement | null {
  if (container) return container;
  return isBrowser ? document : null;
}

/** `allowMultiple` to `data-hl-allow-multiple`. */
export function attributeName(option: string): string {
  return `data-hl-${option.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;
}

function parseAttribute(raw: string, type: AttributeType): unknown {
  if (typeof type === 'function') return type(raw);
  if (Array.isArray(type)) return type.includes(raw) ? raw : undefined;
  switch (type) {
    case 'boolean':
      return raw === '' || raw === 'true' ? true : raw === 'false' ? false : undefined;
    case 'number': {
      const n = Number(raw);
      return raw.trim() === '' || Number.isNaN(n) ? undefined : n;
    }
    default:
      return raw;
  }
}

/**
 * Read the options a root's `data-hl-*` attributes set, according to `schema`.
 * Attributes that are absent or fail to parse are left out so they never
 * shadow a default.
 */
export function readAttributes<Options extends object>(
  root: Element,
  schema: AttributeSchema<Options> | undefined,
): Partial<Options> {
  const out: Record<string, unknown> = {};
  if (!schema) return out as Partial<Options>;
  for (const [key, type] of Object.entries(schema) as [string, AttributeType][]) {
    const raw = root.getAttribute(attributeName(key));
    if (raw === null) continue;
    const value = parseAttribute(raw, type);
    if (value !== undefined) out[key] = value;
  }
  return out as Partial<Options>;
}

/** Drop `undefined` entries so a caller passing unset props can't shadow defaults or attributes. */
export function omitUndefined<T extends object>(value: T | undefined): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value ?? {})) {
    if (entry !== undefined) out[key] = entry;
  }
  return out as Partial<T>;
}

/**
 * Turn a per-root `setup` into a full enhancer with the shared lifecycle every
 * Hydrateless component needs: root discovery (including the container itself),
 * idempotent de-duplication, option merging (defaults, then the root's
 * `data-hl-*` attributes, then caller options), automatic listener and
 * observer teardown, re-enhancement after destroy, and a uniform handle
 * exposing each instance's imperative API. This is the single contract all
 * enhancers are built on. Calling an enhancer with no container outside a
 * browser is a safe no-op that returns an empty handle.
 */
export function defineEnhancer<Options extends object = Record<string, never>, Api = null>(
  def: EnhancerDefinition<Options, Api>,
): Enhancer<Options, Api> {
  const enhanced = new WeakSet<Element>();

  const enhancer = (
    containerArg?: Document | HTMLElement,
    options?: Partial<Options>,
  ): EnhancerHandle<Api> => {
    const container = resolveContainer(containerArg);
    if (!container) return toHandle([]);
    const roots = selectRoots(container, def.selector);
    const instances: EnhancerInstance<Api>[] = [];

    for (const root of roots) {
      if (enhanced.has(root)) continue;
      enhanced.add(root);

      const bag: Disposer[] = [];
      const ctx: EnhancerContext<Options> = {
        root,
        container,
        options: {
          ...(def.defaults ?? {}),
          ...readAttributes<Options>(root, def.attributes),
          ...omitUndefined(options),
        } as Options,
        on: (target, type, handler, listenerOptions) => {
          bag.push(onEvent(target, type, handler, listenerOptions));
        },
        observe: (target, callback, init) => {
          if (typeof MutationObserver === 'undefined') return;
          const observer = new MutationObserver(callback);
          observer.observe(target, init ?? { childList: true, subtree: true });
          bag.push(() => observer.disconnect());
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

  return Object.assign(enhancer, { definition: def }) as Enhancer<Options, Api>;
}

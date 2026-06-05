/**
 * A teardown function returned by every enhancer. Calling it removes all
 * listeners and observers the enhancer registered and un-marks the affected
 * roots so they can be safely enhanced again (e.g. after a framework remount).
 */
export type Disposer = () => void;

/**
 * The toolkit handed to an enhancer's `setup` for a single matched root.
 *
 * Every listener registered through `on` and every disposer passed to `add`
 * is tracked and torn down automatically when the enhancer is disposed, so
 * component authors never manage an array of cleanups by hand.
 */
export interface EnhancerContext<O extends object = object> {
  /** The element the enhancer matched. */
  readonly root: HTMLElement;
  /** The container the enhancer was invoked with (often `document`). */
  readonly container: Document | HTMLElement;
  /** Resolved options: `defaults` merged with the caller's overrides. */
  readonly options: O;
  /** Attach a listener that is removed automatically on dispose. */
  on(
    target: EventTarget,
    type: string,
    handler: (event: Event) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;
  /** Register an arbitrary teardown to run on dispose. */
  add(disposer: Disposer): void;
  /** Generate a unique, stable-per-call id scoped to this component. */
  uid(suffix?: string): string;
}

/**
 * Declarative description of an enhancer. `defineEnhancer` turns this into a
 * function that finds every matching root in a container, wires it up exactly
 * once, and returns a single disposer for all of them.
 */
export interface EnhancerDefinition<O extends object = object> {
  /** Short component name, used for generated ids and the auto-loader. */
  name: string;
  /** CSS selector that identifies a component root. */
  selector: string;
  /** Default options merged under any caller overrides. */
  defaults?: O;
  /** Wire up a single matched root. Return an optional extra disposer. */
  setup(ctx: EnhancerContext<O>): Disposer | void;
}

/** The callable produced by `defineEnhancer`. */
export type Enhancer<O extends object = object> = (
  container?: Document | HTMLElement,
  options?: Partial<O>,
) => Disposer;

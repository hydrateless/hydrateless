import type { Attachment } from 'svelte/attachments';
import type { EnhancerHandle } from '@hydrateless/enhancers';

/** What {@link useEnhancer} returns: an attachment for the root plus the live API. */
export interface UseEnhancer<Api> {
  /**
   * Attach to the element the enhancer should treat as its container:
   * `<div {@attach enhancer.attach}>`. Runs the enhancer when the element
   * mounts and destroys it when the element is removed or the options change.
   */
  readonly attach: Attachment<HTMLElement>;
  /** The enhanced root's imperative API, or `null` while nothing is attached. */
  readonly api: Api | null;
}

/**
 * Drop `undefined` entries so an omitted component prop falls through to the
 * enhancer's default instead of overriding it with `undefined` when the two
 * option objects are merged.
 */
function defined<T extends object>(options: T): Partial<T> {
  const out: Partial<T> = {};
  for (const key of Object.keys(options) as (keyof T)[]) {
    if (options[key] !== undefined) out[key] = options[key];
  }
  return out;
}

/**
 * Bind any Hydrateless enhancer to an element for its lifetime. This is the
 * one low-level escape hatch the Svelte package offers, and every component in
 * it is built on the same call, so custom wrappers behave exactly like the
 * shipped ones.
 *
 * `getOptions` is read inside the attachment, so any reactive state it touches
 * re-runs the enhancer (destroy, then enhance again with the fresh options).
 * Wrap values that should only seed the initial state, such as a bound
 * `value` passed as `defaultValue`, in `untrack` to keep them from retriggering
 * it. Callbacks are invoked later, outside the attachment, so reading props
 * inside them doesn't track. Options left `undefined` are dropped so the
 * enhancer's own defaults apply.
 *
 * ```svelte
 * <script lang="ts">
 *   import { enhanceTabs } from '@hydrateless/enhancers';
 *   import { useEnhancer } from '@hydrateless/svelte';
 *
 *   const tabs = useEnhancer(enhanceTabs, () => ({ activation: 'automatic' }));
 *   // tabs.api?.setValue('two');
 * </script>
 *
 * <div data-hl-tabs {@attach tabs.attach}>...</div>
 * ```
 */
export function useEnhancer<Options extends object, Api>(
  enhancer: (container: HTMLElement, options?: Partial<Options>) => EnhancerHandle<Api>,
  getOptions: () => Partial<Options> = () => ({}),
): UseEnhancer<Api> {
  // `$state.raw` because the API object is opaque; proxying it would break
  // getters that close over the enhancer's private state.
  let api = $state.raw<Api | null>(null);

  const attach: Attachment<HTMLElement> = (node) => {
    const handle = enhancer(node, defined(getOptions()));
    api = handle.api;
    return () => {
      handle.destroy();
      api = null;
    };
  };

  return {
    attach,
    get api() {
      return api;
    },
  };
}

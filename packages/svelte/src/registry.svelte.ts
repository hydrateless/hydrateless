import { untrack } from 'svelte';

/** A live position in a parent's item list plus its disposer. @internal */
export interface Registration {
  /** Current index in document order; shifts as siblings mount or unmount. */
  readonly index: number;
  /**
   * Report the rendered element (from `bind:this`, inside an `$effect`) so
   * items inserted out of registration order, such as a prepend, sort into
   * their real document position.
   */
  attach(node: Element | null): void;
  /** Free the slot (call from `onDestroy`). */
  unregister(): void;
}

/** A parent-side list of registered children. @internal */
export interface Registry<T = void> {
  /** Register a child; `value` is any per-child getter the parent needs. */
  register(value: T): Registration;
  /** Registered children's values in document order. */
  readonly entries: T[];
}

interface Entry<T> {
  value: T;
  node: Element | null;
}

const DOCUMENT_POSITION_FOLLOWING = 4;

/** Orders mounted entries by document position; unmounted ones keep their place. */
function byDocumentOrder<T>(a: Entry<T>, b: Entry<T>): number {
  if (!a.node || !b.node || a.node === b.node) return 0;
  return a.node.compareDocumentPosition(b.node) & DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}

/**
 * Tracks children so their indexes stay dense and in document order while an
 * `{#each}` inserts or removes them after mount. Registration happens during
 * child init (so server output is right), and the write is untracked to keep
 * it out of the parent's render. Shared by the accordion and tabs, whose
 * enhancers fall back to the same positional indexes.
 * @internal
 */
export function createRegistry<T = void>(): Registry<T> {
  let items = $state.raw<Entry<T>[]>([]);
  return {
    get entries() {
      return items.map((item) => item.value);
    },
    register(value) {
      const entry: Entry<T> = { value, node: null };
      untrack(() => {
        items = [...items, entry];
      });
      return {
        get index() {
          return items.indexOf(entry);
        },
        attach(node) {
          if (entry.node === node) return;
          entry.node = node;
          items = [...items].sort(byDocumentOrder);
        },
        unregister() {
          items = items.filter((item) => item !== entry);
        },
      };
    },
  };
}

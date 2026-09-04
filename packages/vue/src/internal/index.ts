import {
  computed,
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
  type ComputedRef,
  type Ref,
  type ShallowRef,
} from 'vue';

/** Join truthy class names into a single string. */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/** A class-only wrapper component: `<tag class={klass}>` around the default slot. */
export function part(name: string, tag: string, klass: string) {
  return defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { slots, attrs }) {
      return () => h(tag, { ...attrs, class: cx(klass, attrs.class as string) }, slots.default?.());
    },
  });
}

/** Options for {@link useControlled}. */
export interface ControlledOptions<T, E extends string> {
  /** Name of the controlled prop (e.g. `modelValue`, `open`). */
  prop: string;
  /** Name of the update event emitted when the value changes. */
  event: E;
  /** Initial value used while the prop is `undefined` (uncontrolled). */
  default: T;
}

/** A controlled-or-uncontrolled value and the setter that reports changes. */
export interface Controlled<T> {
  /** The prop while it's defined, else the internal (uncontrolled) value. */
  value: ComputedRef<T>;
  /** Record a change from the enhancer: update the internal mirror and emit. */
  set: (next: T) => void;
}

/**
 * Vue's version of the "controlled or uncontrolled" contract every stateful
 * component shares. While `props[prop]` is `undefined` the component owns its
 * state; once the parent passes a value the prop wins. `set` always emits so
 * `v-model` keeps working in both modes.
 */
export function useControlled<T, E extends string>(
  props: Record<string, unknown>,
  emit: (event: E, value: T) => void,
  { prop, event, default: fallback }: ControlledOptions<T, E>,
): Controlled<T> {
  const controlled = () => props[prop] as T | undefined;
  const internal = shallowRef<T>(controlled() ?? fallback);
  const value = computed(() => {
    const outer = controlled();
    return outer === undefined ? internal.value : outer;
  });
  const set = (next: T) => {
    internal.value = next;
    emit(event, next);
  };
  return { value, set };
}

/** A live position in a parent's item list plus its disposer. */
export interface Registration {
  /** Current index in document order; shifts as siblings mount or unmount. */
  readonly index: number;
  /**
   * Report the rendered element (from `onMounted`) so items inserted out of
   * registration order, such as a prepend, sort into their real position.
   */
  attach(node: Element | null): void;
  /** Free the slot (call from `onBeforeUnmount`). */
  unregister(): void;
}

/** A parent-side list of registered children. */
export interface Registry<T = void> {
  /** Register a child; `value` is any per-child getter the parent needs. */
  register(value: T): Registration;
  /** Registered children's values in document order. */
  readonly entries: ComputedRef<T[]>;
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
 * Tracks children so their indexes stay dense and in document order while a
 * `v-for` inserts or removes them after mount. Registration happens in
 * `setup` so server output is right. Shared by the accordion and tabs, whose
 * enhancers fall back to the same positional indexes.
 */
export function createRegistry<T = void>(): Registry<T> {
  const items = shallowRef<Entry<T>[]>([]);
  return {
    entries: computed(() => items.value.map((item) => item.value)),
    register(value) {
      const entry: Entry<T> = { value, node: null };
      items.value = [...items.value, entry];
      return {
        get index() {
          return items.value.indexOf(entry);
        },
        attach(node) {
          if (entry.node === node) return;
          entry.node = node;
          items.value = [...items.value].sort(byDocumentOrder);
        },
        unregister() {
          items.value = items.value.filter((item) => item !== entry);
        },
      };
    },
  };
}

/**
 * Register with a parent's registry for this component's lifetime: attach
 * the rendered element on mount and free the slot before unmount. Returns
 * the element ref to put on the root vnode plus the live index.
 */
export function useRegistration(registration: Registration | undefined): {
  node: Ref<Element | null>;
  index: ComputedRef<number>;
} {
  const node = ref<Element | null>(null);
  onMounted(() => registration?.attach(node.value));
  onBeforeUnmount(() => registration?.unregister());
  return { node, index: computed(() => registration?.index ?? 0) };
}

function same(a: unknown, b: unknown): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, i) => item === b[i]);
  }
  return a === b;
}

/**
 * Push a controlled value into a live enhancer whenever it changes. The write
 * is skipped while the enhancer already reports that value, so the round trip
 * (enhancer change, `update:*` emit, prop update) doesn't re-enter the
 * enhancer or steal focus.
 */
export function useApiSync<Api, T>(
  api: ShallowRef<Api | null>,
  source: ComputedRef<T>,
  read: (api: Api) => unknown,
  write: (api: Api, value: Exclude<T, undefined>) => void,
): void {
  watch(source, (value) => {
    const current = api.value;
    if (current && value !== undefined && !same(read(current), value)) {
      write(current, value as Exclude<T, undefined>);
    }
  });
}

import {
  computed,
  defineComponent,
  h,
  shallowRef,
  watch,
  type ComputedRef,
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

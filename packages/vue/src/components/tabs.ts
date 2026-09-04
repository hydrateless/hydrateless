import {
  computed,
  defineComponent,
  h,
  inject,
  provide,
  ref,
  useId,
  type ComputedRef,
  type ExtractPublicPropTypes,
  type InjectionKey,
  type PropType,
} from 'vue';
import { enhanceTabs, type EnhanceTabsOptions, type TabsApi } from '@hydrateless/enhancers';
import {
  createRegistry,
  useApiSync,
  useControlled,
  useRegistration,
  type Registration,
} from '../internal/index.js';
import { useEnhancer } from '../useEnhancer.js';

interface TabsContext {
  id: string;
  /** Selected value; `undefined` selects the first tab. */
  value: ComputedRef<string | undefined>;
  /** Tab values in order, so panels can match by position like the enhancer. */
  values: ComputedRef<string[]>;
  /**
   * Register a tab (with its value getter) or panel. Indexes are live, so
   * tabs added or removed by a `v-for` renumber the rest; call `unregister`
   * on unmount.
   */
  tab: (value: () => string | undefined) => Registration;
  panel: () => Registration;
}
const TabsKey: InjectionKey<TabsContext> = Symbol('hl-tabs');

const tabsProps = {
  activation: { type: String as PropType<EnhanceTabsOptions['activation']>, default: undefined },
  orientation: { type: String as PropType<EnhanceTabsOptions['orientation']>, default: undefined },
  /** Controlled value of the selected tab (`v-model`). */
  modelValue: { type: String, default: undefined },
  /** Initial value for uncontrolled usage. */
  defaultValue: { type: String, default: undefined },
} as const;

/** Props for {@link Tabs}. */
export type TabsProps = ExtractPublicPropTypes<typeof tabsProps>;

/**
 * Tabbed interface root. Compose with `<TabList>`, `<Tab>`, and `<TabPanel>`.
 * Tab values come from each `<Tab value>`, defaulting to the index; selection
 * works uncontrolled (`defaultValue`) or with `v-model`. Selection state is
 * rendered (`aria-selected`, `hidden`, roving `tabindex`), so server output
 * is correct before the enhancer takes over.
 *
 * ```vue
 * <Tabs v-model="tab">
 *   <TabList>
 *     <Tab value="overview">Overview</Tab>
 *     <Tab value="install">Install</Tab>
 *   </TabList>
 *   <TabPanel>Zero runtime by default.</TabPanel>
 *   <TabPanel>npm install hydrateless</TabPanel>
 * </Tabs>
 * ```
 */
export const Tabs = defineComponent({
  name: 'HlTabs',
  inheritAttrs: false,
  props: tabsProps,
  emits: ['update:modelValue'],
  setup(props, { slots, attrs, emit }) {
    const host = ref<HTMLElement | null>(null);
    const { value, set } = useControlled<string | undefined, 'update:modelValue'>(props, emit, {
      prop: 'modelValue',
      event: 'update:modelValue',
      default: props.defaultValue,
    });
    const api = useEnhancer(
      host,
      enhanceTabs,
      () => ({
        activation: props.activation,
        orientation: props.orientation,
        defaultValue: value.value,
        onValueChange: set,
      }),
      () => [props.activation, props.orientation],
    );
    useApiSync<TabsApi, string | undefined>(
      api,
      value,
      (a) => a.value,
      (a, v) => a.setValue(v),
    );
    // Tabs register a value getter so `values` stays in DOM order even when
    // a `v-for` inserts or removes tabs after mount.
    const tabs = createRegistry<() => string | undefined>();
    const panels = createRegistry();
    const values = computed(() => tabs.entries.value.map((get, i) => get() ?? String(i)));
    provide(TabsKey, {
      id: useId(),
      value,
      values,
      tab: (getValue) => tabs.register(getValue),
      panel: () => panels.register(),
    });
    return () => h('div', { ...attrs, 'data-hl-tabs': '', ref: host }, slots.default?.());
  },
});

/** Props for {@link TabList}. */
export type TabListProps = Record<never, never>;

/** The row of tab triggers (`role="tablist"`). */
export const TabList = defineComponent({
  name: 'HlTabList',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () => h('div', { ...attrs, role: 'tablist' }, slots.default?.());
  },
});

const tabProps = {
  /** Stable value identifying this tab; defaults to its index. */
  value: { type: String, default: undefined },
  disabled: { type: Boolean, default: false },
} as const;

/** Props for {@link Tab}. */
export type TabProps = ExtractPublicPropTypes<typeof tabProps>;

/** Whether the tab or panel at `index` is the selected one. */
function isSelected(ctx: TabsContext | null, index: number) {
  const selected = ctx?.value.value;
  return selected === undefined ? index === 0 : ctx!.values.value.indexOf(selected) === index;
}

/** A single tab trigger (`role="tab"`). */
export const Tab = defineComponent({
  name: 'HlTab',
  inheritAttrs: false,
  props: tabProps,
  setup(props, { slots, attrs }) {
    const ctx = inject(TabsKey, null);
    const { node, index } = useRegistration(ctx?.tab(() => props.value));
    const selected = computed(() => isSelected(ctx, index.value));
    return () =>
      h(
        'button',
        {
          type: 'button',
          ...attrs,
          ref: node,
          id: ctx && `${ctx.id}-t${index.value}`,
          role: 'tab',
          'data-hl-value': props.value,
          'aria-selected': String(selected.value),
          'aria-controls': ctx && `${ctx.id}-p${index.value}`,
          'aria-disabled': props.disabled || undefined,
          tabindex: selected.value ? 0 : -1,
        },
        slots.default?.(),
      );
  },
});

/** Props for {@link TabPanel}. */
export type TabPanelProps = Record<never, never>;

/** Content for the tab at the same position (`role="tabpanel"`). */
export const TabPanel = defineComponent({
  name: 'HlTabPanel',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const ctx = inject(TabsKey, null);
    const { node, index } = useRegistration(ctx?.panel());
    const selected = computed(() => isSelected(ctx, index.value));
    return () =>
      h(
        'div',
        {
          ...attrs,
          ref: node,
          id: ctx && `${ctx.id}-p${index.value}`,
          role: 'tabpanel',
          'aria-labelledby': ctx && `${ctx.id}-t${index.value}`,
          tabindex: 0,
          hidden: !selected.value,
        },
        slots.default?.(),
      );
  },
});

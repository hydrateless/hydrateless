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
import { useApiSync, useControlled } from '../internal/index.js';
import { useEnhancer } from '../useEnhancer.js';

interface TabsContext {
  id: string;
  /** Selected value; `undefined` selects the first tab. */
  value: ComputedRef<string | undefined>;
  /** Tab values in order, so panels can match by position like the enhancer. */
  values: string[];
  /** Claim the next tab (or panel) index; the enhancer falls back to it too. */
  tab: (value: string | undefined) => number;
  panel: () => number;
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
    const values: string[] = [];
    let panels = 0;
    provide(TabsKey, {
      id: useId(),
      value,
      values,
      tab: (v) => values.push(v ?? String(values.length)) - 1,
      panel: () => panels++,
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
  return selected === undefined ? index === 0 : ctx!.values.indexOf(selected) === index;
}

/** A single tab trigger (`role="tab"`). */
export const Tab = defineComponent({
  name: 'HlTab',
  inheritAttrs: false,
  props: tabProps,
  setup(props, { slots, attrs }) {
    const ctx = inject(TabsKey, null);
    const index = ctx?.tab(props.value) ?? 0;
    const selected = computed(() => isSelected(ctx, index));
    return () =>
      h(
        'button',
        {
          type: 'button',
          ...attrs,
          id: ctx && `${ctx.id}-t${index}`,
          role: 'tab',
          'data-hl-value': props.value,
          'aria-selected': String(selected.value),
          'aria-controls': ctx && `${ctx.id}-p${index}`,
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
    const index = ctx?.panel() ?? 0;
    const selected = computed(() => isSelected(ctx, index));
    return () =>
      h(
        'div',
        {
          ...attrs,
          id: ctx && `${ctx.id}-p${index}`,
          role: 'tabpanel',
          'aria-labelledby': ctx && `${ctx.id}-t${index}`,
          tabindex: 0,
          hidden: !selected.value,
        },
        slots.default?.(),
      );
  },
});

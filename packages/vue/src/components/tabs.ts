import { defineComponent, h, watch, type PropType } from 'vue';
import { enhanceTabs, type EnhanceTabsOptions, type TabsApi } from '@hydrateless/enhancers';
import { useHostEnhancer } from '../internal.js';

/**
 * Tabbed interface root. Compose with `<TabList>`, `<Tab>`, and `<TabPanel>`.
 * Tab values come from each `<Tab value>`, defaulting to the index; selection
 * works uncontrolled (`defaultValue`) or with `v-model`.
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
  props: {
    activation: { type: String as PropType<EnhanceTabsOptions['activation']>, default: undefined },
    orientation: {
      type: String as PropType<EnhanceTabsOptions['orientation']>,
      default: undefined,
    },
    /** Controlled value of the selected tab (`v-model`). */
    modelValue: { type: String, default: undefined },
    /** Initial value for uncontrolled usage. */
    defaultValue: { type: String, default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, attrs, emit }) {
    const { host, api } = useHostEnhancer<TabsApi>((el) =>
      enhanceTabs(el, {
        activation: props.activation,
        orientation: props.orientation,
        defaultValue: props.modelValue ?? props.defaultValue,
        onValueChange: (value) => emit('update:modelValue', value),
      }),
    );
    watch(
      () => props.modelValue,
      (value) => {
        if (value != null) api.value?.setValue(value);
      },
    );
    return () => h('div', { ...attrs, 'data-hl-tabs': '', ref: host }, slots.default?.());
  },
});

/** The row of tab triggers (`role="tablist"`). */
export const TabList = defineComponent({
  name: 'HlTabList',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () => h('div', { ...attrs, role: 'tablist' }, slots.default?.());
  },
});

/** A single tab trigger (`role="tab"`). */
export const Tab = defineComponent({
  name: 'HlTab',
  inheritAttrs: false,
  props: {
    /** Stable value identifying this tab; defaults to its index. */
    value: { type: String, default: undefined },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'button',
        { type: 'button', ...attrs, role: 'tab', 'data-hl-value': props.value },
        slots.default?.(),
      );
  },
});

/** Content for the matching tab (`role="tabpanel"`). */
export const TabPanel = defineComponent({
  name: 'HlTabPanel',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () => h('div', { ...attrs, role: 'tabpanel' }, slots.default?.());
  },
});

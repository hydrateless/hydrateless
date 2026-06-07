import { defineComponent, h, type PropType } from 'vue';
import { enhanceTabs, type EnhanceTabsOptions } from '@hydrateless/enhancers';
import { useHostEnhancer } from '../internal.js';

/**
 * Tabbed interface root. Compose with `<TabList>`, `<Tab>`, and `<TabPanel>`.
 *
 * ```vue
 * <Tabs>
 *   <TabList>
 *     <Tab>Overview</Tab>
 *     <Tab>Install</Tab>
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
  },
  setup(props, { slots, attrs }) {
    const host = useHostEnhancer((el) =>
      enhanceTabs(el, { activation: props.activation, orientation: props.orientation }),
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
  setup(_, { slots, attrs }) {
    return () => h('button', { type: 'button', ...attrs, role: 'tab' }, slots.default?.());
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

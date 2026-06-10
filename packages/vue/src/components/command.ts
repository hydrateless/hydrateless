import { defineComponent, h } from 'vue';
import { enhanceCommand } from '@hydrateless/enhancers';
import { cx, useHostEnhancer } from '../internal.js';

/**
 * Command palette. Compose with `<CommandInput>`, `<CommandList>`,
 * `<CommandGroup>`, `<CommandItem>`, `<CommandEmpty>`. Emits `select` with the
 * chosen value. Place inside a `<dialog>` to use `hotkey`.
 */
export const Command = defineComponent({
  name: 'HlCommand',
  inheritAttrs: false,
  props: {
    hotkey: { type: String, default: undefined },
  },
  emits: ['select'],
  setup(props, { slots, attrs, emit }) {
    const { host } = useHostEnhancer((el) =>
      enhanceCommand(el, {
        hotkey: props.hotkey,
        onCommand: (value) => emit('select', value),
      }),
    );
    return () =>
      h(
        'div',
        { ...attrs, 'data-hl-command': '', 'data-hl-command-hotkey': props.hotkey, ref: host },
        slots.default?.(),
      );
  },
});

/** The palette search field. */
export const CommandInput = defineComponent({
  name: 'HlCommandInput',
  inheritAttrs: false,
  props: {
    styled: { type: Boolean, default: true },
  },
  setup(props, { attrs }) {
    return () =>
      h('input', {
        ...attrs,
        class: cx(props.styled && 'hl-input', attrs.class as string),
        'data-hl-command-input': '',
      });
  },
});

/** The scrollable list of commands (`role="listbox"`). */
export const CommandList = defineComponent({
  name: 'HlCommandList',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h('div', { ...attrs, 'data-hl-command-list': '', role: 'listbox' }, slots.default?.());
  },
});

/** A labelled group of commands. The optional heading uses the `label` slot. */
export const CommandGroup = defineComponent({
  name: 'HlCommandGroup',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () => {
      const children = [];
      if (slots.label) {
        children.push(
          h('div', { class: 'hl-command-group-label', role: 'presentation' }, slots.label()),
        );
      }
      if (slots.default) children.push(...(slots.default() as never[]));
      return h('div', { ...attrs, 'data-hl-command-group': '' }, children);
    };
  },
});

/** A runnable command (`role="option"`). */
export const CommandItem = defineComponent({
  name: 'HlCommandItem',
  inheritAttrs: false,
  props: {
    value: { type: String, required: true },
    keywords: { type: String, default: undefined },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          role: 'option',
          'data-hl-value': props.value,
          'data-hl-keywords': props.keywords,
        },
        [slots.icon?.(), h('span', slots.default?.())],
      );
  },
});

/** Shown when no commands match the query. */
export const CommandEmpty = defineComponent({
  name: 'HlCommandEmpty',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'div',
        { ...attrs, 'data-hl-command-empty': '', hidden: true },
        slots.default?.() ?? 'No results found.',
      );
  },
});

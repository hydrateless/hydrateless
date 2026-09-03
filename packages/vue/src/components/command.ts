import { defineComponent, h, ref, type ExtractPublicPropTypes } from 'vue';
import { enhanceCommand, type CommandApi } from '@hydrateless/enhancers';
import { cx, useApiSync, useControlled } from '../internal/index.js';
import { useEnhancer } from '../useEnhancer.js';

const commandProps = {
  /** Lowercased key that, with Cmd/Ctrl, opens the hosting `<dialog>`. */
  hotkey: { type: String, default: undefined },
  /** Controlled filter query (`v-model:query`). */
  query: { type: String, default: undefined },
  /** Initial query for uncontrolled usage. */
  defaultQuery: { type: String, default: undefined },
} as const;

/** Props for {@link Command}. */
export type CommandProps = ExtractPublicPropTypes<typeof commandProps>;

/**
 * Command palette. Compose with `<CommandInput>`, `<CommandList>`,
 * `<CommandGroup>`, `<CommandItem>`, `<CommandEmpty>`. The filter query works
 * uncontrolled (`defaultQuery`) or with `v-model:query`; running a command
 * emits `command` with `(value, item)`. Place inside a `<dialog>` to use
 * `hotkey`.
 */
export const Command = defineComponent({
  name: 'HlCommand',
  inheritAttrs: false,
  props: commandProps,
  emits: ['update:query', 'command'],
  setup(props, { slots, attrs, emit }) {
    const host = ref<HTMLElement | null>(null);
    const { value: query, set } = useControlled<string | undefined, 'update:query'>(props, emit, {
      prop: 'query',
      event: 'update:query',
      default: props.defaultQuery,
    });
    const api = useEnhancer(
      host,
      enhanceCommand,
      () => ({
        hotkey: props.hotkey,
        defaultValue: query.value,
        onValueChange: set,
        onCommand: (value, item) => emit('command', value, item),
      }),
      () => props.hotkey,
    );
    useApiSync<CommandApi, string | undefined>(
      api,
      query,
      (a) => a.value,
      (a, v) => a.setValue(v),
    );
    return () =>
      h(
        'div',
        { ...attrs, 'data-hl-command': '', 'data-hl-command-hotkey': props.hotkey, ref: host },
        slots.default?.(),
      );
  },
});

const commandInputProps = {
  styled: { type: Boolean, default: true },
} as const;

/** Props for {@link CommandInput}. */
export type CommandInputProps = ExtractPublicPropTypes<typeof commandInputProps>;

/** The palette search field. */
export const CommandInput = defineComponent({
  name: 'HlCommandInput',
  inheritAttrs: false,
  props: commandInputProps,
  setup(props, { attrs }) {
    return () =>
      h('input', {
        ...attrs,
        class: cx(props.styled && 'hl-input', attrs.class as string),
        'data-hl-command-input': '',
      });
  },
});

/** Props for {@link CommandList}. */
export type CommandListProps = Record<never, never>;

/** The scrollable list of commands (`role="listbox"`). */
export const CommandList = defineComponent({
  name: 'HlCommandList',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h('div', { ...attrs, 'data-hl-command-list': '', role: 'listbox' }, slots.default?.());
  },
});

const commandGroupProps = {
  /** Group heading; the `label` slot takes precedence. */
  label: { type: String, default: undefined },
} as const;

/** Props for {@link CommandGroup}. */
export type CommandGroupProps = ExtractPublicPropTypes<typeof commandGroupProps>;

/** A labelled group of commands. */
export const CommandGroup = defineComponent({
  name: 'HlCommandGroup',
  inheritAttrs: false,
  props: commandGroupProps,
  setup(props, { slots, attrs }) {
    return () => {
      const label = slots.label?.() ?? props.label;
      return h('div', { ...attrs, 'data-hl-command-group': '' }, [
        label ? h('div', { class: 'hl-command-group-label', role: 'presentation' }, label) : null,
        slots.default?.(),
      ]);
    };
  },
});

const commandItemProps = {
  value: { type: String, required: true },
  /** Extra search terms matched by the filter. */
  keywords: { type: String, default: undefined },
} as const;

/** Props for {@link CommandItem}. */
export type CommandItemProps = ExtractPublicPropTypes<typeof commandItemProps>;

/** A runnable command (`role="option"`). */
export const CommandItem = defineComponent({
  name: 'HlCommandItem',
  inheritAttrs: false,
  props: commandItemProps,
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

/** Props for {@link CommandEmpty}. */
export type CommandEmptyProps = Record<never, never>;

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

import { describe, it, expect } from 'vitest';
import { defineComponent, h, nextTick, type Component } from 'vue';
import { mount } from '@vue/test-utils';
import { axe } from 'vitest-axe';
import { Tabs, TabList, Tab, TabPanel } from './components/tabs.js';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownGroup,
  DropdownSeparator,
} from './components/dropdown.js';
import { Menu, MenuItem, MenuSubmenu } from './components/menu.js';
import { Breadcrumb, BreadcrumbItem } from './components/breadcrumb.js';
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from './components/combobox.js';
import { Command, CommandInput, CommandList, CommandItem } from './components/command.js';
import { Accordion, AccordionItem, Disclosure } from './components/disclosure.js';
import { Modal, ModalBody, Drawer } from './components/overlay.js';
import { SegmentedControl } from './components/forms.js';
import { Button } from './components/button.js';
import { Alert, Skeleton } from './components/feedback.js';
import { Table } from './components/data.js';

async function violationIds(el: Element): Promise<string[]> {
  const results = await axe(el, {
    rules: { region: { enabled: false }, 'color-contrast': { enabled: false } },
  });
  return results.violations.map((v) => v.id);
}

/**
 * Mount `render` with a reactive `state` object, the way a parent using
 * `v-model` would. Returns the wrapper plus the live state.
 */
function mountWith<S extends object>(state: S, render: (state: S) => ReturnType<typeof h>) {
  const wrapper = mount(
    defineComponent({
      data: () => ({ ...state }),
      render() {
        return render(this.$data as S);
      },
    }),
    { attachTo: document.body },
  );
  return { wrapper, state: wrapper.vm.$data as S };
}

const tabs = (props: Record<string, unknown>) =>
  h(Tabs, props, {
    default: () => [
      h(TabList, null, {
        default: () => [
          h(Tab, { value: 'one' }, () => 'One'),
          h(Tab, { value: 'two' }, () => 'Two'),
        ],
      }),
      h(TabPanel, () => 'First'),
      h(TabPanel, () => 'Second'),
    ],
  });

describe('Tabs', () => {
  it('renders selection state server-side (no enhancer flash)', () => {
    const wrapper = mount({ render: () => tabs({ defaultValue: 'two' }) });
    const [one, two] = wrapper.findAll('[role="tab"]');
    expect(one.attributes('aria-selected')).toBe('false');
    expect(one.attributes('tabindex')).toBe('-1');
    expect(two.attributes('aria-selected')).toBe('true');
    expect(two.attributes('aria-controls')).toBe(
      wrapper.findAll('[role="tabpanel"]')[1].attributes('id'),
    );
    const panels = wrapper.findAll('[role="tabpanel"]');
    expect(panels[0].attributes('hidden')).toBeDefined();
    expect(panels[1].attributes('hidden')).toBeUndefined();
  });

  it('is uncontrolled by default and emits update:modelValue', async () => {
    const seen: string[] = [];
    const wrapper = mount(
      { render: () => tabs({ 'onUpdate:modelValue': (v: string) => seen.push(v) }) },
      { attachTo: document.body },
    );
    const items = wrapper.findAll('[role="tab"]');
    expect(items[0].attributes('aria-selected')).toBe('true');
    await items[1].trigger('click');
    expect(items[1].attributes('aria-selected')).toBe('true');
    expect(seen).toEqual(['two']);
    wrapper.unmount();
  });

  it('renumbers index-valued tabs and panels when a v-for changes', async () => {
    const { wrapper, state } = mountWith({ tabs: ['One', 'Two', 'Three'] }, (s) =>
      h(Tabs, { defaultValue: '1' }, () => [
        h(TabList, null, () => s.tabs.map((label) => h(Tab, { key: label }, () => label))),
        ...s.tabs.map((label) => h(TabPanel, { key: label }, () => `${label} panel`)),
      ]),
    );
    const tabs = () => wrapper.findAll('[role="tab"]');
    const panels = () => wrapper.findAll('[role="tabpanel"]');
    expect(tabs()[1].attributes('aria-selected')).toBe('true');
    state.tabs = ['Two', 'Three'];
    await nextTick();
    await nextTick();
    // Positional values: the tab now at index 1 ("Three") holds value "1".
    expect(tabs()).toHaveLength(2);
    expect(tabs()[1].text()).toBe('Three');
    expect(tabs()[1].attributes('aria-selected')).toBe('true');
    expect(tabs()[1].attributes('aria-controls')).toBe(panels()[1].attributes('id'));
    expect(panels()[0].attributes('hidden')).toBeDefined();
    expect(panels()[1].attributes('hidden')).toBeUndefined();
    wrapper.unmount();
  });

  it('supports v-model', async () => {
    const { wrapper, state } = mountWith({ tab: 'two' }, (s) =>
      tabs({ modelValue: s.tab, 'onUpdate:modelValue': (v: string) => (s.tab = v) }),
    );
    const items = wrapper.findAll('[role="tab"]');
    expect(items[1].attributes('aria-selected')).toBe('true');
    await items[0].trigger('click');
    expect(state.tab).toBe('one');
    state.tab = 'two';
    await nextTick();
    expect(items[1].attributes('aria-selected')).toBe('true');
    expect(wrapper.findAll('[role="tabpanel"]')[1].attributes('hidden')).toBeUndefined();
    wrapper.unmount();
  });
});

describe('Modal', () => {
  it('opens via the open prop and reports closes', async () => {
    const { wrapper, state } = mountWith({ open: false }, (s) =>
      h(
        Modal,
        { open: s.open, 'onUpdate:open': (v: boolean) => (s.open = v) },
        { default: () => h(ModalBody, () => 'Body') },
      ),
    );
    const dialog = wrapper.get('dialog').element as HTMLDialogElement;
    expect(dialog.open).toBe(false);
    state.open = true;
    await nextTick();
    expect(dialog.open).toBe(true);
    dialog.close();
    await nextTick();
    expect(state.open).toBe(false);
    wrapper.unmount();
  });

  it('opens uncontrolled with defaultOpen', () => {
    const wrapper = mount(Modal, { props: { defaultOpen: true }, attachTo: document.body });
    expect((wrapper.element as HTMLDialogElement).open).toBe(true);
    wrapper.unmount();
  });

  it('Drawer renders a logical side', () => {
    const wrapper = mount(Drawer, { props: { side: 'start' } });
    expect(wrapper.attributes('data-hl-side')).toBe('start');
    expect(mount(Drawer).attributes('data-hl-side')).toBe('end');
  });
});

const dropdown = (props: Record<string, unknown>, items?: () => unknown[]) =>
  h(Dropdown, props, {
    default: () => [
      h(DropdownTrigger, () => 'Actions'),
      h(DropdownMenu, null, {
        default: items ?? (() => [h(DropdownItem, { value: 'edit' }, () => 'Edit')]),
      }),
    ],
  });

describe('Dropdown', () => {
  it('renders popover + popovertarget so it works before hydration', () => {
    const wrapper = mount({ render: () => dropdown({}) });
    const menu = wrapper.get('[data-hl-dropdown-menu]');
    expect(menu.attributes('popover')).toBe('auto');
    expect(menu.attributes('id')).toBeTruthy();
    expect(wrapper.get('[data-hl-dropdown-trigger]').attributes('popovertarget')).toBe(
      menu.attributes('id'),
    );
  });

  it('is uncontrolled by default and emits update:open + select', async () => {
    const opens: boolean[] = [];
    const selected: unknown[][] = [];
    const wrapper = mount(
      {
        render: () =>
          dropdown({
            'onUpdate:open': (v: boolean) => opens.push(v),
            onSelect: (...args: unknown[]) => selected.push(args),
          }),
      },
      { attachTo: document.body },
    );
    const trigger = wrapper.get('[data-hl-dropdown-trigger]');
    expect(trigger.attributes('aria-expanded')).toBe('false');
    await trigger.trigger('click');
    expect(trigger.attributes('aria-expanded')).toBe('true');
    await wrapper.get('[role="menuitem"]').trigger('click');
    expect(opens).toEqual([true, false]);
    expect(selected[0][0]).toBe('edit');
    wrapper.unmount();
  });

  it('supports v-model:open', async () => {
    const { wrapper, state } = mountWith({ open: false }, (s) =>
      dropdown({ open: s.open, 'onUpdate:open': (v: boolean) => (s.open = v) }),
    );
    const trigger = wrapper.get('[data-hl-dropdown-trigger]');
    state.open = true;
    await nextTick();
    expect(trigger.attributes('aria-expanded')).toBe('true');
    await trigger.trigger('click');
    expect(state.open).toBe(false);
    wrapper.unmount();
  });

  it('DropdownItem checkbox toggles aria-checked and fires click and select', async () => {
    const clicks: Event[] = [];
    const selects: unknown[][] = [];
    const wrapper = mount(
      {
        render: () =>
          dropdown({ closeOnSelect: false }, () => [
            h(
              DropdownItem,
              {
                role: 'menuitemcheckbox',
                value: 'bold',
                onClick: (e: Event) => clicks.push(e),
                onSelect: (...args: unknown[]) => selects.push(args),
              },
              () => 'Bold',
            ),
            h(DropdownGroup, { label: 'Size' }, () => [
              h(DropdownItem, { role: 'menuitemradio', value: 'sm', checked: true }, () => 'Small'),
              h(DropdownItem, { role: 'menuitemradio', value: 'lg' }, () => 'Large'),
            ]),
            h(DropdownSeparator),
            h(DropdownItem, { value: 'off', disabled: true }, () => 'Disabled'),
          ]),
      },
      { attachTo: document.body },
    );
    const item = wrapper.get('[role="menuitemcheckbox"]');
    expect(item.attributes('aria-checked')).toBe('false');
    await item.trigger('click');
    expect(item.attributes('aria-checked')).toBe('true');
    expect(clicks).toHaveLength(1);
    // Same (value, item, checked) shape as the root Dropdown's `select`.
    expect(selects).toEqual([['bold', item.element, true]]);
    await item.trigger('click');
    expect(item.attributes('aria-checked')).toBe('false');
    expect(selects[1]).toEqual(['bold', item.element, false]);

    const group = wrapper.get('[role="group"]');
    expect(group.attributes('aria-label')).toBe('Size');
    const radios = group.findAll('[role="menuitemradio"]');
    expect(radios[0].attributes('aria-checked')).toBe('true');
    await radios[1].trigger('click');
    expect(radios[0].attributes('aria-checked')).toBe('false');
    expect(radios[1].attributes('aria-checked')).toBe('true');
    expect(wrapper.get('[role="separator"]').classes()).toContain('hl-dropdown-separator');
    expect(wrapper.get('[data-hl-value="off"]').attributes('disabled')).toBeDefined();
    wrapper.unmount();
  });
});

const menu = (props: Record<string, unknown>) =>
  h(Menu, props, {
    default: () => [
      h(MenuItem, { href: '/' }, () => 'Home'),
      h(MenuSubmenu, { label: 'File', value: 'file' }, () => [
        h(MenuItem, { value: 'new' }, () => 'New'),
      ]),
    ],
  });

describe('Menu', () => {
  it('renders a menubar with roving tabindex and opens submenus uncontrolled', async () => {
    const seen: unknown[] = [];
    const wrapper = mount(
      { render: () => menu({ 'onUpdate:modelValue': (v: unknown) => seen.push(v) }) },
      { attachTo: document.body },
    );
    expect(wrapper.find('[role="menubar"]').exists()).toBe(true);
    const items = wrapper.findAll('[role="menubar"] > li > [role="menuitem"]');
    expect(items[0].attributes('tabindex')).toBe('0');
    expect(items[1].attributes('aria-haspopup')).toBe('menu');
    expect(items[1].attributes('aria-expanded')).toBe('false');
    await items[1].trigger('click');
    expect(items[1].attributes('aria-expanded')).toBe('true');
    expect(seen).toEqual(['file']);
    wrapper.unmount();
  });

  it('supports v-model for the open submenu and emits select', async () => {
    const selected: unknown[] = [];
    const { wrapper, state } = mountWith({ open: null as string | null }, (s) =>
      menu({
        modelValue: s.open,
        'onUpdate:modelValue': (v: string | null) => (s.open = v),
        onSelect: (v: string) => selected.push(v),
      }),
    );
    const file = wrapper.findAll('[role="menubar"] > li > [role="menuitem"]')[1];
    const submenu = wrapper.get('[data-hl-submenu]');
    expect(submenu.attributes('hidden')).toBeDefined();
    state.open = 'file';
    await nextTick();
    expect(file.attributes('aria-expanded')).toBe('true');
    expect(submenu.attributes('hidden')).toBeUndefined();
    await submenu.get('[role="menuitem"]').trigger('click');
    expect(selected).toEqual(['new']);
    expect(state.open).toBeNull();
    wrapper.unmount();
  });
});

const command = (props: Record<string, unknown>) =>
  h(Command, props, {
    default: () => [
      h(CommandInput),
      h(CommandList, null, {
        default: () => [
          h(CommandItem, { value: 'open' }, () => 'Open file'),
          h(CommandItem, { value: 'save' }, () => 'Save file'),
        ],
      }),
    ],
  });

describe('Command', () => {
  it('filters uncontrolled from defaultQuery and emits update:query and command', async () => {
    const queries: string[] = [];
    const commands: string[] = [];
    const wrapper = mount(
      {
        render: () =>
          command({
            defaultQuery: 'save',
            'onUpdate:query': (q: string) => queries.push(q),
            onCommand: (v: string) => commands.push(v),
          }),
      },
      { attachTo: document.body },
    );
    const input = wrapper.get('input');
    expect((input.element as HTMLInputElement).value).toBe('save');
    const [open, save] = wrapper.findAll('[role="option"]');
    expect(open.attributes('hidden')).toBeDefined();
    expect(save.attributes('hidden')).toBeUndefined();
    await input.setValue('op');
    expect(queries).toEqual(['op']);
    await open.trigger('click');
    expect(commands).toEqual(['open']);
    wrapper.unmount();
  });

  it('supports v-model:query', async () => {
    const { wrapper, state } = mountWith({ q: '' }, (s) =>
      command({ query: s.q, 'onUpdate:query': (v: string) => (s.q = v) }),
    );
    const input = wrapper.get('input');
    state.q = 'save';
    await nextTick();
    expect((input.element as HTMLInputElement).value).toBe('save');
    expect(wrapper.findAll('[role="option"]')[0].attributes('hidden')).toBeDefined();
    await input.setValue('');
    expect(state.q).toBe('');
    wrapper.unmount();
  });
});

const combobox = (props: Record<string, unknown>) =>
  h(Combobox, props, {
    default: () => [
      h(ComboboxInput, { placeholder: 'Fruit' }),
      h(ComboboxList, null, {
        default: () => [
          h(ComboboxOption, { value: 'apple' }, () => 'Apple'),
          h(ComboboxOption, { value: 'banana' }, () => 'Banana'),
          h(ComboboxOption, { value: 'cherry', disabled: true }, () => 'Cherry'),
        ],
      }),
    ],
  });

describe('Combobox', () => {
  it('wires ARIA and commits uncontrolled selections', async () => {
    const values: string[] = [];
    const opens: boolean[] = [];
    const wrapper = mount(
      {
        render: () =>
          combobox({
            'onUpdate:modelValue': (v: string) => values.push(v),
            'onUpdate:open': (v: boolean) => opens.push(v),
          }),
      },
      { attachTo: document.body },
    );
    const input = wrapper.get('input');
    expect(input.attributes('role')).toBe('combobox');
    expect(wrapper.findAll('[role="option"]')[2].attributes('aria-disabled')).toBe('true');
    await input.trigger('focus');
    expect(opens).toEqual([true]);
    await wrapper.findAll('[role="option"]')[1].trigger('click');
    expect(values).toEqual(['banana']);
    expect((input.element as HTMLInputElement).value).toBe('banana');
    wrapper.unmount();
  });

  it('supports v-model', async () => {
    const { wrapper, state } = mountWith({ value: 'apple' }, (s) =>
      combobox({ modelValue: s.value, 'onUpdate:modelValue': (v: string) => (s.value = v) }),
    );
    const input = wrapper.get('input').element as HTMLInputElement;
    expect(input.value).toBe('apple');
    state.value = 'banana';
    await nextTick();
    expect(input.value).toBe('banana');
    wrapper.unmount();
  });
});

const accordion = (props: Record<string, unknown>) =>
  h(Accordion, props, {
    default: () => [
      h(AccordionItem, { value: 'a', title: 'A' }, () => 'Alpha'),
      h(AccordionItem, { value: 'b', title: 'B' }, () => 'Beta'),
    ],
  });

describe('Accordion', () => {
  it('renders defaultValue open and emits update:modelValue', async () => {
    const seen: string[][] = [];
    const wrapper = mount(
      {
        render: () =>
          accordion({ defaultValue: ['a'], 'onUpdate:modelValue': (v: string[]) => seen.push(v) }),
      },
      { attachTo: document.body },
    );
    const [a, b] = wrapper.findAll('details').map((d) => d.element as HTMLDetailsElement);
    expect(a.open).toBe(true);
    expect(b.open).toBe(false);
    b.open = true;
    b.dispatchEvent(new Event('toggle'));
    await nextTick();
    expect(seen).toEqual([['b']]);
    expect(a.open).toBe(false);
    wrapper.unmount();
  });

  it('supports v-model', async () => {
    const { wrapper, state } = mountWith({ open: [] as string[] }, (s) =>
      accordion({ modelValue: s.open, 'onUpdate:modelValue': (v: string[]) => (s.open = v) }),
    );
    const [a, b] = wrapper.findAll('details').map((d) => d.element as HTMLDetailsElement);
    state.open = ['b'];
    await nextTick();
    expect(b.open).toBe(true);
    expect(a.open).toBe(false);
    wrapper.unmount();
  });

  it('renumbers index-valued items when a v-for changes', async () => {
    const { wrapper, state } = mountWith({ items: ['A', 'B'] }, (s) =>
      h(Accordion, { defaultValue: ['1'] }, () =>
        s.items.map((label) => h(AccordionItem, { key: label, title: label }, () => label)),
      ),
    );
    const details = () => wrapper.findAll('details').map((d) => d.element as HTMLDetailsElement);
    expect(details()[1].open).toBe(true);
    state.items = ['Z', 'A', 'B'];
    await nextTick();
    await nextTick();
    // Values are positional, so index 1 is now "A" and both Vue and the
    // enhancer agree it's the open one.
    expect(details()).toHaveLength(3);
    expect(details()[1].open).toBe(true);
    expect(details()[2].open).toBe(false);
    wrapper.unmount();
  });

  it('Disclosure forwards name for native exclusive groups', () => {
    const wrapper = mount(Disclosure, { props: { name: 'faq', title: 'Q' } });
    expect(wrapper.get('details').attributes('name')).toBe('faq');
    wrapper.unmount();
  });
});

describe('SegmentedControl', () => {
  const options = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
  ];

  it('selects the first option uncontrolled and emits changes', async () => {
    const seen: string[] = [];
    const wrapper = mount(SegmentedControl, {
      props: { options, 'onUpdate:modelValue': (v: string) => seen.push(v) },
    });
    const radios = wrapper.findAll('input');
    expect((radios[0].element as HTMLInputElement).checked).toBe(true);
    await radios[1].setValue(true);
    expect((radios[1].element as HTMLInputElement).checked).toBe(true);
    expect(seen).toEqual(['week']);
  });

  it('supports v-model', async () => {
    const { wrapper, state } = mountWith({ v: 'week' }, (s) =>
      h(SegmentedControl, {
        options,
        modelValue: s.v,
        'onUpdate:modelValue': (v: string) => (s.v = v),
      }),
    );
    const radios = wrapper.findAll('input');
    expect((radios[1].element as HTMLInputElement).checked).toBe(true);
    state.v = 'day';
    await nextTick();
    expect((radios[0].element as HTMLInputElement).checked).toBe(true);
    wrapper.unmount();
  });
});

describe('primitives', () => {
  it('Table renders modifiers and forwards attrs', () => {
    const wrapper = mount(Table, {
      props: { striped: true, hover: true, align: 'end', size: 'sm' },
      attrs: { class: 'mine', id: 't1' },
      slots: { default: () => h('tbody', [h('tr', [h('td', 'cell')])]) },
    });
    const table = wrapper.get('table');
    expect(table.classes()).toEqual(['hl-table', 'mine']);
    expect(table.attributes('id')).toBe('t1');
    expect(table.attributes('data-hl-striped')).toBeDefined();
    expect(table.attributes('data-hl-hover')).toBeDefined();
    expect(table.attributes('data-hl-align')).toBe('end');
    expect(table.attributes('data-hl-size')).toBe('sm');
    expect(table.text()).toBe('cell');
  });

  it('Skeleton renders shape and sizes', () => {
    const wrapper = mount(Skeleton, { props: { shape: 'circle', width: 40, height: '2rem' } });
    expect(wrapper.attributes('data-hl-shape')).toBe('circle');
    expect(wrapper.attributes('style')).toContain('inline-size: 40px');
    expect(wrapper.attributes('style')).toContain('block-size: 2rem');
  });

  it('Breadcrumb renders a labelled nav with current page', () => {
    const wrapper = mount({
      render: () =>
        h(Breadcrumb, null, {
          default: () => [
            h(BreadcrumbItem, { href: '/' }, () => 'Home'),
            h(BreadcrumbItem, { current: true }, () => 'Components'),
          ],
        }),
    });
    const nav = wrapper.get('nav');
    expect(nav.attributes('aria-label')).toBe('Breadcrumb');
    expect(nav.get('[aria-current="page"]').text()).toBe('Components');
  });

  it('Button and Alert have no axe violations', async () => {
    const button = mount(Button, {
      props: { intent: 'primary' },
      slots: { default: () => 'Save' },
    });
    expect(await violationIds(button.element)).toEqual([]);
    const alert = mount(Alert as Component, {
      props: { intent: 'info', title: 'Heads up' },
      slots: { default: () => 'Body' },
    });
    expect(await violationIds(alert.element)).toEqual([]);
  });
});

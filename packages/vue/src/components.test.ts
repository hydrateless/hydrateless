import { describe, it, expect } from 'vitest';
import { h } from 'vue';
import { mount } from '@vue/test-utils';
import { axe } from 'vitest-axe';
import { Tabs, TabList, Tab, TabPanel } from './components/tabs.js';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSeparator,
} from './components/dropdown.js';
import { Menu, MenuItem } from './components/menu.js';
import { Breadcrumb, BreadcrumbItem } from './components/breadcrumb.js';
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from './components/combobox.js';
import { Modal, ModalBody } from './components/overlay.js';
import { Field, FieldLabel, FieldHelp, Input, RadioGroup, Radio } from './components/forms.js';
import { Button } from './components/button.js';
import { Alert } from './components/feedback.js';

async function violationIds(el: Element): Promise<string[]> {
  const results = await axe(el, {
    rules: { region: { enabled: false }, 'color-contrast': { enabled: false } },
  });
  return results.violations.map((v) => v.id);
}

describe('@hydrateless/vue components', () => {
  it('Tabs wires ARIA roles and selects the first tab', () => {
    const wrapper = mount(
      {
        render: () =>
          h(Tabs, null, {
            default: () => [
              h(TabList, null, { default: () => [h(Tab, () => 'One'), h(Tab, () => 'Two')] }),
              h(TabPanel, () => 'First'),
              h(TabPanel, () => 'Second'),
            ],
          }),
      },
      { attachTo: document.body },
    );
    const tabs = wrapper.findAll('[role="tab"]');
    expect(tabs).toHaveLength(2);
    expect(tabs[0].attributes('aria-selected')).toBe('true');
    expect(tabs[1].attributes('aria-selected')).toBe('false');
    wrapper.unmount();
  });

  it('Dropdown opens on trigger click and emits select', async () => {
    let selected = false;
    const wrapper = mount(
      {
        render: () =>
          h(Dropdown, null, {
            default: () => [
              h(DropdownTrigger, () => 'Actions'),
              h(DropdownMenu, null, {
                default: () => [
                  h(DropdownItem, { onSelect: () => (selected = true) }, () => 'Edit'),
                  h(DropdownSeparator),
                  h(DropdownItem, () => 'Delete'),
                ],
              }),
            ],
          }),
      },
      { attachTo: document.body },
    );
    const trigger = wrapper.get('[data-hl-dropdown-trigger]');
    expect(trigger.attributes('aria-expanded')).toBe('false');
    await trigger.trigger('click');
    expect(trigger.attributes('aria-expanded')).toBe('true');
    await wrapper.findAll('[role="menuitem"]')[0].trigger('click');
    expect(selected).toBe(true);
    wrapper.unmount();
  });

  it('Menu renders a menubar with roving tabindex', () => {
    const wrapper = mount(
      {
        render: () =>
          h(Menu, null, {
            default: () => [
              h(MenuItem, { href: '/' }, () => 'Home'),
              h(MenuItem, null, { default: () => 'Edit' }),
            ],
          }),
      },
      { attachTo: document.body },
    );
    expect(wrapper.find('[role="menubar"]').exists()).toBe(true);
    const items = wrapper.findAll('[role="menuitem"]');
    expect(items[0].attributes('tabindex')).toBe('0');
    wrapper.unmount();
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

  it('Combobox wires combobox ARIA and emits the committed value', async () => {
    let value = '';
    const wrapper = mount(
      {
        render: () =>
          h(
            Combobox,
            { onSelect: (v: string) => (value = v) },
            {
              default: () => [
                h(ComboboxInput, { placeholder: 'Fruit' }),
                h(ComboboxList, null, {
                  default: () => [
                    h(ComboboxOption, { value: 'apple' }, () => 'Apple'),
                    h(ComboboxOption, { value: 'banana' }, () => 'Banana'),
                  ],
                }),
              ],
            },
          ),
      },
      { attachTo: document.body },
    );
    const input = wrapper.get('input');
    expect(input.attributes('role')).toBe('combobox');
    await input.trigger('focus');
    await wrapper.findAll('[role="option"]')[1].trigger('click');
    expect(value).toBe('banana');
    wrapper.unmount();
  });

  it('Tabs supports v-model', async () => {
    const wrapper = mount(
      {
        data: () => ({ tab: 'two' }),
        render(this: { tab: string }) {
          return h(
            Tabs,
            { modelValue: this.tab, 'onUpdate:modelValue': (v: string) => (this.tab = v) },
            {
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
            },
          );
        },
      },
      { attachTo: document.body },
    );
    const tabs = wrapper.findAll('[role="tab"]');
    expect(tabs[1].attributes('aria-selected')).toBe('true');

    // Clicking a tab updates the bound model.
    await tabs[0].trigger('click');
    expect(wrapper.vm.tab).toBe('one');

    // Driving the model selects the tab.
    await wrapper.setData({ tab: 'two' });
    expect(tabs[1].attributes('aria-selected')).toBe('true');
    wrapper.unmount();
  });

  it('Modal opens via the open prop', async () => {
    const wrapper = mount(
      {
        data: () => ({ open: false }),
        render(this: { open: boolean }) {
          return h(Modal, { open: this.open }, { default: () => h(ModalBody, () => 'Body') });
        },
      },
      { attachTo: document.body },
    );
    const dialog = wrapper.get('dialog').element as HTMLDialogElement;
    expect(dialog.open).toBe(false);
    await wrapper.setData({ open: true });
    expect(dialog.open).toBe(true);
    wrapper.unmount();
  });

  it('Input supports v-model', async () => {
    const wrapper = mount(
      {
        data: () => ({ value: '' }),
        render(this: { value: string }) {
          return h(Input, {
            modelValue: this.value,
            'onUpdate:modelValue': (v: string) => (this.value = v),
          });
        },
      },
      { attachTo: document.body },
    );
    await wrapper.get('input').setValue('hello');
    expect(wrapper.vm.value).toBe('hello');
    wrapper.unmount();
  });

  it('RadioGroup binds the selected value', async () => {
    const wrapper = mount(
      {
        data: () => ({ value: 'a' }),
        render(this: { value: string }) {
          return h(
            RadioGroup,
            { modelValue: this.value, 'onUpdate:modelValue': (v: string) => (this.value = v) },
            {
              default: () => [
                h(Radio, { value: 'a' }, () => 'A'),
                h(Radio, { value: 'b' }, () => 'B'),
              ],
            },
          );
        },
      },
      { attachTo: document.body },
    );
    const radios = wrapper.findAll('input[type="radio"]');
    await radios[1].trigger('change');
    expect(wrapper.vm.value).toBe('b');
    wrapper.unmount();
  });

  it('Field associates label, help, and control', async () => {
    const wrapper = mount({
      render: () =>
        h(Field, null, {
          default: () => [h(FieldLabel, () => 'Email'), h(Input), h(FieldHelp, () => 'Required')],
        }),
    });
    const input = wrapper.get('input');
    const label = wrapper.get('label');
    expect(label.attributes('for')).toBe(input.attributes('id'));
    expect(input.attributes('aria-describedby')).toContain(wrapper.get('p').attributes('id'));
    expect(await violationIds(wrapper.element)).toEqual([]);
  });

  it('Button and Alert have no axe violations', async () => {
    const button = mount(Button, {
      props: { intent: 'primary' },
      slots: { default: () => 'Save' },
    });
    expect(await violationIds(button.element)).toEqual([]);
    const alert = mount(Alert, {
      props: { intent: 'info', title: 'Heads up' },
      slots: { default: () => 'Body' },
    });
    expect(await violationIds(alert.element)).toEqual([]);
  });
});

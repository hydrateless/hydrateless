import { describe, it, expect } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { axe } from 'vitest-axe';
import {
  Field,
  FieldLabel,
  FieldHelp,
  FieldError,
  Input,
  Textarea,
  Select,
  Checkbox,
  Switch,
  Slider,
  RadioGroup,
  Radio,
  useField,
} from './components/forms.js';
import { ComboboxInput } from './components/combobox.js';
import { ToastRegion } from './components/feedback.js';
import { useToast } from './useToast.js';

async function violationIds(el: Element): Promise<string[]> {
  const results = await axe(el, {
    rules: { region: { enabled: false }, 'color-contrast': { enabled: false } },
  });
  return results.violations.map((v) => v.id);
}

describe('Field', () => {
  it('associates label, help, and control with sub-components', async () => {
    const wrapper = mount({
      render: () =>
        h(Field, null, {
          default: () => [h(FieldLabel, () => 'Email'), h(Input), h(FieldHelp, () => 'Required')],
        }),
    });
    const input = wrapper.get('input');
    const label = wrapper.get('label');
    expect(label.attributes('for')).toBe(input.attributes('id'));
    expect(input.attributes('aria-describedby')).toBe(wrapper.get('p').attributes('id'));
    expect(input.attributes('aria-invalid')).toBeUndefined();
    expect(await violationIds(wrapper.element)).toEqual([]);
  });

  it('renders label, description, and error from props and wires state', async () => {
    const wrapper = mount(
      defineComponent({
        data: () => ({ error: '' }),
        render() {
          return h(
            Field,
            { label: 'Name', description: 'Your full name', error: this.error, required: true },
            () => h(Input),
          );
        },
      }),
    );
    const input = wrapper.get('input');
    expect(wrapper.get('label').text()).toBe('Name');
    expect(input.attributes('required')).toBeDefined();
    expect(input.attributes('aria-invalid')).toBeUndefined();
    expect(input.attributes('aria-describedby')).toBe(wrapper.get('.hl-help').attributes('id'));

    await wrapper.setData({ error: 'Too short' });
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(wrapper.attributes('data-hl-invalid')).toBeDefined();
    const ids = input.attributes('aria-describedby')!.split(' ');
    expect(ids).toContain(wrapper.get('.hl-help').attributes('id'));
    expect(ids).toContain(wrapper.get('.hl-error').attributes('id'));
    expect(wrapper.get('.hl-error').attributes('role')).toBe('alert');
  });

  it('auto-wires every control kind, and none throws outside a Field', () => {
    const controls = [
      () => h(Input),
      () => h(Textarea),
      () => h(Select, () => h('option', 'A')),
      () => h(Checkbox, () => 'Agree'),
      () => h(Switch, () => 'On'),
      () => h(Slider),
      () => h(ComboboxInput),
    ];
    for (const control of controls) {
      const outside = mount({ render: control });
      const bare = outside.get('input, textarea, select');
      expect(bare.attributes('id')).toBeUndefined();
      expect(bare.attributes('aria-describedby')).toBeUndefined();

      const inside = mount({
        render: () =>
          h(Field, { invalid: true, required: true }, () => [
            h(FieldLabel, () => 'L'),
            control(),
            h(FieldError, () => 'Bad'),
          ]),
      });
      const el = inside.get('input, textarea, select');
      expect(el.attributes('id')).toBe(inside.get('label').attributes('for'));
      expect(el.attributes('aria-invalid')).toBe('true');
      expect(el.attributes('required')).toBeDefined();
      expect(el.attributes('aria-describedby')).toBe(inside.get('.hl-error').attributes('id'));
    }
  });

  it('exposes useField() for custom controls, null outside a Field', async () => {
    let seen: ReturnType<typeof useField> = null;
    const Custom = defineComponent({
      setup() {
        const field = useField();
        seen = field;
        return () =>
          h('div', { class: 'custom', id: field?.id, 'aria-invalid': field?.invalid || undefined });
      },
    });
    expect(mount(Custom).attributes('id')).toBeUndefined();
    expect(seen).toBeNull();

    const wrapper = mount(
      defineComponent({
        data: () => ({ invalid: false }),
        render() {
          return h(Field, { id: 'custom', invalid: this.invalid }, () => h(Custom));
        },
      }),
    );
    expect(wrapper.get('.custom').attributes('id')).toBe('custom');
    expect(seen!.required).toBe(false);
    await wrapper.setData({ invalid: true });
    expect(seen!.invalid).toBe(true);
    expect(wrapper.get('.custom').attributes('aria-invalid')).toBe('true');
  });
});

describe('controls', () => {
  it('Input supports v-model', async () => {
    const wrapper = mount(
      defineComponent({
        data: () => ({ value: '' }),
        render() {
          return h(Input, {
            modelValue: this.value,
            'onUpdate:modelValue': (v: string) => (this.value = v),
          });
        },
      }),
    );
    await wrapper.get('input').setValue('hello');
    expect(wrapper.vm.value).toBe('hello');
  });

  it('RadioGroup binds the selected value', async () => {
    const wrapper = mount(
      defineComponent({
        data: () => ({ value: 'a' }),
        render() {
          return h(
            RadioGroup,
            { modelValue: this.value, 'onUpdate:modelValue': (v: string) => (this.value = v) },
            () => [h(Radio, { value: 'a' }, () => 'A'), h(Radio, { value: 'b' }, () => 'B')],
          );
        },
      }),
    );
    const radios = wrapper.findAll('input[type="radio"]');
    expect(radios[0].attributes('name')).toBe(radios[1].attributes('name'));
    await radios[1].trigger('change');
    expect(wrapper.vm.value).toBe('b');
  });

  it('RadioGroup works uncontrolled with defaultValue and reflects orientation', async () => {
    const wrapper = mount({
      render: () =>
        h(RadioGroup, { defaultValue: 'b', orientation: 'horizontal' }, () => [
          h(Radio, { value: 'a' }, () => 'A'),
          h(Radio, { value: 'b' }, () => 'B'),
        ]),
    });
    const group = wrapper.get('[role="radiogroup"]');
    expect(group.attributes('data-hl-orientation')).toBe('horizontal');
    expect(group.attributes('aria-orientation')).toBe('horizontal');
    const radios = wrapper.findAll<HTMLInputElement>('input[type="radio"]');
    expect(radios[1].element.checked).toBe(true);
    await radios[0].trigger('change');
    expect(radios[0].element.checked).toBe(true);
    expect(radios[1].element.checked).toBe(false);
  });
});

describe('Toast', () => {
  it('ToastRegion enhances on mount and useToast shows intents into it', async () => {
    const region = mount(ToastRegion, { attachTo: document.body });
    expect(region.attributes('data-hl-toast-region')).toBeDefined();
    expect(region.attributes('aria-live')).toBe('polite');

    const Comp = defineComponent({
      setup() {
        const toast = useToast();
        return () =>
          h('button', { onClick: () => toast.show('Saved', { intent: 'danger', duration: 0 }) });
      },
    });
    const wrapper = mount(Comp, { attachTo: document.body });
    await wrapper.get('button').trigger('click');
    await nextTick();
    const toast = region.element.querySelector('[data-hl-toast]')!;
    expect(toast.textContent).toContain('Saved');
    expect(toast.getAttribute('data-hl-intent')).toBe('danger');
    expect(toast.getAttribute('role')).toBe('alert');
    expect(document.querySelectorAll('[data-hl-toast-region]')).toHaveLength(1);
    wrapper.unmount();
    region.unmount();
  });
});

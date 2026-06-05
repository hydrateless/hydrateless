import { describe, it, expect } from 'vitest';
import { defineComponent, h, withDirectives } from 'vue';
import { mount } from '@vue/test-utils';
import { vHlTabs, vHlDropdown } from './directives.js';
import { useToast } from './useToast.js';

describe('@hydrateless/vue', () => {
  it('v-hl-tabs wires ARIA roles', () => {
    const Comp = defineComponent({
      render() {
        return withDirectives(
          h('div', { 'data-hl-tabs': '' }, [
            h('div', { role: 'tablist' }, [
              h('button', { role: 'tab' }, 'A'),
              h('button', { role: 'tab' }, 'B'),
            ]),
            h('div', { role: 'tabpanel' }, 'Panel A'),
            h('div', { role: 'tabpanel' }, 'Panel B'),
          ]),
          [[vHlTabs]],
        );
      },
    });

    const wrapper = mount(Comp, { attachTo: document.body });
    const tabs = wrapper.findAll('[role="tab"]');
    expect(tabs[0].attributes('aria-selected')).toBe('true');
    expect(tabs[1].attributes('aria-selected')).toBe('false');
    wrapper.unmount();
  });

  it('v-hl-dropdown toggles aria-expanded on click', async () => {
    const Comp = defineComponent({
      render() {
        return withDirectives(
          h('div', { 'data-hl-dropdown': '' }, [
            h('button', { 'data-hl-dropdown-trigger': '' }, 'Menu'),
            h('ul', { 'data-hl-dropdown-menu': '' }, [
              h('li', [h('button', { role: 'menuitem' }, 'Edit')]),
            ]),
          ]),
          [[vHlDropdown]],
        );
      },
    });

    const wrapper = mount(Comp, { attachTo: document.body });
    const trigger = wrapper.get('[data-hl-dropdown-trigger]');
    expect(trigger.attributes('aria-expanded')).toBe('false');
    await trigger.trigger('click');
    expect(trigger.attributes('aria-expanded')).toBe('true');
    wrapper.unmount();
  });

  it('useToast shows a toast', async () => {
    const Comp = defineComponent({
      setup() {
        const toast = useToast();
        return () => h('button', { onClick: () => toast.show('Saved') }, 'show');
      },
    });

    const wrapper = mount(Comp, { attachTo: document.body });
    await wrapper.get('button').trigger('click');
    expect(document.querySelector('[data-hl-toast]')?.textContent).toContain('Saved');
    wrapper.unmount();
  });
});

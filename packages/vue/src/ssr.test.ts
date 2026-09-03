import { describe, it, expect } from 'vitest';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { Tabs, TabList, Tab, TabPanel } from './components/tabs.js';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from './components/dropdown.js';
import { Field, FieldHelp, FieldLabel, Input } from './components/forms.js';

const render = (vnode: ReturnType<typeof h>) =>
  renderToString(createSSRApp({ render: () => vnode }));

describe('server rendering', () => {
  it('Tabs emit selection state so hydration causes no flash', async () => {
    const html = await render(
      h(Tabs, { defaultValue: 'b' }, () => [
        h(TabList, () => [h(Tab, { value: 'a' }, () => 'A'), h(Tab, { value: 'b' }, () => 'B')]),
        h(TabPanel, () => 'Alpha'),
        h(TabPanel, () => 'Beta'),
      ]),
    );
    expect(html).toContain('role="tablist"');
    expect(html).toMatch(/aria-selected="false"[^>]*tabindex="-1"[^>]*>A</);
    expect(html).toMatch(/aria-selected="true"[^>]*tabindex="0"[^>]*>B</);
    expect(html).toMatch(/<div[^>]*role="tabpanel"[^>]*hidden[^>]*>Alpha</);
    expect(html).not.toMatch(/<div[^>]*role="tabpanel"[^>]*hidden[^>]*>Beta</);
  });

  it('Dropdown links trigger and popover menu by id', async () => {
    const html = await render(
      h(Dropdown, null, () => [
        h(DropdownTrigger, () => 'Menu'),
        h(DropdownMenu, () => [h(DropdownItem, { value: 'x' }, () => 'X')]),
      ]),
    );
    const id = html.match(/popovertarget="([^"]+)"/)?.[1];
    expect(id).toBeTruthy();
    expect(html).toContain(`id="${id}" popover="auto" role="menu"`);
  });

  it('Field wires controls to parts rendered later in the slot', async () => {
    const html = await render(
      h(Field, { required: true }, () => [
        h(FieldLabel, () => 'Email'),
        h(Input),
        h(FieldHelp, () => 'We never share it.'),
      ]),
    );
    const id = html.match(/<label for="([^"]+)"/)?.[1];
    expect(id).toBeTruthy();
    expect(html).toContain(`id="${id}" aria-describedby="${id}-help" required`);
    expect(html).toContain(`<p id="${id}-help"`);
  });
});

// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import TabsHarness from './harness/TabsHarness.svelte';
import AccordionHarness from './harness/AccordionHarness.svelte';
import DropdownHarness from './harness/DropdownHarness.svelte';
import FieldHarness from './harness/FieldHarness.svelte';
import TableHarness from './harness/TableHarness.svelte';
import TooltipHarness from './harness/TooltipHarness.svelte';

// Server output must already carry the state-dependent attributes so nothing
// flashes before the enhancers hydrate.
describe('@hydrateless/svelte server rendering', () => {
  it('Tabs renders aria-selected, tabindex, and hidden from the value', () => {
    const { body } = render(TabsHarness, { props: { defaultValue: 'two' } });
    expect(body).toContain('role="tablist"');
    expect(body).toMatch(/data-hl-value="one"[^>]*aria-selected="false"[^>]*tabindex="-1"/);
    expect(body).toMatch(/data-hl-value="two"[^>]*aria-selected="true"[^>]*tabindex="0"/);
    const panels = body.match(/<div[^>]*role="tabpanel"[^>]*>/g) ?? [];
    expect(panels).toHaveLength(2);
    expect(panels[0]).toContain('hidden');
    expect(panels[1]).not.toContain('hidden');
  });

  it('Accordion renders the open attribute for items in the value', () => {
    const { body } = render(AccordionHarness);
    const items = body.match(/<details[^>]*>/g) ?? [];
    expect(items).toHaveLength(2);
    expect(items[0]).toContain('open');
    expect(items[1]).not.toContain('open');
  });

  it('Dropdown renders popover and a matching popovertarget before hydration', () => {
    const { body } = render(DropdownHarness);
    const target = body.match(/popovertarget="([^"]+)"/)?.[1];
    expect(target).toBeTruthy();
    expect(body).toMatch(new RegExp(`<ul[^>]*id="${target}"[^>]*popover="auto"`));
    expect(body).toContain('role="group"');
    expect(body).toContain('aria-label="View"');
    expect(body).toMatch(/role="menuitemradio"[^>]*aria-checked="true"/);
    expect(body).toMatch(/data-hl-dropdown-trigger[^>]*aria-expanded="false"/);
  });

  it('Dropdown renders aria-expanded from defaultOpen', () => {
    const { body } = render(DropdownHarness, { props: { defaultOpen: true } });
    expect(body).toMatch(/data-hl-dropdown-trigger[^>]*aria-expanded="true"/);
  });

  it('Tooltip links a spread trigger to the tip without a browser', () => {
    const { body } = render(TooltipHarness);
    const tipId = body.match(/data-hl-tooltip="([^"]+)"/)?.[1];
    expect(tipId).toBeTruthy();
    expect(body).toMatch(new RegExp(`<button[^>]*aria-describedby="${tipId}"`));
    expect(body).toMatch(new RegExp(`<span[^>]*id="${tipId}"[^>]*role="tooltip"[^>]*hidden`));
    // The fallback child is only linked on the client.
    expect(body.match(/data-hl-tooltip=/g)).toHaveLength(1);
  });

  it('Field wires ids and required into controls without a browser', () => {
    const { body } = render(FieldHarness);
    const forId = body.match(/<label[^>]*for="([^"]+)"/)?.[1];
    expect(forId).toBeTruthy();
    expect(body).toMatch(new RegExp(`<input[^>]*id="${forId}"[^>]*required`));
    expect(body).toMatch(new RegExp(`aria-describedby="${forId}-help"`));
    expect(body).toMatch(/<textarea[^>]*id="bio-control"/);
  });

  it('Table renders its data attributes', () => {
    const { body } = render(TableHarness);
    expect(body).toMatch(
      /<table[^>]*class="hl-table report"[^>]*data-hl-striped[^>]*data-hl-hover[^>]*data-hl-align="end"[^>]*data-hl-size="sm"/,
    );
  });
});

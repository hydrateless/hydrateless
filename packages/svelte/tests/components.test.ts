import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import { axe } from 'vitest-axe';
import TabsHarness from './harness/TabsHarness.svelte';
import TabsBindHarness from './harness/TabsBindHarness.svelte';
import ComboboxHarness from './harness/ComboboxHarness.svelte';
import FieldHarness from './harness/FieldHarness.svelte';
import RadioHarness from './harness/RadioHarness.svelte';
import ModalHarness from './harness/ModalHarness.svelte';
import DropdownHarness from './harness/DropdownHarness.svelte';
import MenuHarness from './harness/MenuHarness.svelte';
import AccordionHarness from './harness/AccordionHarness.svelte';
import BreadcrumbHarness from './harness/BreadcrumbHarness.svelte';
import PaginationHarness from './harness/PaginationHarness.svelte';
import PresentationalHarness from './harness/PresentationalHarness.svelte';
import ControlsHarness from './harness/ControlsHarness.svelte';
import Button from '../src/components/Button.svelte';

async function violationIds(el: Element): Promise<string[]> {
  const results = await axe(el, {
    rules: { region: { enabled: false }, 'color-contrast': { enabled: false } },
  });
  return results.violations.map((v) => v.id);
}

describe('@hydrateless/svelte components', () => {
  it('Tabs wires ARIA roles and selects the first tab', () => {
    const { container } = render(TabsHarness);
    const tabs = container.querySelectorAll('[role="tab"]');
    expect(tabs).toHaveLength(2);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
  });

  it('Tabs binds value two-way', async () => {
    const { container, getByText, getByTestId } = render(TabsBindHarness);
    const tabs = container.querySelectorAll<HTMLElement>('[role="tab"]');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');

    // Clicking a tab updates the bound state.
    await fireEvent.click(tabs[0]);
    expect(getByTestId('value').textContent).toBe('one');

    // Driving the state selects the tab... and back again.
    await fireEvent.click(tabs[1]);
    expect(getByTestId('value').textContent).toBe('two');
    await fireEvent.click(getByText('go'));
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
  });

  it('Combobox commits a selected value via onValueChange', async () => {
    const { container, getByTestId } = render(ComboboxHarness);
    const input = container.querySelector('input')!;
    expect(input.getAttribute('role')).toBe('combobox');
    await fireEvent.focus(input);
    const option = container.querySelectorAll('[role="option"]')[1];
    await fireEvent.click(option);
    expect(getByTestId('value').textContent).toBe('banana');
    expect(input.value).toBe('banana');
  });

  it('Field associates label, help, and control', async () => {
    const { container } = render(FieldHarness);
    const input = container.querySelector('input')!;
    const label = container.querySelector('label')!;
    const help = container.querySelector('p')!;
    expect(label.getAttribute('for')).toBe(input.id);
    expect(input.getAttribute('aria-describedby')).toContain(help.id);
    expect(await violationIds(container)).toEqual([]);
  });

  it('RadioGroup binds the selected value', async () => {
    const { container, getByTestId } = render(RadioHarness);
    const radios = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    await fireEvent.click(radios[1]);
    expect(getByTestId('value').textContent).toBe('b');
    expect(radios[1].checked).toBe(true);
  });

  it('Modal opens via the open prop', async () => {
    const { container, getByText } = render(ModalHarness);
    const dialog = container.querySelector('dialog') as HTMLDialogElement;
    expect(dialog.open).toBe(false);
    await fireEvent.click(getByText('open'));
    expect(dialog.open).toBe(true);
  });

  it('Button has no axe violations', async () => {
    const { container } = render(Button, { props: { intent: 'primary', 'aria-label': 'Save' } });
    expect(await violationIds(container)).toEqual([]);
  });

  it('Dropdown wires the menu-button pattern and fires onSelect', async () => {
    const { container, getByTestId, getByText } = render(DropdownHarness);
    const trigger = getByText('Actions');
    expect(trigger.getAttribute('aria-haspopup')).toBe('true');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    const items = container.querySelectorAll('[role="menuitem"]');
    expect(items).toHaveLength(2);
    await fireEvent.click(items[0]);
    expect(getByTestId('selected').textContent).toBe('edit');
  });

  it('Menu exposes menubar roles and link/button items', () => {
    const { container } = render(MenuHarness);
    expect(container.querySelector('[role="menubar"]')).not.toBeNull();
    const items = container.querySelectorAll('[role="menuitem"]');
    expect(items).toHaveLength(2);
    expect(items[1].tagName).toBe('A');
  });

  it('Accordion renders details with defaultOpen honored', () => {
    const { container } = render(AccordionHarness);
    const details = container.querySelectorAll('details');
    expect(details).toHaveLength(2);
    expect((details[0] as HTMLDetailsElement).open).toBe(true);
    expect((details[1] as HTMLDetailsElement).open).toBe(false);
  });

  it('Breadcrumb marks the current page and has no violations', async () => {
    const { container } = render(BreadcrumbHarness);
    const current = container.querySelector('[aria-current="page"]')!;
    expect(current.textContent).toBe('Guide');
    expect(container.querySelectorAll('a')).toHaveLength(2);
    expect(await violationIds(container)).toEqual([]);
  });

  it('Pagination navigates via controls', async () => {
    const { getByLabelText, getByTestId } = render(PaginationHarness);
    expect(getByTestId('page').textContent).toBe('3');
    await fireEvent.click(getByLabelText('Next page'));
    expect(getByTestId('page').textContent).toBe('4');
    await fireEvent.click(getByLabelText('Page 1'));
    expect(getByTestId('page').textContent).toBe('1');
  });

  it('Presentational components have no axe violations', async () => {
    const { container } = render(PresentationalHarness);
    expect(await violationIds(container)).toEqual([]);
  });

  it('Form controls bind values and stay accessible', async () => {
    const { container, getByTestId, getByLabelText } = render(ControlsHarness);
    const checkbox = getByLabelText('I agree') as HTMLInputElement;
    await fireEvent.click(checkbox);
    expect(getByTestId('agree').textContent).toBe('true');
    const grid = container.querySelector<HTMLInputElement>('input[value="grid"]')!;
    await fireEvent.click(grid);
    expect(getByTestId('view').textContent).toBe('grid');
    expect(await violationIds(container)).toEqual([]);
  });
});

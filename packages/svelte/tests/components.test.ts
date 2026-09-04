import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import { tick } from 'svelte';
import { axe } from 'vitest-axe';
import TabsHarness from './harness/TabsHarness.svelte';
import TabsBindHarness from './harness/TabsBindHarness.svelte';
import ComboboxHarness from './harness/ComboboxHarness.svelte';
import CommandHarness from './harness/CommandHarness.svelte';
import FieldHarness from './harness/FieldHarness.svelte';
import RadioHarness from './harness/RadioHarness.svelte';
import ModalHarness from './harness/ModalHarness.svelte';
import DropdownHarness from './harness/DropdownHarness.svelte';
import MenuHarness from './harness/MenuHarness.svelte';
import AccordionHarness from './harness/AccordionHarness.svelte';
import SegmentedHarness from './harness/SegmentedHarness.svelte';
import BreadcrumbHarness from './harness/BreadcrumbHarness.svelte';
import PaginationHarness from './harness/PaginationHarness.svelte';
import PresentationalHarness from './harness/PresentationalHarness.svelte';
import ControlsHarness from './harness/ControlsHarness.svelte';
import TableHarness from './harness/TableHarness.svelte';
import ToastHarness from './harness/ToastHarness.svelte';
import TooltipHarness from './harness/TooltipHarness.svelte';
import DynamicHarness from './harness/DynamicHarness.svelte';
import Button from '../src/components/Button.svelte';
import Drawer from '../src/components/Drawer.svelte';
import Skeleton from '../src/components/Skeleton.svelte';

async function violationIds(el: Element): Promise<string[]> {
  const results = await axe(el, {
    rules: { region: { enabled: false }, 'color-contrast': { enabled: false } },
  });
  return results.violations.map((v) => v.id);
}

/** Flush the enhancers' microtask-coalesced change notifications. */
const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('Tabs', () => {
  it('uncontrolled: selects the first tab and reports changes', async () => {
    const { container, getByTestId } = render(TabsHarness);
    const tabs = container.querySelectorAll<HTMLElement>('[role="tab"]');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
    await fireEvent.click(tabs[1]);
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(getByTestId('changes').textContent).toBe('two');
  });

  it('uncontrolled: honors defaultValue', () => {
    const { container } = render(TabsHarness, { props: { defaultValue: 'two' } });
    const tabs = container.querySelectorAll<HTMLElement>('[role="tab"]');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    const panels = container.querySelectorAll<HTMLElement>('[role="tabpanel"]');
    expect(panels[0].hidden).toBe(true);
    expect(panels[1].hidden).toBe(false);
  });

  it('controlled: binds value two-way', async () => {
    const { container, getByText, getByTestId } = render(TabsBindHarness);
    const tabs = container.querySelectorAll<HTMLElement>('[role="tab"]');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    await fireEvent.click(tabs[0]);
    expect(getByTestId('value').textContent).toBe('one');
    await fireEvent.click(tabs[1]);
    expect(getByTestId('value').textContent).toBe('two');
    await fireEvent.click(getByText('go'));
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
  });
});

describe('Accordion', () => {
  it('uncontrolled: opens the defaultValue items', () => {
    const { container } = render(AccordionHarness);
    const details = container.querySelectorAll<HTMLDetailsElement>('details');
    expect(details).toHaveLength(2);
    expect(details[0].open).toBe(true);
    expect(details[1].open).toBe(false);
  });

  it('controlled: binds value two-way', async () => {
    const { container, getByText, getByTestId } = render(AccordionHarness, {
      props: { controlled: true },
    });
    const details = container.querySelectorAll<HTMLDetailsElement>('details');
    expect(details[0].open).toBe(true);
    await fireEvent.click(getByText('open b'));
    expect(details[1].open).toBe(true);
    expect(details[0].open).toBe(false);
    // The native toggle feeds back into the binding.
    details[0].open = true;
    details[0].dispatchEvent(new Event('toggle'));
    await settle();
    await tick();
    expect(getByTestId('value').textContent).toBe('a');
  });
});

describe('dynamic children', () => {
  it('Tabs renumber index-valued tabs and panels when an {#each} changes', async () => {
    const { container, getByText } = render(DynamicHarness);
    const tabs = () => container.querySelectorAll<HTMLElement>('[role="tab"]');
    const panels = () => container.querySelectorAll<HTMLElement>('[role="tabpanel"]');
    expect(tabs()).toHaveLength(3);
    expect(tabs()[1].getAttribute('aria-selected')).toBe('true');
    expect(panels()[1].hidden).toBe(false);
    await fireEvent.click(getByText('drop first tab'));
    await settle();
    await tick();
    expect(tabs()).toHaveLength(2);
    // Values are positional, so the tab now at index 1 ("Three") carries the
    // selected value "1" and the Svelte-rendered state agrees with the enhancer.
    expect(tabs()[1].textContent).toBe('Three');
    expect(tabs()[1].getAttribute('aria-selected')).toBe('true');
    expect(panels()[1].hidden).toBe(false);
    expect(panels()[0].hidden).toBe(true);
  });

  it('Accordion renumbers index-valued items when an {#each} changes', async () => {
    const { container, getByText } = render(DynamicHarness);
    const details = () => container.querySelectorAll<HTMLDetailsElement>('details');
    expect(details()).toHaveLength(2);
    expect(details()[1].open).toBe(true);
    await fireEvent.click(getByText('prepend item'));
    await settle();
    await tick();
    expect(details()).toHaveLength(3);
    // Item "B" shifted to index 2, so index 1 ("A") is now the open value.
    expect(details()[1].open).toBe(true);
    expect(details()[2].open).toBe(false);
  });
});

describe('Tooltip', () => {
  it('links a spread trigger and falls back to the first child', () => {
    const { container } = render(TooltipHarness);
    const tips = container.querySelectorAll<HTMLElement>('[role="tooltip"]');
    const save = container.querySelector<HTMLElement>('button.hl-button')!;
    expect(save.getAttribute('data-hl-tooltip')).toBe(tips[0].id);
    expect(save.getAttribute('aria-describedby')).toBe(tips[0].id);
    const fallback = container.querySelector<HTMLElement>('button:not(.hl-button)')!;
    expect(fallback.getAttribute('data-hl-tooltip')).toBe(tips[1].id);
    expect(fallback.getAttribute('aria-describedby')).toBe(tips[1].id);
  });
});

describe('Modal', () => {
  it('controlled: opens and closes via bind:open and reports changes', async () => {
    const { container, getByText, getByTestId } = render(ModalHarness);
    const dialog = container.querySelector('dialog') as HTMLDialogElement;
    expect(dialog.open).toBe(false);
    await fireEvent.click(getByText('open'));
    expect(dialog.open).toBe(true);
    await fireEvent.click(getByText('close'));
    expect(dialog.open).toBe(false);
    expect(getByTestId('changes').textContent).toBe('true,false');
    // Native close (Escape/backdrop) updates the binding too.
    await fireEvent.click(getByText('open'));
    dialog.close();
    await tick();
    expect(getByTestId('open').textContent).toBe('false');
  });

  it('uncontrolled: honors defaultOpen', () => {
    const { container } = render(ModalHarness, { props: { controlled: false } });
    const dialog = container.querySelector('dialog') as HTMLDialogElement;
    expect(dialog.open).toBe(true);
  });
});

describe('Drawer', () => {
  it('renders the logical side', () => {
    const { container } = render(Drawer, { props: { side: 'start' } });
    expect(container.querySelector('dialog')?.getAttribute('data-hl-side')).toBe('start');
    const { container: other } = render(Drawer);
    expect(other.querySelector('dialog')?.getAttribute('data-hl-side')).toBe('end');
  });
});

describe('Dropdown', () => {
  it('renders the popover markup and wires the menu-button pattern', () => {
    const { getByText, container } = render(DropdownHarness);
    const trigger = getByText('Actions');
    const menu = container.querySelector<HTMLElement>('[data-hl-dropdown-menu]')!;
    expect(trigger.getAttribute('popovertarget')).toBe(menu.id);
    expect(menu.getAttribute('popover')).toBe('auto');
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(menu.getAttribute('role')).toBe('menu');
    expect(container.querySelector('[role="separator"]')).not.toBeNull();
    expect(container.querySelector('li > ul[role="group"][aria-label="View"]')).not.toBeNull();
  });

  it('controlled: binds open two-way', async () => {
    const { getByText, getByTestId, container } = render(DropdownHarness);
    const trigger = getByText('Actions');
    await fireEvent.click(getByText('show'));
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(getByTestId('open').textContent).toBe('true');
    await fireEvent.click(getByText('hide'));
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    // Opening through the native invoker updates the binding.
    await fireEvent.click(trigger);
    expect(getByTestId('open').textContent).toBe('true');
    const menu = container.querySelector<HTMLElement>('[data-hl-dropdown-menu]')!;
    expect(menu.matches(':popover-open')).toBe(true);
  });

  it('fires onSelect with the value and skips disabled items', async () => {
    const { getByText, getByTestId } = render(DropdownHarness);
    await fireEvent.click(getByText('show'));
    await fireEvent.click(getByText('Edit'));
    expect(getByTestId('selected').textContent).toBe('edit');
    expect(getByTestId('checked').textContent).toBe('undefined');
    await fireEvent.click(getByText('Archive'));
    expect(getByTestId('selected').textContent).toBe('edit');
  });

  it('checkbox items toggle aria-checked and radio items are exclusive', async () => {
    const { getByText, getByTestId } = render(DropdownHarness);
    const grid = getByText('Grid');
    expect(grid.getAttribute('aria-checked')).toBe('false');
    await fireEvent.click(getByText('show'));
    await fireEvent.click(grid);
    expect(grid.getAttribute('aria-checked')).toBe('true');
    expect(getByTestId('checked').textContent).toBe('true');
    await fireEvent.click(grid);
    expect(grid.getAttribute('aria-checked')).toBe('false');
    expect(getByTestId('checked').textContent).toBe('false');

    const asc = getByText('Ascending');
    const desc = getByText('Descending');
    expect(desc.getAttribute('aria-checked')).toBe('true');
    await fireEvent.click(asc);
    expect(asc.getAttribute('aria-checked')).toBe('true');
    expect(desc.getAttribute('aria-checked')).toBe('false');
  });
});

describe('Menu', () => {
  it('renders menubar roles, links, and a submenu trigger', () => {
    const { container, getByText } = render(MenuHarness);
    expect(container.querySelector('[role="menubar"]')).not.toBeNull();
    expect(getByText('Docs').tagName).toBe('A');
    const trigger = getByText('Resources');
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(container.querySelector('[data-hl-submenu]')?.getAttribute('role')).toBe('menu');
  });

  it('controlled: binds the open submenu value two-way', async () => {
    const { getByText, getByTestId } = render(MenuHarness);
    const trigger = getByText('Resources');
    await fireEvent.click(getByText('open resources'));
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(getByTestId('value').textContent).toBe('resources');
    await fireEvent.click(getByText('close'));
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(getByTestId('value').textContent).toBe('null');
    // Clicking the trigger feeds back into the binding.
    await fireEvent.click(trigger);
    expect(getByTestId('value').textContent).toBe('resources');
  });

  it('fires onSelect for leaf items and closes the submenu', async () => {
    const { getByText, getByTestId } = render(MenuHarness);
    await fireEvent.click(getByText('Home'));
    expect(getByTestId('selected').textContent).toBe('home');
    await fireEvent.click(getByText('Resources'));
    await fireEvent.click(getByText('Blog'));
    expect(getByTestId('selected').textContent).toBe('blog');
    expect(getByTestId('value').textContent).toBe('null');
  });
});

describe('Command', () => {
  it('controlled: binds query two-way and filters', async () => {
    const { container, getByText, getByTestId } = render(CommandHarness);
    const input = container.querySelector('input')!;
    expect(input.getAttribute('role')).toBe('combobox');
    await fireEvent.input(input, { target: { value: 'new' } });
    expect(getByTestId('query').textContent).toBe('new');
    const items = container.querySelectorAll<HTMLElement>('[role="option"]');
    expect(items[0].hidden).toBe(false);
    expect(items[1].hidden).toBe(true);
    await fireEvent.click(getByText('filter settings'));
    expect(input.value).toBe('set');
    expect(items[0].hidden).toBe(true);
    expect(items[1].hidden).toBe(false);
  });

  it('uncontrolled: honors defaultQuery and runs commands', async () => {
    const { container, getByTestId } = render(CommandHarness, { props: { controlled: false } });
    const input = container.querySelector('input')!;
    expect(input.value).toBe('new');
    const items = container.querySelectorAll<HTMLElement>('[role="option"]');
    expect(items[1].hidden).toBe(true);
    await fireEvent.click(items[0]);
    expect(getByTestId('ran').textContent).toBe('new-file');
  });
});

describe('Combobox', () => {
  it('controlled: binds value and open two-way', async () => {
    const { container, getByText, getByTestId } = render(ComboboxHarness);
    const input = container.querySelector('input')!;
    expect(input.getAttribute('role')).toBe('combobox');
    // Focusing expands the listbox, which feeds back into the binding.
    input.focus();
    expect(input.getAttribute('aria-expanded')).toBe('true');
    await tick();
    expect(getByTestId('open').textContent).toBe('true');
    const options = container.querySelectorAll<HTMLElement>('[role="option"]');
    await fireEvent.click(options[1]);
    expect(getByTestId('value').textContent).toBe('banana');
    expect(input.value).toBe('banana');
    expect(getByTestId('open').textContent).toBe('false');
    // Driving the binding expands programmatically.
    await fireEvent.click(getByText('expand'));
    expect(input.getAttribute('aria-expanded')).toBe('true');
    // Disabled options can't be selected.
    await fireEvent.click(options[2]);
    expect(getByTestId('value').textContent).toBe('banana');
    // Driving the binding commits programmatically.
    await fireEvent.click(getByText('pick cherry'));
    expect(input.value).toBe('cherry');
    expect(getByTestId('changes').textContent).toBe('banana,cherry');
  });

  it('uncontrolled: honors defaultValue', () => {
    const { container } = render(ComboboxHarness, { props: { controlled: false } });
    expect(container.querySelector('input')!.value).toBe('banana');
  });
});

describe('SegmentedControl', () => {
  it('uncontrolled: defaults to the first option', async () => {
    const { container, getByTestId } = render(SegmentedHarness);
    const radios = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    expect(radios[0].checked).toBe(true);
    await fireEvent.click(radios[1]);
    expect(radios[1].checked).toBe(true);
    expect(getByTestId('changes').textContent).toBe('grid');
  });

  it('controlled: binds value two-way', async () => {
    const { container, getByText, getByTestId } = render(SegmentedHarness, {
      props: { controlled: true },
    });
    const radios = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    expect(radios[1].checked).toBe(true);
    await fireEvent.click(getByText('set list'));
    expect(radios[0].checked).toBe(true);
    await fireEvent.click(radios[1]);
    expect(getByTestId('value').textContent).toBe('grid');
  });
});

describe('Field', () => {
  it('auto-wires every control and stays quiet outside a Field', async () => {
    const { container, getByTestId, getByText } = render(FieldHarness);
    const email = getByTestId('email') as HTMLInputElement;
    const label = getByTestId('email-field').querySelector('label')!;
    expect(label.getAttribute('for')).toBe(email.id);
    expect(email.required).toBe(true);
    expect(email.getAttribute('aria-describedby')).toBe(`${email.id}-help`);
    expect(email.getAttribute('aria-invalid')).toBeNull();

    await fireEvent.click(getByText('invalidate'));
    expect(email.getAttribute('aria-invalid')).toBe('true');
    expect(email.getAttribute('aria-describedby')).toBe(`${email.id}-help ${email.id}-error`);
    expect(container.querySelector('[role="alert"]')?.id).toBe(`${email.id}-error`);

    expect(getByTestId('bio').id).toBe('bio-control');
    for (const id of ['fruit', 'agree', 'notify', 'volume', 'city']) {
      expect(getByTestId(id).id).toMatch(/^hl-field-/);
    }
    const lonely = getByTestId('lonely');
    expect(lonely.id).toBe('');
    expect(lonely.hasAttribute('aria-describedby')).toBe(false);
    expect(await violationIds(container)).toEqual([]);
  });

  it('renders label, description, and error from props and wires state', async () => {
    const { container, getByTestId, getByText } = render(FieldHarness);
    const name = getByTestId('name') as HTMLInputElement;
    const label = getByText('Name') as HTMLLabelElement;
    expect(label.tagName).toBe('LABEL');
    expect(label.getAttribute('for')).toBe(name.id);
    expect(name.required).toBe(true);
    expect(name.getAttribute('aria-describedby')).toBe(`${name.id}-help`);
    expect(getByText('Your full name').id).toBe(`${name.id}-help`);
    expect(name.getAttribute('aria-invalid')).toBeNull();

    await fireEvent.click(getByText('fail name'));
    expect(name.getAttribute('aria-invalid')).toBe('true');
    expect(name.getAttribute('aria-describedby')).toBe(`${name.id}-help ${name.id}-error`);
    const alert = getByText('Name is required.');
    expect(alert.getAttribute('role')).toBe('alert');
    expect(alert.id).toBe(`${name.id}-error`);
    expect(name.closest('.hl-field')?.hasAttribute('data-hl-invalid')).toBe(true);
    expect(await violationIds(container)).toEqual([]);
  });
});

describe('Table', () => {
  it('renders data attributes and forwards class/id', () => {
    const { container } = render(TableHarness);
    const table = container.querySelector('table')!;
    expect(table.className).toBe('hl-table report');
    expect(table.id).toBe('sales');
    expect(table.hasAttribute('data-hl-striped')).toBe(true);
    expect(table.hasAttribute('data-hl-hover')).toBe(true);
    expect(table.getAttribute('data-hl-align')).toBe('end');
    expect(table.getAttribute('data-hl-size')).toBe('sm');
    expect(table.querySelectorAll('td')).toHaveLength(2);
  });
});

describe('Toast', () => {
  it('ToastRegion enhances on mount and useToast renders intents into it', async () => {
    const { getByText, getByTestId } = render(ToastHarness);
    const region = getByTestId('region');
    expect(region.getAttribute('role')).toBe('status');
    await fireEvent.click(getByText('save'));
    const toast = region.querySelector<HTMLElement>('[data-hl-toast]')!;
    expect(toast.getAttribute('data-hl-intent')).toBe('success');
    expect(toast.hasAttribute('role')).toBe(false);
    expect(toast.textContent).toContain('Saved');
    await fireEvent.click(getByText('fail'));
    const danger = region.querySelectorAll<HTMLElement>('[data-hl-toast]')[1];
    expect(danger.getAttribute('data-hl-intent')).toBe('danger');
    expect(danger.getAttribute('role')).toBe('alert');
    // Toasts land in the mounted region, not a fallback appended to <body>.
    expect(document.querySelectorAll('[data-hl-toast-region]')).toHaveLength(1);
  });
});

describe('Skeleton', () => {
  it('renders shape and logical sizes', () => {
    const { container } = render(Skeleton, { props: { shape: 'circle', width: 32, height: 32 } });
    const el = container.querySelector('span')!;
    expect(el.getAttribute('data-hl-shape')).toBe('circle');
    expect(el.getAttribute('style')).toMatch(/inline-size:\s*32px;\s*block-size:\s*32px/);
  });
});

describe('misc components', () => {
  it('RadioGroup binds the selected value', async () => {
    const { container, getByTestId } = render(RadioHarness);
    const radios = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    await fireEvent.click(radios[1]);
    expect(getByTestId('value').textContent).toBe('b');
    expect(radios[1].checked).toBe(true);
  });

  it('Button has no axe violations', async () => {
    const { container } = render(Button, { props: { intent: 'primary', 'aria-label': 'Save' } });
    expect(await violationIds(container)).toEqual([]);
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

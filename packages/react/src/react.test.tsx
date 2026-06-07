import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs, TabList, Tab, TabPanel } from './Tabs.js';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSeparator,
} from './Dropdown.js';
import { Menu, MenuItem } from './Menu.js';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb.js';
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from './Combobox.js';
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from './Command.js';
import { Switch } from './Switch.js';
import { Tooltip } from './Tooltip.js';
import { ToastProvider, useToast } from './Toast.js';

describe('@hydrateless/react', () => {
  it('Tabs wires ARIA roles and selects the first tab', () => {
    render(
      <Tabs>
        <TabList>
          <Tab>One</Tab>
          <Tab>Two</Tab>
        </TabList>
        <TabPanel>First</TabPanel>
        <TabPanel>Second</TabPanel>
      </Tabs>,
    );
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(2);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
  });

  it('Tabs selects a tab on click', () => {
    render(
      <Tabs>
        <TabList>
          <Tab>One</Tab>
          <Tab>Two</Tab>
        </TabList>
        <TabPanel>First</TabPanel>
        <TabPanel>Second</TabPanel>
      </Tabs>,
    );
    const tabs = screen.getAllByRole('tab');
    fireEvent.click(tabs[1]);
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(screen.getByText('Second').hasAttribute('hidden')).toBe(false);
  });

  it('Dropdown opens on trigger click and wires menuitems', () => {
    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Edit</DropdownItem>
          <DropdownSeparator />
          <DropdownItem>Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );
    const trigger = screen.getByText('Actions');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
  });

  it('Dropdown fires onSelect', () => {
    let selected = '';
    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem onSelect={() => (selected = 'edit')}>Edit</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );
    fireEvent.click(screen.getByText('Actions'));
    fireEvent.click(screen.getByText('Edit'));
    expect(selected).toBe('edit');
  });

  it('Menu renders a menubar with roving tabindex', () => {
    render(
      <Menu>
        <MenuItem href="/">Home</MenuItem>
        <MenuItem submenu={<MenuItem href="/docs">Docs</MenuItem>}>Resources</MenuItem>
      </Menu>,
    );
    expect(screen.getByRole('menubar')).toBeTruthy();
    const top = screen.getAllByRole('menuitem');
    expect(top[0].tabIndex).toBe(0);
  });

  it('Breadcrumb renders a labelled nav with current page', () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem current>Components</BreadcrumbItem>
      </Breadcrumb>,
    );
    const nav = screen.getByLabelText('Breadcrumb');
    expect(nav.tagName).toBe('NAV');
    expect(nav.querySelector('[aria-current="page"]')?.textContent).toBe('Components');
  });

  it('Combobox filters and commits a value', () => {
    let value = '';
    render(
      <Combobox onValueChange={(v) => (value = v)}>
        <ComboboxInput placeholder="Fruit" />
        <ComboboxList>
          <ComboboxOption value="apple">Apple</ComboboxOption>
          <ComboboxOption value="banana">Banana</ComboboxOption>
        </ComboboxList>
      </Combobox>,
    );
    const input = screen.getByPlaceholderText('Fruit') as HTMLInputElement;
    expect(input.getAttribute('role')).toBe('combobox');
    fireEvent.focus(input);
    fireEvent.click(screen.getByText('Banana'));
    expect(value).toBe('banana');
  });

  it('Command shows an empty state when nothing matches', () => {
    render(
      <Command>
        <CommandInput placeholder="Command" />
        <CommandList>
          <CommandItem value="new">New File</CommandItem>
        </CommandList>
        <CommandEmpty>Nothing here</CommandEmpty>
      </Command>,
    );
    const input = screen.getByPlaceholderText('Command') as HTMLInputElement;
    fireEvent.input(input, { target: { value: 'zzz' } });
    expect(screen.getByText('Nothing here').hasAttribute('hidden')).toBe(false);
  });

  it('Switch renders a checkbox with the switch role', () => {
    render(<Switch defaultChecked>Notifications</Switch>);
    const input = screen.getByRole('switch');
    expect((input as HTMLInputElement).type).toBe('checkbox');
  });

  it('Tooltip wires aria-describedby on the trigger', () => {
    render(
      <Tooltip label="Helpful hint">
        <button>Hover me</button>
      </Tooltip>,
    );
    const trigger = screen.getByText('Hover me');
    const tipId = trigger.getAttribute('aria-describedby');
    expect(tipId).toBeTruthy();
    expect(document.getElementById(tipId!)?.getAttribute('role')).toBe('tooltip');
  });

  it('ToastProvider exposes a working useToast hook', () => {
    function Demo() {
      const toast = useToast();
      return (
        <button type="button" onClick={() => toast.show('Saved')}>
          show
        </button>
      );
    }
    render(
      <ToastProvider>
        <Demo />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText('show'));
    const toast = document.querySelector('[data-hl-toast]');
    expect(toast?.textContent).toContain('Saved');
  });
});

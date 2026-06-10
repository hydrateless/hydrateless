import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Tabs, TabList, Tab, TabPanel } from './Tabs.js';
import { Accordion, AccordionItem } from './Accordion.js';
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
import { Modal, ModalHeader, ModalBody } from './Modal.js';
import { Switch } from './Switch.js';
import { Tooltip } from './Tooltip.js';
import { ToastRegion, useToast } from './Toast.js';

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

  it('useToast works with a mounted ToastRegion', () => {
    function Demo() {
      const toast = useToast();
      return (
        <button type="button" onClick={() => toast.show('Saved', { duration: 0 })}>
          show
        </button>
      );
    }
    render(
      <>
        <ToastRegion />
        <Demo />
      </>,
    );
    fireEvent.click(screen.getByText('show'));
    const region = document.querySelector('[data-hl-toast-region]')!;
    expect(region.querySelector('[data-hl-toast]')?.textContent).toContain('Saved');
  });

  it('Tabs supports defaultValue and reports changes', () => {
    const onValueChange = vi.fn();
    render(
      <Tabs defaultValue="two" onValueChange={onValueChange}>
        <TabList>
          <Tab value="one">One</Tab>
          <Tab value="two">Two</Tab>
        </TabList>
        <TabPanel>First</TabPanel>
        <TabPanel>Second</TabPanel>
      </Tabs>,
    );
    const tabs = screen.getAllByRole('tab');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');

    fireEvent.click(tabs[0]);
    expect(onValueChange).toHaveBeenCalledWith('one');
  });

  it('Tabs works fully controlled', () => {
    function Demo() {
      const [tab, setTab] = useState('one');
      return (
        <>
          <button type="button" onClick={() => setTab('two')}>
            go
          </button>
          <Tabs value={tab} onValueChange={setTab}>
            <TabList>
              <Tab value="one">One</Tab>
              <Tab value="two">Two</Tab>
            </TabList>
            <TabPanel>First</TabPanel>
            <TabPanel>Second</TabPanel>
          </Tabs>
        </>
      );
    }
    render(<Demo />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');

    // External state change drives the enhancer.
    fireEvent.click(screen.getByText('go'));
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');

    // Clicking a tab reports back through onValueChange.
    fireEvent.click(tabs[0]);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
  });

  it('Accordion reports open values', async () => {
    const onValueChange = vi.fn();
    render(
      <Accordion allowMultiple onValueChange={onValueChange}>
        <AccordionItem value="a" summary="One">
          1
        </AccordionItem>
        <AccordionItem value="b" summary="Two">
          2
        </AccordionItem>
      </Accordion>,
    );
    const [first] = Array.from(document.querySelectorAll('details'));
    await act(async () => {
      first.open = true;
      first.dispatchEvent(new Event('toggle'));
      await Promise.resolve(); // change notifications are coalesced
    });
    expect(onValueChange).toHaveBeenCalledWith(['a']);
  });

  it('Modal opens and closes through the open prop', () => {
    for (const dialog of [HTMLDialogElement.prototype]) {
      dialog.showModal ??= function (this: HTMLDialogElement) {
        this.setAttribute('open', '');
      };
      dialog.close ??= function (this: HTMLDialogElement) {
        this.removeAttribute('open');
      };
    }
    function Demo() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            open
          </button>
          <Modal open={open} onOpenChange={setOpen}>
            <ModalHeader>Confirm</ModalHeader>
            <ModalBody>Are you sure?</ModalBody>
          </Modal>
        </>
      );
    }
    render(<Demo />);
    const dialog = document.querySelector('dialog')!;
    expect(dialog.hasAttribute('open')).toBe(false);

    fireEvent.click(screen.getByText('open'));
    expect(dialog.hasAttribute('open')).toBe(true);

    // The header labels the dialog.
    expect(dialog.getAttribute('aria-labelledby')).toBeTruthy();
  });
});

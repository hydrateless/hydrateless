import { describe, it, expect, vi } from 'vitest';
import { useRef, useState } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { enhanceTabs } from '@hydrateless/enhancers';
import { useEnhancer } from './useEnhancer.js';
import { Tabs, TabList, Tab, TabPanel } from './Tabs.js';
import { Accordion, AccordionItem } from './Accordion.js';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownGroup,
  DropdownSeparator,
} from './Dropdown.js';
import { Menu, MenuItem, MenuSubmenu } from './Menu.js';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb.js';
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from './Combobox.js';
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from './Command.js';
import { Modal, ModalHeader, ModalBody } from './Modal.js';
import { Drawer } from './Drawer.js';
import { Switch } from './Switch.js';
import { Tooltip } from './Tooltip.js';
import { ToastRegion, useToast } from './Toast.js';
import { SegmentedControl } from './SegmentedControl.js';
import { RadioGroup, Radio } from './Radio.js';
import { Field, useField } from './Field.js';
import { Input } from './Input.js';
import { Checkbox } from './Checkbox.js';
import { Table } from './Table.js';
import { Skeleton } from './Skeleton.js';

const twoTabs = (props: Parameters<typeof Tabs>[0] = {}) => (
  <Tabs {...props}>
    <TabList>
      <Tab value="one">One</Tab>
      <Tab value="two">Two</Tab>
    </TabList>
    <TabPanel>First</TabPanel>
    <TabPanel>Second</TabPanel>
  </Tabs>
);

describe('Tabs', () => {
  it('renders aria-selected, hidden, and tabindex on the server', () => {
    const html = renderToStaticMarkup(twoTabs({ defaultValue: 'two' }));
    expect(html).toContain('aria-selected="false" tabindex="-1"');
    expect(html).toContain('aria-selected="true" tabindex="0"');
    expect(html).toMatch(/role="tabpanel" hidden="">First/);
    expect(html).toMatch(/role="tabpanel">Second/);
  });

  it('selects the first tab by default and switches on click', () => {
    render(twoTabs());
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    fireEvent.click(tabs[1]);
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(screen.getByText('Second').hasAttribute('hidden')).toBe(false);
    expect(screen.getByText('First').hasAttribute('hidden')).toBe(true);
  });

  it('supports defaultValue and reports changes', () => {
    const onValueChange = vi.fn();
    render(twoTabs({ defaultValue: 'two', onValueChange }));
    const tabs = screen.getAllByRole('tab');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    fireEvent.click(tabs[0]);
    expect(onValueChange).toHaveBeenCalledWith('one');
  });

  it('works fully controlled', () => {
    function Demo() {
      const [tab, setTab] = useState('one');
      return (
        <>
          <button type="button" onClick={() => setTab('two')}>
            go
          </button>
          {twoTabs({ value: tab, onValueChange: setTab })}
        </>
      );
    }
    render(<Demo />);
    const tabs = screen.getAllByRole('tab');
    fireEvent.click(screen.getByText('go'));
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    fireEvent.click(tabs[0]);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
  });
});

describe('Accordion', () => {
  it('renders open items from defaultValue and reports changes', async () => {
    const onValueChange = vi.fn();
    render(
      <Accordion allowMultiple defaultValue={['b']} onValueChange={onValueChange}>
        <AccordionItem value="a" summary="One">
          1
        </AccordionItem>
        <AccordionItem value="b" summary="Two">
          2
        </AccordionItem>
      </Accordion>,
    );
    const [first, second] = Array.from(document.querySelectorAll('details'));
    expect(second.open).toBe(true);
    await act(async () => {
      first.open = true;
      first.dispatchEvent(new Event('toggle'));
      await Promise.resolve(); // change notifications are coalesced
    });
    expect(onValueChange).toHaveBeenCalledWith(['a', 'b']);
  });

  it('follows a controlled value', () => {
    const { rerender } = render(
      <Accordion value={['0']} onValueChange={() => {}}>
        <AccordionItem summary="One">1</AccordionItem>
        <AccordionItem summary="Two">2</AccordionItem>
      </Accordion>,
    );
    const [first, second] = Array.from(document.querySelectorAll('details'));
    expect(first.open).toBe(true);
    rerender(
      <Accordion value={['1']} onValueChange={() => {}}>
        <AccordionItem summary="One">1</AccordionItem>
        <AccordionItem summary="Two">2</AccordionItem>
      </Accordion>,
    );
    expect(first.open).toBe(false);
    expect(second.open).toBe(true);
  });
});

describe('Dropdown', () => {
  it('renders popover + popovertarget so it works before hydration', () => {
    const html = renderToStaticMarkup(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Edit</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );
    expect(html).toContain('popovertarget="hl-dropdown-menu-');
    const [, id] = html.match(/popovertarget="([^"]+)"/)!;
    expect(html).toContain(`id="${id}" popover="auto"`);
  });

  it('opens on trigger click and wires menuitems', () => {
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
    expect(document.querySelector('.hl-dropdown-separator')?.getAttribute('role')).toBe(
      'separator',
    );
  });

  it('fires onSelect with the value and closes', () => {
    const onSelect = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <Dropdown onSelect={onSelect} onOpenChange={onOpenChange}>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem value="edit">Edit</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );
    fireEvent.click(screen.getByText('Actions'));
    fireEvent.click(screen.getByText('Edit'));
    expect(onSelect).toHaveBeenCalledWith('edit', expect.any(HTMLElement), undefined);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('toggles aria-checked on a menuitemcheckbox and stays open with closeOnSelect=false', () => {
    const onSelect = vi.fn();
    render(
      <Dropdown closeOnSelect={false} onSelect={onSelect}>
        <DropdownTrigger>View</DropdownTrigger>
        <DropdownMenu>
          <DropdownGroup label="Panels">
            <DropdownItem role="menuitemcheckbox" value="sidebar">
              Sidebar
            </DropdownItem>
          </DropdownGroup>
        </DropdownMenu>
      </Dropdown>,
    );
    const trigger = screen.getByText('View');
    fireEvent.click(trigger);
    const item = screen.getByRole('menuitemcheckbox');
    expect(item.getAttribute('aria-checked')).toBe('false');
    fireEvent.click(item);
    expect(item.getAttribute('aria-checked')).toBe('true');
    expect(onSelect).toHaveBeenCalledWith('sidebar', item, true);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('group').getAttribute('aria-label')).toBe('Panels');
  });

  it('skips disabled items', () => {
    const onSelect = vi.fn();
    render(
      <Dropdown onSelect={onSelect}>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem disabled value="nope">
            Nope
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );
    fireEvent.click(screen.getByText('Actions'));
    fireEvent.click(screen.getByText('Nope'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('works controlled through the open prop', () => {
    function Demo() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            open
          </button>
          <Dropdown open={open} onOpenChange={setOpen}>
            <DropdownTrigger>Actions</DropdownTrigger>
            <DropdownMenu>
              <DropdownItem>Edit</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </>
      );
    }
    render(<Demo />);
    const trigger = screen.getByText('Actions');
    fireEvent.click(screen.getByText('open'));
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(screen.getByText('Edit'));
  });
});

describe('Menu', () => {
  const menu = (props: Parameters<typeof Menu>[0] = {}) => (
    <Menu {...props}>
      <MenuItem href="/">Home</MenuItem>
      <MenuSubmenu label="Resources" value="resources">
        <MenuItem href="/docs">Docs</MenuItem>
      </MenuSubmenu>
    </Menu>
  );

  it('renders a menubar with roving tabindex', () => {
    render(menu());
    expect(screen.getByRole('menubar')).toBeTruthy();
    const top = screen.getAllByRole('menuitem');
    expect(top[0].tabIndex).toBe(0);
    expect(top[1].getAttribute('aria-haspopup')).toBe('menu');
  });

  it('reports the open submenu as its value', () => {
    const onValueChange = vi.fn();
    render(menu({ onValueChange }));
    fireEvent.click(screen.getByText('Resources'));
    expect(onValueChange).toHaveBeenCalledWith('resources');
    expect(screen.getByText('Resources').getAttribute('aria-expanded')).toBe('true');
  });

  it('opens the submenu from defaultValue and follows a controlled value', () => {
    const { rerender } = render(menu({ defaultValue: 'resources' }));
    expect(screen.getByText('Resources').getAttribute('aria-expanded')).toBe('true');

    rerender(menu({ value: null, onValueChange: () => {} }));
    expect(screen.getByText('Resources').getAttribute('aria-expanded')).toBe('false');
    rerender(menu({ value: 'resources', onValueChange: () => {} }));
    expect(screen.getByText('Resources').getAttribute('aria-expanded')).toBe('true');
  });

  it('fires onSelect for leaf items', () => {
    const onSelect = vi.fn();
    render(
      <Menu onSelect={onSelect}>
        <MenuItem value="home">Home</MenuItem>
      </Menu>,
    );
    fireEvent.click(screen.getByText('Home'));
    expect(onSelect).toHaveBeenCalledWith('home', expect.any(HTMLElement), undefined);
  });
});

describe('Combobox', () => {
  const combobox = (props: Parameters<typeof Combobox>[0] = {}) => (
    <Combobox {...props}>
      <ComboboxInput placeholder="Fruit" />
      <ComboboxList>
        <ComboboxOption value="apple">Apple</ComboboxOption>
        <ComboboxOption value="banana">Banana</ComboboxOption>
        <ComboboxOption value="cherry" disabled>
          Cherry
        </ComboboxOption>
      </ComboboxList>
    </Combobox>
  );

  it('commits a value and reports open state', () => {
    const onValueChange = vi.fn();
    const onOpenChange = vi.fn();
    render(combobox({ onValueChange, onOpenChange }));
    const input = screen.getByPlaceholderText('Fruit') as HTMLInputElement;
    expect(input.getAttribute('role')).toBe('combobox');
    fireEvent.focus(input);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    fireEvent.click(screen.getByText('Banana'));
    expect(onValueChange).toHaveBeenCalledWith('banana');
    expect(input.value).toBe('banana');
  });

  it('refuses disabled options', () => {
    const onValueChange = vi.fn();
    render(combobox({ onValueChange }));
    const input = screen.getByPlaceholderText('Fruit');
    fireEvent.focus(input);
    expect(screen.getByText('Cherry').getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(screen.getByText('Cherry'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('seeds the input from defaultValue and follows a controlled value', () => {
    const { rerender } = render(combobox({ defaultValue: 'apple' }));
    const input = screen.getByPlaceholderText('Fruit') as HTMLInputElement;
    expect(input.value).toBe('apple');
    rerender(combobox({ value: 'banana', onValueChange: () => {} }));
    expect(input.value).toBe('banana');
  });
});

describe('Command', () => {
  const palette = (props: Parameters<typeof Command>[0] = {}) => (
    <Command {...props}>
      <CommandInput placeholder="Command" />
      <CommandList>
        <CommandItem value="new">New File</CommandItem>
        <CommandItem value="open">Open</CommandItem>
      </CommandList>
      <CommandEmpty>Nothing here</CommandEmpty>
    </Command>
  );

  it('shows an empty state when nothing matches and reports the query', () => {
    const onQueryChange = vi.fn();
    render(palette({ onQueryChange }));
    const input = screen.getByPlaceholderText('Command') as HTMLInputElement;
    fireEvent.input(input, { target: { value: 'zzz' } });
    expect(onQueryChange).toHaveBeenCalledWith('zzz');
    expect(screen.getByText('Nothing here').hasAttribute('hidden')).toBe(false);
  });

  it('seeds the query from defaultQuery and follows a controlled query', () => {
    const { rerender } = render(palette({ defaultQuery: 'new' }));
    const input = screen.getByPlaceholderText('Command') as HTMLInputElement;
    expect(input.value).toBe('new');
    rerender(palette({ query: 'open', onQueryChange: () => {} }));
    expect(input.value).toBe('open');
    expect(screen.getByText('New File').closest('[role="option"]')?.hasAttribute('hidden')).toBe(
      true,
    );
  });

  it('runs a command on click', () => {
    const onCommand = vi.fn();
    render(palette({ onCommand }));
    fireEvent.click(screen.getByText('Open'));
    expect(onCommand).toHaveBeenCalledWith('open', expect.any(HTMLElement));
  });
});

describe('Modal and Drawer', () => {
  it('Modal opens and closes through the open prop', () => {
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
    expect(dialog.getAttribute('aria-labelledby')).toBeTruthy();
  });

  it('Modal opens uncontrolled from defaultOpen', () => {
    render(
      <Modal defaultOpen>
        <ModalBody>Hi</ModalBody>
      </Modal>,
    );
    expect(document.querySelector('dialog')!.hasAttribute('open')).toBe(true);
  });

  it('Drawer renders the logical side', () => {
    render(<Drawer defaultOpen side="start" />);
    expect(document.querySelector('dialog')!.getAttribute('data-hl-side')).toBe('start');
  });
});

describe('SegmentedControl', () => {
  const options = [
    { label: 'List', value: 'list' },
    { label: 'Grid', value: 'grid' },
  ];

  it('defaults to the first option when uncontrolled', () => {
    const onValueChange = vi.fn();
    render(<SegmentedControl aria-label="View" options={options} onValueChange={onValueChange} />);
    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(radios[0].checked).toBe(true);
    fireEvent.click(radios[1]);
    expect(radios[1].checked).toBe(true);
    expect(onValueChange).toHaveBeenCalledWith('grid');
  });

  it('follows a controlled value', () => {
    render(
      <SegmentedControl
        aria-label="View"
        options={options}
        value="grid"
        onValueChange={() => {}}
      />,
    );
    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(radios[1].checked).toBe(true);
    fireEvent.click(radios[0]);
    expect(radios[1].checked).toBe(true);
  });
});

describe('Field', () => {
  it('wires Input inside a Field without extra props', () => {
    render(
      <Field label="Email" description="We never share it." error="Required" required>
        <Input />
      </Field>,
    );
    const input = screen.getByLabelText('Email') as HTMLInputElement;
    expect(input.id).toMatch(/^hl-field-/);
    expect(input.getAttribute('aria-describedby')).toBe(`${input.id}-help ${input.id}-error`);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.required).toBe(true);
    expect(screen.getByRole('alert').textContent).toBe('Required');
  });

  it('leaves controls alone outside a Field', () => {
    render(<Checkbox>Agree</Checkbox>);
    const box = screen.getByRole('checkbox');
    expect(box.hasAttribute('id')).toBe(false);
    expect(box.hasAttribute('aria-describedby')).toBe(false);
  });

  it('useField returns null outside a Field', () => {
    let result: unknown = 'unset';
    function Probe() {
      result = useField();
      return null;
    }
    render(<Probe />);
    expect(result).toBeNull();
  });
});

describe('Table', () => {
  it('renders the hl-table primitive with data attributes', () => {
    render(
      <Table striped hover align="end" size="sm">
        <tbody>
          <tr>
            <td>1</td>
          </tr>
        </tbody>
      </Table>,
    );
    const table = screen.getByRole('table');
    expect(table.className).toBe('hl-table');
    expect(table.hasAttribute('data-hl-striped')).toBe(true);
    expect(table.hasAttribute('data-hl-hover')).toBe(true);
    expect(table.getAttribute('data-hl-align')).toBe('end');
    expect(table.getAttribute('data-hl-size')).toBe('sm');
  });
});

describe('useEnhancer', () => {
  it('enhances custom markup, exposes the API, and calls the latest handler', () => {
    const first = vi.fn();
    const second = vi.fn();
    let api: { setValue: (value: string) => void } | null = null;
    function Custom({ onValueChange }: { onValueChange: (value: string) => void }) {
      const ref = useRef<HTMLDivElement>(null);
      const handle = useEnhancer(ref, enhanceTabs, { onValueChange });
      api = handle.current;
      return (
        <div data-hl-tabs ref={ref}>
          <div role="tablist">
            <button role="tab">A</button>
            <button role="tab">B</button>
          </div>
          <div role="tabpanel">a</div>
          <div role="tabpanel">b</div>
        </div>
      );
    }
    const { rerender } = render(<Custom onValueChange={first} />);
    rerender(<Custom onValueChange={second} />);
    expect(api).not.toBeNull();
    fireEvent.click(screen.getByText('B'));
    // The handler from the latest render runs without re-enhancing.
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith('1');
  });
});

describe('misc', () => {
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

  it('Switch renders a checkbox with the switch role', () => {
    render(<Switch defaultChecked>Notifications</Switch>);
    const input = screen.getByRole('switch');
    expect((input as HTMLInputElement).type).toBe('checkbox');
  });

  it('Skeleton renders the shape attribute', () => {
    const { container } = render(<Skeleton shape="circle" width={32} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.getAttribute('data-hl-shape')).toBe('circle');
    expect(el.style.inlineSize).toBe('32px');
  });

  it('Tooltip wires aria-describedby on the trigger', () => {
    render(
      <Tooltip content="Helpful hint">
        <button>Hover me</button>
      </Tooltip>,
    );
    const trigger = screen.getByText('Hover me');
    const tipId = trigger.getAttribute('aria-describedby');
    expect(tipId).toBeTruthy();
    expect(document.getElementById(tipId!)?.getAttribute('role')).toBe('tooltip');
  });

  it('useToast shows toasts with an intent inside a mounted ToastRegion', () => {
    function Demo() {
      const toast = useToast();
      return (
        <button
          type="button"
          onClick={() => toast.show('Saved', { duration: 0, intent: 'success' })}
        >
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
    const toast = region.querySelector('[data-hl-toast]')!;
    expect(toast.textContent).toContain('Saved');
    expect(toast.getAttribute('data-hl-intent')).toBe('success');
  });

  it('ToastRegion applies a default duration and reports open changes', () => {
    vi.useFakeTimers();
    try {
      const onOpenChange = vi.fn();
      function Demo() {
        const toast = useToast();
        return (
          <button type="button" onClick={() => toast.show('Ping')}>
            show
          </button>
        );
      }
      render(
        <>
          <ToastRegion duration={1000} onOpenChange={onOpenChange} />
          <Demo />
        </>,
      );
      fireEvent.click(screen.getByText('show'));
      const region = document.querySelector('[data-hl-toast-region]')!;
      const toast = region.querySelector('[data-hl-toast]')!;
      expect(onOpenChange).toHaveBeenCalledWith(true, toast);
      act(() => {
        vi.advanceTimersByTime(1500);
      });
      expect(onOpenChange).toHaveBeenLastCalledWith(false, toast);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('RadioGroup', () => {
  it('reflects orientation on the group', () => {
    render(
      <RadioGroup defaultValue="b" orientation="horizontal">
        <Radio value="a">A</Radio>
        <Radio value="b">B</Radio>
      </RadioGroup>,
    );
    const group = screen.getByRole('radiogroup');
    expect(group.getAttribute('data-hl-orientation')).toBe('horizontal');
    expect(group.getAttribute('aria-orientation')).toBe('horizontal');
    expect((screen.getByLabelText('B') as HTMLInputElement).checked).toBe(true);
  });
});

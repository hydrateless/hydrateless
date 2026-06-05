import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs } from './Tabs.js';
import { Dropdown } from './Dropdown.js';
import { Breadcrumb } from './Breadcrumb.js';
import { Switch } from './Switch.js';
import { Tooltip } from './Tooltip.js';
import { ToastProvider, useToast } from './Toast.js';

describe('@hydrateless/react', () => {
  it('Tabs wires ARIA roles and selects the first tab', () => {
    render(
      <Tabs
        items={[
          { label: 'One', content: 'First' },
          { label: 'Two', content: 'Second' },
        ]}
      />,
    );
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(2);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
  });

  it('Dropdown opens on trigger click', () => {
    render(
      <Dropdown
        trigger="Actions"
        items={[{ label: 'Edit' }, { separator: true, label: '' }, { label: 'Delete' }]}
      />,
    );
    const trigger = screen.getByText('Actions');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('Breadcrumb renders a labelled nav with current page', () => {
    render(
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Components', current: true },
        ]}
      />,
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

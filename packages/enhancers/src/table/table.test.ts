import { describe, it, expect, beforeEach } from 'vitest';
import { enhanceTable } from './index.js';

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));
const names = () =>
  Array.from(document.querySelectorAll('tbody tr')).map((tr) => tr.children[0].textContent);
const th = (i: number) => document.querySelectorAll<HTMLElement>('th')[i];

describe('enhanceTable', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <table data-hl-table>
        <thead><tr>
          <th data-hl-sort="name">Name</th>
          <th data-hl-sort="price">Price</th>
          <th>Notes</th>
        </tr></thead>
        <tbody>
          <tr><td>Pear</td><td data-hl-value="3">$3.00</td><td>b</td></tr>
          <tr><td>apple</td><td data-hl-value="12">$12.00</td><td>a</td></tr>
          <tr><td>Fig</td><td data-hl-value="7">$7.00</td><td>c</td></tr>
        </tbody>
      </table>
    `;
  });

  it('makes sortable headers focusable with aria-sort="none"', () => {
    enhanceTable(document);
    expect(th(0).tabIndex).toBe(0);
    expect(th(0).getAttribute('aria-sort')).toBe('none');
    expect(th(2).hasAttribute('aria-sort')).toBe(false);
  });

  it('sorts rows on click, toggling direction, and emits hl:change', () => {
    const changes: unknown[] = [];
    document.addEventListener('hl:change', (e) => changes.push((e as CustomEvent).detail.value));
    const api = enhanceTable(document).api!;

    th(0).click();
    expect(names()).toEqual(['apple', 'Fig', 'Pear']);
    expect(th(0).getAttribute('aria-sort')).toBe('ascending');
    th(0).click();
    expect(names()).toEqual(['Pear', 'Fig', 'apple']);
    expect(api.value).toEqual({ column: 'name', direction: 'descending' });
    expect(changes).toEqual([
      { column: 'name', direction: 'ascending' },
      { column: 'name', direction: 'descending' },
    ]);
  });

  it('compares data-hl-value numerically and Enter/Space sort too', () => {
    enhanceTable(document);
    th(1).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(names()).toEqual(['Pear', 'Fig', 'apple']);
    expect(th(1).getAttribute('aria-sort')).toBe('ascending');
    expect(th(0).getAttribute('aria-sort')).toBe('none');
  });

  it('restores authored order with setValue(null) and on destroy', () => {
    const handle = enhanceTable(document);
    th(0).click();
    handle.api!.setValue(null);
    expect(names()).toEqual(['Pear', 'apple', 'Fig']);
    th(0).click();
    handle.destroy();
    expect(names()).toEqual(['Pear', 'apple', 'Fig']);
    expect(th(0).hasAttribute('aria-sort')).toBe(false);
  });

  it('honors data-hl-default-value and a server-rendered aria-sort', () => {
    document.querySelector('table')!.setAttribute('data-hl-default-value', 'price:descending');
    const api = enhanceTable(document).api!;
    expect(api.value).toEqual({ column: 'price', direction: 'descending' });
    expect(names()).toEqual(['apple', 'Fig', 'Pear']);
  });

  it('sorts rows added later into place', async () => {
    enhanceTable(document);
    th(0).click();
    document
      .querySelector('tbody')!
      .insertAdjacentHTML(
        'beforeend',
        '<tr><td>Banana</td><td data-hl-value="1">$1</td><td></td></tr>',
      );
    await settle();
    expect(names()).toEqual(['apple', 'Banana', 'Fig', 'Pear']);
  });
});

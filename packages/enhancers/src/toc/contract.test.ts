import { describe, it, expect, beforeEach } from 'vitest';
import { enhanceToc } from './index.js';

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));
const links = () =>
  Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-hl-toc] a')).map(
    (a) => a.textContent,
  );

describe('enhanceToc contract', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <main>
        <nav data-hl-toc><p>Loading…</p></nav>
        <h2 id="intro">Intro</h2>
        <h3 id="setup">Setup</h3>
        <h2 id="usage">Usage</h2>
      </main>
    `;
  });

  it('exposes the current heading as value and emits hl:change', () => {
    const seen: (string | null)[] = [];
    const events: (string | null)[] = [];
    document.addEventListener('hl:change', (e) => events.push((e as CustomEvent).detail.value));
    const api = enhanceToc(document, { onValueChange: (v) => seen.push(v) }).api!;
    expect(api.value).toBeNull();
    api.setValue('usage');
    expect(document.querySelector('a[href="#usage"]')!.getAttribute('aria-current')).toBe('true');
    expect(document.querySelector('a[href="#intro"]')!.hasAttribute('aria-current')).toBe(false);
    api.setValue(null);
    expect(seen).toEqual(['usage', null]);
    expect(events).toEqual(['usage', null]);
  });

  it('rebuilds when headings are added to the content region', async () => {
    enhanceToc(document);
    expect(links()).toEqual(['Intro', 'Setup', 'Usage']);
    document.querySelector('main')!.insertAdjacentHTML('beforeend', '<h2 id="faq">FAQ</h2>');
    await settle();
    expect(links()).toEqual(['Intro', 'Setup', 'Usage', 'FAQ']);
  });

  it('reads headings and watch from data attributes', async () => {
    const nav = document.querySelector('nav')!;
    nav.setAttribute('data-hl-headings', 'h2');
    nav.setAttribute('data-hl-watch', 'false');
    enhanceToc(document);
    expect(links()).toEqual(['Intro', 'Usage']);
    document.querySelector('main')!.insertAdjacentHTML('beforeend', '<h2 id="faq">FAQ</h2>');
    await settle();
    expect(links()).toEqual(['Intro', 'Usage']);
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { enhanceToc } from './index.js';

describe('enhanceToc', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <nav data-hl-toc></nav>
      <main>
        <h2>Section One</h2>
        <p>Content one.</p>
        <h3>Subsection</h3>
        <p>Content sub.</p>
        <h2>Section Two</h2>
        <p>Content two.</p>
      </main>
    `;
  });

  it('generates links from headings', () => {
    enhanceToc(document, { scrollSpy: false });
    const nav = document.querySelector('[data-hl-toc]')!;
    const links = nav.querySelectorAll('a');

    expect(links.length).toBe(3);
    expect(links[0].textContent).toBe('Section One');
    expect(links[1].textContent).toBe('Subsection');
    expect(links[2].textContent).toBe('Section Two');
  });

  it('assigns IDs to headings that lack them', () => {
    enhanceToc(document, { scrollSpy: false });
    const headings = document.querySelectorAll('h2, h3');

    for (const h of headings) {
      expect(h.id).toBeTruthy();
    }
  });

  it('links have correct href', () => {
    enhanceToc(document, { scrollSpy: false });
    const links = document.querySelectorAll('[data-hl-toc] a');

    for (const link of links) {
      const href = link.getAttribute('href')!;
      expect(href.startsWith('#')).toBe(true);
      const target = document.getElementById(href.slice(1));
      expect(target).not.toBeNull();
    }
  });

  it('handles no matching nav elements', () => {
    document.body.innerHTML = '<div>No TOC nav</div>';
    expect(() => enhanceToc(document, { scrollSpy: false })).not.toThrow();
  });

  it('handles no headings', () => {
    document.body.innerHTML = `
      <nav data-hl-toc></nav>
      <main><p>No headings here.</p></main>
    `;
    expect(() => enhanceToc(document, { scrollSpy: false })).not.toThrow();
  });

  it('rebuilds the list through the refresh api', () => {
    const handle = enhanceToc(document, { scrollSpy: false });
    const main = document.querySelector('main')!;
    const heading = document.createElement('h2');
    heading.textContent = 'Section Three';
    main.appendChild(heading);

    handle.api!.refresh();
    const links = document.querySelectorAll('[data-hl-toc] a');
    expect(links.length).toBe(4);
    expect(links[3].textContent).toBe('Section Three');
  });

  it('restores the placeholder content on destroy', () => {
    const nav = document.querySelector('[data-hl-toc]')!;
    nav.innerHTML = '<p>Placeholder</p>';

    const handle = enhanceToc(document, { scrollSpy: false });
    expect(nav.querySelector('p')).toBeNull();
    expect(nav.querySelectorAll('a').length).toBe(3);

    handle.destroy();
    expect(nav.querySelectorAll('a').length).toBe(0);
    expect(nav.textContent).toBe('Placeholder');
  });
});

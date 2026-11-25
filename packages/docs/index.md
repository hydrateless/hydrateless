---
layout: home
title: Hydrateless
titleTemplate: Accessible UI primitives, near-zero runtime
description: Semantic HTML and modern CSS first. Tiny JavaScript enhancers load only when an interaction truly needs them.
hero:
  name: Hydrateless
  text: Accessible UI primitives, near-zero runtime
  tagline: Semantic HTML and modern CSS first. Tiny JavaScript enhancers load only when an interaction truly needs them.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: Browse Components
      link: /components/
    - theme: alt
      text: Theme Studio
      link: /playground/theme
features:
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>'
    title: CSS-first
    details: Accordions, tabs, modals, drawers, tooltips, and more work out of the box with no JavaScript, built on native elements like details and dialog.
    link: /components/
    linkText: Browse components
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'
    title: Optional JS enhancers
    details: Add keyboard navigation, focus management, and ARIA wiring only where native HTML falls short. Each enhancer is a few hundred bytes.
    link: /reference
    linkText: API reference
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'
    title: Auto-initialization
    details: The @hydrateless/auto package detects data-hl-* attributes and lazy-loads exactly the enhancers your page uses.
    link: /guide/data-attributes
    linkText: Data attributes
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>'
    title: Themeable tokens
    details: Every component is driven by CSS variables for color, spacing, radius, and typography. Dark mode is built in.
    link: /playground/theme
    linkText: Open theme studio
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="6" rx="2"/><rect x="3" y="15" width="18" height="6" rx="2"/><path d="M7 9v6"/><path d="M17 9v6"/></svg>'
    title: CSS layers
    details: 'All styles ship inside @layer, so your own CSS always wins: no specificity battles, no !important.'
    link: /guide/css-layers
    linkText: How layers work
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>'
    title: Framework bindings
    details: First-class packages for React, Vue, and Svelte (plus an Astro guide) wrap the same enhancers idiomatically.
    link: /frameworks/react
    linkText: Framework guides
---

<script setup>
const controlsCode = `<button class="hl-button" data-hl-intent="primary">Primary</button>
<button class="hl-button" data-hl-intent="primary" data-hl-variant="soft">Soft</button>
<button class="hl-button" data-hl-variant="outline">Outline</button>
<span class="hl-badge" data-hl-intent="success" data-hl-variant="soft">Stable</span>
<label class="hl-switch">
  <input type="checkbox" role="switch" checked />
  Notifications
</label>`;

const tabsCode = `<div class="hl-tabs" data-hl-tabs>
  <div role="tablist" aria-label="Hydrateless overview">
    <button role="tab" aria-selected="true" id="intro-overview" aria-controls="intro-overview-panel">Overview</button>
    <button role="tab" aria-selected="false" tabindex="-1">Install</button>
    <button role="tab" aria-selected="false" tabindex="-1">Theme</button>
  </div>
  <div role="tabpanel" id="intro-overview-panel" aria-labelledby="intro-overview" tabindex="0">
    Accessible primitives with full keyboard support and ARIA wired by tiny enhancers.
  </div>
  <div role="tabpanel" tabindex="0" hidden>
    Ship the CSS, then add enhancers only where an interaction needs them.
  </div>
  <div role="tabpanel" tabindex="0" hidden>
    Restyle everything from a handful of CSS variables in the theme studio.
  </div>
</div>`;
</script>

<div class="hl-home-showcase">

## Start in one command

Install the stylesheet and auto-initializer, or drop in the [CDN bundle](/guide/cdn) with no build step.

<div class="hl-home-install">
  <InstallTabs />
</div>

## Live by default

These are real Hydrateless components, not screenshots. Toggle JavaScript off in any frame to see how much works with CSS alone, or expand the markup below each preview.

<Demo layout="row" :code="controlsCode">
  <button class="hl-button" data-hl-intent="primary">Primary</button>
  <button class="hl-button" data-hl-intent="primary" data-hl-variant="soft">Soft</button>
  <button class="hl-button" data-hl-variant="outline">Outline</button>
  <span class="hl-badge" data-hl-intent="success" data-hl-variant="soft">Stable</span>
  <label class="hl-switch"><input type="checkbox" role="switch" checked /> Notifications</label>
</Demo>

<Demo layout="fill" :code="tabsCode">
  <div class="hl-tabs" data-hl-tabs style="width:100%">
    <div role="tablist" aria-label="Hydrateless overview">
      <button role="tab" aria-selected="true" id="intro-overview" aria-controls="intro-overview-panel">Overview</button>
      <button role="tab" aria-selected="false" tabindex="-1">Install</button>
      <button role="tab" aria-selected="false" tabindex="-1">Theme</button>
    </div>
    <div role="tabpanel" id="intro-overview-panel" aria-labelledby="intro-overview" tabindex="0"><p style="margin:0">Accessible primitives with full keyboard support and ARIA wired by tiny enhancers.</p></div>
    <div role="tabpanel" tabindex="0" hidden><p style="margin:0">Ship the CSS, then add enhancers only where an interaction needs them.</p></div>
    <div role="tabpanel" tabindex="0" hidden><p style="margin:0">Restyle everything from a handful of CSS variables in the theme studio.</p></div>
  </div>
</Demo>

<p class="hl-home-cta">
  <a class="hl-button" data-hl-intent="primary" href="/components/">Explore all components</a>
  <a class="hl-button" data-hl-variant="outline" href="/playground/theme">Open the theme studio</a>
</p>

</div>

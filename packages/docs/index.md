---
layout: home
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
    - theme: alt
      text: View on GitHub
      link: https://github.com/hydrateless/hydrateless
features:
  - icon: 🪶
    title: CSS-first
    details: Accordions, tabs, modals, drawers, tooltips, and more work out of the box with no JavaScript, built on native elements like details and dialog.
  - icon: ⚡
    title: Optional JS enhancers
    details: Add keyboard navigation, focus traps, and ARIA management only where native HTML falls short. Each enhancer is a few hundred bytes.
  - icon: 🧩
    title: Auto-initialization
    details: The @hydrateless/auto package detects data-hl-* attributes and lazy-loads exactly the enhancers your page uses.
  - icon: 🎨
    title: Themeable tokens
    details: Every component is driven by CSS variables for color, spacing, radius, and typography. Dark mode is built in.
  - icon: 🧱
    title: CSS layers
    details: 'All styles ship inside @layer, so your own CSS always wins: no specificity battles, no !important.'
  - icon: 🔌
    title: Framework bindings
    details: First-class packages for React, Vue, and Svelte (plus an Astro guide) wrap the same enhancers idiomatically.
---

<div class="hl-home-showcase">

## Live by default

These are real Hydrateless components, not screenshots. Toggle JavaScript off in any frame to see how much works with CSS alone.

<Demo layout="row">
  <button class="hl-button" data-hl-intent="primary">Primary</button>
  <button class="hl-button" data-hl-intent="primary" data-hl-variant="soft">Soft</button>
  <button class="hl-button" data-hl-variant="outline">Outline</button>
  <span class="hl-badge" data-hl-intent="success" data-hl-variant="soft">Stable</span>
  <label data-hl-switch><input type="checkbox" role="switch" checked /> Notifications</label>
</Demo>

<Demo layout="fill">
  <div data-hl-tabs style="width:100%">
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

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
      link: /components/accordion
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
    details: All styles ship inside @layer, so your own CSS always wins: no specificity battles, no !important.
  - icon: 🔌
    title: Framework bindings
    details: First-class packages for React, Vue, and Svelte (plus an Astro guide) wrap the same enhancers idiomatically.
---

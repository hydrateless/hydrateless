# Hydrateless Astro example

A minimal Astro 5 site that uses Hydrateless the CSS-first way: there is no
dedicated Astro package, just `hydrateless` for the styles and
`@hydrateless/auto` to lazy-load tiny enhancers only where a page needs
interactivity. The rest of the page stays static HTML with zero JavaScript.

```bash
npm install
npm run dev
```

The site depends on the local packages via `file:` paths, so run
`npm run build` at the repository root first.

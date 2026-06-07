# Hydrateless Svelte example

A minimal Vite + Svelte 5 app using `@hydrateless/svelte`. It showcases the
compound component API with runes (`$state`, `$effect`), `bind:` two-way
binding, snippet-based composition (`Tabs`, `Dropdown`, `Combobox`), a
controlled `Modal`, and imperative toasts via `createToast`.

```bash
npm install
npm run dev
```

The app depends on the local packages via `file:` paths, so run
`npm run build` at the repository root first.
